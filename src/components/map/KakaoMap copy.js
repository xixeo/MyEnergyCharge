import React, { useEffect, useRef, useState } from 'react';

const KakaoMap = ({ onSearchResults, onMapReady }) => {
  const { kakao } = window;
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const infowindowRef = useRef(null);

  // 지도를 초기화하고 InfoWindow를 설정합니다.
  useEffect(() => {
    if (kakao && kakao.maps) {
      kakao.maps.load(() => {
        const container = mapContainerRef.current;
        const options = {
          center: new kakao.maps.LatLng(38.2313466, 128.2139293),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);
        infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
        setMapInstance(map);

        if (onMapReady) {
          onMapReady(map);
        }
      });
    }
  }, [kakao, onMapReady]);

  // 사용자의 현재 위치를 지도에 표시합니다.
  useEffect(() => {
    if (mapInstance && kakao) {
      const successCallback = (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentPosition = new kakao.maps.LatLng(lat, lng);

        // 현재 위치를 지도의 중심으로 설정합니다.
        mapInstance.setCenter(currentPosition);

        // 현재 위치에 마커를 추가합니다.
        const marker = new kakao.maps.Marker({
          position: currentPosition,
        });
        marker.setMap(mapInstance);
      };

      const errorCallback = () => {
        alert('위치 정보를 가져오는 데 실패했습니다.');
      };

      // 위치 정보를 가져옵니다.
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  }, [mapInstance, kakao]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default KakaoMap;
