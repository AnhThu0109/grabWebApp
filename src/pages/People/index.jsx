import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import "./style.css";
import TableComponent from "../subParts/Components/TableComponent";

const People = () => {
  const [size, setSize] = useState("large");

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

  let customers = [
    {
      id: "CUS0010",
      fullName: "Hoang Tran",
      phone: "0793784663",
    },
    {
      id: "CUS0011",
      fullName: "Duy Nguyen",
      phone: "0793784345",
    },
    {
      id: "CUS0012",
      fullName: "Bao Le",
      phone: "9679769563",
    },
    {
      id: "CUS0013",
      fullName: "Hoang Ly",
      phone: "0123456789",
    },
    {
      id: "CUS0014",
      fullName: "Minh Ly",
      phone: "4545455465",
    },
    {
      id: "CUS0015",
      fullName: "Mai Nguyen",
      phone: "6776775578",
    },
    {
      id: "CUS0016",
      fullName: "Hoa Le",
      phone: "3454556456",
    },
    {
        id: "CUS0017",
        fullName: "Minh Dang",
        phone: "6767676423",
      },
      {
        id: "CUS0018",
        fullName: "Hieu Le",
        phone: "9897769876",
      },
      {
        id: "CUS0019",
        fullName: "Trung Tran",
        phone: "7346754764",
      },
      {
        id: "CUS0020",
        fullName: "Ngan Tran",
        phone: "4989659743",
      },
      {
        id: "CUS0021",
        fullName: "Tu Nguyen",
        phone: "4356567898",
      },
      {
        id: "CUS0022",
        fullName: "Ty Le",
        phone: "9706778745",
      },
      {
        id: "CUS0023",
        fullName: "Phuc Le",
        phone: "5576768795",
      },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size={size} className="people">
        <items tab={<div className="px-4 py-1 fw-bolder">Drivers</div>} key="1" className="p-3">
          <TableComponent people={drivers}/>
        </items>
        <items tab={<div className="px-4 py-1 fw-bolder">Customers</div>} key="2" className="p-3">
          <TableComponent people={customers}/>
        </items>
      </Tabs>
    </div>
  );
};

export default People;
