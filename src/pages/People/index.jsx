import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";
import "./style.css";
import TableComponent from "../subParts/Components/TableComponent";
import axios from "axios";
import { GET_CUSTOMER, GET_DRIVER } from "../../utils/API";
import formatPeopleId from "../../utils/formatPeopleID";
import { Skeleton } from "@mui/material";
import { withTranslation } from "react-i18next";

const People = ({t}) => {
  const [size, setSize] = useState("large");
  const [customersData, setCustomersData] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const findAllCustomers = async() => {
    const response = await axios.get(GET_CUSTOMER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    return response.data;
  }

  const findAllDrivers = async() => {
    const response = await axios.get(GET_DRIVER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
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
      peopleList.sort((a, b) => a.id - b.id);
      peopleList = peopleList?.map((item, index) => {
        return { ...item, key: index + 1, peopleID: formatPeopleId(item.id, "DR")};
      });
      setDriversData(peopleList);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    initData();
  }, [])
  return (
    <div>
      {
        isLoading ? (
          <>
            <Skeleton className="m-4" variant="rectangular" height={100} width="96%" />
            <Skeleton className="m-4" variant="rectangular" height={430} width="96%" />
          </>
        ) : (
          <Tabs defaultActiveKey="1" type="card" size={size} className="people">
            <items tab={<div className="px-4 py-1 fw-bolder">{t('drivers')}</div>} key="1" className="p-3">
              <TableComponent people={driversData}/>
            </items>
            <items tab={<div className="px-4 py-1 fw-bolder">{t('customers')}</div>} key="2" className="p-3">
              <TableComponent people={customersData}/>
            </items>
          </Tabs>
        )
      }
    </div>
  );
};

export default withTranslation()(People);
