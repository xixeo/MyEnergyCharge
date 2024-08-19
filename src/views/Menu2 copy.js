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
    const [rows, setRows] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
    const [value, setValue] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]); // 마커 표시할 날짜들
    const { showAlert } = useAlert();

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
            console.log("data menu2", data);
            // 날짜와 elec_total을 포함하는 객체 배열로 변환
            const datesWithTotals = data.map((item) => ({
                date: formatDate(new Date(item.date)),
                elec_total: item.elec_total,
            }));

            setMarkedDates(datesWithTotals); // 상태 업데이트
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        }
    };

    useEffect(() => {
        fetchCalendarData(); // 컴포넌트 마운트 시 데이터 가져오기
    }, []);

    // 날짜가 마커된 날짜인지 확인하는 함수
    const isMarked = (date) => {
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 포맷팅
        return markedDates.includes(formattedDate); // 해당 날짜가 markedDates에 있는지 확인
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
            const token = localStorage.getItem("token");
            const url = `http://192.168.0.144:8080/members/forum/fee?date=${startDate}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `데이터 로드 오류: ${
                        errorData.message || response.statusText
                    }`
                );
            }

            const data = await response.json();
            const formattedRows = [
                {
                    board_id: 1,
                    fee: data.fee?.toLocaleString() || "",
                    sum: data.sum?.toLocaleString() || "",
                    prev_sum: data.prev_sum?.toLocaleString() || "",
                    prev_fee: data.prev_fee?.toLocaleString() || "",
                },
            ];

            setRows(formattedRows);
            showAlert("조회되었습니다.", "success");
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
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
    };

    const handleSubAreaChange = (e) => {
        setSelectedSubArea(e.target.value);
    };

    return (
        <div className="w-full px-10 pb-10">
            <div className="w-full h-14 md:px-4 md:pr-0 flex pb-1 lg:pb-0 items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                <div className="flex items-center">
                    <InputBox
                        id="startDate"
                        type="date"
                        value={startDate}
                        max={today}
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
            <div className="flex justify-end text-sm mt-5 text-blue-400">
                *주택용(저압) 기준 요금
            </div>
            {/* <TableContainer
                style={{
                    marginTop: "0px",
                    border: "1px solid #CED2E2",
                    borderRadius: "0.375rem",
                }}
            >
                <Table aria-label="collapsible table">
                    <TableHead style={{ background: "#DEE0EA" }}>
                        <TableRow>
                            <TableCell align="center">조회기간</TableCell>
                            <TableCell align="center">총 사용량</TableCell>
                            <TableCell align="center">요금 </TableCell>
                            <TableCell align="center">지난달 사용량</TableCell>
                            <TableCell align="center">지난달 요금</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.board_id}
                                style={{ borderTop: "1px solid #e4e4e4" }}
                            >                             
                                <TableCell align="center">
                                    {startDate} ~ {endDate}
                                </TableCell>
                                <TableCell align="center">
                                    {row.sum} <span>kWh</span>
                                </TableCell>
                                <TableCell align="center">
                                    {row.fee} <span>원</span>
                                </TableCell>
                                <TableCell align="center">
                                    {row.prev_sum} <span>kWh</span>
                                </TableCell>
                                <TableCell align="center">
                                    {row.prev_fee} <span>원</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            <div className="lg:grid grid-cols-5 gap-4 calendarWrap overflow-y-auto">
                <div className="h-full col-span-2 p-3 bg-[#DEE0EA] rounded-md border border-[#CDD1E1]">
                    <Calendar
                        onChange={setValue} // 날짜 선택 시 상태 업데이트
                        value={value}
                        minDetail="month" // '월' 단위만 보이도록 설정
                        maxDetail="month"
                        showNeighboringMonth={false} // 이전, 이후 달의 날짜는 보이지 않도록 설정
                        tileContent={({ date, view }) => {
                            if (view === "month") {
                                const formattedDate = formatDate(date);
                                const markedDate = markedDates.find(
                                    (d) => d.date === formattedDate
                                );

                                return markedDate ? (
                                    <>
                                        <div className="marker"></div>
                                        <div className="text-[#222]">
                                            {markedDate.elec_total} <span className="text-xs">kWh</span>
                                            {/* elec_total 표시 */}
                                        </div>
                                    </>
                                ) : null;
                            }
                            return null;
                        }} // 마커 표시
                    />
                </div>

                <div className="col-span-3">
                  차아트
                </div>
            </div>
        </div>
    );
}
