import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DataGrid } from "@mui/x-data-grid";
import tableData from "../components/data/table.json"; // JSON 파일 import
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import areas from "../components/data/area.json";
import dayjs from "dayjs";

export default function Menu1() {
    const [rows, setRows] = useState([]);
    const [openRows, setOpenRows] = useState({});

    useEffect(() => {
        setRows(
            tableData.data.map((item, index) => ({
                id: index + 1,
                date: item.date, // Date 객체로 변환
                elec_total: item.elec_total,
                region: item.region,
                subRegion: item.subRegion,
                temp: item.temp,
                rh: item.rh,
                elec_diff: item.elec_diff,
                days_diff: item.days_diff,
                sum: item.sum,
                comment: item.comment || [],
            }))
        );
    }, []);

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

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    const today = formatDate(new Date());

    const inRef = useRef();

    // 데이터 조회 BTN 수정
    const handleSearch = () => {
        const filteredRows = tableData.data
            .filter((item) => {
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                // 날짜 필터링: startDate가 없거나 데이터의 날짜가 시작 날짜 이후이거나 같고,
                // endDate가 없거나 데이터의 날짜가 종료 날짜 이전이거나 같을 때 true
                const dateRange =
                    (!startDate || itemDate >= start) &&
                    (!endDate || itemDate <= end);

                // 지역 필터링: 선택된 지역이 없거나, 데이터의 지역과 선택된 지역이 일치할 때 true
                const matchingArea =
                    !selectedArea || item.region === selectedArea;

                // 하위 지역 필터링: 선택된 하위 지역이 없거나, 데이터의 하위 지역과 선택된 하위 지역이 일치할 때 true
                const matchingSubArea =
                    !selectedSubArea || item.subRegion === selectedSubArea;

                // 키워드 검색 부분에서 undefined 체크 추가
                const keywordValue = inRef.current?.value.toLowerCase() || ""; // null 처리
                const matchingKeyword =
                    keywordValue === "" ||
                    Object.values(item).some(
                        (val) =>
                            val &&
                            val.toString().toLowerCase().includes(keywordValue)
                    );

                console.log("Matching Keyword:", matchingKeyword);

                return (
                    dateRange &&
                    matchingArea &&
                    matchingSubArea &&
                    matchingKeyword
                );
            })
            .map((item, index) => ({
                id: index + 1,
                date: item.date,
                elec_total: item.elec_total,
                region: item.region,
                subRegion: item.subRegion,
                temp: item.temp,
                rh: item.rh,
                elec_diff: item.elec_diff,
                days_diff: item.days_diff,
                sum: item.sum,
                comment: item.comment || [],
            }));
        setRows(filteredRows);
    };

    const toggleRow = (id) => {
        setOpenRows((prevOpenRows) => ({
            ...prevOpenRows,
            [id]: !prevOpenRows[id],
        }));
    };

    const columns = [
        { field: "id", headerName: "번호", width: 80 },
        {
            field: "date",
            headerName: "날짜",
            type: "date",            
            editable: true,
            valueFormatter: ({ value }) => {
                // 날짜 문자열을 Date 객체로 변환
                const date = new Date(value);
                if (isNaN(date)) return value; // 유효하지 않은 날짜는 그대로 반환
                const formatter = new Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
                return formatter.format(date);
            },
            flex: 1 
        },
        {
            field: "elec_total",
            headerName: "계량기 수치",
            type: "number",
            flex: 1 
        },
        { field: "region", headerName: "시도", flex: 1 },
        { field: "subRegion", headerName: "시군구", flex: 1 },
        { field: "temp", headerName: "기온", type: "number", flex: 1 },
        { field: "rh", headerName: "습도", type: "number", flex: 1 },
        {
            field: "elec_diff",
            headerName: "지난 수치 대비",
            type: "number",
            flex: 1             
        },
        { field: "sum", headerName: "합계", type: "number", flex: 1 },
        {
            field: "expand",
            headerName: "",
            width: 50,
            
            renderCell: (params) => (
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => toggleRow(params.row.id)}
                >
                    {openRows[params.row.id] ? (
                        <KeyboardArrowUpIcon />
                    ) : (
                        <KeyboardArrowDownIcon />
                    )}
                </IconButton>
            ),
        },
    ];

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <h1 className="text-xl font-semibold mb-4">마이페이지</h1>
            <div className="w-full h-14 md:px-4 flex pb-1 lg:pb-0 items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                <div className="flex items-center">
                    <InputBox
                        id="startDate"
                        type="date"
                        value={startDate}
                        handleChange={(e) => setStartDate(e.target.value)}
                        customClass=" mr-2"
                        labelText="날짜"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />
                    <div className="mr-2">~</div>
                    <InputBox
                        id="endDate"
                        type="date"
                        min={startDate}
                        max={today}
                        value={endDate}
                        handleChange={(e) => setEndDate(e.target.value)}
                        customClass="xl:mr-10 mr-4"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />
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
                        id="search"
                        ref={inRef}
                        labelText="검색"
                        initText="입력하세요"
                        customClass="xl:mr-10 mr-4"
                        labelClass="ml-0 mr-2 lg:mr-4"
                    />
                </div>
                <Btn
                    caption="조회"
                    customClass="bg-[#0473E9] text-white text-sm py-1 px-4 rounded"
                    handleClick={handleSearch}
                />
            </div>
            <Box sx={{ height: 600, width: "100%", marginTop: 2 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    disableSelectionOnClick
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>
            {Object.keys(openRows).map((rowId) => (
                <Collapse
                    key={rowId}
                    in={openRows[rowId]}
                    timeout="auto"
                    unmountOnExit
                >
                    <Box
                        sx={{
                            margin: 1,
                            borderRadius: "0.375rem",
                            padding: "8px",
                            border: "1px solid #cdcdcd",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            메모
                        </Typography>
                        <Box sx={{ height: 300, width: "100%" }}>
                            <DataGrid
                                rows={rows
                                    .find((row) => row.id === Number(rowId))
                                    .comment.map((comment, index) => ({
                                        id: index,
                                        content: comment.content,
                                    }))}
                                columns={[
                                    {
                                        field: "content",
                                        headerName: "메모 내용",
                                        width: 400,
                                    },
                                ]}
                                hideFooter
                                pageSize={5}
                            />
                        </Box>
                    </Box>
                </Collapse>
            ))}
        </div>
    );
}
