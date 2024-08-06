import React, { useState, useCallback, useRef } from "react";
import KakaoMap from "../components/map/KakaoMap";
import areas from "../components/data/area.json";
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";

const Home = () => {
    const [map, setMap] = useState(null);
    const [area, setArea] = useState("");
    const [subArea, setSubArea] = useState("");
    const infowindowRef = useRef(null);

    const handleMapReady = useCallback((mapInstance) => {
        setMap(mapInstance);
        infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        console.log("Map instance:", map); // map 변수 사용
    }, []);

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
        console.log("Selected area:", selectedArea); // selectedArea 변수 사용
    };

    const handleSubAreaChange = (e) => {
        setSelectedSubArea(e.target.value);
        console.log("Selected sub area:", e.target.value); // selectedSubArea 변수 사용
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

    //  YYYY-MM-DD
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

    // 날짜 포맷
    const startDate = formatDate(oneYearAgo);
    const endDate = formatDate(today);

    //조회 버튼 클릭
    const handleButtonClick = () => {
        // 전달된 값을 상태로 업데이트하여 KakaoMap 컴포넌트에 전달
        setArea(areaSelectRef.current ? areaSelectRef.current.value.substring(0, 2) : "");
        setSubArea(subAreaSelectRef.current ? subAreaSelectRef.current.value : "");
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
                    customClass="bg-[#0473E9] py-1 rounded-sm text-white text-sm mx-1"
                    handleClick={handleButtonClick}
                />
            </div>

            <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="col-span-3">
                    <KakaoMap
                        onMapReady={handleMapReady}
                        area={area}
                        subArea={subArea}
                    />
                </div>

                <div className="col-span-2">
                    {/* 여기에 다른 컴포넌트나 기능을 추가할 수 있습니다 */}
                </div>
            </div>
        </div>
    );
};

export default Home;
