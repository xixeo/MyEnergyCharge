import React, { useState, useCallback, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';

const KakaoMap = ({ onSearchResults, onMapReady }) => {
  const { kakao } = window;
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
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

  // 사용자 위치를 가져오고 지도 중심을 설정합니다.
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPosition = new kakao.maps.LatLng(latitude, longitude);
          if (map) {
            map.setCenter(userPosition);
            map.setLevel(3);
          }
        },
        () => {
          alert("사용자의 현재 위치를 가져올 수 없습니다.");
        }
      );
    } else {
      alert("Geolocation을 지원하지 않는 브라우저입니다.");
    }
  }, [map, kakao]);

  useEffect(() => {
    if (map) {
      getUserLocation();
    }
  }, [map, getUserLocation]);

  // 마커 클릭 시 InfoWindow를 표시합니다.
  const handleMarkerClick = useCallback((place, position, marker) => {
    if (infowindowRef.current) {
      infowindowRef.current.setContent(`<span>${place.place_name}</span>`);
      infowindowRef.current.open(map, marker);

      const currentLevel = map.getLevel();
      const newLevel = currentLevel > 3 ? 3 : currentLevel;
      map.setLevel(newLevel, { anchor: position });
      map.panTo(position);
    }
  }, [map]);

  // 검색 결과를 처리합니다.
  const handleSearch = useCallback((keyword) => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        onSearchResults(data, pagination);

        infowindowRef.current.close();
        const bounds = new kakao.maps.LatLngBounds();
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);

        data.forEach((place) => {
          const position = new kakao.maps.LatLng(place.y, place.x);
          const marker = new kakao.maps.Marker({ map, position });
          
          kakao.maps.event.addListener(marker, 'click', () => handleMarkerClick(place, position, marker));
          
          setMarkers(prevMarkers => [...prevMarkers, marker]);
          bounds.extend(position);
        });
        map.setBounds(bounds);
      } else {
        alert("검색 결과 중 오류가 발생했습니다.");
      }
    });
  }, [map, markers, handleMarkerClick, kakao, onSearchResults]);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default KakaoMap;

