import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Checkbox, Button, Form, message } from "antd";
import "./style.css";
import "./../style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { LOGIN, SERVER_URL } from "../../utils/API";
import { useTranslation } from "react-i18next";
import io from 'socket.io-client';

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
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

      message.success("Đăng nhập thành công!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.data.id);
      i18n.changeLanguage("en");
      navigate("/welcome");
    } catch (error) {
      console.error(error);
      message.error("Username hoặc Password không đúng.");
      handleClearInput();
    }
  };

  const handleClearInput = () => {
    form.setFieldValue("username", "");
    form.setFieldValue("password", "");
  }

  useEffect(() => {
    setRootBackground();

    // // Connect to the Socket.IO server
    // const socket = io(SERVER_URL);

    // // Event listener for when the connection is established
    // socket.on('connect', (socket) => {
    //   console.log(socket);
    //   console.log('Connected to Socket.IO server');
    //   //save socket id to database
    // });

    // // Cleanup: disconnect from the server when the component unmounts
    // return () => {
    //   socket.disconnect();
    //   console.log('Disconnected from Socket.IO server');
    // };
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
            <Input.Password  visibilityToggle={false} className="py-2" />
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
