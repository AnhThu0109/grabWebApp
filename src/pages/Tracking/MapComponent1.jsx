import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import io from 'socket.io-client';
import GOOGLE_KEY from '../../utils/googleKey';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

// const socket = io('http://localhost:4000');

const MapComponent = () => {
  const [driverPositions, setDriverPositions] = useState({});

//   useEffect(() => {
//     // Listen for driver position updates
//     socket.on('driverPositions', positions => {
//       setDriverPositions(positions);
//     });

//     // Clean up socket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* Display driver markers */}
        {Object.keys(driverPositions).map(driverId => (
          <Marker key={driverId} position={driverPositions[driverId]} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
