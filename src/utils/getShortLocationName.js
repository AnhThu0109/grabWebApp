const getShortLocationName = (locationName) => {
    const a = locationName.split(",");
    return a[0]+ "," + a[a.length-3] + "," + a[a.length-2];
}

export default getShortLocationName;