// 현재 위치값 지도에 표현하기
import React, { useState, useEffect, useRef } from 'react';

const KakaoMap = () => {
  const kakaoMaps = useRef(null);
  const [map, setMap] = useState(null);

  const getKakao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const mapContainer = document.getElementById("map");
        if (!map) {
          const mapOptions = {
            center: new window.kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            ),
            level: 4,
          };
          const map = new window.kakao.maps.Map(mapContainer, mapOptions);
          const myPosition = new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: myPosition,
          });
          setMap(map);
        }
      });
    } else {
      console.log("현재 위치를 사용할 수 없습니다.");
    }
  };
  useEffect(() => {
    getKakao();
  }, []);
  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "4px",
        overflow: "hidden",
    }}
      ref={kakaoMaps}
    ></div>
  );
};

export default KakaoMap;