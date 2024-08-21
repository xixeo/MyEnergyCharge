import React, { useState, useEffect, useRef } from "react";
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAlert } from "../components/AlertContext";
import { useLoading } from "../components/LoadingContext";
import areas from "../components/data/area.json";

import { ReactComponent as Ther } from "../assets/icons/svg/thermometer.svg";
import { ReactComponent as Water } from "../assets/icons/svg/waterdrop.svg";
import { ReactComponent as Shop } from "../assets/icons/svg/shop.svg";
import { ReactComponent as Down } from "../assets/icons/svg/arrowD.svg";
import { ReactComponent as Flash } from "../assets/icons/svg/flash.svg";
import { ReactComponent as Up } from "../assets/icons/svg/arrowU.svg";
import { ReactComponent as Rec } from "../assets/icons/svg/receipt.svg";
import { ReactComponent as Weather } from "../assets/icons/svg/weather.svg";

// 날짜 포맷을 YYYY-MM-DD로 변환하는 함수
const formatDate = (date) => {
    // if (!date) return ""; // date가 null 또는 undefined인 경우 빈 문자열 반환
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
};

export default function Menu2() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [today] = useState(new Date().toISOString().split("T")[0]);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]); // 마커 표시할 날짜들
    const [selectedData, setSelectedData] = useState(null); // 선택된 날짜의 데이터
    const [fetchData, setFetchData] = useState([]);
    const { showAlert } = useAlert();
    const { setLoading } = useLoading(); // 로딩 컴포넌트

    // 서버에서 날짜 데이터를 가져오는 함수
    const fetchCalendarData = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:8080/members/forum`;
            // const url = `http://192.168.0.144:8080/members/forum`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "데이터 로드 실패");
            }

            const data = await response.json();

            const fetchData = data.map((item) => ({
                date: formatDate(new Date(item.date)),
                elec_total: item.elec_total,
                city: item.city,
                region: item.region,
                min_temp: item.min_temp,
                avg_temp: item.avg_temp,
                max_temp: item.max_temp,
                min_rh: item.min_rh,
                avg_rh: item.avg_rh,
                max_rh: item.max_rh,
                elec_diff: item.elec_diff,
                days_diff: item.days_diff,
                sum: item.sum,
                comment: item.comment || [],
            }));

            console.log("fetchData:", fetchData); // fetchData 확인

            setFetchData(fetchData);
            setMarkedDates(fetchData); // 상태 업데이트
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };

    // 선택된 날짜의 상세 데이터를 가져오는 함수
    const fetchSelectedData = async (calendarDate, feeDate) => {
        try {
            const token = localStorage.getItem("token");
    
            const year = calendarDate.getFullYear();
            const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
            const day = String(calendarDate.getDate()).padStart(2, '0');
            const formattedCalendarDate = `${year}-${month}-${day}`;
            
            console.log("formattedCalendarDate:", formattedCalendarDate);
            console.log("fetchData:", fetchData);
    
            const calendarData = fetchData.find(
                (d) => d.date === formattedCalendarDate
            );
    
            if (!calendarData) {
                console.warn("해당 날짜의 캘린더 데이터를 찾을 수 없습니다.");
                setSelectedData(null);
                return;
            }
    
            if (!feeDate) {
                console.error("feeDate가 설정되지 않았습니다.");
                return;
            }
    
            let url = `http://localhost:8080/members/forum/fee?date=${feeDate}`;
            // let url = `http://192.168.0.144:8080/members/forum/fee?date=${feeDate}`;
            if (selectedArea && selectedSubArea) {
                url += `&city=${selectedArea}&county=${selectedSubArea}`;
            }
    
            console.log("API URL:", url);
    
            const feeResponse = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!feeResponse.ok) {
                const errorData = await feeResponse.json();
                throw new Error(errorData.message || "요금 데이터 로드 실패");
            }
    
            const feeData = await feeResponse.json();
    
            console.log("price_avg:", feeData.price_avg);
            console.log("prev_price_avg:", feeData.prev_price_avg);
    
            setSelectedData({
                calendarDate: formattedCalendarDate,
                feeDate: feeDate,
                fee: feeData.fee,
                prev_sum: feeData.prev_sum,
                prev_fee: feeData.prev_fee,
                prev_price_avg: feeData.prev_price_avg,
                price_avg: feeData.price_avg,
                sum: feeData.sum,
                elec_total: calendarData.elec_total,
                min_temp: calendarData.min_temp,
                avg_temp: calendarData.avg_temp,
                max_temp: calendarData.max_temp,
                min_rh: calendarData.min_rh,
                avg_rh: calendarData.avg_rh,
                max_rh: calendarData.max_rh,
                elec_diff: calendarData.elec_diff,
                days_diff: calendarData.days_diff,
                comment: calendarData.comment,
            });
    
            console.log('calendarData', calendarData);
            console.log('feeData', feeData);
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };
    
    // 날짜가 마커된 날짜인지 확인하는 함수
    const isMarked = (date) => {
        const formattedDate = formatDate(date);
        return markedDates.find((d) => d.date === formattedDate) || null;
    };

    // startDate가 변경될 때마다 endDate를 자동으로 설정
    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setMonth(start.getMonth() + 1);
            end.setDate(end.getDate() - 1);
            setEndDate(formatDate(end));
        } else {
            setEndDate("");
        }
    }, [startDate]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            await fetchCalendarData();

            // 조회한 날짜로 캘린더 이동
            if (startDate) {
                const selectedDate = new Date(startDate);
                setCalendarDate(selectedDate); // 캘린더를 선택된 날짜로 이동
                await fetchSelectedData(selectedDate, selectedDate); // 선택된 날짜의 데이터 가져오기
            }

            showAlert("데이터가 정상적으로 로드되었습니다.", "success");
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        } finally {
            setLoading(false);
        }
    };

