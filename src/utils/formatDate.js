const changeFormatDate = (date) => {
    let newDate = new Date(date);
    let options = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour12 : false,
      hour:  "2-digit",
      minute:  "2-digit",
    };
    return newDate.toLocaleDateString("en-us", options);
  };

  const changeFormatDate1 = (date) => {
    let newDate = new Date(date);
    let options = { weekday: 'short', day: 'numeric' };
    return newDate.toLocaleDateString("en-us", options);
  };

export {changeFormatDate, changeFormatDate1};