import { useEffect, useState } from "react";
import "./style.css";
import { Divider } from "antd";
import { fetchDataWeather, showIcon } from "../../utils/weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { changeFormatDate, changeFormatDate1 } from "../../utils/formatDate";

const Home = () => {
  const [isAdmin, setAdmin] = useState(false);
  const isAdminLogin = () => {
    localStorage.getItem(isAdmin) === "true" ? setAdmin(true) : setAdmin(false);
  };

  //Fetching weather in 3 days
  const [weather, setWeather] = useState();
  const [currentIcon, setCurrentIcon] = useState();
  const [displayDate, setDisplayDate] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMess, setErrorMess] = useState("");
  const [fTemp, setFTemp] = useState(false);

  //Fetch data weather
  const fetchWeather = async (location) => {
    //If not search keyword yet ==> show weather of user's current location || show weather of seaching location
    if (!location) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords; //latitude-longitude: units represent the coordinates at geographic coordinate system (vĩ độ-kinh độ)
        fetchDataWeather(`${latitude},${longitude}`)
          .then((json) => {
            console.log("weather data", json);
            setWeather(json);
            setCurrentIcon(showIcon(json.current.condition.text));
            // let newArr = [];
            //Take condition text of days
            // json.forecast.forecastday.map((item) => {
            //   let source = showIcon(item.day.condition.text);
            //   newArr.push(source);
            // });
          })
          .catch((error) => {
            setIsError(true);
            setErrorMess("Sorry. Your location is not found.");
          });
      });
    } else {
      fetchDataWeather(location)
        .then((json) => {
          setWeather(json);
          setCurrentIcon(showIcon(json.current.condition.text));
          //   let newArr = [];
          //   json.forecast.forecastday.map((item) => {
          //     let source = showIcon(item.day.condition.text);
          //     newArr.push(source);
          //   });
          //   setDisplayIcon(newArr);
        })
        .catch((error) => {
          setIsError(true);
          setErrorMess("Location is not found. Please type again!!!");
        });
    }
  };

  //Handle submit for form of searching location
  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyWord.trim() !== "") {
      fetchWeather(keyWord);
    }
  };

  useEffect(() => {
    isAdminLogin();
    fetchWeather();
    let date = changeFormatDate(weather?.current?.last_updated);
    setDisplayDate(date);
  }, [keyWord]);

  return (
    <>
      <div className="m-3 rounded-4 bg-white d-flex align-items-center justify-content-between px-4">
        <h3 className="fw-bolder pt-2">
          WELCOME BACK{isAdmin === true ? ", ADMIN" : ""}!
        </h3>
        <img
          src="/images/welcomeback.png"
          alt="welcomeBackImg"
          className="welcomeBackImg"
        />
      </div>

      <div className="row m-3 gap-3">
        <div className="col bg-white rounded-4 cardHome pb-2">
          <div className="d-flex pt-4 align-items-center">
            <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
              <img alt="sum" src="/images/sum.png" className="iconHome" />
            </div>

            <h5 className="fw-bolder fs-16">Total</h5>
          </div>
          <Divider />
          <h5 className="textBlue2 fw-bolder fs-16">124</h5>
          <small className="textGrey1">Booking trips</small>
        </div>

        <div className="col bg-white rounded-4 cardHome pb-2">
          <div className="d-flex pt-4 align-items-center">
            <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
              <img alt="sum" src="/images/complete.png" className="iconHome" />
            </div>

            <h5 className="fw-bolder fs-16">Complete</h5>
          </div>
          <Divider />
          <h5 className="textBlue2 fw-bolder fs-16">115</h5>
          <small className="textGrey1">Booking trips</small>
        </div>

        <div className="col bg-white rounded-4 cardHome pb-2">
          <div className="d-flex pt-4 align-items-center">
            <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
              <img alt="sum" src="/images/ongoing.png" className="iconHome" />
            </div>

            <h5 className="fw-bolder fs-16">Ongoing</h5>
          </div>
          <Divider />
          <h5 className="textBlue2 fw-bolder fs-16">2</h5>
          <small className="textGrey1">Booking trips</small>
        </div>

        {/* Show weather forecast */}
        <div className="col-4 bg-white rounded-4">
          <form
            className="searchFormLocation d-flex justify-content-end pt-3 pb-2"
            onSubmit={handleSubmit}
          >
            <input
              className="border-0 fs-14 bgBlue4 textGrey1 py-1 px-2"
              type="text"
              name="keyword"
              id="keyword"
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              placeholder="Search"
            />
            <button type="submit" className="border-0 bgBlue4 py-1 px-2 fs-14">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="textGrey1" />
            </button>
          </form>

          {isError === true || weather?.error ? (
            <p className="text-danger">{errorMess}</p>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <div className="fw-bolder text-black pb-1">
                {weather?.location?.name} - {weather?.location?.country}
              </div>
              <div className="row">
                <img
                  src={currentIcon}
                  className="weatherIcon col-3"
                  alt="weatherIcon"
                />
                <div className="col fs-14 textGrey1">
                  <div className="pb-2">
                    {changeFormatDate(weather?.current?.last_updated) === -1
                      ? changeFormatDate1(
                          weather?.forecast?.forecastday[0].date
                        )
                      : changeFormatDate(weather?.current?.last_updated)}
                  </div>
                  <div className="pb-2">
                    {fTemp === false
                      ? weather?.current?.temp_c
                      : weather?.current?.temp_f}
                    <sup>o</sup>
                    <button
                      className="rounded-2 bgBlue2 text-white border-0 ms-1 fw-bolder"
                      onClick={() => setFTemp(!fTemp)}
                    >
                      {fTemp === false ? <>C</> : <>F</>}
                    </button>
                  </div>
                  <div className="pb-2">
                    {weather?.current?.condition?.text}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row m-3 gap-3">
        <div className="bg-white col-9 rounded-4">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque ab
            esse modi inventore molestias vero ullam iste illum, neque culpa
            ipsam et. Vero recusandae nisi iusto fugit dolore. Perferendis,
            tempore?
          </p>
        </div>

        <div className="bg-white col rounded-4 pb-2 pt-3" style={{height: "310px"}}>
          <div className="d-flex justify-content-between">
            <h5 className="fw-bolder textGrey1">Contact</h5>
            <form
              className="searchFormContact"
            >
              <input
                className="border-0 fs-14 bgBlue4 textGrey1 py-1 px-2"
                type="text"
                placeholder="Search"
              />
              <button
                type="submit"
                className="border-0 bgBlue4 py-1 px-2 fs-14"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="textGrey1"
                />
              </button>
            </form>
          </div>
          <hr className="textGrey4"/>
          <div className="contactList">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            eveniet libero, omnis labore voluptatem et, sunt nihil repudiandae
            atque blanditiis nostrum impedit quaerat ex expedita eum, rerum
            veniam! Odit, aut.
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
