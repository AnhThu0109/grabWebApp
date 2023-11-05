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
import { useState } from "react";
import "./style.css";
import moment from "moment/moment";
import API_KEY from "../../../utils/KEY";
import calculateDistance from "../../../utils/calculateDistance";

export default function FormGetInfo() {
  const [form] = Form.useForm();
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [queryDes, setQueryDes] = useState("");
  const [predictionsDes, setPredictionsDes] = useState([]);
  const [pickUp, setPickUp] = useState({
    lat: 0,
    lng: 0
  });
  const [destination, setDestination] = useState({
    lat: 0,
    lng: 0
  })

  const handleInputChange = (e, setQueryFunction, setPredictionsFunction, inputName) => {
    const inputValue = e.target.value;
    form.setFieldValue(inputName, e.target.value);
    setQueryFunction(inputValue);

    // Create a new instance of google.maps.places.AutocompleteService
    const autocompleteService =
      new window.google.maps.places.AutocompleteService();

    // Use AutocompleteService to get predictions based on the input value
    autocompleteService.getPlacePredictions(
      {
        input: inputValue,
        componentRestrictions: { country: "VN" }, // Restrict predictions to Vietnam
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPredictionsFunction(predictions);
        } else {
          setPredictionsFunction([]);
        }
      }
    );
  };

  // const chooseLocation = (location, setQueryFunction, setPredictionsFunction, inputName) => {
  //   setQueryFunction(location);
  //   console.log(location);
  //   setPredictionsFunction([]);
  //   form.setFieldValue(inputName, location);
  // };

  const chooseLocation = async(location, setQueryFunction, setPredictionsFunction, inputName) => {
    setQueryFunction(location);
    console.log(location);
    setPredictionsFunction([]);
    form.setFieldValue(inputName, location);
    debugger;
    // Geocoding API endpoint URL
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`;

    // Make API call to fetch latitude and longitude for the location
    await fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(data => {
            // Extract latitude and longitude from the response
            const { lat, lng } = data.results[0].geometry.location;
            debugger;
            // Now you have latitude and longitude for the selected location
            console.log(`Latitude: ${lat}, Longitude: ${lng}`);

            inputName === "PickupLocation" ? setPickUp({lat, lng}) : setDestination({lat, lng});
        })
        .catch(error => {
            console.log('Error fetching location details:', error);
        });
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

  const onFinish = async() => {
    if (form.getFieldValue("PickupLocation") === form.getFieldValue("Destination")) {
      message.error("Pickup Location and Destination are the same. Please choose again!");
    } else{
      debugger;
      //const distance = await calculateDistance(pickUp.lat, pickUp.lng, destination.lat, destination.lng);
      calculateDistance(pickUp.lat, pickUp.lng, destination.lat, destination.lng)
        .then(distance => {
            console.log('Distance:', distance);
        })
        .catch(error => {
            console.error('Error:', error);
        });
      message.success("Submit success!");
    }
  };
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="bookingForm"
      // initialValues={}
    >
      <h6 className="fw-bolder">Basic Information</h6>
      <div className="row">
        <div className="col">
          <Form.Item
            className="location-search-container"
            name="PickupLocation"
            label={<div className="textBlue3">Pickup Location</div>}
            rules={[
              {
                required: true,
                message: "Please input Pickup location!",
              },
              {
                type: "string",
                min: 6,
              },
            ]}
            hasFeedback
          >
            {/* <Search
              onSearch={onSearch}
            /> */}
            {/* <SearchLocationInput /> */}
            <Input
              value={query}
              onChange={(e) => handleInputChange(e, setQuery, setPredictions, "PickupLocation")}
            />
            <ul className="predictions-list">
              {predictions.map((prediction) => (
                <li
                  key={prediction.place_id}
                  onClick={() => chooseLocation(prediction.description, setQuery, setPredictions, "PickupLocation")}
                >
                  {prediction.description}
                </li>
              ))}
            </ul>
          </Form.Item>
        </div>
        <div className="col">
          <Form.Item
            name="Destination"
            label={<div className="textBlue3">Destination</div>}
            rules={[
              {
                required: true,
                message: "Please input Destination",
              },
              {
                type: "string",
                min: 6,
              },
            ]}
            hasFeedback
          >
            <Input
              type="text"
              value={queryDes}
              onChange={(e) =>
                handleInputChange(e, setQueryDes, setPredictionsDes, "Destination")
              }
            />
            <ul className="predictions-list">
              {predictionsDes.map((prediction) => (
                <li
                  key={prediction.place_id}
                  onClick={() => chooseLocation(prediction.description, setQueryDes, setPredictionsDes, "Destination")}
                >
                  {prediction.description}
                </li>
              ))}
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
              <Option value="2">2</Option>
              <Option value="4">4</Option>
              <Option value="7">7</Option>
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
              <Option value="standard">Standard</Option>
              <Option value="plus">Plus</Option>
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
              form.getFieldValue("Destination") === undefined ||
              form.getFieldValue("NoOfGuest") === undefined ||
              form.getFieldValue("CarType") === undefined ||
              form.getFieldValue("CarService") === undefined ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length
            }
            className={
              form.getFieldValue("PickupLocation") !== undefined &&
              form.getFieldValue("Destination") !== undefined &&
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
