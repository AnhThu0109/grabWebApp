import { Button, Form, Input, message } from "antd";
import FormGetInfo from "./FormComponent";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinishForm = () => {
    if(form.getFieldValue("Name") !== undefined &&
    form.getFieldValue("PhoneNumber") !== undefined &&
    !!form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length === false){
        navigate("/booking/tracking");
    }
    message.success("Submit success form 1!");
  };

  return (
    <div className="contentAddNew">
      <div className="leftPart mx-3 pt-3">
        <h5 className="textBlue2 text-center fw-bolder">Add New Booking</h5>
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
                <Input />
              </Form.Item>
            </div>
            <div className="col">
              <Form.Item
                name="PhoneNumber"
                label={<div className="textBlue3">Phone Number</div>}
                rules={[
                  {
                    required: true,
                    message: "Please input Guest's Phone Number",
                  },
                  {
                    type: "string",
                    min: 12,
                  },
                ]}
                hasFeedback
              >
                <Input />
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
            <div className="fs-14 mt-3">No information</div>

            <Form.Item shouldUpdate style={{ textAlign: "center" }}>
              {() => (
                <Button
                  htmlType="submit"
                  className="border-0 rounded-3 px-5 mt-4 w-70 text-black-60 fw-bolder bookingBtn"
                  disabled={
                    form.getFieldValue("Name") === undefined ||
                    form.getFieldValue("PhoneNumber") === undefined ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
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
