const getShortLocationName = (locationName) => {
    const a = locationName.split(",");
    return a[0].trim();
}

export default getShortLocationName;