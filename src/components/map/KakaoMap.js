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
    const [customOverlay, setCustomOverlay] = useState(null);
    const [overlayPosition, setOverlayPosition] = useState(null);
    const [subAreaName, setSubAreaName] = useState("");
    const [weather] = useState("맑음");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const center = new kakao.maps.LatLng(latitude, longitude);
                const container = mapContainerRef.current;
                const options = {
                    center,
                    level: 8,
                    disablePan: true,
                };
                const map = new kakao.maps.Map(container, options);
                setMapInstance(map);

                if (onMapReady) {
                    onMapReady(map);
                }

                kakao.maps.event.addListener(map, "click", (mouseEvent) => {
                    const latlng = mouseEvent.latLng;
                    const lat = latlng.getLat();
                    const lng = latlng.getLng();
                    console.log(`지도 클릭 위치: 위도 ${lat}, 경도 ${lng}`);

                    const geocoder = new kakao.maps.services.Geocoder();
                    geocoder.coord2Address(lng, lat, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            let address = result[0].address.region_2depth_name;
                            console.log(`주소 변환 결과: ${address}`);

                            setOverlayPosition(latlng);
                            setSubAreaName(address);
                        } else {
                            console.error("주소 변환 실패:", status);
                        }
                    });
                });
            });
        }
    }, [kakao, onMapReady]);

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

    useEffect(() => {
        if (mapInstance && area && subArea) {
            const geocoder = new kakao.maps.services.Geocoder();
            const address = `${area} ${subArea}`;
            geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    mapInstance.setCenter(coords);
                    setOverlayPosition(coords);
                    setSubAreaName(subArea);
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
