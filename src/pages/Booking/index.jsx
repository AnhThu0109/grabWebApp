import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPlus,
  faFilter,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
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

function Booking() {
  const [bookingId, setbookingId] = useState();
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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
            close
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

  let bookings = [
    {
      id: "B00110",
      createdAt: "Mar 20, 2023, 10:37",
      status: "Running",
    },
    {
      id: "B00109",
      createdAt: "Mar 20, 2023, 10:20",
      status: "Running",
    },
    {
      id: "B00108",
      createdAt: "Mar 20, 2023, 09:15",
      status: "Running",
    },
    {
      id: "B00107",
      createdAt: "Mar 19, 2023, 17:41",
      status: "Running",
    },
    {
      id: "B0016",
      createdAt: "Mar 19, 2023, 10:37",
      status: "Running",
    },
    {
      id: "B00105",
      createdAt: "Mar 18, 2023, 20:20",
      status: "Running",
    },
    {
      id: "B00104",
      createdAt: "Mar 17, 2023, 09:15",
      status: "Running",
    },
    {
      id: "B00103",
      createdAt: "Mar 17, 2023, 08:41",
      status: "Running",
    },
  ];

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
          See Detail
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
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("createdAt"),
      className: "ps-5",
    },
    {
      title: "STATUS",
      key: "status",
      dataIndex: "status",
      className: "ps-5",
      filters: [
        {
          text: "On Progress",
          value: "Progress",
        },
        {
          text: "Running",
          value: "Running",
        },
      ],
      onFilter: (value, record) => (value === "Running" && record.status === 2) || (value === "Progress" && record.status === 1),
      render: (_, item) => (
        <div className="d-flex justify-content-between">
          <Tag
            bordered={false}
            color={item.status === 2 ? "green" : "cyan"}
          >
            {item.status === 2? "Running" : "On Process"}
          </Tag>
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
        </div>
      ),
    },
  ];

  const initData = async (filterItem) => {
    let filterData;
    if (filterItem === "All") {
      const data = await getAll(BOOKING_FORM, token);
      filterData = data.rows.filter(item => item.status === 1 || item.status === 2);
      filterData = filterData.map((item, index) => ({
        ...item,
        bookingId: formatPeopleId(item.id, "BK"),
        key: index + 1,
        createdAt: formatDateBooking(item.createdAt),
      }));
    } else {
      const data = await getAll(`${BOOKING_FORM}/admin/${userId}`, token);
      filterData = data.filter(item => item.status === 1 || item.status === 2);
      filterData = filterData.map((item, index) => ({
        ...item,
        bookingId: formatPeopleId(item.id, "BK"),
        key: index + 1,
        createdAt: formatDateBooking(item.createdAt),
      }));
    }
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
          Show All
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link
          rel="noopener noreferrer"
          className="nav-link"
          onClick={() => handleClickFilter("Mine")}
        >
          Show Mine
        </Link>
      </Menu.Item>
    </Menu>
  );

  const handleClickFilter = async (filterItem) => {
    setIsLoading(true);
    await initData(filterItem); // Call initData directly with the filterItem argument
  };

  useEffect(() => {
    initData("All");
  }, []);

  return (
    <>
      {isLoading === true ? (
        <div className="pt-3 px-4">
          <Skeleton variant="rectangular" height={100} className="my-3"/>
          <Skeleton variant="rectangular" height={420} />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between pt-4">
            <h5 className="px-3 mt-2 textGrey1">
              {bookingData?.length} in total.
            </h5>
            <div>
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
                    Filter
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="me-1"
                    ></FontAwesomeIcon>
                  </Space>
                </button>
              </Dropdown>
              <button className="border-0 bgBlue2 addNewBtn px-3 py-2 me-3 rounded-3">
                <Link to="/booking/add">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="me-2"
                  ></FontAwesomeIcon>
                  Add New
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
