import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsRenderer, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '305px',
};

const directionsService = new window.google.maps.DirectionsService();

const MapComponent = ({ driverLocation, pickup, destination, carType }) => {
  const [directions, setDirections] = useState(null);

  let center = {
    lat: pickup.lat, // Default latitude for the map center
    lng: pickup.lng, // Default longitude for the map center
  };

  const motocycleMarkerIcon = {
    url: '/images/driver.png', // Replace this with the URL of your custom marker icon
    scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the custom marker icon
  };

  const taxiMarkerIcon = {
    url: '/images/taxi.png', // Replace this with the URL of your custom marker icon
    scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the custom marker icon
  };

  useEffect(() => {
    const origin = new window.google.maps.LatLng(pickup.lat, pickup.lng);
    const destinationLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);

    directionsService.route(
      {
        origin: origin,
        destination: destinationLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(response);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
    console.log(driverLocation);
  }, [pickup, destination, driverLocation]);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {directions && <DirectionsRenderer directions={directions} />}
      {/* <Marker position={pickup} label="PickUpLocation" />
      <Marker position={destination} label="Destination" /> */}
      {
        driverLocation !== null && <MarkerF position={driverLocation} icon={carType === "1"? motocycleMarkerIcon : taxiMarkerIcon}/>
      }     
      {/* {locations.map((location, index) => (
        <Marker key={index} position={location} />
      ))} */}
    </GoogleMap>
  );
};

export default MapComponent;
