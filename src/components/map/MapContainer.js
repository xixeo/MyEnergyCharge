// MapContainer.jsx
import { useEffect, useRef } from "react";

const MapContainer = ({ setMap }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const { kakao } = window;

    kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(38.2313466, 128.2139293),
        level: 3,
      };
      const mapInstance = new kakao.maps.Map(container, options);
      mapRef.current = mapInstance;
      setMap(mapInstance);
    });
  }, [setMap]);

  return <div id="map" style={{ width: '100%', height: '800px' }}></div>;
};

export default MapContainer;
