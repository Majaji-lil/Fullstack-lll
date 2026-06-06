import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "../components/HeatmapLayer";
import "leaflet/dist/leaflet.css";

export default function Mapa() {
  const position = [-33.43778, -70.65028];

  // Datos de ejemplo para el mapa de calor
  // Formato: [lat, lng, intensidad (0-1)]
  const addressPoints = [
    // Centro de Santiago
    [-33.43778, -70.65028, 0.9],
    [-33.43650, -70.65100, 0.8],
    [-33.43900, -70.65000, 0.7],
    [-33.43500, -70.65200, 0.85],
    [-33.44000, -70.64900, 0.75],
    
    // Puntos adicionales alrededor
    [-33.42778, -70.66028, 0.6],
    [-33.44778, -70.64028, 0.65],
    [-33.43778, -70.63028, 0.55],
    [-33.43778, -70.66528, 0.7],
    [-33.42278, -70.65028, 0.5],
  ];

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
      <HeatmapLayer
        data={addressPoints}
        latitudeExtractor={(m) => m[0]}
        longitudeExtractor={(m) => m[1]}
        intensityExtractor={(m) => parseFloat(m[2])}
        radius={30}
        blur={15}
        max={1.0}
        gradient={{
          0.0: "#0000ff",
          0.25: "#00ff00",
          0.5: "#ffff00",
          0.75: "#ff7f00",
          1.0: "#ff0000",
        }}
      />
    </MapContainer>
  );
}