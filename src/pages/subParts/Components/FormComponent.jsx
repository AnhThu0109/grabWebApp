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

export default function FormGetInfo() {
  const [form] = Form.useForm();
  const onFinish = () => {
    message.success("Submit success!");
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
            <Input />
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
            <Input />
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
              format="YYYY-MM-DD HH:mm:ss"
              placeholder=""
              className="w-100"
              locale={locale}
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
