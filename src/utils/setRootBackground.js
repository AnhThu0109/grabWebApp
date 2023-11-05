const setRootBackground = (oldbg, newbg) => {
    document.documentElement.style.setProperty(
        oldbg,
        newbg
    );
  };

export default setRootBackground;