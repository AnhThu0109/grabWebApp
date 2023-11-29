import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { Icon } from "leaflet";

const createRoutineMachineLayer = ({ pickup, destination}) => {
    const pickupIcon = new Icon({
        iconUrl: '/images/pin.png', // Replace this with the URL of your custom marker icon
        iconSize: [30, 30] // Adjust the size of the custom marker icon
      });
    
      const destinationIcon = new Icon({
        iconUrl: '/images/location.png', // Replace this with the URL of your custom marker icon
        iconSize: [30, 30] // Adjust the size of the custom marker icon
      });
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(pickup.lat, pickup.lng),
      L.latLng(destination.lat, destination.lng)
    ],
    routeWhileDragging: false,
    createMarker: function (i, waypoint, n) {
      let icon;

      // Use different icons for pickup and destination
      if (i === 0) {
        icon = pickupIcon; // Use the motorcycle icon for pickup
      } else if (i === n - 1) {
        icon = destinationIcon; // Use the taxi icon for destination
      }

      return L.marker(waypoint.latLng, {
        draggable: false,
        icon: icon
      });
    }
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;