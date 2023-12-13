import { useEffect, useRef, useState } from "react";
import "./style.css";
import "./../style.css";
import { Divider } from "antd";
import { fetchDataWeather, showIcon } from "../../utils/weather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { changeFormatDate, changeFormatDate1 } from "../../utils/formatDate";
import { Skeleton } from "@mui/material";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import setRootBackground from "../../utils/setRootBackground";
import getAll from "../../utils/getAll";
import { ADMIN, BOOKING_FORM } from "../../utils/API";
import { useTranslation, withTranslation } from "react-i18next";
import formatPeopleId from "../../utils/formatPeopleID";

const Home = ({ t }) => {
  const [isAdmin, setAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataChart, setDataChart] = useState();
  const [allBooking, setAllBooking] = useState();
  const [completeBooking, setCompleteBooking] = useState();
  const [ongoingBooking, setOngoingBooking] = useState();
  const [adminList, setAdminList] = useState([]);
  const token = localStorage.getItem("token");
  const isAdminLogin = () => {
    localStorage.getItem(isAdmin) === "true" ? setAdmin(true) : setAdmin(false);
  };
  const chartInstance = useRef(null);
  const chartCanvas = useRef(null);

  const peopleList = [
    {
      username: "Huy Nguyen",
      avatarPath:
        "https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO",
      onlineTime: "4 minutes ago",
    },
    {
      username: "Anh Ly",
      avatarPath:
        "https://lh3.googleusercontent.com/0V6XGdiudZ_0TBKUwchdxyPQZ5maRryBxhZRUG6mI-QhL9VG8kEWrzNy7tYbT352KCkrlhAQkzVXlUFaiBSV1wIPo4o",
      onlineTime: "Online",
    },
    {
      username: "Ngoc Tran",
      avatarPath:
        "https://lh3.googleusercontent.com/PSBfmOl_5jv97zDydSaV0FYEOFaU279KK4EKxGj5yzMMHMim8501-dToq_kD4sMfZ-niDUYtywSoNgwnUdP02hsfnQ",
      onlineTime: "Online",
    },
    {
      username: "Duy Tran",
      avatarPath:
        "https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO",
      onlineTime: "1 hour ago",
    },
    {
      username: "Bao Nguyen",
      avatarPath:
        "https://lh3.googleusercontent.com/CXJ89PcCSDQAdqL1xpyAhwfdz8nsICwJQRnuZ6Qq_2j5rgFUlezb40rt6EsR-7lJTfE2tWiZn5vLj4WA6VG2bxoBQA",
      onlineTime: "Offline",
    },
    {
      username: "Huong Ly",
      avatarPath:
        "https://lh3.googleusercontent.com/3mpmhWQkYgEBm2tDbLsBQL67O2qHsrI9Bn18nCueKC3YP6pnwg9RUxMtKsggN72RD63fLptVu_05_AiPGrsuzssp",
      onlineTime: "Offline",
    },
  ];

  //Fetching weather in 3 days
  const [weather, setWeather] = useState();
  const [currentIcon, setCurrentIcon] = useState();
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
            setIsLoading(false);
            console.log("weather data", json);
            setWeather(json);
            setCurrentIcon(showIcon(json.current.condition.text));
          })
          .catch((error) => {
            setIsLoading(false);
            setIsError(true);
            setErrorMess("Sorry. Your location is not found.");
          });
      });
    } else {
      fetchDataWeather(location)
        .then((json) => {
          setIsLoading(false);
          setIsError(false);
          setWeather(json);
          setCurrentIcon(showIcon(json.current.condition.text));
        })
        .catch((error) => {
          setIsLoading(false);
          setIsError(true);
          setErrorMess("Location is not found. Please type again!");
        });
    }
  };

  //Handle submit for form of searching location
  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyWord.trim() !== "") {
      fetchWeather(keyWord);
      setIsLoading(true);
    }
  };

  //Get data booking of month
  const getBookingNumberMonth = async(status) => {
    const data = await getAll(BOOKING_FORM, token);
    const dataFilter = data.rows.filter(item => item.BookingStatusId.status_description === status)
    let dataChart = [];  
    for(let i = 0; i< 12; i++){    
      let a = 0;
      if(dataFilter.length > 0){
        dataFilter.forEach(element => {
          if(new Date(element.createdAt).getMonth() === i){
            a = a + 1;
          }
        });
      }
      dataChart.push(a);
    }
    return dataChart;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const getBookingsData = async() => {
    const data = await getAll(BOOKING_FORM, token);
    setAllBooking(data);
    const complete = data?.rows?.filter(item => item.status === 4);
    setCompleteBooking(complete);
    const ongoing = data?.rows?.filter(item => item.status === 3);
    setOngoingBooking(ongoing);
  }

  const initData = async() => {
    await getBookingsData();
    await fetchWeather();
    const admins = await getAll(`${ADMIN}/all`, token);
    console.log("admins", admins);
    setAdminList(admins);

    //initial data chart
    const months = [
      t('Jan'),
      t('Feb'),
      t('Mar'),
      t('Apr'),
      t('May'),
      t('Jun'),
      t('Jul'),
      t('Aug'),
      t('Sep'),
      t('Oct'),
      t('Nov'),
      t('Dec'),
    ];
    const data = {
      labels: months,
      datasets: [
        {
          label: t('complete'),
          backgroundColor: "#00D6BB",
          borderRadius: 10,
          borderSkipped: false,
          barPercentage: 0.5,
          data: await getBookingNumberMonth("Complete"),
        },
        {
          label: t('canceled'),
          backgroundColor: "#C51E3A",
          borderRadius: 10,
          borderSkipped: false,
          barPercentage: 0.5,
          data: await getBookingNumberMonth("Canceled"),
        },
      ],
    };

    setDataChart(data);
  }

  useEffect(() => {
    // Set root background
    setRootBackground("--bg-color1", "rgb(248,248,255)");

    // Check admin login status
    isAdminLogin();

    //Init data
    initData()

    // Cleanup the chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isAdmin, t]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="m-4">
            <Skeleton variant="rectangular" height={120} />
          </div>

          <div className="row m-4 gap-3">
            <div className="col pb-2 skeletonRect">
              <Skeleton variant="rectangular" height={140} />
            </div>

            <div className="col pb-2 skeletonRect">
              <Skeleton variant="rectangular" height={140} />
            </div>

            <div className="col pb-2 skeletonRect">
              <Skeleton variant="rectangular" height={140} />
            </div>

            {/* Show weather forecast */}
            <div className="col-4 skeletonRect">
              <Skeleton variant="rectangular" height={140} />
            </div>
          </div>

          <div className="row m-4 gap-3">
            <div className="col-9 skeletonRect">
              <Skeleton variant="rectangular" height={230} />
            </div>

            <div className="col pb-2 skeletonRect">
              <Skeleton variant="rectangular" height={230} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="m-3 rounded-4 bg-white d-flex align-items-center justify-content-between px-4">
            <h3 className="fw-bolder pt-2">
            {t('welcomeback')}{isAdmin === true ? ", ADMIN" : ""}!
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

                <h5 className="fw-bolder fs-16">{t('total')}</h5>
              </div>
              <Divider />
              <h5 className="textBlue2 fw-bolder fs-16">{allBooking?.count}</h5>
              <small className="textGrey1">{t('bookingTrips')}</small>
            </div>

            <div className="col bg-white rounded-4 cardHome pb-2">
              <div className="d-flex pt-4 align-items-center">
                <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
                  <img
                    alt="sum"
                    src="/images/complete.png"
                    className="iconHome"
                  />
                </div>

                <h5 className="fw-bolder fs-16">{t('complete')}</h5>
              </div>
              <Divider />
              <h5 className="textBlue2 fw-bolder fs-16">{completeBooking?.length}</h5>
              <small className="textGrey1">{t('bookingTrips')}</small>
            </div>

            <div className="col bg-white rounded-4 cardHome pb-2">
              <div className="d-flex pt-4 align-items-center">
                <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
                  <img
                    alt="sum"
                    src="/images/ongoing.png"
                    className="iconHome"
                  />
                </div>

                <h5 className="fw-bolder fs-16">{t('ongoing')}</h5>
              </div>
              <Divider />
              <h5 className="textBlue2 fw-bolder fs-16">{ongoingBooking?.length}</h5>
              <small className="textGrey1">{t('bookingTrips')}</small>
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
                  placeholder={t('search')}
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
              <div className="mt-3 fw-bolder">
              {t('activity')} {new Date().getFullYear()}
              </div>
              <div className="mx-2 my-1" style={{ height: "80%" }}>
                {dataChart && (
                  <Bar data={dataChart} options={options} />
                )}
              </div>
            </div>

            <div
              className="bg-white col rounded-4 pb-2 pt-3"
              style={{ height: "310px" }}
            >
              <div className="d-flex justify-content-between">
                <h5 className="fw-bolder textGrey1">{t('contact')}</h5>
                <form className="searchFormContact">
                  <input
                    className="border-0 fs-14 bgBlue4 textGrey1 py-1 px-2"
                    type="text"
                    placeholder={t('search')}
                  />
                  <button
                    type="submit"
                    className="border-0 bgBlue4 py-1 px-2 fs-14"
                    onClick={(e) => e.preventDefault()}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="textGrey1"
                    />
                  </button>
                </form>
              </div>
              <hr className="textGrey4" />
              <div className="contactList">
                {adminList.length > 0 && adminList.map((item, index) => (
                  <div className="row pb-3" key={index}>
                    <div className="col-3">
                      <img
                        src={item.avatarPath !== null ? item.avatarPath : "https://secure.gravatar.com/avatar/11273dbd2dcbfb87e3061eef1b3a5fe9?s=500&d=mm&r=g"}
                        alt="avatar"
                        className="rounded-circle avatarContact"
                      />
                    </div>

                    <div className="col">
                      <b>{item.fullname}</b>
                      <div className="fs-14 textGrey1">{formatPeopleId(item.id, "AD")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default withTranslation()(Home);
