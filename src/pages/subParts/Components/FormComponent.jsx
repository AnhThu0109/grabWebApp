import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import locale from "antd/es/date-picker/locale/en_US";
// import dayjs from "dayjs";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import "./style.css";
import moment from "moment/moment";
import API_KEY from "../../../utils/KEY";
import axios from "axios";
import {
  CREATE_LOCATION,
  GET_CARTYPE,
  GET_DISTANCE,
  GET_SERVICE,
  SEARCH_LOCATION,
} from "../../../utils/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocationDot,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setDistanceData } from "../../../redux/distanceSlide";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import getAll from "../../../utils/getAll";

export default function FormGetInfo() {
  const [form] = Form.useForm();
  const [predictionsDB, setPredictionsDB] = useState([]);
  const [predictionsLive, setPredictionsLive] = useState([]);
  const [predictionsDesDB, setPredictionsDesDB] = useState([]);
  const [predictionsDesLive, setPredictionsDesLive] = useState([]);
  const [pickUp, setPickUp] = useState();
  const [destination, setDestination] = useState();
  const [isChooseLocation, setIsChooseLocation] = useState({
    pickUp: false,
    des: false,
  });
  const [carTypes, setCarTypes] = useState();
  const [carServices, setCarServices] = useState();
  const [hasFeedback, setHasFeedback] = useState({
    pick: null,
    des: null,
  });
  const token = localStorage.getItem("token");
  const distanceInfo = useSelector((state) => state.distance);
  // Dispatching actions
  const dispatch = useDispatch();

  const handleInputChange = async (e, inputName) => {
    if (inputName === "PickupLocation") {
      setPickUp(e.target.value);
      form.setFieldValue("PickupLocation", e.target.value);
      setHasFeedback((previous) => {
        return { ...previous, pick: true };
      });
    } else {
      setDestination(e.target.value);
      form.setFieldValue("Destination", e.target.value);
      setHasFeedback((previous) => {
        return { ...previous, des: true };
      });
    }
    const inputValue = e.target.value.trim();
    // Search location
    if (inputValue !== "") {
      // Search in database first
      const locations = await searchLocationInDatabase(inputValue);
      console.log("database location", locations);
      //setLocations(locations);
      const predictLocations = locations.map((item) => item.locationName);
      inputName === "PickupLocation"
        ? setPredictionsDB(predictLocations) &&
          setIsChooseLocation((prevState) => ({ ...prevState, pickUp: false }))
        : setPredictionsDesDB(predictLocations) &&
          setIsChooseLocation((prevState) => ({ ...prevState, des: false }));

      //Search live from enter third key word
      if (inputValue.length > 3) {
        // Search live
        const predictions = await new Promise((resolve) => {
          const autocompleteService =
            new window.google.maps.places.AutocompleteService();

          autocompleteService.getPlacePredictions(
            {
              input: inputValue,
              componentRestrictions: { country: "VN" }, // Restrict predictions to Vietnam
            },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(predictions);
              } else {
                resolve([]);
              }
            }
          );
        });
        console.log(predictions);
        // Just take 4 results
        if (predictions.length > 4) {
          predictions.splice(4);
        }
        inputName === "PickupLocation"
          ? setPredictionsLive(predictions)
          : setPredictionsDesLive(predictions);
      }
    } else {
      if (inputName === "PickupLocation") {
        setHasFeedback((previous) => {
          return { ...previous, pick: false };
        });
        setPredictionsDB([]);
        setPredictionsLive([]);
      } else {
        setHasFeedback((previous) => {
          return { ...previous, des: false };
        });
        setPredictionsDesDB([]);
        setPredictionsDesLive([]);
      }
    }
  };

  const searchLocationInDatabase = async (keyword) => {
    try {
      const response = await fetch(`${SEARCH_LOCATION}?keyword=${keyword}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const chooseLocation = async (location, inputName, isSearchLive = false) => {
    if (inputName === "PickupLocation") {
      setPickUp(location);
      form.setFieldValue("PickupLocation", location);
      setIsChooseLocation((prevState) => ({ ...prevState, pickUp: true }));
      setPredictionsDB([]);
      setPredictionsLive([]);
    } else {
      setDestination(location);
      form.setFieldValue("Destination", location);
      setIsChooseLocation((prevState) => ({ ...prevState, des: true }));
      setPredictionsDesDB([]);
      setPredictionsDesLive([]);
    }
    //If search live => save location to db
    if (isSearchLive) {
      try {
        debugger;
        const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${API_KEY}`;
        const response = await fetch(geocodingApiUrl);
        const data = await response.json();

        if (response.ok && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          console.log(`Latitude: ${lat}, Longitude: ${lng}`);

          // Save location to database
          await saveLocationToDatabase(location, lat, lng, inputName);
        } else {
          console.log("Error fetching location details:", data.error_message);
        }
      } catch (error) {
        console.log("Error fetching location details:", error);
      }
    }
  };

  const saveLocationToDatabase = async (
    locationName,
    latitude,
    longitude,
    inputName
  ) => {
    debugger;
    const input = {
      locationName: locationName,
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const response = await axios.post(CREATE_LOCATION, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        console.log(`Location ${inputName} saved successfully.`);
      } else {
        console.log("Error saving location:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today (past dates)
    return current && current < moment().startOf("day");
  };

  const disabledDateTime = (current) => {
    const today = new Date();
    let isToday =
      current &&
      current.$D === today.getDate() &&
      current.$M === today.getMonth() &&
      current.$y === today.getFullYear()
        ? true
        : false;
    if (isToday) {
      return {
        disabledHours: () =>
          Array.from({ length: moment().hours() }, (_, i) => i),
        disabledMinutes: () => [],
      };
    }
    return {};
  };

  const getDistance = (origin, destination) => {
    const input = {
      origin,
      destination,
    };
    return fetch(GET_DISTANCE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(input),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const onFinish = async () => {
    if (
      form.getFieldValue("PickupLocation") === form.getFieldValue("Destination")
    ) {
      message.error(
        "Pickup Location and Destination are the same. Please choose again!"
      );
    } else {
      try {
        let allFieldValues = form.getFieldsValue();
        allFieldValues = {...allFieldValues, PickupTime: allFieldValues.PickupTime.toISOString()};
        const response = await getDistance(pickUp, destination);
        console.log("response data", response.data);
        const dataTranfer = { ...allFieldValues, ...response.data };
        console.log("data", dataTranfer);
        dispatch(setDistanceData(dataTranfer));
        message.success("Submit success!");
      } catch (error) {
        console.error("Error fetching distance data:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
      }
    }
  };
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const getInitInformation = async () => {
    const type = await getAll(GET_CARTYPE, token);
    setCarTypes(type);
    const service = await getAll(GET_SERVICE, token);
    setCarServices(service);
  };

  useEffect(() => {
    getInitInformation();
    setHasFeedback({
      pick: null,
      des: null,
    });
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="bookingForm"
    >
      <h6 className="fw-bolder">Basic Information</h6>
      <div className="row">
        <div className="col">
          <Form.Item
            className="location-search-container"
            name="PickupLocation"
            label={<div className="textBlue3">Pickup Location</div>}
            validateStatus={hasFeedback.pick === false ? "error" : ""}
            help={
              hasFeedback.pick === false ? "Please input Pickup location!" : ""
            }
          >
            <Input
              value={pickUp}
              onChange={(e) => handleInputChange(e, "PickupLocation")}
              suffix={
                hasFeedback.pick === true ? (
                  <CheckCircleFilled
                    style={{
                      color: "#52c41a",
                    }}
                  />
                ) : hasFeedback.pick === false ? (
                  <CloseCircleFilled />
                ) : (
                  <span />
                )
              }
            />
            <ul className="predictions-list">
              {predictionsDB.length > 0 &&
                predictionsDB.map((prediction, index) => (
                  <li
                    key={index}
                    onClick={() => chooseLocation(prediction, "PickupLocation")}
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="me-1 text-black-50"
                    />
                    {prediction}
                  </li>
                ))}
              {predictionsLive.length > 0 &&
                predictionsLive.map((prediction, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      chooseLocation(
                        prediction.description,
                        "PickupLocation",
                        true
                      )
                    }
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="me-1 text-black-50"
                    />
                    {prediction.description}
                  </li>
                ))}
              {!isChooseLocation.pickUp &&
                predictionsDB.length == 0 &&
                predictionsLive.length == 0 &&
                form.getFieldValue("PickupLocation")?.trim() != "" &&
                form.getFieldValue("PickupLocation") != undefined && (
                  <li>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="me-1 text-black-50"
                    />
                    No results were found
                  </li>
                )}
            </ul>
          </Form.Item>
        </div>
        <div className="col">
          <Form.Item
            name="Destination"
            label={<div className="textBlue3">Destination</div>}
            validateStatus={hasFeedback.des === false ? "error" : ""}
            help={hasFeedback.des === false ? "Please input Destination!" : ""}
          >
            <Input
              type="text"
              value={destination}
              onChange={(e) => handleInputChange(e, "Destination")}
              suffix={
                hasFeedback.des === true ? (
                  <CheckCircleFilled
                    style={{
                      color: "#52c41a",
                    }}
                  />
                ) : hasFeedback.des === false ? (
                  <CloseCircleFilled />
                ) : (
                  <span />
                )
              }
            />
            <ul className="predictions-list">
              {predictionsDesDB.length > 0 &&
                predictionsDesDB.map((prediction, index) => (
                  <li
                    key={index}
                    onClick={() => chooseLocation(prediction, "Destination")}
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="me-1 text-black-50"
                    />
                    {prediction}
                  </li>
                ))}
              {predictionsDesLive.length > 0 &&
                predictionsDesLive.map((prediction, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      chooseLocation(
                        prediction.description,
                        "Destination",
                        true
                      )
                    }
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="me-1 text-black-50"
                    />
                    {prediction.description}
                  </li>
                ))}
              {!isChooseLocation.des &&
                predictionsDesDB.length == 0 &&
                predictionsDesLive.length == 0 &&
                form.getFieldValue("Destination")?.trim() != "" &&
                form.getFieldValue("Destination") != undefined && (
                  <li>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="me-1 text-black-50"
                    />
                    No results were found
                  </li>
                )}
            </ul>
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Form.Item
            name="PickupTime"
            label={<div className="textBlue3">Pickup Time (Optional)</div>}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder=""
              className="w-100"
              locale={locale}
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
            />
          </Form.Item>
        </div>
        <div className="col">
          <Form.Item
            name="NoOfGuest"
            label={<div className="textBlue3">No. of Guest</div>}
            rules={[
              {
                required: true,
                message: "Please input No. of Guest",
              },
            ]}
            hasFeedback
          >
            <InputNumber min={1} max={10} className="w-100" />
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Form.Item
            name="CarType"
            label={<div className="textBlue3">Car Type</div>}
            rules={[
              {
                required: true,
                message: "Please select Car Type",
              },
            ]}
            hasFeedback
          >
            <Select>
              {carTypes?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.car_type}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="col">
          <Form.Item
            name="CarService"
            label={<div className="textBlue3">Car Service</div>}
            rules={[
              {
                required: true,
                message: "Please select Car Service",
              },
            ]}
            hasFeedback
          >
            <Select>
              {carServices?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.serviceName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <Form.Item shouldUpdate style={{ textAlign: "right" }}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            ghost
            disabled={
              form.getFieldValue("PickupLocation") === undefined ||
              form.getFieldValue("PickupLocation") === "" ||
              form.getFieldValue("Destination") === undefined ||
              form.getFieldValue("Destination") === "" ||
              form.getFieldValue("NoOfGuest") === undefined ||
              form.getFieldValue("CarType") === undefined ||
              form.getFieldValue("CarService") === undefined ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length ||
              hasFeedback.pick === false ||
              hasFeedback.des === false
            }
            className={
              form.getFieldValue("PickupLocation") !== undefined &&
              form.getFieldValue("PickupLocation") !== "" &&
              form.getFieldValue("Destination") !== undefined &&
              form.getFieldValue("Destination") !== "" &&
              form.getFieldValue("NoOfGuest") !== undefined &&
              form.getFieldValue("CarType") !== undefined &&
              form.getFieldValue("CarService") !== undefined &&
              !form.getFieldsError().filter(({ errors }) => errors.length)
                .length
                ? "activeButton"
                : ""
            }
          >
            Apply
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
