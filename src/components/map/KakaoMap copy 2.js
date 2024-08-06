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
  const customOverlay = new kakao.maps.CustomOverlay({});
  const [currentData, setCurrentData] = useState(null); // 현재 표시 중인 데이터

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const center = new kakao.maps.LatLng(latitude, longitude);
        const container = mapContainerRef.current;
        const options = {
          center,
          level: 8, // 기본 줌 레벨 설정
          disablePan: true, // 드래그 비활성화
        };
        const map = new kakao.maps.Map(container, options);
        setMapInstance(map);

        if (onMapReady) {
          onMapReady(map);
        }

        init(map, sigData, 8); // 초기 시작 시 sigData로 설정

        kakao.maps.event.addListener(map, 'zoom_changed', () => {
          const currentLevel = map.getLevel();
          if (currentLevel <= 3 && currentData !== dongData) {
            removePolygon();
            init(map, dongData, 3);
          } else if (currentLevel > 3 && currentLevel <= 7 && currentData !== sigData) {
            removePolygon();
            init(map, sigData, 5);
          } else if (currentLevel > 7 && currentData !== sidoData) {
            removePolygon();
            init(map, sidoData, 8);
          }
        });
      });
    }
  }, [kakao, onMapReady, detailMode]);

  useEffect(() => {
    if (mapInstance && area && subArea) {
      const selectedArea = sidoData.features.find(
        (feature) => feature.properties.SIDO_NM === area
      );
      const selectedSubArea = sigData.features.find(
        (feature) =>
          feature.properties.SIDO_NM === selectedArea?.properties.SIG_KOR_NM &&
          feature.properties.SIG_KOR_NM === subArea
      );

      if (selectedSubArea) {
        const coords = (selectedSubArea || selectedArea).geometry.coordinates[0].map(
          (coord) => new kakao.maps.LatLng(coord[1], coord[0])
        );

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

  const getTempName = (temp) => {
    if (typeof temp === 'string' && temp.length > 0) {
      const lastIndex = temp.lastIndexOf(' ');
      return lastIndex !== -1 ? temp.substring(lastIndex + 1) : temp;
    }
    return '';
  };

  const init = (mapInstance, data, zoomLevel) => {
    setCurrentData(data);
    mapInstance.setLevel(zoomLevel);

    data.features.forEach((unit) => {
      const path = unit.geometry.coordinates[0].map(
        (coordinate) => new kakao.maps.LatLng(coordinate[1], coordinate[0])
      );

      let name;
      if (data === dongData) {
        name = getTempName(unit.properties.temp);
      } else if (data === sigData) {
        name = unit.properties.SIG_KOR_NM;
      } else if (data === sidoData) {
        name = unit.properties.SIDO_NM;
      }

      const polygon = new kakao.maps.Polygon({
        map: mapInstance,
        path,
        strokeWeight: 2,
        strokeColor: "#004c80",
        strokeOpacity: 0.8,
        fillColor: "#fff",
        fillOpacity: 0.7,
      });

      setPolygons((prevPolygons) => [...prevPolygons, polygon]);

      const handleMouseOver = (mouseEvent) => {
        if (mapInstance.getLevel() <= 3) {
          polygon.setOptions({ fillColor: "#09f" });
          customOverlay.setContent(`<div class="area">${name}</div>`);
          customOverlay.setPosition(mouseEvent.latLng);
          customOverlay.setMap(mapInstance);
        }
      };

      const handleMouseOut = () => {
        if (mapInstance.getLevel() <= 3) {
          polygon.setOptions({ fillOpacity: 0 });
          customOverlay.setMap(null);
        }
      };

      const handleClick = () => {
        if (data === sidoData) {
          removePolygon();
          init(mapInstance, sigData, 5);
        } else if (data === sigData) {
          removePolygon();
          setDetailMode(true);
          init(mapInstance, dongData, 3);
        }
      };

      kakao.maps.event.addListener(polygon, 'mouseover', handleMouseOver);
      kakao.maps.event.addListener(polygon, 'mouseout', handleMouseOut);
      kakao.maps.event.addListener(polygon, 'click', handleClick);
    });
  };

  return <div ref={mapContainerRef} style={{ width: '100%', height: '750px' }} />;
};

export default KakaoMap;
