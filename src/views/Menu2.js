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
import { useLoading } from "../components/LoadingContext";
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
            const url = `http://192.168.0.144:8080/members/forum`;

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

            setFetchData(fetchData);
            setMarkedDates(fetchData); // 상태 업데이트
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };

    // 선택된 날짜의 상세 데이터를 가져오는 함수
    const fetchSelectedData = async (date) => {
        try {
            const token = localStorage.getItem("token");
            const formattedDate = formatDate(date);

            const calendarData = fetchData.find(
                (d) => d.date === formattedDate
            );

            if (!calendarData) {
                throw new Error("해당 날짜의 데이터를 찾을 수 없습니다.");
            }

            const url = `http://192.168.0.144:8080/members/forum/fee?date=${formattedDate}`;

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

            const feeData = await response.json();

            setSelectedData({
                date: formattedDate,
                fee: feeData.fee,
                prev_sum: feeData.prev_sum,
                prev_fee: feeData.prev_fee,
                prev_price_avg: feeData.prev_price_avg,
                price_avg: feeData.price_avg,
                min_temp: calendarData.min_temp,
                avg_temp: calendarData.avg_temp,
                max_temp: calendarData.max_temp,
                min_rh: calendarData.min_rh,
                avg_rh: calendarData.avg_rh,
                max_rh: calendarData.max_rh,
                elec_diff: calendarData.elec_diff,
                days_diff: calendarData.days_diff,
                sum: calendarData.sum,
                comment: calendarData.comment,
            });
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
                await fetchSelectedData(selectedDate); // 선택된 날짜의 데이터 가져오기
            }

            showAlert("데이터가 정상적으로 로드되었습니다.", "success");
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async (date) => {
        setCalendarDate(date);
        await fetchSelectedData(date);
    };

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
        setSelectedSubArea(e.target.value);
    };

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
            <div className="lg:grid grid-cols-4 gap-4 calendarWrap overflow-y-auto">
                <div className="h-full col-span-2 p-3 bg-[#DEE0EA] rounded-md border border-[#CDD1E1]">
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
                                            {markedDate.comment != "" ?(
                                            <div className="markData pt-2 pl-1 text-left">
                                                <div className="markerMemo" />
                                                메모
                                            </div>):("")}
                                        </div>
                                    ) : null;
                                }
                                return null;
                            }}
                        />
                    </div>
                </div>

                <div className="h-full col-span-2">
                    <div className="rounded-md my-0 p-4 border border-[#CDD1E1]">
                        {selectedData ? (
                            <div className="w-full">
                                <div className="pt-3 flex">
                                    <div>
                                        <span className="font-bold  ml-2 mr-4 text-sm">
                                            최저기온:
                                        </span>
                                        <span className="text-[#ff8f00] font-bold">
                                            {selectedData.min_temp}
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-500">
                                            °C
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            평균기온:
                                        </span>
                                        <span className="text-[#ff4900] font-bold">
                                            {selectedData.avg_temp}
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-500">
                                            °C
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            최고기온:
                                        </span>
                                        <span className="text-[#FF0000] font-bold">
                                            {selectedData.max_temp}
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-500">
                                            °C
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 flex">
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            최저습도:
                                        </span>
                                        <span className="text-[#00a9ff] font-bold">
                                            {selectedData.min_rh}%
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-500">
                                            %
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            평균습도:
                                        </span>
                                        <span className="text-[#0058ff] font-bold">
                                            {selectedData.avg_rh}
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-500">
                                            %
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            최고습도:
                                        </span>
                                        <span className="text-[#0006ff] font-bold">
                                            {selectedData.max_rh}
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-500">
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 flex">
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            사용 전력량:
                                        </span>
                                        {selectedData.elec_diff.toLocaleString()}{" "}
                                        kWh
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            누적 요금:
                                        </span>
                                        {selectedData.fee.toLocaleString()} 원
                                    </div>
                                </div>
                                <div className="pt-3 flex">
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            지난달 사용량:
                                        </span>
                                        {selectedData.prev_sum.toLocaleString()}{" "}
                                        kWh
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            지난달 요금:
                                        </span>
                                        {selectedData.prev_fee.toLocaleString()}{" "}
                                        원
                                    </div>
                                </div>
                                <div className="pt-3 flex">
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                            해당 지역 지난달 가구별 평균 요금:
                                        </span>
                                        {selectedData.prev_price_avg}{" "}
                                        kWh
                                    </div>
                                    <div>
                                        <span className="font-bold ml-2 mr-4 text-sm">
                                        해당 지역 이번달 가구별 평균 요금:
                                        </span>
                                        {selectedData.price_avg}{" "}
                                        원
                                    </div>
                                </div>
                                {selectedData.comment != "" ? (
                                    <div className="p-3 flex bg-[#F2F5FE] rounded-md">
                                        {selectedData.comment}
                                    </div>
                                ) : (
                                    ""
                                )}
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
