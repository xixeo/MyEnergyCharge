import React, { useEffect, useRef, useState } from 'react';
import sigData from '../data/sig.json'; // JSON 파일 경로
import sidoData from '../data/sido.json'; // JSON 파일 경로
import dongData from '../data/dong.json'; // JSON 파일 경로

const KakaoMap = ({ onMapReady, area, subArea }) => {
  const { kakao } = window;
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [detailMode, setDetailMode] = useState(false);
  const [polygons, setPolygons] = useState([]);
  const [currentAreaCode, setCurrentAreaCode] = useState(null); // 클릭된 행정구역 코드
  const customOverlay = new kakao.maps.CustomOverlay({});

  useEffect(() => {
    if (kakao && kakao.maps) {
      kakao.maps.load(() => {
        const container = mapContainerRef.current;
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 12,
        };
        const map = new kakao.maps.Map(container, options);
        setMapInstance(map);

        if (onMapReady) {
          onMapReady(map);
        }

        // 초기 시작
        init(map, sidoData);

        // 지도 줌 레벨 변경 이벤트 리스너
        kakao.maps.event.addListener(map, 'zoom_changed', () => {
          const currentLevel = map.getLevel();
          if (!detailMode && currentLevel <= 3) {
            setDetailMode(true);
            removePolygon();
            init(map, dongData);
          } else if (detailMode && currentLevel > 3) {
            setDetailMode(true);
            removePolygon();
            init(map, sigData);
          } else if (detailMode && currentLevel > 10) {
            setDetailMode(false);
            removePolygon();
            init(map, sidoData);
          }
        });
      });
    }
  }, [kakao, onMapReady, detailMode]);

  useEffect(() => {
    if (mapInstance && area && subArea) {
      // 특정 지역에 대한 폴리곤을 찾기 위해 데이터 검색
      const selectedArea = sidoData.features.find(
        (feature) => feature.properties.SIDO_NM === area
      );
      const selectedSubArea = sigData.features.find(
        (feature) => feature.properties.SIG_KOR_NM === subArea
      );

      if (selectedSubArea) {
        const coords = selectedSubArea.geometry.coordinates[0].map(
          (coord) => new kakao.maps.LatLng(coord[1], coord[0])
        );

        // 중점 좌표 설정 및 확대 레벨 설정
        const bounds = new kakao.maps.LatLngBounds();
        coords.forEach((coord) => bounds.extend(coord));
        mapInstance.setBounds(bounds);
      } else if (selectedArea) {
        const coords = selectedArea.geometry.coordinates[0].map(
          (coord) => new kakao.maps.LatLng(coord[1], coord[0])
        );

        // 중점 좌표 설정 및 확대 레벨 설정
        const bounds = new kakao.maps.LatLngBounds();
        coords.forEach((coord) => bounds.extend(coord));
        mapInstance.setBounds(bounds);
      }
    }
  }, [area, subArea, mapInstance]);

  const removePolygon = () => {
    polygons.forEach(polygon => polygon.setMap(null));
    setPolygons([]);
  };

  const init = (mapInstance, data) => {
    const units = data.features;
    const areas = units.map((unit) => {
      const coordinates = unit.geometry.coordinates;
      const name = unit.properties.SIG_KOR_NM;
      const cd_location = unit.properties.SIG_CD;
      const path = coordinates[0].map(coordinate => new kakao.maps.LatLng(coordinate[1], coordinate[0]));
      return { name, path, location: cd_location };
    });

    areas.forEach(area => displayArea(mapInstance, area));
  };

  const displayArea = (mapInstance, area) => {
    const polygon = new kakao.maps.Polygon({
      map: mapInstance,
      path: area.path,
      strokeWeight: 2,
      strokeColor: '#004c80',
      strokeOpacity: 0.8,
      fillColor: '#fff',
      fillOpacity: 0.7,
    });

    setPolygons(prevPolygons => [...prevPolygons, polygon]);

    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
      polygon.setOptions({ fillColor: '#09f' });
      customOverlay.setContent(`<div class="area">${area.name}</div>`);
      customOverlay.setPosition(mouseEvent.latLng);
      customOverlay.setMap(mapInstance);
    });

    kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
      customOverlay.setPosition(mouseEvent.latLng);
    });

    kakao.maps.event.addListener(polygon, 'mouseout', function () {
      polygon.setOptions({ fillColor: '#fff' });
      customOverlay.setMap(null);
    });

    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
      if (!detailMode) {
        setCurrentAreaCode(area.location); // 클릭된 지역 코드 저장
        mapInstance.setLevel(3); // level에 따라 이벤트 변경
        const latlng = mouseEvent.latLng;
        mapInstance.panTo(latlng);
        removePolygon(); // 기존 폴리곤 제거
      }
    });
  };

  return <div ref={mapContainerRef} style={{ width: '100%', height: '750px' }} />;
};

export default KakaoMap;
