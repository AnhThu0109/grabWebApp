import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Dropdown,
  Button,
  Space,
  Menu,
  Table,
  Input,
  Tag,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./style.css";
import "./../style.css";
import getAll from "../../utils/getAll";
import { BOOKING_FORM } from "../../utils/API";
import { Skeleton } from "@mui/material";
import { formatDateBooking } from "../../utils/formatDate";
import formatPeopleId from "../../utils/formatPeopleID";
import {
  updateBookingForm,
  submitBookingForm,
} from "../../utils/bookingFormAction";
import getById from "../../utils/getById";
import { useDispatch } from "react-redux";
import { createNotification } from "../../utils/notificationAction";
import { addNotification } from "../../redux/notificationSlide";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../utils/socketContext";

function Booking() {
  const [bookingId, setbookingId] = useState();
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const socketData = useSocket();
  const [isChangeBookingData, setChangeBookingData] = useState(false);

  //Get id of chosen booking for showing modal see detail
  const bookingChosen = (id) => {
    localStorage.setItem("bookingChosenId", id);
    setbookingId(id);
  };

  //For table using ant design
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  //Search booking using ant design
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //Function onChange for table
  const onChangeTable = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const displayAndCreateNotification = (noti) => {
    message.success(noti);

    const input = {
      text: noti,
      adminId: Number(adminId),
      isErrorNoti: false,
    };

    createNotification(input, token)
      .then((createNotificationResponse) => {
        console.log("createNotificationResponse", createNotificationResponse);
        dispatch(
          addNotification({
            text: createNotificationResponse.data.text,
            isRead: false,
          })
        );
      })
      .catch((createNotificationError) => {
        console.error("Error creating notification:", createNotificationError);
      });
  };

  const handleReSendBookingForm = async () => {
    try {
      const bookingFormById = await getById(bookingId, BOOKING_FORM, token);
      const inputData = {
        pickupLocationId: bookingFormById.pickupLocation.id,
        destinationId: bookingFormById.destination.id,
        bookingWay: 1, //using web admin
        bookingTime: bookingFormById.bookingTime,
        distance: bookingFormById.distance,
        sum: bookingFormById.Bill.sum,
        customerId: bookingFormById.Customer.id,
        adminId: bookingFormById.adminId,
        note: bookingFormById.note,
        serviceId: bookingFormById.service,
        carType: bookingFormById.carType,
        paymentStatus: 1,
        paymentType: 1,
        socketid: socketData.id,
      };
      console.log(inputData);
      const submitBookingPromise = submitBookingForm(
        { data: inputData, bookingId },
        adminId,
        token,
        dispatch
      );
      setChangeBookingData(true);
      message.success(
        `Đơn đặt xe ${formatPeopleId(bookingId, "BK")} đã được gửi đi!`
      );
      // Now, if you need the response from submitBookingForm, you can use .then()
      submitBookingPromise
        .then((response) => {
          console.log("Response from submitBookingForm:", response);
          if (response !== undefined) {
            setChangeBookingData(true);
            const notification = `Tài xế ${formatPeopleId(
              response.data.driver_accepted.id,
              "DR"
            )} chấp nhận đơn đặt xe ${formatPeopleId(
              response.data.bookingId,
              "BK"
            )}!`;
            displayAndCreateNotification(notification);
          } else {
            setChangeBookingData(true);
          }
        })
        .catch((error) => {
          console.error("Error submitting booking form:", error);
          //message.error(t("errorMess"));
        });
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const handleCancelBookingForm = async () => {
    const input = {
      status: 8,
    };
    const response = await updateBookingForm(bookingId, input, token);
    if (response.status === 200) {
      setChangeBookingData(true);
      message.success(
        `Đơn đặt xe ${formatPeopleId(bookingId, "BK")} đã được hủy thành công!`
      );
    }
  };

  //Items in dropdown button of each booking row
  const itemNormalbooking = (
    <Menu>
      <Menu.Item key="1">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          to={`/booking/tracking/${bookingId}`}
        >
          {t("seeDetail")}
        </Link>
      </Menu.Item>
    </Menu>
  );

  const itemFailbooking = (
    <Menu>
      <Menu.Item key="1">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          onClick={handleReSendBookingForm}
        >
          {t("resend")}
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          to={`/booking/tracking/${bookingId}`}
        >
          {t("seeDetail")}
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          onClick={handleCancelBookingForm}
        >
          {t("cancel")}
        </Link>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
      width: 200,
      className: "ps-5",
    },
    {
      title: "ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("bookingId"),
      width: 270,
      className: "ps-5",
    },
    {
      title: t("createdAtCapital"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("createdAt"),
      className: "ps-5",
    },
    {
      title: t("statusCapital"),
      key: "status",
      dataIndex: "status",
      className: "ps-5",
      filters: [
        {
          text: t("onProgress"),
          value: "Progress",
        },
        {
          text: t("running"),
          value: "Running",
        },
        {
          text: t("noDrivers"),
          value: "No drivers accepted",
        },
      ],
      onFilter: (value, record) =>
        (value === "Running" && record?.BookingStatusId?.id === 5) ||
        (value === "Progress" && record?.BookingStatusId?.id === 2) ||
        (value === "No drivers accepted" && record?.BookingStatusId?.id === 10),
      render: (_, item) => (
        <div className="d-flex justify-content-between">
          <Tag
            bordered={false}
            color={
              item.status === 10
                ? "orange"
                : item.status === 2 || item.status === 1
                ? "geekblue"
                : item.status === 3 || item.status === 4
                ? "cyan"
                : "green"
            }
          >
            {item.status === 5
              ? t("running")
              : item.status === 2 || item.status === 1
              ? t("onProgress")
              : item.status === 3
              ? t("driverAccepted")
              : item.status === 4
              ? t("driverPickup-ing")
              : item.status === 11
              ? t("driverPickup")
              : t("noDrivers")}
          </Tag>
          {item.status === 10 ? (
            <Dropdown overlay={itemFailbooking} trigger={["click"]}>
              <Button
                onClick={() => bookingChosen(item.id)}
                className="border-0"
              >
                <Space>
                  <FontAwesomeIcon icon={faEllipsis} className="textGrey1" />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <Dropdown overlay={itemNormalbooking} trigger={["click"]}>
              <Button
                onClick={() => bookingChosen(item.id)}
                className="border-0"
              >
                <Space>
                  <FontAwesomeIcon icon={faEllipsis} className="textGrey1" />
                </Space>
              </Button>
            </Dropdown>
          )}
        </div>
      ),
    },
  ];

  const initData = async () => {
    console.log("Socket Booking", socketData);
    let filterData;
    // if (filterItem === "All") {
    //   const data = await getAll(BOOKING_FORM, token);
    //   filterData = data.rows.filter(
    //     (item) => item.status === 1 ||
    //     item.status === 2 ||
    //     item.status === 3 ||
    //     item.status === 4 ||
    //     item.status === 5 ||
    //     item.status === 10
    //   );
    //   filterData = filterData.map((item, index) => ({
    //     ...item,
    //     bookingId: formatPeopleId(item.id, "BK"),
    //     createdAt: formatDateBooking(item.createdAt),
    //   }));
    // } else {
    //   const data = await getAll(`${BOOKING_FORM}/admin/${adminId}`, token);
    //   filterData = data.filter(
    //     (item) =>
    //       item.status === 1 ||
    //       item.status === 2 ||
    //       item.status === 3 ||
    //       item.status === 4 ||
    //       item.status === 5 ||
    //       item.status === 10
    //   );
    //   filterData = filterData.map((item, index) => ({
    //     ...item,
    //     bookingId: formatPeopleId(item.id, "BK"),
    //     createdAt: formatDateBooking(item.createdAt),
    //   }));
    // }
    const data = await getAll(`${BOOKING_FORM}/admin/${adminId}`, token);
    filterData = data.filter(
      (item) =>
        item.status === 1 ||
        item.status === 2 ||
        item.status === 3 ||
        item.status === 4 ||
        item.status === 5 ||
        item.status === 10
    );
    filterData = filterData.map((item, index) => ({
      ...item,
      bookingId: formatPeopleId(item.id, "BK"),
      createdAt: formatDateBooking(item.createdAt),
    }));
    filterData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    filterData = filterData.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
    setBookingData(filterData);
    setIsLoading(false);
  };

  //Filter items
  const filterItems = (
    <Menu>
      <Menu.Item key="1">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          onClick={() => handleClickFilter("All")}
        >
          {t("showAll")}
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          onClick={() => handleClickFilter("Mine")}
        >
          {t("showMine")}
        </Link>
      </Menu.Item>
    </Menu>
  );

  const handleClickFilter = async (filterItem) => {
    setIsLoading(true);
    setFilter(filterItem);
    await initData(); // Call initData directly with the filterItem argument
  };

  const updateBookingData = (index, newStatusId) => {
    const updatedBookingData = [...bookingData];
    updatedBookingData.map((item) => {
      if (item.id === index) {
        item.status = newStatusId;
      }
    });
    const filter = updatedBookingData.filter((item) => item.id !== index);
    setBookingData(filter);
  };

  socketData &&
    socketData
      .off("admin_check_status")
      .on("admin_check_status", async ({ bookingId, status }) => {
        // debugger;
        if (!bookingId || !status) {
          return;
        }

        // Find booking and check if it belongs to web admin or not
        const booking = await getById(bookingId, BOOKING_FORM, token);
        if (booking?.bookingWay === 1) {
          // let updatedBookingIndex = -1;
          // bookingData.map((item) => {
          //   if (item.id === bookingId && item.status !== status?.id) {
          //     updatedBookingIndex = item.id;
          //   }
          // });
          setChangeBookingData(true);
          if (booking?.adminId === Number(adminId)) {
            message.info(
              `Trạng thái đơn đặt xe ${formatPeopleId(bookingId, "BK")}: ${
                booking?.BookingStatusId?.status_description
              }`
            );

            if (status?.id === 7) {
              displayAndCreateNotification(
                `Đơn đặt xe ${formatPeopleId(bookingId, "BK")} đã hoàn thành!`
              );
            }
          }

          // if (updatedBookingIndex !== -1) {
          //   updateBookingData(updatedBookingIndex, status?.id);
          // }
        }
      });

  socketData &&
    socketData.off("bookingReject").on("bookingReject", async (data) => {
      if (!data) {
        return;
      }

      // if (bookingId !== undefined) {
      //   const notification = `Chưa tìm thấy tài xế cho đơn đặt xe ${formatPeopleId(
      //     bookingId,
      //     "BK"
      //   )}`;
      //   message.info(notification);
      //   const input = {
      //     text: notification,
      //     adminId: Number(adminId),
      //     isErrorNoti: true,
      //   };
      //   const resNoti = await createNotification(input, token);
      //   if (resNoti.status === 200) {
      //     dispatch(addNotification(resNoti.data));
      //   }
      // }
      setChangeBookingData(true);
    });

  useEffect(() => {
    // Initial data load
    initData();
    setChangeBookingData(false);
    // const intervalId = setInterval(() => {
    //   initData();
    // }, 10000); // 10 seconds in milliseconds

    // // Clear the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [isChangeBookingData]); //bookingData

  useEffect(() => {
    console.log("bookingData", bookingData);
  }, [bookingData]);

  return (
    <>
      {isLoading === true ? (
        <div className="pt-3 px-4">
          <Skeleton variant="rectangular" height={100} className="my-3" />
          <Skeleton variant="rectangular" height={420} />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between pt-4">
            <h5 className="px-3 mt-2 textGrey1">
              {bookingData?.length} {t("inTotal")}.
            </h5>
            <div>
              {/* <Dropdown overlay={filterItems} trigger={["click"]}>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="border-0 filterBtn px-3 py-2 me-3 rounded-3 bg-white"
                >
                  <Space>
                    <FontAwesomeIcon
                      icon={faFilter}
                      className="me-1"
                    ></FontAwesomeIcon>
                    {t("filter")}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="me-1"
                    ></FontAwesomeIcon>
                  </Space>
                </button>
              </Dropdown> */}
              <button className="border-0 bgBlue2 addNewBtn px-3 py-2 me-3 rounded-3">
                <Link to="/booking/add">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="me-2"
                  ></FontAwesomeIcon>
                  {t("addNew")}
                </Link>
              </button>
            </div>
          </div>

          {/* Table all bookings */}
          <Table
            columns={columns}
            dataSource={bookingData}
            onChange={onChangeTable}
            pagination={{ pageSize: 6 }}
            className="p-3 rounded-4 bookingsTable"
          />
        </>
      )}
    </>
  );
}
export default Booking;
