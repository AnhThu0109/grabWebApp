import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import "./style.css";
import TableDriverComponent from "./TableDriverComponent";
import TableCusComponent from "./TableCusComponent";

const People = () => {
  const [size, setSize] = useState("large");
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size={size} className="people">
        <items tab={<div className="px-4 py-1 fw-bolder">Drivers</div>} key="1" className="p-3">
          <TableDriverComponent/>
        </items>
        <items tab={<div className="px-4 py-1 fw-bolder">Customers</div>} key="2" className="p-3">
          <TableCusComponent/>
        </items>
      </Tabs>
    </div>
  );
};

export default People;
