import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({
  data,
  latitudeExtractor = (item) => item[0],
  longitudeExtractor = (item) => item[1],
  intensityExtractor = (item) => parseFloat(item[2]),
  radius = 30,
  blur = 15,
  max = 1.0,
  gradient = {
    0.0: '#0000ff',
    0.25: '#00ff00',
    0.5: '#ffff00',
    0.75: '#ff7f00',
    1.0: '#ff0000',
  },
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !data || data.length === 0) return;

    const points = data.map((item) => [
      latitudeExtractor(item),
      longitudeExtractor(item),
      intensityExtractor(item),
    ]);

    const heatLayer = L.heatLayer(points, {
      radius,
      blur,
      max,
      gradient,
    }).addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, data, latitudeExtractor, longitudeExtractor, intensityExtractor, radius, blur, max, gradient]);

  return null;
};

export default HeatmapLayer;
