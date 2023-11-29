import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import RoutingMachine from "./Routing";

const MapComponent = ({ driverLocation, pickup, destination, carType }) => {
  const motocycleMarkerIcon = new Icon({
    iconUrl: '/images/driver.png', // Replace this with the URL of your custom marker icon
    iconSize: [35, 35] // Adjust the size of the custom marker icon
  });

  const taxiMarkerIcon = new Icon({
    iconUrl: '/images/taxi.png', // Replace this with the URL of your custom marker icon
    iconSize: [35, 35] // Adjust the size of the custom marker icon
  });

  return (
    <>
      <MapContainer
        center={[pickup.lat, pickup.lng]}
        zoom={15}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Routing */}
        <RoutingMachine pickup={pickup} destination={destination}/>

        {/* DriverIcon */}
        {
          driverLocation !== null && (
            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={carType === "1"? motocycleMarkerIcon : taxiMarkerIcon}/>
          )
        }        
      </MapContainer>
    </>
  );
};

export default MapComponent;
