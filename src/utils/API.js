const SERVER_URL = "http://localhost:5000";
const API1 = "http://localhost:5000/v1";
const API = "http://35.220.201.164/v1";
const REGISTER = `${API}/admin/register`;
const LOGIN = `${API1}/admin/login`;
const CREATE_LOCATION = `${API1}/location/create`;
const SEARCH_LOCATION = `${API1}/location/search`;
const SEARCH_LOCATION_NAME = `${API1}/location/findByName`;
const ADMIN = `${API1}/admin`;
const GET_CARTYPE = `${API1}/cartypes`;
const GET_DISTANCE = `${API1}/distance`;
const SEARCH_CUSTOMER_PHONE = `${API1}/customers/search`;
const GET_CUSTOMER = `${API1}/customers`;
const GET_DRIVER = `${API1}/driver`;
const GET_SERVICE = `${API1}/services`;
const BOOKING_FORM = `${API1}/booking`;
const NOTIFICATION = `${API1}/notifications`;

export {SERVER_URL, REGISTER, LOGIN, CREATE_LOCATION, SEARCH_LOCATION, SEARCH_LOCATION_NAME, ADMIN, GET_CARTYPE, GET_DISTANCE, SEARCH_CUSTOMER_PHONE, GET_CUSTOMER, GET_DRIVER, GET_SERVICE, BOOKING_FORM, NOTIFICATION};
