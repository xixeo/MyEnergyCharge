// KakaoMap.js
import React, { useState, useRef, useEffect } from 'react';

const KakaoMap = ({ onMapReady }) => {
  const { kakao } = window;
  const [map, setMap] = useState(null);
  const infowindowRef = useRef(null);

  // 지도를 초기화하고 InfoWindow를 설정합니다.
  useEffect(() => {
    if (kakao && kakao.maps) {
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(38.2313466, 128.2139293),
          level: 3,
        };
        const mapInstance = new kakao.maps.Map(container, options);
        setMap(mapInstance);
        infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
        if (onMapReady) {
          onMapReady(mapInstance);
        }
      });
    }
  }, [kakao, onMapReady]);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default KakaoMap;
