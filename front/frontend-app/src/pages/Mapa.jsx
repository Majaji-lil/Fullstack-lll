import { MapContainer, TileLayer } from "react-leaflet";
import { Geocoder } from "./Geocoder"; // El componente que creamos arriba

// IMPORTANTE: No olvides los estilos base de Leaflet en tu archivo principal
import "leaflet/dist/leaflet.css";

export default function MapApp() {
  const position = [-34.6037, -58.3816]; // Ejemplo: Buenos Aires

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
      
      {/* Invocamos el buscador aquí dentro */}
      <Geocoder />
      
    </MapContainer>
  );
}

export default Mapa