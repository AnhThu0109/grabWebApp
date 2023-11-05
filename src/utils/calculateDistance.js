// const calculateDistance = async(pickupLocationLatitude, pickupLocationLongitude, destinationLatitude, destinationLongitude) => {
//     debugger;
//     let distance = 0;
//     // Initialize the Directions Service
//     const directionsService = new window.google.maps.DirectionsService();

//     // Specify the origin and destination locations
//     const origin = new window.google.maps.LatLng(pickupLocationLatitude, pickupLocationLongitude);
//     const destination = new window.google.maps.LatLng(destinationLatitude, destinationLongitude);

//     // Define the travel mode (DRIVING in this case)
//     const travelMode = window.google.maps.TravelMode.DRIVING;

//     // Create a request object for the Directions Service
//     const request = {
//     origin: origin,
//     destination: destination,
//     travelMode: travelMode
//     };

//     // Call the Directions Service to get route information
//     directionsService.route(request, (response, status) => {
//         console.log("response", response);
//         console.log("status", status);
//     if (status === 'OK') {
//         // Extract the driving distance in meters from the response
//         const drivingDistanceInMeters = response.routes[0].legs[0].distance.value;

//         // Convert meters to kilometers
//         distance = drivingDistanceInMeters / 1000;

//         // Display the driving distance in kilometers
//         console.log(`Driving distance between the two locations: ${distance} km`);
//     } else {       
//         console.log('Error fetching directions:', status);
//         return 0;
//     }
//     });
//     return distance;
// }

const calculateDistance = async (pickupLocationLatitude, pickupLocationLongitude, destinationLatitude, destinationLongitude) => {
    return new Promise((resolve, reject) => {
        const directionsService = new window.google.maps.DirectionsService();
        const origin = new window.google.maps.LatLng(pickupLocationLatitude, pickupLocationLongitude);
        const destination = new window.google.maps.LatLng(destinationLatitude, destinationLongitude);
        const travelMode = window.google.maps.TravelMode.DRIVING;

        const request = {
            origin: origin,
            destination: destination,
            travelMode: travelMode
        };

        directionsService.route(request, (response, status) => {
            if (status === 'OK') {
                const drivingDistanceInMeters = response.routes[0].legs[0].distance.value;
                const distance = drivingDistanceInMeters / 1000; // Convert meters to kilometers
                console.log(`Driving distance between the two locations: ${distance} km`);
                resolve(distance); // Resolve the promise with the calculated distance
            } else {
                console.log('Error fetching directions:', status);
                reject(status); // Reject the promise with the error status
            }
        });
    });
};

export default calculateDistance;