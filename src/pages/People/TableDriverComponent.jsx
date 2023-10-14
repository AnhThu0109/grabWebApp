import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Button, Space, Menu, Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./style.css";
import "./../style.css";

function TableDriverComponent() {
  const [peopleId, setpeopleId] = useState();
  const id = localStorage.getItem("peopleChosenId");

  //Get id of chosen booking for showing modal see detail
  const peopleChosen = (id) => {
    localStorage.setItem("peopleChosenId", 123);
    setpeopleId(id);
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

  let people = [
    {
      id: "DR1010",
      fullName: "Hoang Tran",
      phone: "0793784663",
    },
    {
      id: "DR1011",
      fullName: "Duy Nguyen",
      phone: "0793784345",
    },
    {
      id: "DR1012",
      fullName: "Bao Le",
      phone: "9679769563",
    },
    {
      id: "DR1013",
      fullName: "Hoang Ly",
      phone: "0123456789",
    },
    {
      id: "DR1014",
      fullName: "Minh Ly",
      phone: "4545455465",
    },
    {
      id: "DR1015",
      fullName: "Mai Nguyen",
      phone: "6776775578",
    },
    {
      id: "DR1016",
      fullName: "Hoa Le",
      phone: "3454556456",
    },
    {
        id: "DR1017",
        fullName: "Minh Dang",
        phone: "6767676423",
      },
      {
        id: "DR1018",
        fullName: "Hieu Le",
        phone: "9897769876",
      },
      {
        id: "DR1019",
        fullName: "Trung Tran",
        phone: "7346754764",
      },
      {
        id: "DR1020",
        fullName: "Ngan Tran",
        phone: "4989659743",
      },
      {
        id: "DR1021",
        fullName: "Tu Nguyen",
        phone: "4356567898",
      },
      {
        id: "DR1022",
        fullName: "Ty Le",
        phone: "9706778745",
      },
      {
        id: "DR1023",
        fullName: "Phuc Le",
        phone: "5576768795",
      },
  ];

  people = people.map((item, index) => {
    return { ...item, key: index + 1 };
  });

  //Function onChange for table
  const onChangeTable = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  //Items in dropdown button of each booking row
  const itemNormalbooking = (
    <Menu>
      <Menu.Item key="1">
        <Link rel="noopener noreferrer" className="nav-link" to={`/people/detail/${id}`}>
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
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("id"),
      width: 270,
      className: "ps-5",
    },
    {
      title: "FULL NAME",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("fullName"),
      className: "ps-5",
    },
    {
      title: "PHONE NUMBER",
      key: "phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
      className: "ps-5",
      render: (_, item) => (
        <div className="d-flex justify-content-between">
          <div>{item.phone}</div>
          <Dropdown overlay={itemNormalbooking} trigger={["click"]}>
            <Button
              onClick={() => peopleChosen(item._id)}
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

  return (
      <Table
        columns={columns}
        dataSource={people}
        onChange={onChangeTable}
        pagination={{ pageSize: 6 }}
        className="p-3 rounded-4 peopleTable"
      />
  );
}
export default TableDriverComponent;
