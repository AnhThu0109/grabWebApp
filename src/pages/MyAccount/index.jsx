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
import { useDispatch, useSelector } from "react-redux";
import { setAvatarChosenPath, setAvatarPath } from "../../redux/avatarSlide";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import getUserById from "../../utils/getById";
import formatPeopleId from "../../utils/formatPeopleID";
import { withTranslation } from "react-i18next";

const AvatarCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const dispatch = useDispatch();
  const avatar = useSelector((state) => state.avatar.avatarPath);
  const avatarChosen = useSelector((state) => state.avatar.avatarChosenPath);

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
                    dispatch(setAvatarChosenPath(item));
                    setActiveIndex(index + pageIndex * 12); // Adjust the index based on the current page
                  }}
                  alt="avatar"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Carousel>
  );
};

const MyAccount = ({ t }) => {
  const initialItemChange = {
    givenName: null,
    familyName: null,
    birth: null,
    gender: null,
    address: null,
  };
  const [userData, setUserData] = useState();
  const [initialData, setInitialData] = useState();
  const [hasFeedback, setHasFeedback] = useState(false);
  const [itemChange, setItemChange] = useState(initialItemChange);
  const id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const avatar = useSelector((state) => state.avatar.avatarPath);
  const avatarChosen = useSelector((state) => state.avatar.avatarChosenPath);
  const [isDataChange, setIsDataChange] = useState(false);

  const handleFormChange = (changedValues, allValues) => {
    setHasFeedback(true);
    const updatedItemChange = { ...itemChange };
    for (const changedField in changedValues) {
      if (form.getFieldValue(changedField) !== "") {
        updatedItemChange[changedField] = true;
      } else updatedItemChange[changedField] = false;
    }
    console.log(updatedItemChange);
    setItemChange(updatedItemChange);
  };

  const updateInformation = async (input, userId) => {
    const response = await axios.put(`${ADMIN}/${userId}`, input, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response;
  };

  const onFinish = async (values) => {
    const data = {
      fullname: `${values.familyName} ${values.givenName}`,
      birthday: values.birth,
      gender: values.gender,
      address: values.address,
      avatarPath: avatar,
    };
    console.log("Form values:", data);
    const result = await updateInformation(data, id);
    if (result.status === 200) {
      message.success(t("updateInfoSuccessMess"));
      setIsDataChange(true);
    } else {
      message.error(t("updateInfoErrMess"));
    }
    setHasFeedback(false);
    setItemChange(initialItemChange);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    dispatch(setAvatarPath(avatarChosen));
    setHasFeedback(true);
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 200);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const splitFullName = (fullname) => {
    return fullname.split(" ");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(id, ADMIN, token);
        setUserData(user);
        setInitialData({
          givenName: splitFullName(user?.fullname).splice(1).join(" "),
          familyName: splitFullName(user?.fullname)[0],
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
    setIsDataChange(false);
    //setItemChange(initialItemChange);
  }, [id, isDataChange, t]);

  return (
    <div className="myAcc">
      <div className="row bgGreen2">
        {initialData ? (
          <>
            <div className="col d-flex justify-content-center align-items-center">
              <Avatar
                sx={{ width: 120, height: 120 }}
                src={
                  avatar !== ""
                    ? avatar
                    : userData?.avatarPath
                    ? userData?.avatarPath
                    : "https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO"
                }
                alt="avatar"
                className="avatarImg me-5"
              />
              <div>
                <h4>{userData?.fullname}</h4>
                <div>{formatPeopleId(userData?.id, "AD")}</div>
                <button
                  className="changeAvatarBtn bg-white rounded-3 border-0 px-3 py-2 mt-2 textGreen3 fw-bolder"
                  onClick={showModal}
                >
                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                  {t("changeAvatar")}
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
                name="familyName"
                label={<div className="textBlue3">{t("famName")}</div>}
                rules={[
                  {
                    required: true,
                    message: "Please input your Family Name",
                  },
                ]}
                validateStatus={itemChange.familyName === false ? "error" : ""}
              >
                <Input
                  suffix={
                    itemChange.familyName === true ? (
                      <CheckCircleFilled
                        style={{
                          color: "#52c41a",
                        }}
                      />
                    ) : itemChange.familyName === false ? (
                      <CloseCircleFilled />
                    ) : (
                      <span />
                    )
                  }
                />
              </Form.Item>
            </div>
            <div className="col">
              <Form.Item
                name="givenName"
                label={<div className="textBlue3">{t("givenName")}</div>}
                rules={[
                  {
                    required: true,
                    message: "Please input your Given Name!",
                  },
                ]}
                validateStatus={itemChange.givenName === false ? "error" : ""}
              >
                <Input
                  suffix={
                    itemChange.givenName === true ? (
                      <CheckCircleFilled
                        style={{
                          color: "#52c41a",
                        }}
                      />
                    ) : itemChange.givenName === false ? (
                      <CloseCircleFilled />
                    ) : (
                      <span />
                    )
                  }
                />
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Form.Item
                name="birth"
                label={<div className="textBlue3">{t("birthday")}</div>}
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
                label={<div className="textBlue3">{t("gender")}</div>}
                rules={[
                  {
                    required: true,
                    message: "Please select your Gender",
                  },
                ]}
                hasFeedback={hasFeedback && itemChange.gender}
              >
                <Select>
                  <Option value="male">{t("male")}</Option>
                  <Option value="female">{t("female")}</Option>
                  <Option value="others">{t("other")}</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Form.Item
                name="address"
                label={<div className="textBlue3">{t("address")}</div>}
                rules={[
                  {
                    required: true,
                    message: "Please input your Address",
                  },
                ]}
                validateStatus={itemChange.address === false ? "error" : ""}
              >
                <Input
                  suffix={
                    itemChange.address === true ? (
                      <CheckCircleFilled
                        style={{
                          color: "#52c41a",
                        }}
                      />
                    ) : itemChange.address === false ? (
                      <CloseCircleFilled />
                    ) : (
                      <span />
                    )
                  }
                />
              </Form.Item>
            </div>
            <div className="col">
              <Form.Item
                name="phone"
                label={<div className="textBlue3">{t("phone")}</div>}
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
                  form.getFieldValue("givenName") === undefined ||
                  form.getFieldValue("familyName") === undefined ||
                  form.getFieldValue("birth") === undefined ||
                  form.getFieldValue("gender") === undefined ||
                  form.getFieldValue("address") === undefined ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length ||
                  !hasFeedback
                }
                className="border-0 rounded-3 px-5 mt-2 w-70 text-black-60 fw-bolder updateAvatarBtn"
              >
                {t("update")}
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
        title={"\u00A0\u00A0" + t("chooseAva")}
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

export default withTranslation()(MyAccount);
