import React, { useState, useCallback, useRef, useEffect } from "react";
import KakaoMap from "../components/map/KakaoMap";
import areas from "../components/data/area.json";
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import Chart from "../components/chart/Chart";
import { useRecoilState } from "recoil";
import { AtomN } from "./layouts/AtomN";

const Home = () => {
    const [user, setUser] = useRecoilState(AtomN); // 로그인 여부 상태
    const [map, setMap] = useState(null);
    const infowindowRef = useRef(null);

    const handleMapReady = useCallback((mapInstance) => {
        setMap(mapInstance);
        infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    }, []);

    // 초기 값 설정
    const initialArea = "부산광역시";
    const initialSubArea = "금정구";
    const today = new Date().toISOString().split("T")[0];

    // selectBox
    const [selectedArea, setSelectedArea] = useState(initialArea);
    const [selectedSubArea, setSelectedSubArea] = useState(initialSubArea);
    const [subAreas, setSubAreas] = useState([]);

    // 실제로 KakaoMap과 Chart에 전달될 상태
    const [queryArea, setQueryArea] = useState(initialArea);
    const [querySubArea, setQuerySubArea] = useState(initialSubArea);
    const [queryDate, setQueryDate] = useState(today);

    // 사용자가 선택한 값 (임시로 보관)
    const [tempArea, setTempArea] = useState(initialArea);
    const [tempSubArea, setTempSubArea] = useState(initialSubArea);
    const [tempDate, setTempDate] = useState(today);

    useEffect(() => {
        const initialAreaObj = areas.find((area) => area.name === initialArea);
        setSubAreas(initialAreaObj ? initialAreaObj.subArea : []);
    }, []);

    const handleAreaChange = (e) => {
        const areaName = e.target.value;
        setTempArea(areaName); // 임시 상태로 설정
        const selectedAreaObj = areas.find((area) => area.name === areaName);
        setSubAreas(selectedAreaObj ? selectedAreaObj.subArea : []);
        setTempSubArea(""); // 지역 변경 시 하위 지역 초기화
    };

    const handleSubAreaChange = (e) => {
        setTempSubArea(e.target.value); // 임시 상태로 설정
    };

    const handleDateChange = (e) => {
        setTempDate(e.target.value); // 날짜 변경 시 임시 상태 업데이트
    };

    // KakaoMap에서 클릭된 위치 정보를 바로 Chart에 반영
    const handleMapClick = (area, subArea) => {
        setQueryArea(area);
        setQuerySubArea(subArea);
        setQueryDate(tempDate); // 날짜는 조회 버튼을 눌렀을 때 사용되므로 여기서는 그대로 유지
        // Chart.js가 상태 업데이트를 감지하도록 의도된 대로 로직이 이어지는지 확인
        console.log('Updating area:', area, 'subArea:', subArea, 'date:', queryDate);
    };
    

    // 조회 버튼 클릭 시 상태 업데이트
    const handleButtonClick = () => {
        // 조회 버튼을 누르면 입력된 값을 query 상태로 업데이트
        setQueryArea(tempArea);
        setQuerySubArea(tempSubArea);
        setQueryDate(tempDate);
    };

    return (
        <div className="w-full px-10">
            <div className="w-full h-14 md:px-4 md:pr-0 flex pb-1 lg:pb-0 items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                <div className="flex items-center">
                    <InputBox
                        id="areaSelect"
                        type="dropDown"
                        initText={initialArea}
                        ops={areas.map((area) => area.name)}
                        handleChange={handleAreaChange}
                        customClass="xl:mr-10 mr-4 min-w-40"
                        labelText="시도"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />

                    <InputBox
                        id="subAreaSelect"
                        type="dropDown"
                        initText={initialSubArea}
                        ops={subAreas}
                        handleChange={handleSubAreaChange}
                        customClass="xl:mr-10 mr-4 min-w-40"
                        labelText="시군구"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />

                    <InputBox
                        id="dt"
                        type="date"
                        min="2021-08-10"
                        max={today}
                        value={tempDate} // 임시 상태를 InputBox에 바인딩
                        handleChange={handleDateChange}
                        customClass="xl:mr-10 mr-4 min-w-40"
                        labelText="날짜"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />
                </div>

                <Btn
                    caption="조회"
                    customClass="bg-[#17458d] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm mx-1 px-1"
                    handleClick={handleButtonClick}
                />
            </div>

            <div className="lg:grid grid-cols-5 gap-4 mt-6 displayWrap overflow-y-auto">
                <div className="h-full col-span-3 p-3 bg-[#DEE0EA] rounded-md border border-[#CDD1E1]">
                    <KakaoMap
                        onMapReady={handleMapReady}
                        area={queryArea}
                        subArea={querySubArea}
                        selectedDate={queryDate}
                        onMapClick={handleMapClick} // 지도에서 클릭한 값을 받아오는 콜백 함수
                    />
                </div>

                <div className="col-span-2">
                    <div className="chartWrap my-4 lg:mt-0">
                        <Chart 
                          area={queryArea}
                          subArea={querySubArea}
                          selectedDate={queryDate} 
                        />
                    </div>
                    <div className="chartWrap relative">
                        {user ? (
                            <></>
                        ) : (
                            <div className="logined w-full h-full absolute z-10 rounded-md text-white flex items-center justify-center">
                                로그인 후 확인 가능합니다.
                            </div>
                        )}

                        <Chart 
                          area={queryArea}
                          subArea={querySubArea}
                          selectedDate={queryDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
