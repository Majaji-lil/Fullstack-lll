import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function Mapa() {
  const position = [-33.43778, -70.65028];

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}