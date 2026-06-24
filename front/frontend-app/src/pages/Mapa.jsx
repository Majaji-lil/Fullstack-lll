import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
//import HeatmapLayer from "react-leaflet-heatmap-layer";
import { API_REPORTES } from "../api/urls";

const Mapa = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const response = await axios.get(API_REPORTES);
      setReportes(response.data);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    }
  };

  const puntosCalor = reportes
    .filter(
      (r) =>
        r.latitud !== null &&
        r.longitud !== null
    )
    .map((r) => [
      Number(r.latitud),
      Number(r.longitud),
      1
    ]);

  return (
    <MapContainer
      center={[-33.4489, -70.6693]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={puntosCalor}
        longitudeExtractor={(m) => m[1]}
        latitudeExtractor={(m) => m[0]}
        intensityExtractor={(m) => m[2]}
      /> */}

      {reportes.map((reporte) => (
        <Marker
          key={reporte.id}
          position={[
            Number(reporte.latitud),
            Number(reporte.longitud)
          ]}
        >
          <Popup>
            <div>
              <h4>{reporte.mascotaNombre}</h4>

              <p>
                <strong>Descripción:</strong>
                <br />
                {reporte.descripcion}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                {reporte.estado}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {reporte.fecha}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa;