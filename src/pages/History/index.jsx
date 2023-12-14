import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faFilter,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Button, Space, Menu, Table, Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./style.css";
import "./../style.css";
import { Skeleton } from "@mui/material";
import getAll from "../../utils/getAll";
import { BOOKING_FORM } from "../../utils/API";
import formatPeopleId from "../../utils/formatPeopleID";
import { formatDateBooking } from "../../utils/formatDate";
import { useTranslation } from "react-i18next";

function History() {
  const [bookingId, setbookingId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { t } = useTranslation();

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
          text: t("complete"),
          value: "Complete",
        },
        {
          text: t("canceled"),
          value: "Canceled",
        },
      ],
      onFilter: (value, record) =>
        (value === "Complete" &&
          record?.BookingStatusId?.id === 7) ||
        (value === "Canceled" &&
          record?.BookingStatusId?.id === 8),
      render: (_, item) => (
        <div className="d-flex justify-content-between">
          <Tag
            bordered={false}
            color={item.status === 7 ? "processing" : "error"}
          >
            {item.status === 7 ? t("complete") : t("canceled")}
          </Tag>
          <Dropdown overlay={itemNormalbooking} trigger={["click"]}>
            <Button onClick={() => bookingChosen(item.id)} className="border-0">
              <Space>
                <FontAwesomeIcon icon={faEllipsis} className="textGrey1" />
              </Space>
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const initData = async (filterItem) => {
    let filterData;
    if (filterItem === "All") {
      const data = await getAll(BOOKING_FORM, token);
      filterData = data.rows.filter(
        (item) => item.status === 7 || item.status === 8
      );
      filterData = filterData.map((item, index) => ({
        ...item,
        bookingId: formatPeopleId(item.id, "BK"),
        createdAt: formatDateBooking(item.createdAt),
      }));
    } else {
      const data = await getAll(`${BOOKING_FORM}/admin/${userId}`, token);
      filterData = data.filter(
        (item) => item.status === 7 || item.status === 8
      );
      filterData = filterData.map((item, index) => ({
        ...item,
        bookingId: formatPeopleId(item.id, "BK"),
        createdAt: formatDateBooking(item.createdAt),
      }));
    }
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
    await initData(filterItem);
  };

  useEffect(() => {
    initData("All");
  }, []);

  return (
    <>
      {isLoading ? (
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
            <Dropdown overlay={filterItems} trigger={["click"]}>
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
            </Dropdown>
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
export default History;
