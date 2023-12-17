import { Button, Form, Input, message } from "antd";
import "./style.css";
import "./../style.css";
import FormGetInfo from "../subParts/Components/FormComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import changeFareFormat from "../../utils/formatFare";
import {
  GET_CUSTOMER,
  SEARCH_CUSTOMER_PHONE,
  SEARCH_LOCATION_NAME,
} from "../../utils/API";
import axios from "axios";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { setDistanceData } from "../../redux/distanceSlide";
import createCustomer from "../../utils/addNewCustomer";
import getLocationByName from "../../utils/getLocation";
import { useNavigate } from "react-router-dom";
import { submitBookingForm } from "../../utils/bookingFormAction";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../utils/socketContext";
import formatPeopleId from "../../utils/formatPeopleID";
import { createNotification } from "../../utils/notificationAction";
import { addNotification } from "../../redux/notificationSlide";

export default function Add() {
  const [phoneNo, setPhoneNo] = useState();
  const [cusName, setCusName] = useState();
  const [cusId, setCusId] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [form] = Form.useForm();
  const [hasFeedback, setHasFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const adminId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const socketData = useSocket();
  let loadingTimeout;

  let distanceInfo = useSelector((state) => state.distance);
  // Dispatching actions
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const suffix =
    hasFeedback === true ? (
      <CheckCircleFilled
        style={{
          color: "#52c41a",
        }}
      />
    ) : hasFeedback === false ? (
      <CloseCircleFilled />
    ) : (
      <span />
    );

  const getFare = (info) => {
    let result;
    if (info?.CarType === 1) {
      info?.CarService === 1 ? (result = "bike") : (result = "bike-plus");
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
      if (phoneNumbers.length > 0) {
        setPredictions(phoneNumbers);
      } else {
        setPredictions([]);
        setCusId(0);
      }
    } else {
      setPredictions([]);
      form.setFieldsValue({ PhoneNumber: "" });
      setHasFeedback(false);
    }
  };

  const choosePhone = (item) => {
    setHasFeedback(true);
    setPhoneNo(item?.phoneNo);
    setCusId(item.id);
    setPredictions([]);
    form.setFieldsValue({ PhoneNumber: item?.phoneNo, Name: item?.fullname });
  };

  const handleCusNameChange = (e) => {
    const input = e.target.value;
    if (input.trim() !== "") {
      form.setFieldsValue({ Name: input });
    } else {
      form.setFieldsValue({ Name: "" });
    }
  };

  const onFinishForm = async () => {
    try {
      if (distanceInfo != null) {
        let responseCusData;
        if (cusId === 0) {
          const cusData = {
            phoneNo: form.getFieldValue("PhoneNumber"),
            fullname: form.getFieldValue("Name"),
            password: "123a",
          };
          //Add new customer
          responseCusData = await createCustomer(GET_CUSTOMER, cusData);
          console.log(responseCusData);
        }
        const pickLocation = await getLocationByName(
          SEARCH_LOCATION_NAME,
          distanceInfo.PickupLocation,
          token
        );
        const destination = await getLocationByName(
          SEARCH_LOCATION_NAME,
          distanceInfo.Destination,
          token
        );
        const inputData = {
          pickupLocationId: pickLocation.id,
          destinationId: destination.id,
          bookingWay: 1, //using web admin
          bookingTime: distanceInfo.PickupTime,
          distance: distanceInfo.distance.distance.text,
          sum: distanceInfo?.fare[getFare(distanceInfo)],
          customerId: cusId === 0 ? responseCusData?.customer?.id : cusId,
          adminId: adminId,
          note: form.getFieldValue("Note"),
          serviceId: distanceInfo.CarService.toString(),
          carType: distanceInfo.CarType.toString(),
          paymentStatus: 1,
          paymentType: 1,
          socketid: socketData.id,
        };

        console.log("inputData", inputData);
        // Submit booking form without waiting
        const submitBookingPromise = submitBookingForm(
          { data: inputData, bookingId: null },
          adminId,
          token,
          dispatch
        );
        
        setLoading(true);
        loadingTimeout = setTimeout(() => {
          setLoading(false);
          message.success("Đơn đặt xe đã được gửi đi!");
          navigate("/booking");
        }, 8000); //8s
        
        // Now, if you need the response from submitBookingForm, you can use .then()
        submitBookingPromise
          .then((response) => {
            clearTimeout(loadingTimeout);
            console.log("Response from submitBookingForm:", response);
            if (response !== undefined) {
              const notification = `Tài xế ${formatPeopleId(
                response.data.driver_accepted.id,
                "DR"
              )} chấp nhận đơn đặt xe ${formatPeopleId(
                response.data.bookingId,
                "BK"
              )}!`;
              message.success(notification);
              const input = {
                text: notification,
                adminId,
                isErrorNoti: false,
              };
              console.log("input noti", input);
              createNotification(input, token)
                .then((createNotificationResponse) => {
                  console.log(
                    "createNotificationResponse",
                    createNotificationResponse
                  );
                  dispatch(addNotification(createNotificationResponse.data));
                })
                .catch((createNotificationError) => {
                  console.error(
                    "Error creating notification:",
                    createNotificationError
                  );
                });
            } else {
              // dispatch(setBookingData(true));
            }
          })
          .catch((error) => {
            console.error("Error submitting booking form:", error);
            // message.error(t("errorMess"));
          });
      }
    } catch (error) {
      clearTimeout(loadingTimeout);
      console.error("Error fetching distance data:", error);
      throw error;
    }
  };

  useEffect(() => {
    setHasFeedback(null);
    dispatch(setDistanceData(null));
  }, []);

  return (
    <div className="contentAddNew">
      <div className="leftPart mx-3 pt-3">
        <h5 className="textBlue2 text-center fw-bolder">
          {t("addNewBooking")}
        </h5>
        {/* Get info form */}
        <FormGetInfo />
        <h6 className="fw-bolder">{t("guestDetail")}</h6>
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
                label={<div className="textBlue3">{t("phone")}</div>}
                rules={[
                  {
                    required: true,
                  },
                ]}
                validateStatus={hasFeedback === false ? "error" : ""}
                help={
                  hasFeedback === false
                    ? "Please input Guest's Phone Number"
                    : ""
                }
              >
                <Input
                  value={phoneNo}
                  onChange={handleInputChange}
                  suffix={suffix}
                  status={
                    hasFeedback === true
                      ? "success"
                      : hasFeedback === false
                      ? "error"
                      : ""
                  }
                />
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
                label={<div className="textBlue3">{t("name")}</div>}
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
                <Input value={cusName} onChange={handleCusNameChange} />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name="Note"
            label={<div className="textBlue3">{t("note")} (Optional)</div>}
          >
            <Input.TextArea allowClear />
          </Form.Item>
          <div className="rightPart">
            <h6 className="fw-bolder">{t("bookingSummary")}</h6>
            <div className="fs-14 mt-3 lh-lg">
              {distanceInfo == null ? (
                t("noInfo")
              ) : (
                <>
                  <div>
                    {t("km")}:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.distance
                        ? distanceInfo?.distance?.distance?.text
                        : t("unknown")}
                    </b>
                  </div>
                  <div>
                    {t("duration")}:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.distance
                        ? distanceInfo?.distance?.duration?.text
                        : t("unknown")}
                    </b>
                  </div>
                  <div>
                    {t("carType")}:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.CarType === 1
                        ? t("motorcycle")
                        : distanceInfo?.CarType === 3
                        ? t("car-4")
                        : t("car-7")}
                    </b>
                  </div>
                  <div>
                    {t("carService")}:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.CarService === 1 ? "Standard" : "Plus"}
                    </b>
                  </div>
                  <div>
                    {t("vip")}:{" "}
                    <b className="float-end me-5 pe-2">
                      {distanceInfo?.PickupTime === null ? t("none") : t("yes")}
                    </b>
                  </div>
                  <hr />
                  <div className="fw-bolder textOrange1">
                    {t("total")} (Vnd):{" "}
                    <span className="float-end me-5 pe-2 fs-18">
                      {distanceInfo?.fare
                        ? changeFareFormat(
                            distanceInfo?.fare[getFare(distanceInfo)]
                          )
                        : t("unknown")}
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
                  loading={loading}
                  htmlType="submit"
                  className="border-0 rounded-3 px-5 mt-4 w-70 text-black-60 fw-bolder bookingBtn"
                  disabled={
                    form.getFieldValue("Name") === undefined ||
                    form.getFieldValue("Name") === "" ||
                    form.getFieldValue("PhoneNumber") === undefined ||
                    form.getFieldValue("PhoneNumber") === "" ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length ||
                    !hasFeedback ||
                    distanceInfo === null
                  }
                >
                  {t("book")}
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
