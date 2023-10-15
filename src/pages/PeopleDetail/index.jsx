import { Avatar, Button, DatePicker, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function PeopleDetail(props) {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [isCus, setIsCus] = useState(false);

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
  useEffect(() => {
    if (id.includes("CUS")) {
      form.setFieldsValue({
        fullName: "Ms. Hoa",
        phone: "0893874889",
      });
      setIsCus(true);
    } else {
      form.setFieldsValue({
        fullName: "Hoang Tran",
        gender: "male",
        license: "51A-34221",
        phone: "0893874889",
      });
      setIsCus(false);
    }
  }, []);
  return (
    <div className="peopleDetail">
      <div className="row p-3">
        <div className="col-4 d-flex justify-content-center align-items-center">
          <Avatar
            src="https://lh3.googleusercontent.com/PSBfmOl_5jv97zDydSaV0FYEOFaU279KK4EKxGj5yzMMHMim8501-dToq_kD4sMfZ-niDUYtywSoNgwnUdP02hsfnQ"
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
            // onFinish={onFinish}
            // onValuesChange={handleFormChange}
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
                  rules={[
                    {
                      required: true,
                      message: "Please input Full Name!",
                    },
                    {
                      type: "string",
                      min: 2,
                    },
                  ]}
                  //   hasFeedback={hasFeedback && itemChange.firstName}
                >
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  name="phone"
                  label={<div className="textBlue3">Phone Number</div>}
                  //   hasFeedback={hasFeedback && itemChange.lastName}
                >
                  <Input disabled />
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
                    //   hasFeedback={hasFeedback && itemChange.gender}
                  >
                    <Select disabled>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="others">Other</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item
                    name="license"
                    label={<div className="textBlue3">License Plate</div>}
                  >
                    <Input disabled />
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
          {historyList?.map((item, index) => (
            <div className="row mb-5" key={index}>
              <div className="col-10 d-flex">
                <img
                  src="/images/motorcycle.png"
                  className="iconCar me-4"
                  alt="icon"
                />
                <div>
                  <div className="fs-14 textGrey2">
                    Trip from {item.pickup} to {item.destination}
                  </div>
                  <div className="fs-11 textGrey1 mb-3">{item.arrivedTime}</div>
                  <Link
                    className="textBlue5 fs-14 fw-bolder text-decoration-none"
                    to="/"
                  >
                    See Detail
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ms-2 bgBlue1 p-2 rounded-circle iconArrow"
                    />
                  </Link>
                </div>
              </div>
              <div className="fs-14 textGrey2 me-4 col">{item.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
