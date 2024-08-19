import React, { useState, useEffect, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAlert } from "../components/AlertContext";
import areas from "../components/data/area.json";

// 날짜 포맷을 YYYY-MM-DD로 변환하는 함수
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
};

export default function Menu2() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
    const [value, setValue] = useState(new Date()); // 캘린더의 현재 값을 관리
    const [markedDates, setMarkedDates] = useState([]); // 마커 표시할 날짜들
    const [selectedDateData, setSelectedDateData] = useState(null); // 선택된 날짜의 데이터
    const [fetchData, setFetchData] = useState([]);
    const { showAlert } = useAlert();

    // 서버에서 날짜 데이터를 가져오는 함수
    const fetchCalendarData = async (monthStart, monthEnd) => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://192.168.0.144:8080/members/forum?start=${monthStart}&end=${monthEnd}`;

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
            console.log("data menu2", data);

            // 날짜와 관련된 데이터를 포함하는 객체 배열로 변환
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

            setFetchData(fetchData);
            setMarkedDates(fetchData); // 상태 업데이트
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };

    // 선택된 날짜의 상세 데이터를 가져오는 함수
    const fetchSelectedDateData = async (date) => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://192.168.0.144:8080/members/forum/fee?date=${formatDate(
                date
            )}`;

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
            setSelectedDateData({
                date: formatDate(date),
                // sum: data.sum,
                fee: data.fee,
                prev_sum: data.prev_sum,
                prev_fee: data.prev_fee,
            });
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };

    // 날짜가 마커된 날짜인지 확인하는 함수
    const isMarked = (date) => {
        const formattedDate = formatDate(date); // YYYY-MM-DD 형식으로 포맷팅
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
            setEndDate(""); // startDate가 없을 경우 endDate를 비웁니다.
        }
    }, [startDate]);

    const handleSearch = async () => {
        try {
            const start = new Date(startDate);
            const monthStart = formatDate(
                new Date(start.getFullYear(), start.getMonth(), 1)
            );
            const monthEnd = formatDate(
                new Date(start.getFullYear(), start.getMonth() + 1, 0)
            );

            await fetchCalendarData(monthStart, monthEnd); // 월 시작과 월 끝 날짜를 전달하여 데이터 로드

            // 캘린더의 월을 startDate의 월로 설정
            setValue(new Date(start.getFullYear(), start.getMonth(), 1)); // 캘린더를 startDate의 월로 설정
            showAlert("데이터가 정상적으로 로드되었습니다.", "success");
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };

    // 날짜를 선택했을 때 처리하는 함수
    const handleDateChange = (date) => {
        setValue(date);
        const formattedDate = formatDate(date);
        const selectedDate = fetchData.find((d) => d.date === formattedDate);

        if (selectedDate) {
            setSelectedDateData({
                date: formattedDate,
                sum: selectedDate.sum,
                fee: selectedDate.fee,
                prev_sum: selectedDate.prev_sum,
                prev_fee: selectedDate.prev_fee,
                min_temp: selectedDate.min_temp, // min_temp 값을 추가
                min_temp: selectedDate.min_temp,
                avg_temp: selectedDate.avg_temp,
                max_temp: selectedDate.max_temp,
                min_rh: selectedDate.min_rh,
                avg_rh: selectedDate.avg_rh,
                max_rh: selectedDate.max_rh,
                elec_diff: selectedDate.elec_diff,
                days_diff: selectedDate.days_diff,
                comment: selectedDate.comment || [],
            });
        } else {
            setSelectedDateData(null);
        }
    };
    // selectBox
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
        setSelectedSubArea(""); // 지역을 바꾸면 시, 군, 구 선택 초기화
        // console.log("Selected area:", selectedArea); // selectedArea 변수 사용
    };

    const handleSubAreaChange = (e) => {
        setSelectedSubArea(e.target.value);
        // console.log("Selected sub area:", e.target.value); // selectedSubArea 변수 사용
    };

    return (
        <div className="w-full px-10  pb-10">
            <div className="w-full h-14 md:px-4 md:pr-0 flex pb-1 lg:pb-0  items-end lg:items-center justify-between border-b border-[#CDD1E1]">
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
                        <InputBox
                            id="areaSelect"
                            type="dropDown"
                            initText="선택"
                            ops={areas.map((area) => area.name)}
                            handleChange={handleAreaChange}
                            customClass="xl:mr-10 mr-4 min-w-40"
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
                            customClass="xl:mr-10 mr-4 min-w-40"
                            selRef={subAreaSelectRef}
                            labelText="시군구"
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
            <div className="flex justify-end text-sm mt-5 text-blue-400">
                *주택용(저압) 기준 요금
            </div>
            <div className="lg:grid grid-cols-5 gap-4 calendarWrap overflow-y-auto">
                <div className="h-full col-span-2 p-3 bg-[#DEE0EA] rounded-md border border-[#CDD1E1]">
                    <div className="h-full w-full border border-[#CDD1E1] rounded-md ">
                        <Calendar
                            onChange={handleDateChange} // 날짜 선택 시 상태 업데이트
                            value={value}
                            minDetail="month" // '월' 단위만 보이도록 설정
                            maxDetail="month"
                            showNeighboringMonth={false} // 이전, 이후 달의 날짜는 보이지 않도록 설정
                            tileContent={({ date, view }) => {
                                if (view === "month") {
                                    const formattedDate = formatDate(date);
                                    const markedDate = isMarked(date);

                                    return markedDate ? (
                                        <div className="dateCell">
                                            <div className="marker"></div>
                                            <div className="markData">
                                                {markedDate.elec_diff}{" "}
                                                <span className="text-xs">
                                                    kWh
                                                </span>
                                            </div>
                                        </div>
                                    ) : null;
                                }
                                return null;
                            }} // 마커 표시
                        />
                    </div>
                </div>

                <div className="col-span-3">
                    <div className="bg-[#F2F5FE] rounded-md m-4 p-4">
                        {selectedDateData ? (
                            <div className="w-full">
                                <div className="flex justify-end font-bold">
                                    {selectedDateData.date}
                                </div>
                                <div className="pt-3">
                                    <span className="font-bold">최저기온:</span>
                                    {selectedDateData.min_temp}
                                </div>
                                <div className="pt-3">
                                    <span className="font-bold">최고기온:</span>
                                    {selectedDateData.max_temp}
                                </div>
                                <div className="pt-3">
                                    <span className="font-bold">
                                        누적 사용 전력량:
                                    </span>
                                    {selectedDateData.elec_diff} kWh
                                </div>
                                <div className="pt-3">
                                    <span className="font-bold">
                                        누적 요금:
                                    </span>
                                    {selectedDateData.fee} 원
                                </div>
                                <div className="pt-3">
                                    <span className="font-bold">
                                        지난달 사용량:
                                    </span>
                                    {selectedDateData.prev_sum} kWh
                                </div>
                                <div className="pt-3">
                                    <span className="font-bold">
                                        지난달 요금:
                                    </span>
                                    {selectedDateData.prev_fee} 원
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
