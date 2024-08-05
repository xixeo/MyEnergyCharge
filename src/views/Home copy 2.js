import React, { useState, useCallback, useRef, useEffect } from "react";
import KakaoMap from "../components/map/KakaoMap";
import PlaceList from "../components/map/PlaceList";
import SearchBar from "../components/map/SearchBar";
import areas from "../components/data/area.json";
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";

const Home = () => {
    const [map, setMap] = useState(null);
    const infowindowRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleMapReady = useCallback((mapInstance) => {
        setMap(mapInstance);
        infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    }, []);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    useEffect(() => {
        if (map && searchQuery) {
            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(searchQuery, (data, status, pagination) => {
                if (status === window.kakao.maps.services.Status.OK) {

                    infowindowRef.current.close();
                    const bounds = new window.kakao.maps.LatLngBounds();
                    map.setLevel(3);

                    data.forEach((place) => {
                        const position = new window.kakao.maps.LatLng(
                            place.y,
                            place.x
                        );
                        const marker = new window.kakao.maps.Marker({
                            map,
                            position,
                        });

                        window.kakao.maps.event.addListener(
                            marker,
                            "click",
                            () => {
                                if (infowindowRef.current) {
                                    infowindowRef.current.setContent(
                                        `<span>${place.place_name}</span>`
                                    );
                                    infowindowRef.current.open(map, marker);

                                    const currentLevel = map.getLevel();
                                    const newLevel =
                                        currentLevel > 3 ? 3 : currentLevel;
                                    map.setLevel(newLevel, {
                                        anchor: position,
                                    });
                                    map.panTo(position);
                                }
                            }
                        );

                        bounds.extend(position);
                    });
                    map.setBounds(bounds);
                } else {
                    alert("검색 결과 중 오류가 발생했습니다.");
                }
            });
        }
    }, [map, searchQuery]);

    // selectBox
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedSubArea, setSelectedSubArea] = useState("");
    const [subAreas, setSubAreas] = useState([]);

    const handleAreaChange = (e) => {
        const areaName = e.target.value;
        setSelectedArea(areaName);
        const selectedAreaObj = areas.find((area) => area.name === areaName);
        setSubAreas(selectedAreaObj ? selectedAreaObj.subArea : []);
        setSelectedSubArea(""); // 지역을 바꾸면 시, 군, 구 선택 초기화
    };

    const handleSubAreaChange = (e) => {
        setSelectedSubArea(e.target.value);
    };

    // dateBox
    const [selectedDate, setSelectedDate] = useState("");

    // Create refs for InputBox components
    const areaSelectRef = useRef(null);
    const subAreaSelectRef = useRef(null);
    const dateInputRef = useRef(null);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Utility function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    // Get today's date and the date 1 year ago
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Format the dates
    const startDate = formatDate(oneYearAgo);
    const endDate = formatDate(today);

    // Button click handler to log values
    const handleButtonClick = () => {
        console.log(
            "Area:",
            areaSelectRef.current ? areaSelectRef.current.value : "N/A"
        );
        console.log(
            "Sub Area:",
            subAreaSelectRef.current ? subAreaSelectRef.current.value : "N/A"
        );
        console.log(
            "Date:",
            dateInputRef.current ? dateInputRef.current.value : "N/A"
        );
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <div className="w-full h-14 px-4 flex items-center justify-between border-b border-[#CDD1E1]">
                <div className="flex items-center">
                    <InputBox
                        id="areaSelect"
                        type="dropDown"
                        initText="선택"
                        ops={areas.map((area) => area.name)}
                        handleChange={handleAreaChange}
                        customClass="mr-10"
                        selRef={areaSelectRef}
                        labelText="시도"
                        labelClass="ml-0 mr-4"
                    />

                    <InputBox
                        id="subAreaSelect"
                        type="dropDown"
                        initText="선택"
                        ops={subAreas}
                        handleChange={handleSubAreaChange}
                        customClass="mr-10"
                        selRef={subAreaSelectRef}
                        labelText="시군구"
                        labelClass="ml-0 mr-4"
                    />

                    <InputBox
                        id="dt"
                        type="date"
                        min={startDate}
                        max={endDate}
                        value={selectedDate}
                        handleChange={handleDateChange}
                        customClass="mr-10"
                        inRef={dateInputRef} 
                        labelText="날짜"
                        labelClass="ml-0 mr-4"
                    />
                </div>

                <Btn
                    caption="조회"
                    customClass={
                        "bg-[#0473E9] py-1 rounded-sm text-white text-sm mx-1"
                    }
                    handleClick={handleButtonClick}
                />
            </div>

            <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="col-span-3">
                    <KakaoMap
                        onSearchResults={handleSearchResults}
                        onMapReady={handleMapReady}
                    />
                </div>

                <div className="col-span-2">
                </div>
            </div>
        </div>
    );
};

export default Home;
