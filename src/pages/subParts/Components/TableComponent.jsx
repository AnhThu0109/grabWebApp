import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Button, Space, Menu, Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";

function TableComponent(props) {
  const [data, setData] = useState();
  const { t } = useTranslation();

  //Get id of chosen booking for showing modal see detail
  const peopleChosen = (itemId) => {
    localStorage.setItem("peopleChosenId", itemId);
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

  //Function onChange for table
  const onChangeTable = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  //Items in dropdown button of each booking row
  const itemDropdown = (itemId) => {return (
    <Menu>
      <Menu.Item key="1">
        <Link rel="noopener noreferrer" className="nav-link" to={`/people/detail/${itemId}`}>
          {t("seeDetail")}
        </Link>
      </Menu.Item>
    </Menu>
  )};

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
      dataIndex: "peopleID",
      key: "peopleID",
      sorter: (a, b) => a.id.localeCompare(b.id),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("peopleID"),
      width: 270,
      className: "ps-5",
    },
    {
      title: t("fullNameCapital"),
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("fullname"),
      className: "ps-5",
    },
    {
      title: t("phoneCapital"),
      key: "phoneNo",
      dataIndex: "phoneNo",
      ...getColumnSearchProps("phoneNo"),
      className: "ps-5",
      render: (_, item) => (
        <div className="d-flex justify-content-between">
          <div>{item.phoneNo}</div>
          <Dropdown overlay={() => itemDropdown(item.peopleID)} trigger={["click"]}>
            <Button
              onClick={() => peopleChosen(item.id)}
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

  useEffect(()=>{
    let peopleList = [...props.people];
    setData(peopleList);
  }, [])

  return (
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChangeTable}
        pagination={{ pageSize: 6 }}
        className="p-3 rounded-4 peopleTable"
      />
  );
}
export default TableComponent;
