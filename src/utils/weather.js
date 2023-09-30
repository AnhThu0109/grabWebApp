//Show icon weather 
const showIcon = (text) => {
  let iconSrc = "";
  if (text.includes("sunny") || text === "Sunny") {
    iconSrc = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  } else if (text.includes("rain")) {
    iconSrc = "https://cdn-icons-png.flaticon.com/128/4246/4246656.png";
  } else if (text.includes("snow")) {
    iconSrc = "https://cdn-icons-png.flaticon.com/128/2942/2942909.png";
  } else if (text.includes("drizzle")) {
    iconSrc = "https://cdn-icons-png.flaticon.com/128/3075/3075858.png";
  } else if (text.includes("overcast") || text === "Overcast") {
    iconSrc = "https://cdn-icons-png.flaticon.com/128/1146/1146869.png";
  } else if (text.includes("fog") || text === "Fog") {
    iconSrc = "https://cdn-icons-png.flaticon.com/512/2076/2076792.png";
  } else {
    iconSrc = "https://cdn-icons-png.flaticon.com/128/414/414927.png";
  }
  return iconSrc;
};

//Fetch data weather
const fetchDataWeather = async (q) => {
    const data = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=3f66991e4c8c4f16b9731107230802&q=${q}&days=3&aqi=yes&alerts=no`
    );
    return data.json();
  };

export {fetchDataWeather, showIcon};