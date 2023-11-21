const changeFareFormat = (number) => {
  const numStr = String(number);
  const numArray = numStr.split("");

  let result = "";
  for (let i = numArray.length - 1, count = 0; i >= 0; i--) {
    result = numArray[i] + result;
    count++;

    if (count === 3 && i !== 0) {
      result = "." + result;
      count = 0;
    }
  }

  return result;
};
export default changeFareFormat;
