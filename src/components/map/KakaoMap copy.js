import React, { useEffect, useRef, useState } from "react";
import sigData from "../data/sig.json"; // JSON 파일 경로
import sidoData from "../data/sido.json"; // JSON 파일 경로
import dongData from "../data/dong.json"; // JSON 파일 경로

const KakaoMap = ({ onMapReady, combinedArea }) => {
    const { kakao } = window;
    const mapContainerRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [polygons, setPolygons] = useState([]);
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
                kakao.maps.event.addListener(map, "zoom_changed", () => {
                    const currentLevel = map.getLevel();
                    if (currentLevel <= 3) {
                        removePolygon();
                        init(map, dongData);
                    } else if (currentLevel > 3 && currentLevel <= 10) {
                        removePolygon();
                        init(map, sigData);
                    } else if (currentLevel > 10) {
                        removePolygon();
                        init(map, sidoData);
                    }
                });
            });
        }
    }, [kakao, onMapReady]);

    useEffect(() => {
        if (mapInstance && combinedArea) {
            const [areaFull, subArea] = combinedArea.split(":");
            const area = areaFull.substring(0, 2);
            console.log("combinedArea:", combinedArea);
            console.log("area:", area);
            console.log("subArea:", subArea);

            // sidoData에서 'area'에 해당하는 폴리곤 찾기
            const selectedArea = sidoData.features.find(
                (feature) => feature.properties.SIG_KOR_NM === area
            );
            console.log("selectedArea:", selectedArea);

            const selectedSubArea = selectedArea
                ? sigData.features.find(
                      (feature) =>
                          feature.properties.SIG_KOR_NM ===
                              selectedArea.properties.SIG_KOR_NM &&
                          feature.properties.SIG_KOR_NM === subArea
                  )
                : null;

            console.log("selectedSubArea:", selectedSubArea);

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
    }, [combinedArea, mapInstance]);

    const removePolygon = () => {
        polygons.forEach((polygon) => polygon.setMap(null));
        setPolygons([]);
    };

    const init = (mapInstance, data) => {
        const units = data.features;
        const areas = units.map((unit) => {
            const coordinates = unit.geometry.coordinates;
            const name = unit.properties.SIG_KOR_NM || unit.properties.SIDO_NM;
            const cd_location = unit.properties.SIG_CD;
            const path = coordinates[0].map(
                (coordinate) =>
                    new kakao.maps.LatLng(coordinate[1], coordinate[0])
            );
            return { name, path, location: cd_location };
        });

        areas.forEach((area) => displayArea(mapInstance, area));
    };

    const displayArea = (mapInstance, area) => {
        const polygon = new kakao.maps.Polygon({
            map: mapInstance,
            path: area.path,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: "#fff",
            fillOpacity: 0.7,
        });

        setPolygons((prevPolygons) => [...prevPolygons, polygon]);

        kakao.maps.event.addListener(
            polygon,
            "mouseover",
            function (mouseEvent) {
                polygon.setOptions({ fillColor: "#09f" });
                customOverlay.setContent(
                    `<div class="area">${area.name}</div>`
                );
                customOverlay.setPosition(mouseEvent.latLng);
                customOverlay.setMap(mapInstance);
            }
        );

        kakao.maps.event.addListener(
            polygon,
            "mousemove",
            function (mouseEvent) {
                customOverlay.setPosition(mouseEvent.latLng);
            }
        );

        kakao.maps.event.addListener(polygon, "mouseout", function () {
            polygon.setOptions({ fillColor: "#fff" });
            customOverlay.setMap(null);
        });

        kakao.maps.event.addListener(polygon, "click", function (mouseEvent) {
            mapInstance.setLevel(3); // level에 따라 이벤트 변경
            const latlng = mouseEvent.latLng;
            mapInstance.panTo(latlng);
            removePolygon(); // 기존 폴리곤 제거
        });
    };

    return (
        <div ref={mapContainerRef} style={{ width: "100%", height: "750px" }} />
    );
};

export default KakaoMap;
