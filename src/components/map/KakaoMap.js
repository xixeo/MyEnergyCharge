import React, { useState, useCallback, useRef, useEffect } from 'react';
import MapContainer from './MapContainer';
import SearchBar from './SearchBar';
import PlaceList from './PlaceList';
import Pagination from './Pagination';

const KakaoMap = () => {
  const { kakao } = window; // 전역 kakao 객체 접근
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [markers, setMarkers] = useState([]);
  const infowindow = useRef(new kakao.maps.InfoWindow({ zIndex: 1 }));

  // 사용자 위치를 가져오기
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPosition = new kakao.maps.LatLng(latitude, longitude);
          if (map) {
            map.setCenter(userPosition);
            map.setLevel(3); // default zoomLevel 설정.
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

	// Maker 클릭 이벤트
  const handleMarkerClick = useCallback((place, position, marker) => {
  
	  //마커 위에 장소 이름 띄우기
    infowindow.current.setContent(`<span>${place.place_name}</span>`);
    infowindow.current.open(map, marker);

    const currentLevel = map.getLevel();
    
    //마커에 맞춰 지도 레벨 확대
    const newLevel = currentLevel > 3 ? 3 : currentLevel;
    map.setLevel(newLevel, { anchor: position });
    map.panTo(position);
  }, [map, infowindow]);

  const handleSearch = useCallback((keyword) => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
	      
	      // 장소 리스트 만들기
        setPlaces(data);
        
        //장소 리스트에 맞춰 page화
        setPagination(pagination);
        
        // 새로운 장소 검색 시 infowindow 닫기
        infowindow.current.close();

        const bounds = new kakao.maps.LatLngBounds();
        markers.forEach(marker => marker.setMap(null)); // 기존 마커 제거
        setMarkers([]);

        data.forEach((place) => {
          const position = new kakao.maps.LatLng(place.y, place.x);
          // 리스트에 있는 장소들 마커 생성
          const marker = new kakao.maps.Marker({ map, position });
          
          // 마커 클릭 시 공통 로직 처리
          kakao.maps.event.addListener(marker, 'click', () => handleMarkerClick(place, position, marker));
          
          setMarkers(prevMarkers => [...prevMarkers, marker]);
          bounds.extend(position);
        });
        map.setBounds(bounds);
      } else {
        alert("검색 결과 중 오류가 발생했습니다.");
      }
    });
  }, [map, markers, handleMarkerClick, kakao]);

  const handlePlaceSelect = (place, marker) => {
    const position = new kakao.maps.LatLng(place.y, place.x);
    handleMarkerClick(place, position, marker);
  };

  return (
    <div className="map_wrap">
      <MapContainer setMap={setMap} />
      <div id="menuDiv">
        <div id="menu_wrap" className="bg-white">
          <div className="option">
            <div>
              <div id="map_title">
                <div>List</div>
              </div>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <PlaceList places={places} onPlaceSelect={handlePlaceSelect} />
          <Pagination pagination={pagination} />
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
