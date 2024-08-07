import React, { useEffect, useRef, useState } from "react";
import siguData from "../data/sig.json"; // SIG 데이터 JSON 파일 경로
import sidoData from "../data/sido.json"; // 시도 데이터 JSON 파일 경로
import defaultData from "../data/defaultData.json"; // mock up 데이터 연결

// 아이콘 파일을 모듈처럼 가져오기
import w01 from "../../assets/icons/w01.png";
import w02 from "../../assets/icons/w02.png";
import w03 from "../../assets/icons/w03.png";
import w04 from "../../assets/icons/w04.png";

const KakaoMap = ({ onMapReady, area, subArea, selectedDate }) => {
    const { kakao } = window;
    const mapContainerRef = useRef(null); // 지도를 렌더링할 DOM 요소 참조
    const [mapInstance, setMapInstance] = useState(null); // 지도 인스턴스 상태
    const [customOverlay, setCustomOverlay] = useState(null); // 사용자 정의 오버레이 상태
    const [overlayPosition, setOverlayPosition] = useState(null); // 날씨 팝업 위치
    const [subAreaName, setSubAreaName] = useState(""); // 하위 지역 이름 상태
    const [weather] = useState("맑음"); // 날씨 상태 기본값
    const polygons = useRef([]); // 폴리곤을 저장할 useRef 변수
    const [currentZoomLevel, setCurrentZoomLevel] = useState(9); // 초기 줌 레벨 상태 설정
    // 색상 배열 정의
    const colorPalette = [
        // "#FFDDC1",
        // "#C1E1C1",
        // "#C1D3E1",
        // "#FAD02E",
        // "#F28D35",
        // "#E56B6F",
        // "#D30C02",
        // "#F6AA55",
        // "#F7F7B6",
        // "#A7D3E4",
        // "#2275B2",
        // "#F769AA",
        // "#F7D592",
        // "#CFF77F",
        // "#6CF2F7",
        // "#95B4F7",
        "#76AAAA",
        "#8ABA75",
        "#97A291",
        "#A6D0AC",
        "#B2B6B7",
        "#ADACCE",
        "#8B84AE",
        "#86C8DE",
        "#B2D1CB",
        "#C9BCD3",
        "#EAA9BD",
        "#934C89",
        "#E6E2C5",
        "#D6EEF0",
        "#B0CBE9",
        "#B3A29B",
    ];

    // 지도 초기화 및 폴리곤 추가
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const center = new kakao.maps.LatLng(latitude, longitude); // 현재 위치를 중심으로 설정
                const container = mapContainerRef.current; // 지도 컨테이너 참조
                const options = {
                    center,
                    level: 9,
                    disablePan: true, // 지도 이동 비활성화
                };
                const map = new kakao.maps.Map(container, options); // 지도 인스턴스 생성
                setMapInstance(map);

                if (onMapReady) {
                    onMapReady(map); // 지도 준비 완료 시 콜백 호출
                }

                // 지도 줌 컨트롤을 생성
                const zoomControl = new kakao.maps.ZoomControl();
                map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
                // 마우스로 지도 줌 하는거 막기
                map.setZoomable(false);

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

                // 지도 줌 레벨 변경 이벤트 리스너 추가
                kakao.maps.event.addListener(map, "zoom_changed", () => {
                    const level = map.getLevel();
                    setCurrentZoomLevel(level);
                });

                // 초기 줌 레벨 상태 설정
                setCurrentZoomLevel(map.getLevel());
            });
        }
    }, [kakao, onMapReady]);

    // 폴리곤 삭제 함수
    const deletePolygon = () => {
        polygons.current.forEach((polygon) => {
            polygon.setMap(null);
        });
        polygons.current = []; // 폴리곤 배열 초기화
    };

    // 폴리곤 추가 함수
    const getPolycode = (feature, map, featureIndex) => {
        const { geometry, properties } = feature;
        let path = [];
        let coordinates = geometry.coordinates[0];
        let name = "";

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
            setPolygon({ name, path, featureIndex }, map); // featureIndex 추가
        } else if (geometry.type === "MultiPolygon") {
            coordinates.forEach((polygon) => {
                path = [];
                polygon[0].forEach((coord) => {
                    path.push(new kakao.maps.LatLng(coord[1], coord[0]));
                });
                setPolygon({ name, path, featureIndex }, map); // featureIndex 추가
            });
        }
    };

    // 폴리곤 설정 함수
    const setPolygon = (area, map) => {
        const polygon = new kakao.maps.Polygon({
            path: area.path,
            strokeWeight: 1,
            // strokeColor: "#004c80",
            strokeColor: "#fff",
            strokeOpacity: 0.8,
            fillColor: colorPalette[area.featureIndex % colorPalette.length], // 색상 배열에서 색상 선택
            fillOpacity: 0.8,
        });

        kakao.maps.event.addListener(polygon, "mouseover", () => {
            polygon.setOptions({ fillOpacity: 0 });
        });

        kakao.maps.event.addListener(polygon, "mouseout", () => {
            polygon.setOptions({
                fillColor:
                    colorPalette[area.featureIndex % colorPalette.length],
                fillOpacity: 0.8,
            });
        });

        const centroidPosition = centroid(area.path); // 폴리곤의 중심 좌표 계산

        // 폴리곤을 지도에 추가
        polygon.setMap(map);
        polygons.current.push(polygon); // 폴리곤을 현재 폴리곤 배열에 추가
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

    // 폴리곤 데이터 업데이트
    useEffect(() => {
        if (mapInstance) {
            const addPolygons = () => {
                deletePolygon(); // 기존 폴리곤 삭제
                const dataToUse = currentZoomLevel < 11 ? siguData : sidoData;
                dataToUse.features.forEach((feature, index) => {
                    getPolycode(feature, mapInstance, index); // 인덱스 추가
                });
            };

            addPolygons(); // 폴리곤 추가
        }
    }, [mapInstance, currentZoomLevel]);

    // 날짜 형식 변환 함수
    const formatDate = (date) => {
        // 입력된 날짜가 '2024-08-05' 형식인지 확인
        // '24-08-05' 형식으로 변환
        const [year, month, day] = date.split("-");
        return `${year.slice(-2)}-${month}-${day}`;
    };

    //날짜에 따른 데이터 찾기
    const getDateByData = (date) => {
        const formattedDate = formatDate(date); // 날짜 형식 변환
        console.log("변환된 날짜:", formattedDate); // 콘솔에 변환된 날짜 출력
        const data = defaultData.find((item) => item.date === formattedDate);
        console.log("검색된 데이터:", data); // 콘솔에 검색된 데이터 출력
        return data || {};
    };

    // mouoseover 오버레이 업데이트
    useEffect(() => {
        if (mapInstance && (overlayPosition || subAreaName)) {
            if (customOverlay) {
                customOverlay.setMap(null);
            }

            const data = getDateByData(selectedDate);

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
                               <div class="tem"> ${
                                   data.temp || "N/A"
                               }<span>ºC</span></div>
                            </div>

                              <div class="unit-wrap">
                               <div class="unit">습도</div>
                               <div class="hum"> ${
                                   data.hum || "N/A"
                               }<span>%</span></div>
                            </div> 

                              <div class="unit-wrap">
                               <div class="unit">체감온도</div>
                               <div class="tem2">${
                                   data.temp || "N/A"
                               } <span>ºC</span></div>
                            </div>

                              <div class="unit-wrap">
                               <div class="unit">전력량</div>
                               <div class="ee">${
                                   data.elec || "N/A"
                               } <span>kw</span></div>
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
    }, [mapInstance, overlayPosition, selectedDate, subAreaName, weather]);

    // 주소에 해당하는 위치로 지도를 이동
    useEffect(() => {
        if (mapInstance && area && subArea) {
            const geocoder = new kakao.maps.services.Geocoder();
            const address = `${area} ${subArea}`;
            geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const coords = new kakao.maps.LatLng(
                        result[0].y,
                        result[0].x
                    );
                    mapInstance.setCenter(coords); // 주소 위치로 지도 중심 설정
                    mapInstance.setLevel(7); // 줌 레벨 설정
                    setOverlayPosition(coords); // 오버레이 위치 설정
                    setSubAreaName(subArea); // 하위 지역 이름 설정
                } else {
                    console.error("주소 검색 실패:", status);
                }
            });
        }
    }, [mapInstance, area, subArea]);

    return <div ref={mapContainerRef} className="h-full w-full rounded-md" />;
};

export default KakaoMap;
