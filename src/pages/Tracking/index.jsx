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
import MapComponent from "./MapComponent1";
import { BOOKING_FORM, GET_DRIVER } from "../../utils/API";
import { useEffect, useState } from "react";
import getById from "../../utils/getById";
import formatPeopleId from "../../utils/formatPeopleID";
import getShortLocationName from "../../utils/getShortLocationName";
import changeFareFormat from "../../utils/formatFare";
import { useTranslation } from "react-i18next";
import { formatDateBooking } from "../../utils/formatDate";

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
  const [driverLocation, setDriverLocation] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  const { t } = useTranslation();

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
    if (bookingFormInfo !== "") {
      const bookingId = bookingFormInfo.BookingStatusId.id;
      if (
        bookingId !== 3 &&
        bookingId !== 4 &&
        bookingId !== 5 &&
        bookingId !== 6
      ) {
        setDriverLocation(null);
      } else {
        //Status running => Có driverId => lấy thông tin driver để lấy location
        const driver = await getById(
          bookingFormInfo.driverId,
          GET_DRIVER,
          token
        );
        if (driverLocation !== null) {
          if (
            driver.location.coordinates[1] !== driverLocation.lat ||
            driver.location.coordinates[0] !== driverLocation.lng
          ) {
            setDriverLocation({
              lat: driver.location.coordinates[1],
              lng: driver.location.coordinates[0],
            });
          }
        } else {
          setDriverLocation({
            lat: driver.location.coordinates[1],
            lng: driver.location.coordinates[0],
          });
        }
      }
      setBookingForm(bookingFormInfo);
      setPickup({
        lat: Number(bookingFormInfo.pickupLocation.latitude),
        lng: Number(bookingFormInfo.pickupLocation.longitude),
      });
      setDestination({
        lat: Number(bookingFormInfo.destination.latitude),
        lng: Number(bookingFormInfo.destination.longitude),
      });
      setIsLoading(false);
    } else {
      navigate("/notfound");
    }
  };

  useEffect(() => {
    initInformation();
    const intervalId = setInterval(() => {
      initInformation();
    }, 5000); // 5 seconds in milliseconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [driverLocation]);

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
                {t("return")}
              </Button>
            </div>
            <div className="col row bg-white rounded-3 p-3 fs-14 me-3">
              <div className="col-5 firstColumn">
                <div className="d-flex justify-content-between">
                  <div>
                    {bookingForm?.service === "1" ? "Standard" : "Plus"} Service
                  </div>
                  {/* <div>{bookingForm?.distance}</div> */}
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
                      {getShortLocationName(
                        bookingForm?.pickupLocation?.locationName
                      )}
                      <div className="text-black-50 fs-11">
                        {bookingForm?.BookingStatusId?.id === 6 ||
                        bookingForm?.BookingStatusId?.id === 5 ||
                        bookingForm?.BookingStatusId?.id === 7
                          ? formatDateBooking(bookingForm?.Trip_Start_Time)
                          : bookingForm?.BookingStatusId?.id === 8
                          ? "None"
                          : "On Progress"}
                      </div>
                    </div>
                    {spaces}
                    <div>
                      {getShortLocationName(
                        bookingForm?.destination?.locationName
                      )}
                      <div className="text-black-50 fs-11">
                        {bookingForm?.BookingStatusId?.id === 7
                          ? formatDateBooking(bookingForm?.Trip_End_Time)
                          : bookingForm?.BookingStatusId?.id === 5
                          ? "Ongoing"
                          : bookingForm?.BookingStatusId?.id === 8
                          ? "None"
                          : "On Progress"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col secondColumn">
                <div className="d-flex justify-content-between">
                  <div>{t("guest")}</div>
                  <div className="fw-bolder">
                    {bookingForm?.Customer?.fullname}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>{t("phone")}</div>
                  <div className="fw-bolder">
                    {bookingForm?.Customer?.phoneNo}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>{t("admin")}</div>
                  <div className="fw-bolder">
                    {formatPeopleId(bookingForm?.adminId, "AD")}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>{t("driver")}</div>
                  <div className="fw-bolder">
                    {bookingForm?.driverId === null &&
                    bookingForm?.BookingStatusId?.id === 10
                      ? t("noDrivers")
                      : bookingForm?.driverId === null &&
                        bookingForm?.BookingStatusId?.id === 2
                      ? t("finding")
                      : bookingForm?.driverId === null &&
                        bookingForm?.BookingStatusId?.id === 8
                      ? t("none")
                      : formatPeopleId(bookingForm?.driverId, "DR")} 
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>{t("carType")}</div>
                  <div className="fw-bolder">
                    {bookingForm?.carType === "1" ? t("motorcycle") : t("car")}
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <div>{t("total")} (Vnd)</div>
                  <div>
                    <div className="fw-bolder textOrange1">
                      {changeFareFormat(bookingForm?.Bill?.sum)}
                    </div>
                    <div className="text-black-50">
                      {bookingForm?.BookingStatusId?.id === 7
                        ? t("paid")
                        : bookingForm?.BookingStatusId?.id === 8
                        ? t("canceled")
                        : t("unpaid")}
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
              carType={bookingForm?.carType}
            />
          </div>
        </>
      )}
    </div>
  );
}
