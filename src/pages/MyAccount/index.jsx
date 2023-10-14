import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { useState } from "react";
import "./style.css";
import locale from "antd/es/date-picker/locale/en_US";
import { Option } from "antd/es/mentions";
import moment from "moment";

const MyAccount = () => {
  const [isAdmin, setAdmin] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [itemChange, setItemChange] = useState({
    firstName: false,
    lastName: false,
    birth: false,
    gender: false,
    address: false,
  });
  const a = localStorage.getItem("isAdmin");
  const [form] = Form.useForm();

  let initialValue = {
    firstName: "Tommy",
    lastName: "Nguyen",
    birth: moment("1997-07-17"),
    gender: "male",
    address: "284 Nguyen Trai Street, District 1",
    phone: "0893874889",
  };

  const initialItemChange = {
    firstName: false,
    lastName: false,
    birth: false,
    gender: false,
    address: false,
  };

  const handleFormChange = (changedValues, allValues) => {
    setHasFeedback(true);
    console.log("hasfeed", hasFeedback);
    console.log("change", changedValues);
    const updatedItemChange = { ...itemChange };
    for (const changedField in changedValues) {
      updatedItemChange[changedField] = true;
    }
    console.log(updatedItemChange);
    setItemChange(updatedItemChange);
  };

  const onFinish = (values) => {
    message.success("Update information success!");
    initialValue = {
      firstName: values.firstName,
      lastName: values.lastName,
      birth: values.birth,
      gender: values.gender,
      address: values.address,
      phone: "0893874889",
    };
    console.log("Form values:", initialValue);
    setHasFeedback(false);
    setItemChange(initialItemChange);
  };
  return (
    <div>
      <div className="row bgGreen2">
        <div className="col d-flex justify-content-center align-items-center">
          <Avatar
            sx={{ width: 120, height: 120 }}
            src="https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO"
            alt="avatar"
            className="avatarImg me-5"
          />
          <div>
            <h4>Tommy Nguyen</h4>
            <div>AD01272</div>
            <button className="changeAvatarBtn bg-white rounded-3 border-0 px-3 py-2 mt-2 textGreen3 fw-bolder">
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Change Avatar
            </button>
          </div>
        </div>
        <div className="col text-center">
          <img src="/images/gifDriver.gif" alt="img" className="imgDriver" />
        </div>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange}
        autoComplete="off"
        className="p-5"
        requiredMark={false}
        initialValues={initialValue}
      >
        <div className="row">
          <div className="col">
            <Form.Item
              name="firstName"
              label={<div className="textBlue3">First Name</div>}
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                },
                {
                  type: "string",
                  min: 2,
                },
              ]}
              hasFeedback={hasFeedback && itemChange.firstName}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name="lastName"
              label={<div className="textBlue3">Last Name</div>}
              rules={[
                {
                  required: true,
                  message: "Please input Destination",
                },
                {
                  type: "string",
                  min: 2,
                },
              ]}
              hasFeedback={hasFeedback && itemChange.lastName}
            >
              <Input />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Form.Item
              name="birth"
              label={<div className="textBlue3">Date of Birth</div>}
              rules={[
                {
                  required: true,
                  message: "Please choose your Date of Birth!",
                },
              ]}
              hasFeedback={hasFeedback && itemChange.birth}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder=""
                className="w-100"
                locale={locale}
              />
            </Form.Item>
          </div>
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
              hasFeedback={hasFeedback && itemChange.gender}
            >
              <Select>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="others">Other</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Form.Item
              name="address"
              label={<div className="textBlue3">Address</div>}
              rules={[
                {
                  required: true,
                  message: "Please input your Address",
                },
                {
                  type: "string",
                  min: 2,
                },
              ]}
              hasFeedback={hasFeedback && itemChange.address}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name="phone"
              label={<div className="textBlue3">Phone Number</div>}
            >
              <Input className="textGrey1" readOnly />
            </Form.Item>
          </div>
        </div>

        <Form.Item shouldUpdate style={{ textAlign: "right" }}>
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default MyAccount;
