import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDot,
  faCircleLeft,
  faEllipsisVertical,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import "./../style.css";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "./MapComponent";
import getLocationByName from "../../utils/getLocation";
import { BOOKING_FORM, SEARCH_LOCATION_NAME } from "../../utils/API";
import { useEffect, useState } from "react";
import getById from "../../utils/getById";
import formatPeopleId from "../../utils/formatPeopleID";
import getShortLocationName from "../../utils/getShortLocationName";
import formatTime from "../../utils/formatTime";
import changeFareFormat from "../../utils/formatFare";

export default function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleReturn = () => {
    navigate(-1);
  };
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [pickup, setPickup] = useState();
  const [destination, setDestination] = useState();
  const [driverLocation, setDriverLocation] = useState();
  const [bookingForm, setBookingForm] = useState();

  const icons = Array.from({ length: 9 }, (_, index) => (
    <FontAwesomeIcon
      key={index}
      icon={faEllipsisVertical}
      className="textGrey1"
    />
  ));
  const spaces = Array.from({ length: 4 }, (_, index) => <br key={index} />);

  const initInformation = async () => {
    const bookingFormInfo = await getById(id, BOOKING_FORM, token);
    console.log(bookingFormInfo);
    setBookingForm(bookingFormInfo);
    const pickLocation = await getLocationByName(
      SEARCH_LOCATION_NAME,
      bookingFormInfo.pickupLocation,
      token
    );
    setPickup({
      lat: Number(pickLocation.latitude),
      lng: Number(pickLocation.longitude),
    });
    const destLocation = await getLocationByName(
      SEARCH_LOCATION_NAME,
      bookingFormInfo.destination,
      token
    );
    setDestination({
      lat: Number(destLocation.latitude),
      lng: Number(destLocation.longitude),
    });
    setIsLoading(false);
  };

  useEffect(() => {
    initInformation();
    setDriverLocation({
      lat: 10.780987, // Driver's latitude
      lng: 106.69747, // Driver's longitude
    });
  }, []);

  return (
    <div className="p-4">
      {isLoading ? (
        <></>
      ) : (
        <>
          <div className="row">
            <div className="col-2 me-2">
              <Button
                type="primary"
                htmlType="submit"
                ghost
                className="returnBtn"
                onClick={handleReturn}
              >
                <FontAwesomeIcon icon={faCircleLeft} className="me-2" />
                Return
              </Button>
            </div>
            <div className="col row bg-white rounded-3 p-3 fs-14 me-3">
              <div className="col-5 firstColumn">
                <div className="d-flex justify-content-between">
                  <div>
                    {bookingForm?.service === "1" ? "Standard" : "Plus"} Service
                  </div>
                  <div>{bookingForm?.distance}</div>
                </div>
                <div className="d-flex">
                  <div className="d-flex flex-column me-2 py-3">
                    <FontAwesomeIcon icon={faCircleDot} className="textBlue5" />
                    {icons}
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="locationIcon textOrange1"
                    />
                  </div>
                  <div className="py-3">
                    <div>
                      {getShortLocationName(bookingForm?.pickupLocation)}
                      <div className="text-black-50 fs-11">
                        {bookingForm?.Trip_Start_Time !== null
                          ? formatTime(bookingForm?.Trip_Start_Time)
                          : "On Progress"}
                      </div>
                    </div>
                    {spaces}
                    <div>
                      {getShortLocationName(bookingForm?.destination)}
                      <div className="text-black-50 fs-11">
                        {bookingForm?.Trip_End_Time === null &&
                        bookingForm?.Trip_Start_Time === null
                          ? "On Progress"
                          : bookingForm?.Trip_End_Time === null &&
                            bookingForm?.Trip_Start_Time !== null
                          ? "Ongoing"
                          : formatTime(bookingForm?.Trip_End_Time)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col secondColumn">
                <div className="d-flex justify-content-between">
                  <div>Guest</div>
                  <div className="fw-bolder">
                    {bookingForm?.Customer?.fullname}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Phone Number</div>
                  <div className="fw-bolder">
                    {bookingForm?.Customer?.phoneNo}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Admin</div>
                  <div className="fw-bolder">
                    {formatPeopleId(bookingForm?.adminId, "AD")}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Driver</div>
                  <div className="fw-bolder">
                    {bookingForm?.driverId === null
                      ? "Finding Driver..."
                      : formatPeopleId(bookingForm?.driverId, "DR")}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Car Type</div>
                  <div className="fw-bolder">
                    {bookingForm?.carType === "1" ? "Motorcycle" : "Car"}
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <div>Total (Vnd)</div>
                  <div>
                    <div className="fw-bolder textOrange1">
                      {changeFareFormat(bookingForm?.Bill?.sum)}
                    </div>
                    <div className="text-black-50">
                      {bookingForm?.Trip_End_Time === null ? "Unpaid" : "Paid"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <MapComponent
              driverLocation={driverLocation}
              pickup={pickup}
              destination={destination}
            />
          </div>
        </>
      )}
    </div>
  );
}
