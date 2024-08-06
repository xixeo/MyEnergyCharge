import React, { useEffect, useRef, useState } from "react";
import sigData from "../data/sig.json"; // JSON 파일 경로
import sidoData from "../data/sido.json"; // JSON 파일 경로

// 아이콘 파일을 모듈처럼 가져오기
import w01 from "../../assets/icons/w01.png";
import w02 from "../../assets/icons/w02.png";
import w03 from "../../assets/icons/w03.png";
import w04 from "../../assets/icons/w04.png";

const KakaoMap = ({ onMapReady, area, subArea }) => {
    const { kakao } = window;
    const mapContainerRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [selectedSubAreaPosition, setSelectedSubAreaPosition] = useState(null);
    const [subAreaName, setSubAreaName] = useState(""); // SIG_KOR_NM 값을 저장할 상태 추가
    const [weather] = useState("맑음"); // 날씨 상태를 임의로 "맑음"으로 설정

    // 사용자의 현재 위치값 받아오기
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

                /// 지도 위를 클릭했을 때
                kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
                  const latlng = mouseEvent.latLng;
                  const lat = latlng.getLat();
                  const lng = latlng.getLng();
                  console.log(`지도 클릭 위치: 위도 ${lat}, 경도 ${lng}`);

                  // 좌표를 주소로 변환
                  const geocoder = new kakao.maps.services.Geocoder();
                  geocoder.coord2Address(lng, lat, (result, status) => {
                      if (status === kakao.maps.services.Status.OK) {
                        let address = result[0].address.region_2depth_name;

                        const spaceIndex = address.indexOf(' ');
                        if(spaceIndex !== -1){
                          address = address.slice(0, spaceIndex);
                        }
                        console.log(`주소: ${address}`);

                      } else {
                          console.error("주소 변환 실패:", status);
                      }
                  });
            
              });
            });
        }
    }, [kakao, onMapReady]);

    // Home.js에서 받아온 selectBox value값으로 좌표 찍기
    useEffect(() => {
        if (mapInstance && area && subArea) {
            const selectedArea = sidoData.features.find(
                (feature) => feature.properties.SIDO_NM === area
            );
            const selectedSubArea = sigData.features.find(
                (feature) =>
                    feature.properties.SIDO_NM ===
                        selectedArea?.properties.SIG_KOR_NM &&
                    feature.properties.SIG_KOR_NM === subArea
            );

            if (selectedSubArea) {
                const coords = selectedSubArea.geometry.coordinates[0].map(
                    (coord) => new kakao.maps.LatLng(coord[1], coord[0])
                );

                const bounds = new kakao.maps.LatLngBounds();
                coords.forEach((coord) => bounds.extend(coord));
                mapInstance.setBounds(bounds);

                // 커스텀 오버레이 위치 및 이름 설정
                setSelectedSubAreaPosition(
                    new kakao.maps.LatLng(
                        selectedSubArea.geometry.coordinates[0][0][1],
                        selectedSubArea.geometry.coordinates[0][0][0]
                    )
                );
                setSubAreaName(selectedSubArea.properties.SIG_KOR_NM); // SIG_KOR_NM 값을 상태에 저장
            }
        }
    }, [area, subArea, mapInstance]);

    // 줌 컨트롤과 이벤트 리스너를 mapInstance가 설정된 후에 추가합니다
    useEffect(() => {
        if (mapInstance) {
            // ZoomControl이 여러 번 생성되지 않도록 방지
            if (!mapInstance.zoomControl) {
                const zoomControl = new kakao.maps.ZoomControl();
                mapInstance.addControl(
                    zoomControl,
                    kakao.maps.ControlPosition.RIGHT
                );
                mapInstance.zoomControl = true; // ZoomControl이 추가되었음을 표시하는 플래그
            }

            kakao.maps.event.addListener(
                mapInstance,
                "zoom_changed",
                function () {
                    console.log("줌 레벨이 변경되었습니다.");
                }
            );
        }
    }, [mapInstance]);

    // 커스텀 오버레이를 mapInstance가 설정된 후에 추가합니다
    useEffect(() => {
        if (mapInstance && selectedSubAreaPosition) {
            // 날씨 아이콘의 경로를 weather 상태에 따라 동적으로 설정
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
                    // 다른 날씨 상태에 대한 아이콘 경로를 추가할 수 있습니다
                    default:
                        return w01; // 기본 아이콘
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

            const customOverlay = new kakao.maps.CustomOverlay({
                position: selectedSubAreaPosition,
                content: content,
                xAnchor: 0.3,
                yAnchor: 0.91,
            });

            customOverlay.setMap(mapInstance);

            return () => {
                customOverlay.setMap(null);
            };
        }
    }, [mapInstance, selectedSubAreaPosition, subAreaName, weather]);

    return (
        <div ref={mapContainerRef} style={{ width: "100%", height: "750px" }} />
    );
};

export default KakaoMap;
