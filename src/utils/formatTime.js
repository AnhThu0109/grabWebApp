const formatTime = (timeString) => {
  const formattedTime = new Date(
    `1970-01-01T${timeString}Z`
  ).toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });

  return formattedTime;
};

export default formatTime;
