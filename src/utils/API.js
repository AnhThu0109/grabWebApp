// const API = "http://localhost:5000/v1";
const API = "http://35.220.201.164/v1";
const REGISTER = `${API}/admin/register`;
const LOGIN = `${API}/admin/login`;
const CREATE_LOCATION = `${API}/location/create`;
const SEARCH_LOCATION = `${API}/location/search`;
const SEARCH_LOCATION_NAME = `${API}/location/findByName`;
const ADMIN = `${API}/admin`;
const GET_CARTYPE = `${API}/cartypes`;
const GET_DISTANCE = `${API}/distance`;
const SEARCH_CUSTOMER_PHONE = `${API}/customers/search`;
const GET_CUSTOMER = `${API}/customers`;
const GET_DRIVER = `${API}/driver`;
const GET_SERVICE = `${API}/services`;
const BOOKING_FORM = `http://localhost:5000/v1/booking`;
const NOTIFICATION = `${API}/notifications`;

export {REGISTER, LOGIN, CREATE_LOCATION, SEARCH_LOCATION, SEARCH_LOCATION_NAME, ADMIN, GET_CARTYPE, GET_DISTANCE, SEARCH_CUSTOMER_PHONE, GET_CUSTOMER, GET_DRIVER, GET_SERVICE, BOOKING_FORM, NOTIFICATION};
