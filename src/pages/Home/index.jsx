import { useEffect, useState } from "react";
import "./style.css";
import { Card, Divider, Space } from "antd";

const Home = () => {
  const [isAdmin, setAdmin] = useState(false);
  const isAdminLogin = () => {
    localStorage.getItem(isAdmin) === "true" ? setAdmin(true) : setAdmin(false);
  };

  useEffect(() => {
    isAdminLogin();
  }, []);

  return (
    <>
      <div className="m-4 rounded-3 bg-white d-flex align-items-center justify-content-between px-4">
        <h3 className="fw-bolder">
          WELCOME BACK{isAdmin === true ? ", ADMIN" : ""}!
        </h3>
        <img
          src="/images/welcomeback.png"
          alt="welcomeBackImg"
          className="welcomeBackImg"
        />
      </div>

      <div className="row m-4 gap-3">
        <div
          className="col-2 bg-white rounded-3 cardHome pb-2"
        >
          <div className="d-flex pt-2 align-items-center">
            <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
              <img alt="sum" src="/images/sum.png" className="iconHome" />
            </div>

            <h5 className="fw-bolder fs-16">Total</h5>
          </div>
          <Divider />
          <h5 className="textBlue2 fw-bolder fs-16">124</h5>
          <small className="textGrey1">Booking trips</small>
        </div>

        <div
          className="col-2 bg-white rounded-3 cardHome pb-2"
        >
          <div className="d-flex pt-2 align-items-center">
            <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
              <img alt="sum" src="/images/complete.png" className="iconHome" />
            </div>

            <h5 className="fw-bolder fs-16">Complete</h5>
          </div>
          <Divider />
          <h5 className="textBlue2 fw-bolder fs-16">115</h5>
          <small className="textGrey1">Booking trips</small>
        </div>

        <div
          className="col-2 bg-white rounded-3 cardHome pb-2"
        >
          <div className="d-flex pt-2 align-items-center">
            <div className="bgIconHome rounded-circle d-flex align-items-center justify-content-center me-2">
              <img alt="sum" src="/images/ongoing.png" className="iconHome" />
            </div>

            <h5 className="fw-bolder fs-16">Ongoing</h5>
          </div>
          <Divider />
          <h5 className="textBlue2 fw-bolder fs-16">2</h5>
          <small className="textGrey1">Booking trips</small>
        </div>

        <div className="col bg-white rounded-3">

        </div>
      </div>

      <div className="row m-4 gap-3">
        <div className="bg-white col-8 rounded-3">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque ab esse modi inventore molestias vero ullam iste illum, neque culpa ipsam et. Vero recusandae nisi iusto fugit dolore. Perferendis, tempore?</p>
        </div>

        <div className="bg-white col rounded-3">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam eveniet libero, omnis labore voluptatem et, sunt nihil repudiandae atque blanditiis nostrum impedit quaerat ex expedita eum, rerum veniam! Odit, aut.</p>
        </div>
      </div>
    </>
  );
};

export default Home;
