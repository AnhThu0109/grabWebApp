import { Avatar, Button, DatePicker, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
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

  const historyList = [
    {
      id: "TR0123",
      pickup: "Centec Tower",
      destination: "Gigamall Thu Duc",
      arrivedTime: "14:00, Sep 15th 2023",
      total: "54.000 vnd",
    },
    {
      id: "TR0124",
      pickup: "123 Nguyen Trai Street, District 1, Ho Chi Minh city",
      destination: "32 Nguyen Thi Minh Khai, District 3, Ho Chi Minh city",
      arrivedTime: "17:02, Sep 15th 2023",
      total: "63.500 vnd",
    },
    {
      id: "TR0125",
      pickup: "Diamond Plaza, Ho Chi Minh city",
      destination: "Gigamall Thu Duc",
      arrivedTime: "09:20, Sep 17th 2023",
      total: "72.000 vnd",
    },
    {
      id: "TR0126",
      pickup: "Etown 2",
      destination: "Gigamall Thu Duc",
      arrivedTime: "16:33, Sep 18th 2023",
      total: "135.000 vnd",
    },
  ];

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
    }
    const history = bookings.filter(
      (item) => item.status === 3 || item.status === 4
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
                    {/* <Select disabled>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="others">Other</Option>
                    </Select> */}
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

            {/* <Form.Item shouldUpdate style={{ textAlign: "right" }}>
          {() => (
            <Button
              htmlType="submit"
              disabled={
                form.getFieldValue("firstName") === undefined ||
                form.getFieldValue("lastName") === undefined ||
                form.getFieldValue("birth") === undefined ||
                form.getFieldValue("gender") === undefined ||
                form.getFieldValue("address") === undefined ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length || !hasFeedback
              }
              className="border-0 rounded-3 px-5 mt-2 w-70 text-black-60 fw-bolder updateAvatarBtn"
            >
              UPDATE
            </Button>
          )}
        </Form.Item> */}
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
          {bookingData?.map((item, index) => (
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
                    Trip from {item.pickupLocation.split(",")[0]} to{" "}
                    {item.destination}
                  </div>
                  <div className="fs-11 textGrey1 mb-3">
                    {item?.status === 3
                      ? "Completed at " + formatTime(item.Trip_End_Time)
                      : "Canceled"}
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
          ))}
        </div>
      </div>
    </div>
  );
}