// 날짜 변경 핸들러에서 feeDate가 정확히 전달되는지 확인
const handleDateChange = async (date) => {
    setCalendarDate(date);
    const feeDate = startDate || date; // startDate가 없으면 date를 사용
    await fetchSelectedData(date, feeDate);
};

    // const handleSearch = async () => {
    //     setLoading(true);
    //     try {
    //         await fetchCalendarData();

    //         // 조회한 날짜로 캘린더 이동
    //         if (startDate) {
    //             const selectedDate = new Date(startDate);
    //             setCalendarDate(selectedDate); // 캘린더를 선택된 날짜로 이동
    //             await fetchSelectedData(selectedDate); // 선택된 날짜의 데이터 가져오기
    //         }

    //         showAlert("데이터가 정상적으로 로드되었습니다.", "success");
    //     } catch (error) {
    //         console.error("Data fetch error:", error);
    //         showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleDateChange = async (date) => {
    //     setCalendarDate(date);
    //     await fetchSelectedData(date);
    // };

    // 지역 선택 처리
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedSubArea, setSelectedSubArea] = useState("");
    const [subAreas, setSubAreas] = useState([]);

    const areaSelectRef = useRef(null);
    const subAreaSelectRef = useRef(null);

    const handleAreaChange = (e) => {
        const selectedArea = e.target.value;
        setSelectedArea(selectedArea);
        const selectedAreaObj = areas.find(
            (area) => area.name === selectedArea
        );
        setSubAreas(selectedAreaObj ? selectedAreaObj.subArea : []);
        setSelectedSubArea("");
    };

    const handleSubAreaChange = (e) => {
        const selectedSubArea = e.target.value;
        setSelectedSubArea(selectedSubArea);
    };

    // `selectedArea` 또는 `selectedSubArea`가 변경될 때 데이터를 가져오는 useEffect 추가
    useEffect(() => {
        const feeDate = startDate || calendarDate;
        fetchSelectedData(calendarDate, feeDate);
    }, [selectedArea, selectedSubArea]);

    return (
        <div className="w-full px-10 ">
            <div className="w-full h-14 md:px-4 md:pr-0 flex pb-1 lg:pb-0 items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                <div className="w-full flex justify-between">
                    <div className="flex">
                        <InputBox
                            id="startDate"
                            type="date"
                            value={startDate}
                            handleChange={(e) => setStartDate(e.target.value)}
                            customClass="xl:mr-10 mr-4 min-w-40"
                            labelText="사용 시작 날짜"
                            labelClass="ml-0 mr-2 lg:mr-4"
                        />
                        <InputBox
                            id="endDate"
                            type="date"
                            value={endDate}
                            disabled
                            customClass="xl:mr-10 mr-4 min-w-40"
                            labelText="사용 종료 날짜"
                            labelClass="ml-0 mr-2 lg:mr-4"
                        />
                    </div>
                    <div>
                        <Btn
                            caption="조회"
                            customClass="bg-[#17458d] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm ml-1 px-1"
                            handleClick={handleSearch}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end text-sm mt-5 text-[#F37E6F]">
                *주택용(저압) 기준 요금 | 누진구간: 1단계: 0~300kWh, 2단계
                300~450kWh, 3단계 451kWh 적용
            </div>
            <div className="lg:grid grid-cols-5 gap-4 calendarWrap overflow-y-auto">
                <div className="h-full col-span-3 p-3 bg-[#DEE0EA] rounded-md border border-[#CDD1E1]">
                    <div className="h-full w-full border border-[#CDD1E1] rounded-md ">
                        <Calendar
                            onChange={handleDateChange}
                            value={calendarDate}
                            calendarType="gregory"
                            showNeighboringMonth={true}
                            tileContent={({ date, view }) => {
                                if (view === "month") {
                                    const markedDate = isMarked(date);
                                    return markedDate ? (
                                        <div className="dateCell">
                                            <div className="markData pt-3 pl-1">
                                                <div className="marker" />
                                                {markedDate.elec_diff}{" "}
                                                <span className="text-xs">
                                                    kWh
                                                </span>
                                            </div>
                                            {markedDate.comment != "" ? (
                                                <div className="markData pt-2 pl-1 text-left">
                                                    <div className="markerMemo" />
                                                    메모
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    ) : null;
                                }
                                return null;
                            }}
                        />
                    </div>
                </div>

                <div className="h-full col-span-2">
                    <div className="rounded-md my-0 pt-5 px-6 pb-6 border border-[#CDD1E1]">
                        {selectedData ? (
                            <div className="w-full">
                                <div className="flex flex-col">
                                    <div className="text-md font-semibold pb-4">
                                        이 날의 날씨
                                    </div>
                                    <div className="xl:pl-3 flex items-center">
                                        <div className="flex items-center">
                                            <Ther />
                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                최저기온:
                                            </span>
                                            <span className="text-sm font-bold">
                                                {selectedData.min_temp}
                                            </span>
                                            <span className="ml-1 text-xs text-zinc-500">
                                                °C
                                            </span>
                                        </div>
                                        <div className="">
                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                평균기온:
                                            </span>
                                            <span className="text-sm font-bold">
                                                {selectedData.avg_temp}
                                            </span>
                                            <span className="ml-1 text-xs text-zinc-500">
                                                °C
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                최고기온:
                                            </span>
                                            <span className="text-sm font-bold">
                                                {selectedData.max_temp}
                                            </span>
                                            <span className="ml-1 text-xs text-zinc-500">
                                                °C
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col pt-2">
                                        <div className="xl:pl-3 flex items-center">
                                            <div className="flex items-center">
                                                <Water />
                                                <span className="font-medium ml-2 mr-4 text-sm">
                                                    최저습도:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.min_rh}
                                                </span>
                                                <span className="ml-2 text-xs text-zinc-500">
                                                    %
                                                </span>
                                            </div>
                                            <div className="">
                                                <span className="font-medium ml-1 mr-4 text-sm">
                                                    평균습도:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.avg_rh}
                                                </span>
                                                <span className="ml-2 text-xs text-zinc-500">
                                                    %
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium ml-1 mr-4 text-sm">
                                                    최고습도:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.max_rh}
                                                </span>
                                                <span className="ml-2 text-xs text-zinc-500">
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                </div>

                                <div className="flex flex-col">
                                    <div className="text-md font-semibold pt-10 pb-0">
                                        전력량 가계부
                                    </div>
                                    <div className=" rounded-md px-2 pt-4 pb-2">
                                        <div className="xl:pl-3">
                                            <div className="flex items-center">
                                                <Flash />
                                                <span className="font-medium ml-2 mr-4 text-sm">
                                                    하루 사용 전력량:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.elec_diff?.toLocaleString() ||
                                                        ""}
                                                </span>
                                                <span className="ml-1 text-xs text-zinc-500">
                                                    kWh
                                                </span>
                                            </div>
                                            <div className="pl-5 pt-2">
                                                <span className="font-medium ml-2 mr-4 text-sm">
                                                    전체 사용 전력량:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.sum?.toLocaleString() ||
                                                        ""}
                                                </span>
                                                <span className="ml-1 text-xs text-zinc-500">
                                                    kWh
                                                </span>
                                            </div>
                                        </div>
                                        <div className="py-2 px-3 flex items-center justify-end">
                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                이번 달 예상 요금:
                                            </span>
                                            <span className="text-md font-bold flex">
                                                {selectedData.fee?.toLocaleString() ||
                                                    ""}
                                            </span>
                                            <span className="ml-1 text-sn text-zinc-500">
                                                원
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="mt-2  rounded-md px-2 pt-4 pb-2">
                                        <div className="xl:pl-3">
                                            <div className="flex items-center">
                                                <Rec />
                                                <span className="font-medium ml-2 mr-4 text-sm">
                                                    지난달 사용량:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.prev_sum?.toLocaleString() ||
                                                        ""}
                                                </span>
                                                <span className="ml-1 text-xs text-zinc-500">
                                                    kWh
                                                </span>
                                            </div>
                                            <div className="pl-5 pt-2">
                                                <span className="font-medium ml-2 mr-4 text-sm">
                                                    지난달 요금:
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {selectedData.prev_fee?.toLocaleString() ||
                                                        ""}
                                                </span>
                                                <span className="ml-1 text-xs text-zinc-500">
                                                    원
                                                </span>
                                            </div>
                                        </div>
                                        <div className="py-2 px-3 flex items-center justify-end">
                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                지난 달 비교:
                                            </span>
                                            <span className="text-md font-bold flex items-center">
                                                {selectedData.prev_fee -
                                                    selectedData.fee >=
                                                0 ? (
                                                    <Down />
                                                ) : (
                                                    <Up />
                                                )}
                                                {Math.abs(
                                                    selectedData.fee -
                                                        selectedData.prev_fee
                                                )?.toLocaleString() || ""}
                                            </span>
                                            <span className="ml-1 text-sm text-zinc-500">
                                                원
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex flex-col">
                                        <div className="flex items-start justify-between pt-8 pb-4">
                                            <div className="text-md font-semibold">
                                                지역 가구별 평균 요금
                                            </div>
                                        </div>
                                        <div className="flex justify-center pb-8">
                                            <InputBox
                                                id="areaSelect"
                                                type="dropDown"
                                                initText="선택"
                                                ops={areas.map(
                                                    (area) => area.name
                                                )}
                                                handleChange={handleAreaChange}
                                                customClass="xl:mr-10 mr-4"
                                                selRef={areaSelectRef}
                                                labelText="시도"
                                                labelClass="ml-0 mr-2 text-sm"
                                            />
                                            <InputBox
                                                id="subAreaSelect"
                                                type="dropDown"
                                                initText="선택"
                                                ops={subAreas}
                                                handleChange={
                                                    handleSubAreaChange
                                                }
                                                customClass="xl:mr-10 mr-4"
                                                selRef={subAreaSelectRef}
                                                labelText="시군구"
                                                labelClass="ml-0 mr-2 text-sm"
                                            />
                                        </div>
                                        {selectedData.prev_price_avg &&
                                        selectedData.price_avg ? (
                                            <div className="flex justify-center">
                                                <div className="flex items-center xl:pl-3">
                                                    {/* <Rec /> */}
                                                    <div className="flex pr-5">
                                                        <div>
                                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                                지난달:
                                                            </span>
                                                            <span className="text-sm font-bold">
                                                                {selectedData.prev_price_avg?.toLocaleString() ||
                                                                    ""}
                                                            </span>
                                                            <span className="ml-1 text-xs text-zinc-500">
                                                                원
                                                            </span>
                                                        </div>
                                                        <div className="pl-4">
                                                            <span className="font-medium ml-2 mr-4 text-sm">
                                                                이번달:
                                                            </span>
                                                            <span className="text-sm font-bold">
                                                                {selectedData.price_avg?.toLocaleString() ||
                                                                    ""}
                                                            </span>
                                                            <span className="ml-1 text-xs text-zinc-500">
                                                                원
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    {selectedData.comment != "" ? (
                                        <div className="flex flex-col">
                                            <div className="text-md font-semibold pt-10 pb-4">
                                                남겼던 기록
                                            </div>
                                            <div className="p-3 flex bg-[#F2F5FE] rounded-md">
                                                {selectedData.comment}
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>날짜를 선택하세요.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
