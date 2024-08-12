import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import tableData from "../components/data/table.json"; // JSON 파일 import
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import areas from "../components/data/area.json";

export default function Menu1() {
    const [rows, setRows] = useState([]);
    const [openRows, setOpenRows] = useState({}); // 각 행의 확장 상태를 저장하는 객체
    const [selectedRows, setSelectedRows] = useState(new Set()); // 선택된 행을 저장하는 Set

    // useEffect를 사용하여 컴포넌트가 마운트될 때 초기 데이터를 설정
    // 조회버튼을 누르지 않아도 초기에 전체 데이터 한번 렌더링 시키기
    useEffect(() => {
        const initialRows = tableData.data.map((item, index) => ({
            forum_id: index + 1,
            date: item.date,
            elec_total: item.elec_total,
            region: item.region,
            subRegion: item.subRegion,
            temp: item.temp,
            rh: item.rh,
            elec_diff: item.elec_diff,
            days_dff: item.days_diff,
            sum: item.sum,
            comment: item.comment || [], // 메모 데이터 포함
        }));
        console.log("Initial rows data:", initialRows); // 데이터 확인
        setRows(initialRows);
    }, []); // 빈 배열을 의존성으로 주어 컴포넌트가 처음 마운트될 때만 실행

    ////////////////////////////////////////////////////////////
    //               조회조건                                  //
    ////////////////////////////////////////////////////////////
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
        console.log("Selected area:", selectedArea); // selectedArea 변수 사용
    };

    const handleSubAreaChange = (e) => {
        setSelectedSubArea(e.target.value);
        console.log("Selected sub area:", e.target.value); // selectedSubArea 변수 사용
    };

    // dateBox
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // YYYY-MM-DD 형식으로 날짜 포맷팅
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    const today = formatDate(new Date());

    // 키워드 입력
    const inRef = useRef();

    // 조회 BTN 수정
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
                forum_id: index + 1,
                date: item.date,
                elec_total: item.elec_total,
                region: item.region,
                subRegion: item.subRegion,
                temp: item.temp,
                rh: item.rh,
                elec_diff: item.elec_diff,
                days_dff: item.days_diff,
                sum: item.sum,
                comment: item.comment || [], // 메모 데이터 포함
            }));
        setRows(filteredRows); // 필터링된 데이터를 상태로 설정하여 테이블에 표시
    };

     // 조회 BTN 수정
     const handleAdd = () => {

     }

    //////////////////////////TABLE/////////////////////////////
    // 체크박스 전체 선택 핸들러                                  //
    ////////////////////////////////////////////////////////////
    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            setSelectedRows(new Set(rows.map((row) => row.forum_id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    // 체크박스 핸들러
    const handleSelectRow = (id) => {
        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(id)) {
                newSelectedRows.delete(id);
            } else {
                newSelectedRows.add(id);
            }
            return newSelectedRows;
        });
    };

    // expand btn
    const toggleRow = (id) => {
        setOpenRows((prevOpenRows) => ({
            ...prevOpenRows,
            [id]: !prevOpenRows[id],
        }));
    };

    //////////////////////////TABLE/////////////////////////////
    // 셀 수정          핸들러                                  //
    ////////////////////////////////////////////////////////////

    const handleChangeCell = (id, field, value, commentIdx = null) => {
        // setRows((prevRows) =>
        //     prevRows.map((row) =>
        //         row.forum_id === id ? { ...row, [field]: value } : row
        //     )
        // );

        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.forum_id === id) {
                    if (field === "comment") {
                        // 메모 업데이트
                        return {
                            ...row,
                            comment: row.comment.map((comment, idx) =>
                                idx === commentIdx
                                    ? { ...comment, content: value }
                                    : comment
                            ),
                        };
                    } else {
                        // 다른 필드 업데이트
                        return { ...row, [field]: value };
                    }
                }
                return row;
            })
        );

        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            newSelectedRows.add(id); //해당 행의 체크박스 활성화
            return newSelectedRows;
        });
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <h1>마이페이지</h1>
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
                    customClass="bg-[#0473E9] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm mx-1 px-1"
                    handleClick={handleSearch}
                />
            </div>
            <TableContainer
                style={{
                    marginTop: "20px",
                    border: "1px solid #CED2E2",
                    borderRadius: "0.375rem",
                }}
            >
                <Table aria-label="collapsible table">
                    <TableHead style={{ background: "#dfe6fb" }}>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    indeterminate={
                                        selectedRows.size > 0 &&
                                        selectedRows.size < rows.length
                                    }
                                    checked={
                                        rows.length > 0 &&
                                        selectedRows.size === rows.length
                                    }
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRows(
                                                new Set(
                                                    rows.map(
                                                        (row) => row.forum_id
                                                    )
                                                )
                                            );
                                        } else {
                                            setSelectedRows(new Set());
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">번호</TableCell>
                            <TableCell align="center">날짜</TableCell>
                            <TableCell align="right">계량기 수치</TableCell>
                            <TableCell align="center">시도</TableCell>
                            <TableCell align="center">시군구</TableCell>
                            <TableCell align="center">기온</TableCell>
                            <TableCell align="center">습도</TableCell>
                            <TableCell align="right">지난 수치 대비</TableCell>
                            <TableCell align="right">합계</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <React.Fragment key={row.forum_id}>
                                <TableRow
                                    style={{ borderTop: "1px solid #e4e4e4" }}
                                >
                                    <TableCell style={{ width: "50px" }}>
                                        <Checkbox
                                            checked={selectedRows.has(
                                                row.forum_id
                                            )}
                                            onChange={() =>
                                                handleSelectRow(row.forum_id)
                                            }
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        {row.forum_id}
                                    </TableCell>
                                    <TableCell align="center" itemType="date">
                                        <InputBox
                                            id={`date-${row.forum_id}`}
                                            type="date"
                                            max={today}
                                            value={row.date}
                                            handleChange={(e) => {
                                                handleChangeCell(
                                                    row.forum_id,
                                                    "date",
                                                    e.target.value
                                                );
                                            }}
                                            customClass=""
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.elec_total}
                                    </TableCell>
                                    <TableCell align="center">
                                        <InputBox
                                            id={`region-${row.forum_id}`}
                                            type="dropDown"
                                            ops={areas.map((area) => area.name)}
                                            value={row.region}
                                            handleChange={(e) =>
                                                handleChangeCell(
                                                    row.forum_id,
                                                    "region",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <InputBox
                                            id={`subRegion-${row.forum_id}`}
                                            type="dropDown"
                                            ops={
                                                areas.find(
                                                    (area) =>
                                                        area.name === row.region
                                                )?.subArea || []
                                            }
                                            value={row.subRegion}
                                            handleChange={(e) =>
                                                handleChangeCell(
                                                    row.forum_id,
                                                    "subRegion",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.temp}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.rh}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.elec_diff}
                                        <span>{row.days_dff}</span>
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.sum}
                                    </TableCell>
                                    <TableCell style={{ width: "50px" }}>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() =>
                                                toggleRow(row.forum_id)
                                            }
                                        >
                                            {openRows[row.forum_id] ? (
                                                <KeyboardArrowUpIcon />
                                            ) : (
                                                <KeyboardArrowDownIcon />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        style={{
                                            paddingBottom: openRows[
                                                row.forum_id
                                            ]
                                                ? 20
                                                : 0,
                                            paddingTop: 0,
                                            paddingRight: 5,
                                            paddingLeft: 50,
                                        }}
                                    >
                                        <Collapse
                                            in={openRows[row.forum_id]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box
                                                sx={{ margin: 1 }}
                                            >
                                                {row.comment.map(
                                                    (commentRow, idx) => (
                                                        <div class="wrap">
                                                        <InputBox
                                                            type= "textArea"
                                                            id={`textarea-${row.forum_id}-${idx}`}
                                                            key={idx}
                                                            placeholder="메모"
                                                            value={
                                                                commentRow.content
                                                            }
                                                            handleChange={(e) =>
                                                                handleChangeCell(
                                                                    row.forum_id,
                                                                    "comment",
                                                                    e.target
                                                                        .value,
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                        </div>
                                                    )
                                                )}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
