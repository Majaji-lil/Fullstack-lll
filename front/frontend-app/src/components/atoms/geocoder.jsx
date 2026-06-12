import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Importamos los estilos y el script del geocoder
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

export function Geocoder() {
  const map = useMap();

  useEffect(() => {
    // Inicializar el buscador
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    }).addTo(map);

    // Limpieza: remover el buscador cuando el componente se desmonte
    return () => {
      geocoder.remove();
    };
  }, [map]);

  return null;
}