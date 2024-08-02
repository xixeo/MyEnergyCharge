import React, { useState, useCallback, useRef, useEffect } from 'react';
import MapContainer from './MapContainer';
import SearchBar from './SearchBar';
import PlaceList from './PlaceList';

const KakaoMap = () => {
  const { kakao } = window;
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

  const handleMarkerClick = useCallback((place, position, marker) => {
    infowindow.current.setContent(`<span>${place.place_name}</span>`);
    infowindow.current.open(map, marker);

    const currentLevel = map.getLevel();
    const newLevel = currentLevel > 3 ? 3 : currentLevel;
    map.setLevel(newLevel, { anchor: position });
    map.panTo(position);
  }, [map, infowindow]);

  const handleSearch = useCallback((keyword) => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        setPagination(pagination);

        infowindow.current.close();
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
  }, [map, markers, handleMarkerClick, kakao]);

  const handlePlaceSelect = (place, marker) => {
    const position = new kakao.maps.LatLng(place.y, place.x);
    handleMarkerClick(place, position, marker);
  };

  const handlePageChange = (page) => {
    if (pagination) {
      pagination.gotoPage(page);
    }
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
          <PlaceList
            places={places}
            onPlaceSelect={handlePlaceSelect}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
