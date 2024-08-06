import React, { useEffect, useRef, useState } from "react";
import siguData from "../data/sig.json"; // SIG 데이터 JSON 파일 경로
import sidoData from "../data/sido.json"; // 시도 데이터 JSON 파일 경로

// 지도 레벨에 따라 행정구역 다르게 표현
// 아이콘 파일을 모듈처럼 가져오기
import w01 from "../../assets/icons/w01.png";
import w02 from "../../assets/icons/w02.png";
import w03 from "../../assets/icons/w03.png";
import w04 from "../../assets/icons/w04.png";

const KakaoMap = ({ onMapReady, area, subArea }) => {
  const { kakao } = window;
  const mapContainerRef = useRef(null); // 지도를 렌더링할 DOM 요소 참조
  const [mapInstance, setMapInstance] = useState(null); // 지도 인스턴스 상태
  const [customOverlay, setCustomOverlay] = useState(null); // 사용자 정의 오버레이 상태
  const [overlayPosition, setOverlayPosition] = useState(null); // 날씨 팝업 위치
  const [subAreaName, setSubAreaName] = useState(""); // 하위 지역 이름 상태
  const [weather] = useState("맑음"); // 날씨 상태 기본값
  const polygons = useRef([]); // 폴리곤을 저장할 useRef 변수
  const [currentZoomLevel, setCurrentZoomLevel] = useState(8); // 초기 줌 레벨 상태 설정

  // 지도 초기화 및 폴리곤 추가
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const center = new kakao.maps.LatLng(latitude, longitude); // 현재 위치를 중심으로 설정
        const container = mapContainerRef.current; // 지도 컨테이너 참조
        const options = {
          center,
          level: currentZoomLevel,
          disablePan: true, // 지도 이동 비활성화
        };
        const map = new kakao.maps.Map(container, options); // 지도 인스턴스 생성
        setMapInstance(map);

        if (onMapReady) {
          onMapReady(map); // 지도 준비 완료 시 콜백 호출
        }

        // 폴리곤 오버레이 생성
        const overlay = new kakao.maps.CustomOverlay({});
        setCustomOverlay(overlay);

        // 데이터 추가 함수
        const addPolygons = () => {
          deletePolygon(); // 기존 폴리곤 삭제
          const dataToUse = currentZoomLevel < 11 ? siguData : sidoData;
          dataToUse.features.forEach((feature) => {
            getPolycode(feature, map, overlay);
          });
        };

        addPolygons(); // 초기 폴리곤 추가

        // 지도 줌 레벨 변경 이벤트 리스너 추가
        kakao.maps.event.addListener(map, 'zoom_changed', () => {
          const level = map.getLevel();
          setCurrentZoomLevel(level);
          addPolygons(); // 줌 레벨에 따라 폴리곤 업데이트
        });

        // 지도 클릭 이벤트 리스너 추가
        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const latlng = mouseEvent.latLng;
          const lat = latlng.getLat();
          const lng = latlng.getLng();
          console.log(`지도 클릭 위치: 위도 ${lat}, 경도 ${lng}`);

          deletePolygon(); // 기존 폴리곤 삭제

          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              let address = result[0].address.region_2depth_name;
              console.log(`주소 변환 결과: ${address}`);

              setOverlayPosition(latlng); // 오버레이 위치 설정
              setSubAreaName(address); // 하위 지역 이름 설정
              map.setCenter(latlng); // 클릭한 지점으로 지도 이동
              map.setLevel(7);
            } else {
              console.error("주소 변환 실패:", status);
            }
          });
        });
      });
    }
  }, [kakao, onMapReady, currentZoomLevel]);

  // 폴리곤 삭제 함수
  function deletePolygon() {
    polygons.current.forEach(polygon => {
      polygon.setMap(null);
    });
    polygons.current = []; // 폴리곤 배열 초기화
  }

  // 폴리곤 추가 함수
  const getPolycode = (feature, map, overlay) => {
    const { geometry, properties } = feature;
    let path = [];
    let coordinates = geometry.coordinates[0];
    let name = '';

    // 데이터 유형에 따라 name 값 설정
    if (siguData.features.includes(feature)) {
      name = properties.SIG_KOR_NM; // SIG 데이터에서 이름 가져오기
    } else if (sidoData.features.includes(feature)) {
      name = properties.SIDO_NM; // SIDO 데이터에서 이름 가져오기
    }

    if (geometry.type === "Polygon") {
      coordinates.forEach((coord) => {
        path.push(new kakao.maps.LatLng(coord[1], coord[0]));
      });
      setPolygon({ name, path }, map, overlay);
    } else if (geometry.type === "MultiPolygon") {
      coordinates.forEach((polygon) => {
        path = [];
        polygon[0].forEach((coord) => {
          path.push(new kakao.maps.LatLng(coord[1], coord[0]));
        });
        setPolygon({ name, path }, map, overlay);
      });
    }
  };

  // 폴리곤 설정 함수
  const setPolygon = (area, map, overlay) => {
    const polygon = new kakao.maps.Polygon({
      path: area.path,
      strokeWeight: 2,
      strokeColor: "#004c80",
      strokeOpacity: 0.8,
      fillColor: "#fff",
      fillOpacity: 0.7,
    });

    kakao.maps.event.addListener(polygon, "mouseover", () => {
      polygon.setOptions({ fillColor: "#09f" });
    });

    kakao.maps.event.addListener(polygon, "mouseout", () => {
      polygon.setOptions({ fillColor: "#fff" });
    });

    const centroidPosition = centroid(area.path); // 폴리곤의 중심 좌표 계산

    // 폴리곤을 지도에 추가
    polygon.setMap(map);
    polygons.current.push(polygon); // 폴리곤을 현재 폴리곤 배열에 추가

    // 항상 오버레이 설정
    const content = `<div class='overlaybox'>${area.name}</div>`;
    const newOverlay = new kakao.maps.CustomOverlay({
      position: centroidPosition, // 폴리곤의 중심 좌표
      content: content,
      xAnchor: 0.5,
      yAnchor: 0.5,
    });
    newOverlay.setMap(map);
  };

  // 폴리곤의 중심 좌표 계산 함수
  const centroid = (path) => {
    let x = 0,
      y = 0,
      n = path.length;
    path.forEach((point) => {
      x += point.getLng();
      y += point.getLat();
    });
    return new kakao.maps.LatLng(y / n, x / n);
  };

  // 날씨 정보가 변경될 때 사용자 정의 오버레이 업데이트
  useEffect(() => {
    if (mapInstance && (overlayPosition || subAreaName)) {
      if (customOverlay) {
        customOverlay.setMap(null);
      }

      const getWeatherIcon = (weather) => {
        switch (weather) {
          case "맑음":
            return w01;
          case "흐림":
            return w02;
          case "비":
            return w03;
          case "천둥":
            return w04;
          default:
            return w01;
        }
      };

      const content = `
                <div class="overlaybox">
                   <div class="weather">
                      <div class="areatitle">${subAreaName}</div>
                        <div class="weather-icon">
                            <img src="${getWeatherIcon(
                              weather
                            )}" alt="날씨 아이콘"/>
                        </div>
                    </div>
                    <ul>
                        <li class="unit-list">
                            <div class="unit-wrap">
                               <div class="unit">기온</div>
                               <div class="tem"> 28<span>ºC</span></div>
                            </div>

                              <div class="unit-wrap">
                               <div class="unit">습도</div>
                               <div class="hum"> 5<span>%</span></div>
                            </div> 

                              <div class="unit-wrap">
                               <div class="unit">체감온도</div>
                               <div class="tem2">29 <span>ºC</span></div>
                            </div>

                              <div class="unit-wrap">
                               <div class="unit">전력량</div>
                               <div class="ee">4 <span>kw</span></div>
                            </div>
                        </li>                       
                    </ul>
                </div>
            `;

      const newCustomOverlay = new kakao.maps.CustomOverlay({
        position: overlayPosition,
        content: content,
        xAnchor: 0.3,
        yAnchor: 0.91,
      });

      newCustomOverlay.setMap(mapInstance);
      setCustomOverlay(newCustomOverlay);

      return () => {
        newCustomOverlay.setMap(null);
      };
    }
  }, [mapInstance, overlayPosition, subAreaName, weather]);

  // 주소에 해당하는 위치로 지도를 이동
  useEffect(() => {
    if (mapInstance && area && subArea) {
      const geocoder = new kakao.maps.services.Geocoder();
      const address = `${area} ${subArea}`;
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          mapInstance.setCenter(coords); // 주소 위치로 지도 중심 설정
          setOverlayPosition(coords); // 오버레이 위치 설정
          setSubAreaName(subArea); // 하위 지역 이름 설정
        } else {
          console.error("주소 검색 실패:", status);
        }
      });
    }
  }, [mapInstance, area, subArea]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />
  );
};

export default KakaoMap;
