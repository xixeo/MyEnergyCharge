import React, { useState, useCallback, useRef } from 'react';
import KakaoMap from '../components/map/KakaoMap';
import PlaceList from '../components/map/PlaceList';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [map, setMap] = useState(null);
  const infowindowRef = useRef(null);

  // KakaoMap에서 검색 결과를 받아오는 핸들러
  const handleSearchResults = useCallback((places, pagination) => {
    setPlaces(places);
    setPagination(pagination);
  }, []);


  // KakaoMap에서 map 객체가 준비되었을 때 호출되는 핸들러
  const handleMapReady = useCallback((mapInstance) => {
    setMap(mapInstance);
    // InfoWindow 인스턴스를 저장
    infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
  }, []);

  // PlaceList에서 장소를 선택했을 때의 처리
  const handlePlaceSelect = useCallback((place, marker) => {
    if (map && infowindowRef.current) {
      // InfoWindow가 열려 있을 경우 닫기
      infowindowRef.current.close();

      const position = new window.kakao.maps.LatLng(place.y, place.x);
      infowindowRef.current.setContent(`<span>${place.place_name}</span>`);
      infowindowRef.current.open(map, marker);

      const currentLevel = map.getLevel();
      const newLevel = currentLevel > 3 ? 3 : currentLevel;
      map.setLevel(newLevel, { anchor: position });
      map.panTo(position);
    }
  }, [map]);

  // PlaceList에서 페이지가 변경됐을 때의 처리
  const handlePageChange = useCallback((page) => {
    console.log('Page changed to:', page);
    if (pagination) {
      pagination.gotoPage(page);
    }
  }, [pagination]);

  return (
    <div>
      <KakaoMap
        onSearchResults={handleSearchResults}
        onMapReady={handleMapReady}
      />
      <PlaceList
        places={places}
        onPlaceSelect={handlePlaceSelect}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;
