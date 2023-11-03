const calculateDistance = async(pickupLocationLatitude, pickupLocationLongitude, destinationLatitude, destinationLongitude) => {
    debugger;
    let distance = 0;
    // Initialize the Directions Service
    const directionsService = new window.google.maps.DirectionsService();

    // Specify the origin and destination locations
    const origin = new window.google.maps.LatLng(pickupLocationLatitude, pickupLocationLongitude);
    const destination = new window.google.maps.LatLng(destinationLatitude, destinationLongitude);

    // Define the travel mode (DRIVING in this case)
    const travelMode = window.google.maps.TravelMode.DRIVING;

    // Create a request object for the Directions Service
    const request = {
    origin: origin,
    destination: destination,
    travelMode: travelMode
    };

    // Call the Directions Service to get route information
    directionsService.route(request, (response, status) => {
    if (status === 'OK') {
        // Extract the driving distance in meters from the response
        const drivingDistanceInMeters = response.routes[0].legs[0].distance.value;

        // Convert meters to kilometers
        distance = drivingDistanceInMeters / 1000;

        // Display the driving distance in kilometers
        console.log(`Driving distance between the two locations: ${distance} km`);
    } else {       
        console.log('Error fetching directions:', status);
        return 0;
    }
    });
    return distance;
}

export default calculateDistance;