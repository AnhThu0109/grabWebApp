import { Avatar, Button, DatePicker, Form, Input } from "antd";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { BOOKING_FORM, GET_CUSTOMER, GET_DRIVER } from "../../utils/API";
import getAll from "../../utils/getAll";
import formatTime from "../../utils/formatTime";

export default function PeopleDetail(props) {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [peopleData, setPeopleData] = useState();
  const [isCus, setIsCus] = useState(false);
  const [bookingData, setBookingData] = useState();
  const token = localStorage.getItem("token");
  const peopleID = localStorage.getItem("peopleChosenId");

  const findPeopleByID = async (peopleId, URL) => {
    const response = await axios.get(`${URL}/${peopleId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response.data;
  };

  const initData = async (id) => {
    let bookings;
    if (id.includes("CUS")) {
      const customer = await findPeopleByID(peopleID, GET_CUSTOMER);
      setIsCus(true);
      form.setFieldValue("fullName", customer?.fullname);
      form.setFieldValue("phone", customer?.phoneNo);
      bookings = await getAll(`${BOOKING_FORM}/customer/${peopleID}`, token);
    } else {
      const driver = await findPeopleByID(peopleID, GET_DRIVER);
      console.log(driver);
      setIsCus(false);
      form.setFieldsValue({
        fullName: driver?.fullname,
        gender: driver?.gender ? driver?.gender : "Unknown",
        license: driver?.licensePlate,
        phone: driver?.phoneNo,
      });
      bookings = await getAll(`${BOOKING_FORM}/driver/${peopleID}`, token);
      console.log(bookings);
    }
    const history = bookings.filter(
      (item) => item.BookingStatusId.status_description === "Complete" || item.BookingStatusId.status_description === "Canceled"
    );
    setBookingData(history);
  };

  useEffect(() => {
    initData(id);
  }, []);
  return (
    <div className="peopleDetail">
      <div className="row p-3">
        <div className="col-4 d-flex justify-content-center align-items-center">
          <Avatar
            src={
              peopleData?.avatarPath != null
                ? peopleData?.avatarPath
                : "https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO"
            }
            alt="avatar"
            className="avatarImg me-5"
          />
          <div>
            <h4>{isCus ? "CUSTOMER" : "DRIVER"}</h4>
            <div>{id}</div>
          </div>
        </div>
        <div className="col">
          <Form
            form={form}
            layout="vertical"
            className="me-2"
            autoComplete="off"
            requiredMark={false}
          >
            <div className="row">
              <div className="col">
                <Form.Item
                  name="fullName"
                  label={
                    <div className="textBlue3">
                      {isCus ? "Name" : "Full Name"}
                    </div>
                  }
                >
                  <Input readOnly />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  name="phone"
                  label={<div className="textBlue3">Phone Number</div>}
                >
                  <Input readOnly />
                </Form.Item>
              </div>
            </div>

            {!isCus && (
              <div className="row">
                <div className="col">
                  <Form.Item
                    name="gender"
                    label={<div className="textBlue3">Gender</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please select your Gender",
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item
                    name="license"
                    label={<div className="textBlue3">License Plate</div>}
                  >
                    <Input readOnly />
                  </Form.Item>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
      <div className="bg-white rounded-3 peopleHistory mx-4 p-4">
        <h5 className="mb-3">Activity History</h5>
        <Form className="d-flex">
          <Form.Item>
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item>
            <Button shape="circle" icon={<SearchOutlined />} className="ms-3" />
          </Form.Item>
        </Form>
        <div className={isCus ? "historyCusList" : "historyDriverList"}>
          {bookingData?.length > 0 ? (bookingData?.map((item, index) => (
            <div className="row mb-5" key={index}>
              <div className="col-10 d-flex">
                {item?.carType === "1" ? (
                  <img
                    src="/images/motorcycle.png"
                    className="iconCar me-4"
                    alt="icon"
                  />
                ) : (
                  <img
                    src="/images/carIcon.png"
                    className="iconCar me-4"
                    alt="icon"
                  />
                )}
                <div>
                  <div className="fs-14 textGrey2">
                    Trip from {item.pickupLocation.locationName.split(",")[0]} to{" "}
                    {item.destination.locationName}
                  </div>
                  <div className="fs-11 textGrey1 mb-3"> {item?.BookingStatusId?.status_description}
                    {item?.BookingStatusId?.status_description === "Complete" && " at " + formatTime(item.Trip_End_Time)}
                  </div>
                  <Link
                    className="textBlue5 fs-14 fw-bolder text-decoration-none"
                    to={`/booking/tracking/${item.id}`}
                  >
                    See Detail
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ms-2 bgBlue1 p-2 rounded-circle iconArrow"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))) : <span className="fs-14 textGrey2">There is no data.</span>}
        </div>
      </div>
    </div>
  );
}
