import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";
import "./style.css";
import TableComponent from "../subParts/Components/TableComponent";
import axios from "axios";
import { GET_CUSTOMER, GET_DRIVER } from "../../utils/API";
import formatPeopleId from "../../utils/formatPeopleID";

const People = () => {
  const [size, setSize] = useState("large");
  const [customersData, setCustomersData] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const token = localStorage.getItem("token");

  let drivers = [
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

  const findAllCustomers = async() => {
    const response = await axios.get(GET_CUSTOMER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    console.log(response);
    return response.data;
  }

  const findAllDrivers = async() => {
    const response = await axios.get(GET_DRIVER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    console.log(response);
    return response.data;
  }

  const initData = async() => {
    const customers = await findAllCustomers();
    if (customers.length > 0) {
      let peopleList = [...customers];
      peopleList = peopleList?.map((item, index) => {
        return { ...item, key: index + 1, peopleID: formatPeopleId(item.id, "CUS")};
      });
      setCustomersData(peopleList);
    }

    const drivers = await findAllDrivers();
    if (drivers.length > 0) {
      let peopleList = [...drivers];
      peopleList = peopleList?.map((item, index) => {
        return { ...item, key: index + 1, peopleID: formatPeopleId(item.id, "DR")};
      });
      console.log(peopleList);
      setDriversData(peopleList);
    }
  }

  useEffect(() => {
    initData();
  }, [])
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size={size} className="people">
        <items tab={<div className="px-4 py-1 fw-bolder">Drivers</div>} key="1" className="p-3">
          <TableComponent people={driversData}/>
        </items>
        <items tab={<div className="px-4 py-1 fw-bolder">Customers</div>} key="2" className="p-3">
          <TableComponent people={customersData}/>
        </items>
      </Tabs>
    </div>
  );
};

export default People;
