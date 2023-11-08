import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Checkbox, Button, Form, message } from "antd";
import "./style.css";
import "./../style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { LOGIN } from "../../utils/API";

export default function Login() {
  const [data, setData] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setRootBackground = () => {
    document.documentElement.style.setProperty(
      "--bg-color1",
      "#BFEBE3" // Replace with your desired background color for the login page
    );
  };

  const onFinish = async (values) => {
    const input = {
      username: values.username,
      password: values.password,
    };
    console.log("Success:", values);
    try {
      const response = await axios.post(LOGIN, input, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", response.data);
      setData(response.data);
      message.success("Login successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.data.id);
      navigate("/welcome");
    } catch (error) {
      console.error(error);
      message.error("Username or Password not correct.");
      handleClearInput();
    }
  };

  const handleClearInput = () => {
    form.setFieldValue("username", "");
    form.setFieldValue("password", "");
  }

  useEffect(() => {
    setRootBackground();
  }, []);

  return (
    <div className="loginPage py-5 px-3 row justify-content-around align-items-center">
      <div className="col-5">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{
            username: "",
            password: "",
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          className="loginForm p-5 rounded-4 bg-white"
        >
          <h4 className="text-center textGreen1 mb-4 fw-bolder">
            Login to Go Taxi
          </h4>
          <Form.Item
            label={<div className="textBlue3">Username</div>}
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input className="py-2" />
          </Form.Item>

          <Form.Item
            label={<div className="textBlue3">Password</div>}
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password className="py-2" />
          </Form.Item>

          <div className="d-flex justify-content-between">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link className="textGrey2">
              <small>Forgot Password</small>
            </Link>
          </div>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                className={`my-3 fw-bolder formLoginBtn ${
                  form.getFieldValue("username") === "" ||
                  form.getFieldValue("password") === "" ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    ? ""
                    : "active"
                }`}
                disabled={
                  form.getFieldValue("username") === "" ||
                  form.getFieldValue("password") === "" ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                LOG IN
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
      <div className="col-5">
        <img className="loginImg" src="images/gifDriver.gif" alt="loginImage" />
        <h3 className="text-center textGrey1">
          <b>
            YOUR FUTURE
            <br />
            is created by what you do
            <br />
            TODAY
          </b>
        </h3>
      </div>
    </div>
  );
}
