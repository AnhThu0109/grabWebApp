const changeFormatDate1 = (date) => {
  let newDate = new Date(date);
  let options = {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  return newDate.toLocaleDateString("en-us", options);
};

const changeFormatDate = (inputDate) => {
  if (inputDate) {
    // Replace hyphens with slashes for proper parsing
    const parsedDate = new Date(inputDate.replace(/-/g, "/"));

    // Check if the parsed date is valid
    if (!isNaN(parsedDate.getTime())) {
      // Date is valid, proceed with formatting
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedDate = `${daysOfWeek[parsedDate.getDay()]}, ${
        months[parsedDate.getMonth()]
      } ${String(parsedDate.getDate()).padStart(
        2,
        "0"
      )}, ${parsedDate.getFullYear()}, ${String(parsedDate.getHours()).padStart(
        2,
        "0"
      )}:${String(parsedDate.getMinutes()).padStart(2, "0")}`;

      return formattedDate;
    } else {
      // Invalid date, handle the error (e.g., set a default date)
      return -1;
    }
  } else {
    // Date variable is undefined, handle the error (e.g., set a default date)
    return -1;
  }
};

const formatCurrentDate = () => {
  const yourDateObject = new Date(); // Replace this with your actual Date object

  const optionsDate = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = yourDateObject.toLocaleString("en-GB", optionsDate);
  const formattedTime = yourDateObject.toLocaleString("en-GB", optionsTime);

  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  return formattedDateTime;
};

const formatDateBooking = (inputDateString) => {
  const inputDate = new Date(inputDateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    inputDate
  );

  return formattedDate; //Nov 20, 2023, 11:08 AM
};

const formatDateOnly = (inputDateString) => {
  const inputDate = new Date(inputDateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    inputDate
  );

  return formattedDate; //Nov 20, 2023
};

export {
  changeFormatDate,
  changeFormatDate1,
  formatCurrentDate,
  formatDateBooking,
  formatDateOnly
};
