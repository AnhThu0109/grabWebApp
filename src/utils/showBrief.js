const showBrief = (str, len) => {
    if(str?.length > len){
      const numLetters = len;
      const shortenedStr = str.slice(0, numLetters) + "..."; 
      return shortenedStr;
    } else return str; 
  }

  export default showBrief;