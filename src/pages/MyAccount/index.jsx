import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Carousel,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  message,
} from "antd";
import { useEffect, useState } from "react";
import "./style.css";
import locale from "antd/es/date-picker/locale/en_US";
import { Option } from "antd/es/mentions";
import moment from "moment";
import { AvatarImg } from "../../utils/avatar";
import axios from "axios";
import { ADMIN } from "../../utils/API";
import { Skeleton } from "@mui/material";

const AvatarCarousel = ({ images }) => {
  const [avatarSrc, setAvatarSrc] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const chunkedImages = chunkArray(images, 12);

  const contentStyle = {
    height: "380px",
    width: "100%",
    marginLeft: "5px",
    textAlign: "center",
  };

  return (
    <Carousel dotPosition="right">
      {chunkedImages.map((chunk, pageIndex) => (
        <div key={pageIndex}>
          <div className="row" style={contentStyle}>
            {chunk.map((item, index) => (
              <div key={index + pageIndex * 12} className="col-3 px-1 pb-2">
                <img
                  src={item}
                  className={
                    index === activeIndex - pageIndex * 12
                      ? "activeImg rounded-2 w-100"
                      : "rounded-2 w-100"
                  }
                  onClick={() => {
                    setAvatarSrc(item);
                    setActiveIndex(index + pageIndex * 12); // Adjust the index based on the current page
                  }}
                  alt={`Image ${index + pageIndex * 12 + 1}`}
                ></img>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Carousel>
  );
};

const MyAccount = () => {
  const [userData, setUserData] = useState();
  const [fullNameSplit, setFullNameSplit] = useState();
  const [initialData, setInitialData] = useState();
  const [hasFeedback, setHasFeedback] = useState(false);
  const [itemChange, setItemChange] = useState({
    firstName: false,
    lastName: false,
    birth: false,
    gender: false,
    address: false,
  });
  const id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
    console.log("change", allValues);
    const updatedItemChange = { ...itemChange };
    for (const changedField in changedValues) {
      updatedItemChange[changedField] = true;
    }
    console.log(updatedItemChange);
    setItemChange(updatedItemChange);
  };

  const onFinish = (values) => {
    message.success("Update information success!");
    // initialValue = {
    //   firstName: values.firstName,
    //   lastName: values.lastName,
    //   birth: values.birth,
    //   gender: values.gender,
    //   address: values.address,
    //   phone: "0893874889",
    // };
    // console.log("Form values:", initialValue);
    setHasFeedback(false);
    setItemChange(initialItemChange);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`${ADMIN}/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; // Re-throw the error to handle it elsewhere if needed
    }
  };

  const splitFullName = (fullname) => {
    return fullname.split(" ");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(id);
        setUserData(user);
        setFullNameSplit(splitFullName(user?.fullname));
        setInitialData({
          firstName: splitFullName(user?.fullname)[
            splitFullName(user?.fullname).length - 1
          ],
          lastName: splitFullName(user?.fullname)[0],
          birth: moment(user?.birthday),
          gender: user?.gender,
          address: user?.address,
          phone: user?.phoneNo,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="myAcc">
      <div className="row bgGreen2">
        {initialData ? (
          <>
            <div className="col d-flex justify-content-center align-items-center">
              <Avatar
                sx={{ width: 120, height: 120 }}
                src={userData?.avatarpath != null? userData?.avatarpath : "https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO"}
                alt="avatar"
                className="avatarImg me-5"
              />
              <div>
                <h4>{userData?.fullname}</h4>
                <div>AD0127{userData?.id}</div>
                <button
                  className="changeAvatarBtn bg-white rounded-3 border-0 px-3 py-2 mt-2 textGreen3 fw-bolder"
                  onClick={showModal}
                >
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  Change Avatar
                </button>
              </div>
            </div>
            <div className="col text-center">
              <img
                src="/images/gifDriver.gif"
                alt="img"
                className="imgDriver"
              />
            </div>
          </>
        ) : (
          <div className="row p-5 mx-5">
            <Skeleton
              variant="circular"
              width={130}
              height={130}
              className="col-4 me-5"
            />
            <div className="col w-100 me-5">
              <Skeleton height={35} width="95%" className="my-2" />
              <Skeleton height={35} width="95%" className="mb-2" />
              <Skeleton height={35} width="95%" />
            </div>
          </div>
        )}
      </div>
      {initialData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          autoComplete="off"
          className="p-5"
          requiredMark={false}
          initialValues={initialData}
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
                    message: "Please input your Last Name",
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
                    .length ||
                  !hasFeedback
                }
                className="border-0 rounded-3 px-5 mt-2 w-70 text-black-60 fw-bolder updateAvatarBtn"
              >
                UPDATE
              </Button>
            )}
          </Form.Item>
        </Form>
      ) : (
        <div className="row p-5 mx-5">
          <div className="col">
            <Skeleton width="100%" height={70} className="mb-3" />
            <Skeleton width="100%" height={70} className="mb-3" />
            <Skeleton width="100%" height={70} />
          </div>
          <div className="col">
            <Skeleton width="100%" height={70} className="mb-3" />
            <Skeleton width="100%" height={70} className="mb-3" />
            <Skeleton width="100%" height={70} />
          </div>
        </div>
      )}

      <Modal
        title="&nbsp;&nbsp;Choose Avatar"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        className="myAccModal"
      >
        <AvatarCarousel images={AvatarImg} />
      </Modal>
    </div>
  );
};

export default MyAccount;
