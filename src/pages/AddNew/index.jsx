import { Button, Form, Input, message } from "antd";
import "./style.css";
import "./../style.css";
import { useNavigate } from "react-router-dom";
import FormGetInfo from "../subParts/Components/FormComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import changeFareFormat from "../../utils/formatFare";
import { BOOKING_FORM, SEARCH_CUSTOMER_PHONE } from "../../utils/API";
import axios from "axios";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { setDistanceData } from "../../redux/distanceSlide";

export default function Add() {
  const navigate = useNavigate();
  const [phoneNo, setPhoneNo] = useState();
  const [cusName, setCusName] = useState();
  const [predictions, setPredictions] = useState([]);
  const [form] = Form.useForm();
  const [hasFeedback, setHasFeedback] = useState(null);
  let distanceInfo = useSelector((state) => state.distance);
  // Dispatching actions
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const suffix = hasFeedback === true ? <CheckCircleFilled style={{
    color: "#52c41a",
  }}/> : hasFeedback === false ? <CloseCircleFilled /> : <span />;

  const getFare = (info) => {
    let result;
    if (info?.CarType === 1) {
      info?.CarService === 1
        ? (result = "bike")
        : (result = "bike-plus");
    } else {
      info?.NoOfGuest > 4
        ? (result = "car-7seat")
        : info?.CarService === 1
        ? (result = "car")
        : (result = "car-plus");
    }
    return result;
  };

  const searchPhoneNo = async (keyword) => {
    const response = await axios.get(
      `${SEARCH_CUSTOMER_PHONE}?keyword=${keyword}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return response.data;
  };

  const handleInputChange = async (e) => {
    setPhoneNo(e.target.value);
    const inputValue = e.target.value.trim();
    if (inputValue !== "") {
      setHasFeedback(true);
      form.setFieldsValue({ PhoneNumber: inputValue });
      const phoneNumbers = await searchPhoneNo(inputValue);
      phoneNumbers.length > 0
        ? setPredictions(phoneNumbers)
        : setPredictions([]);
    } else {
      setPredictions([]);
      form.setFieldsValue({ PhoneNumber: "" });
      setHasFeedback(false);
    }
  };

  const choosePhone = (item) => {
    setHasFeedback(true);
    setPhoneNo(item?.phoneNo);
    setPredictions([]);
    form.setFieldsValue({ PhoneNumber: item?.phoneNo, Name: item?.fullname });
  };

  const handleCusNameChange = (e) => {
    const input = e.target.value.trim();
    if(input !== ""){
      form.setFieldsValue({ Name: input });
    } else {
      form.setFieldsValue({ Name: "" });
    }
  }

  const submitBookingForm = async(input) => {
    try {
      const response = await axios.post(`${BOOKING_FORM}/create`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      })
      return response;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; 
    } 
  }

  const onFinishForm = async() => {
    if (distanceInfo != null) {
      const inputData = {
        "pickupLocation": "Diamond Plaza, Đường Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        "destination": "Etown, Đường Cộng Hòa, phường 13, Tân Bình, Thành phố Hồ Chí Minh",
        "bookingWay": 0,
        "Trip_Start_Time": "2023-11-22 17:14",
        "distance": "2.3 km",
        "sum": 52342,
        "customerId": 1,
        "driverId": 1,
        "adminId": 1,
        "note": "abc",
        "carId": 1
      }
      const response = await submitBookingForm(inputData);
      navigate("/booking/tracking");
    }

    message.success("Submit success form 1!");
  };

  useEffect(() => {
    setHasFeedback(null);
    dispatch(setDistanceData(null));
  }, []);

  return (
    <div className="contentAddNew">
      <div className="leftPart mx-3 pt-3">
        <h5 className="textBlue2 text-center fw-bolder">Add New Booking</h5>
        {/* Get info form */}
        <FormGetInfo />
        <h6 className="fw-bolder">Guest Detail</h6>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinishForm}
          autoComplete="off"
          className="bookingForm1"
        >
          <div className="row">
            <div className="col">
              <Form.Item
                name="PhoneNumber"
                label={<div className="textBlue3">Phone Number</div>}
                validateStatus={ hasFeedback === false? "error" : ""}
                help={hasFeedback === false? "Please input Guest's Phone Number" : ""}
              >
                <Input value={phoneNo} onChange={handleInputChange} suffix={suffix} status={hasFeedback === true ? 'success' : hasFeedback === false? 'error' : ""}/>
                <ul className="predictions-list">
                  {predictions.length > 0 &&
                    predictions.map((item, index) => (
                      <li key={index} onClick={() => choosePhone(item)}>
                        <FontAwesomeIcon
                          icon={faClock}
                          className="me-1 text-black-50"
                        />
                        {item?.phoneNo}
                      </li>
                    ))}
                </ul>
              </Form.Item>
            </div>
            <div className="col">
              <Form.Item
                name="Name"
                label={<div className="textBlue3">Name</div>}
                rules={[
                  {
                    required: true,
                    message: "Please input Guest's Name!",
                  },
                  {
                    type: "string",
                    min: 4,
                  },
                ]}
                hasFeedback
              >
                <Input value={cusName} onChange={handleCusNameChange}/>
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name="Note"
            label={<div className="textBlue3">Note (Optional)</div>}
          >
            <Input.TextArea allowClear />
          </Form.Item>
          <div className="rightPart">
            <h6 className="fw-bolder">Booking Summary</h6>
            <div className="fs-14 mt-3 lh-lg">
              {distanceInfo == null ? (
                "No information"
              ) : (
                <>
                  <div>
                    Kilometer:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.distance
                        ? distanceInfo?.distance?.distance?.text
                        : "Unknown"}
                    </b>
                  </div>
                  <div>
                    Duration:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.distance
                        ? distanceInfo?.distance?.duration?.text
                        : "Unknown"}
                    </b>
                  </div>
                  <div>
                    Car Type:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.CarType}
                    </b>
                  </div>
                  <div>
                    Car Service:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.CarService}
                    </b>
                  </div>
                  <div>
                    VIP Booking:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.PickupTime === undefined ? "None" : "Yes"}
                    </b>
                  </div>
                  <hr />
                  <div className="fw-bolder textOrange1">
                    Total (Vnd):{" "}
                    <span className="float-end me-5 pe-2 fs-18">
                      {distanceInfo?.fare
                        ? changeFareFormat(
                            distanceInfo?.fare[getFare(distanceInfo)]
                          )
                        : "Unknown"}
                    </span>
                  </div>
                </>
              )}
            </div>
            <Form.Item
              shouldUpdate
              style={{ textAlign: "center" }}
              className={distanceInfo == null ? "" : "float-end"}
            >
              {() => (
                <Button
                  htmlType="submit"
                  className="border-0 rounded-3 px-5 mt-4 w-70 text-black-60 fw-bolder bookingBtn"
                  disabled={
                    form.getFieldValue("Name") === undefined || form.getFieldValue("Name") === "" || 
                    form.getFieldValue("PhoneNumber") === undefined || form.getFieldValue("PhoneNumber") === "" ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length || !hasFeedback || distanceInfo === null
                  }
                >
                  BOOK
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
