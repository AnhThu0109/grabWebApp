import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faCircleLeft, faEllipsisVertical, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import"./../style.css";
import { useNavigate } from "react-router-dom";

export default function Tracking() {
    const navigate = useNavigate();
    const handleReturn = () => {
        navigate("/booking");
    }

    const icons = Array.from({ length: 9 }, (_, index) => (
        <FontAwesomeIcon key={index} icon={faEllipsisVertical} className="textGrey1" />
      ));
      const spaces = Array.from({ length: 4 }, (_, index) => (
        <br />
      ));
  return (
    <div className="p-4">
      <div className="row">
        <div className="col-2 me-2">
          <Button type="primary" htmlType="submit" ghost className="returnBtn" onClick={handleReturn}>
            <FontAwesomeIcon icon={faCircleLeft} className="me-2"/>
            Return
          </Button>
        </div>
        <div className="col row bg-white rounded-3 p-3 fs-14 me-3">
            <div className="col-5 firstColumn">
                <div className="d-flex justify-content-between">
                    <div>Grab Standard</div>
                    <div>1.2 km</div>
                </div>
                <div className="d-flex">
                    <div className="d-flex flex-column me-2 py-3">
                    <FontAwesomeIcon icon={faCircleDot} className="textBlue5"/>
                    {icons}
                    <FontAwesomeIcon icon={faLocationDot} className="locationIcon textOrange1"/>
                    </div>
                    <div className="py-3">
                        <div>
                            Diamond Plaza
                            <div className="text-black-50 fs-11">5:19 PM</div>
                        </div>
                        {spaces}
                        <div>
                            Vincom Center
                            <div className="text-black-50 fs-11">Ongoing</div>
                        </div>
                    </div>
                </div>  
            </div>
            <div className="col secondColumn">
                <div className="d-flex justify-content-between">
                    <div>Guest</div>
                    <div className="fw-bolder">Ms.Hoa</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div>Phone Number</div>
                    <div className="fw-bolder">079700888808</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div>Admin</div>
                    <div className="fw-bolder">AD01272</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div>Driver</div>
                    <div className="fw-bolder">DR01023</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div>Car Type</div>
                    <div className="fw-bolder">Motocycle</div>
                </div>
                <hr/>
                <div className="d-flex justify-content-between">
                    <div>Total (Vnd)</div>
                    <div>
                        <div className="fw-bolder textOrange1">52,000</div>
                        <div className="text-black-50">Unpaid</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
