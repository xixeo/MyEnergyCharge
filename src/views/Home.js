import React, { useState, useCallback, useRef } from "react";
import KakaoMap from "../components/map/KakaoMap";
import areas from "../components/data/area.json";
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import Chart from "../components/chart/Chart";

const Home = () => {
    const [map, setMap] = useState(null);
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
    
    // 실제로 KakaoMap에 전달될 상태
    const [queryArea, setQueryArea] = useState("");
    const [querySubArea, setQuerySubArea] = useState("");
    const [queryDate, setQueryDate] = useState("");

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

    const areaSelectRef = useRef(null);
    const subAreaSelectRef = useRef(null);
    const dateInputRef = useRef(null);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // YYYY-MM-DD 형식으로 날짜 포맷팅
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const startDate = formatDate(oneYearAgo);
    const endDate = formatDate(today);

    // 조회 버튼 클릭
    const handleButtonClick = () => {
        setQueryArea(areaSelectRef.current ? areaSelectRef.current.value.substring(0, 2) : "");
        setQuerySubArea(subAreaSelectRef.current ? subAreaSelectRef.current.value : "");
        setQueryDate(dateInputRef.current ? dateInputRef.current.value : "");
        console.log(areaSelectRef.current.value, subAreaSelectRef.current.value, dateInputRef.current.value)
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <div className="w-full h-14 md:px-4 flex pb-1 lg:pb-0 items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                <div className="flex items-center">
                    <InputBox
                        id="areaSelect"
                        type="dropDown"
                        initText="선택"
                        ops={areas.map((area) => area.name)}
                        handleChange={handleAreaChange}
                        customClass="xl:mr-10 mr-4"
                        selRef={areaSelectRef}
                        labelText="시도"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />

                    <InputBox
                        id="subAreaSelect"
                        type="dropDown"
                        initText="선택"
                        ops={subAreas}
                        handleChange={handleSubAreaChange}
                        customClass="xl:mr-10 mr-4"
                        selRef={subAreaSelectRef}
                        labelText="시군구"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />

                    <InputBox
                        id="dt"
                        type="date"
                        min={startDate}
                        max={endDate}
                        value={selectedDate}
                        handleChange={handleDateChange}
                        customClass="xl:mr-10 mr-4"
                        inRef={dateInputRef}
                        labelText="날짜"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />
                </div>

                <Btn
                    caption="조회"
                    customClass="bg-[#0473E9] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm mx-1 px-1"
                    handleClick={handleButtonClick}
                />
            </div>

            <div className="lg:grid grid-cols-5 gap-4 mt-6 displayWrap overflow-y-auto">
                <div className="h-full col-span-3 p-3 bg-[#F2F5FE] rounded-md border border-[#CDD1E1]">
                    <KakaoMap
                        onMapReady={handleMapReady}
                        area={queryArea}
                        subArea={querySubArea}
                        selectedDate={queryDate}
                    />
                </div>

                <div className="col-span-2">
                    <div className="chartWrap my-4 lg:mt-0">
                        <Chart selectedDate={queryDate} />
                    </div>
                    <div className="chartWrap">
                        <Chart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
