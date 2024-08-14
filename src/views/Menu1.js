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
import Checkbox from "@mui/material/Checkbox";

import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import { useAlert } from "../components/AlertContext";

import tableData from "../components/data/table.json"; // JSON 파일 import
import areas from "../components/data/area.json";

export default function Menu1() {
    const [rows, setRows] = useState([]);
    const [openRows, setOpenRows] = useState({}); // 각 행의 확장 상태를 저장하는 객체
    const [selectedRows, setSelectedRows] = useState(new Set()); // 선택된 행을 저장하는 Set
    const [errors, setErrors] = useState({}); // 필드 오류 상태
    const inputRefs = useRef({}); // Ref 저장용
    // 데이터 fetch
    const url = `http://192.168.0.144:8080/members/forum`;
    const [allData, setAllData] = useState([]); //패치된 데이터 저장

    // useEffect를 사용하여 컴포넌트가 마운트될 때 초기 데이터를 설정
    // 조회버튼을 누르지 않아도 초기에 전체 데이터 한번 렌더링 시키기
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token"); // 올바른 토큰 키 사용
            if (!token) {
                console.error("No token found");
                showAlert("토큰이 저장되지 않았습니다.", "error");
                return;
            }

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        // 'headers'로 수정
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, //토큰도 함께 가져오기
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                const initialRows = data.map((item, index) => ({
                    board_id: index + 1,
                    forum_id: item.forum_id,
                    date: item.date,
                    elec_total: `${item.elec_total} kW` || "",
                    region: item.city,
                    subRegion: item.region,
                    temp: item.max_temp,
                    rh: item.max_rh,
                    elec_diff: item.elec_diff,
                    days_dff: item.days_diff,
                    sum: item.sum,
                    comment: item.comment,
                }));

                setAllData(initialRows); // 전체 데이터 상태로 저장
                setRows(initialRows); // 초기 데이터 테이블에 렌더링
                console.log("initialRows", initialRows);
            } catch (error) {
                console.error("Fetch error:", error);
                showAlert("데이터를 가져오는 데 실패했습니다.", "error");
            }
        };

        fetchData();
    }, [url]); // url이 변경될 때만 새로 요청

    // 목업 파일
    // useEffect(() => {
    //     const initialRows = tableData.data.map((item, index) => ({
    //         forum_id: index + 1,
    //         date: item.date,
    //         elec_total: `${item.elec_total} kW` || "", // 단위 추가
    //         region: item.region,
    //         subRegion: item.subRegion,
    //         temp: item.temp,
    //         rh: item.rh,
    //         elec_diff: item.elec_diff,
    //         days_dff: item.days_diff,
    //         sum: item.sum,
    //         comment: item.comment || [], // 메모 데이터 포함
    //     }));
    //     // console.log("Initial rows data:", initialRows); // 데이터 확인
    //     setRows(initialRows);
    // }, []); // 빈 배열을 의존성으로 주어 컴포넌트가 처음 마운트될 때만 실행

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
        // console.log("Selected area:", selectedArea); // selectedArea 변수 사용
    };

    const handleSubAreaChange = (e) => {
        setSelectedSubArea(e.target.value);
        // console.log("Selected sub area:", e.target.value); // selectedSubArea 변수 사용
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

    //////////////////////////BTN EVENT////////////////////////
    //                       CRUD                            //
    // ////////////////////////////////////////////////////////
    // 조회 BTN 수정
    const handleSearch = () => {
        const filteredRows = tableData.data
            .filter((item) => {
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);

                // 날짜 필터링
                const dateRange =
                    (!startDate || itemDate >= start) &&
                    (!endDate || itemDate <= end);

                // 지역 필터링
                const matchingArea =
                    !selectedArea || item.region === selectedArea;

                // 하위 지역 필터링
                const matchingSubArea =
                    !selectedSubArea || item.subRegion === selectedSubArea;

                // 키워드 검색 부분에서 undefined 체크 추가
                const keywordValue = (inRef.current?.value || "").toLowerCase(); // null 처리
                const matchingKeyword =
                    keywordValue === "" ||
                    Object.values(item).some(
                        (val) =>
                            val != null && // undefined와 null 체크
                            val.toString().toLowerCase().includes(keywordValue)
                    );

                return (
                    dateRange &&
                    matchingArea &&
                    matchingSubArea &&
                    matchingKeyword
                );
            })
            .map((item, index) => ({
                board_id: index + 1,
                forum_id: item.forum_id,
                date: item.date,
                elec_total: item.elec_total ? `${item.elec_total} kW` : "", // unit 추가
                region: item.region,
                subRegion: item.subRegion,
                temp: item.temp,
                rh: item.rh,
                elec_diff: item.elec_diff ? `${item.elec_diff} kW` : "", // unit 추가
                days_dff: item.days_diff,
                sum: item.sum,
                comment: item.comment || [], // 메모 데이터 포함
            }));

        showAlert("조회되었습니다.", "success");
        setRows(filteredRows); // 필터링된 데이터를 상태로 설정하여 테이블에 표시
    };

    // row 추가 BTN
    const handleAdd = () => {
        const newId = rows.length + 1; // 새 행의 ID는 기존 행의 수 + 1
        const newRow = {
            forum_id: newId,
            date: "",
            elec_total: "",
            region: "",
            subRegion: "",
            temp: "",
            rh: "",
            elec_diff: "",
            days_dff: "",
            sum: "",
            comment: [], // 기본적으로 빈 배열로 초기화
        };

        // 새 행을 추가하고, 그 행의 ID를 selectedRows에 추가
        setRows((prevRows) => [...prevRows, newRow]);

        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            newSelectedRows.add(newId); // 새로 추가된 행의 체크박스 체크
            return newSelectedRows;
        });
    };

    // row 삭제 BTN
    // const [errorMessage, setErrorMessage] = useState(""); // ErrorAlert 컴포넌트에 사용할 상태
    const { showAlert } = useAlert(); // useAlert 훅 사용

    const handleDelete = async () => {
        // 삭제할건지 재확인
        const confirmed = window.confirm("정말로 삭제하시겠습니까?");

        if (confirmed) {
            try {
                // 선택된 행 ID들
                const idsToDelete = Array.from(selectedRows);
                // 서버에 삭제 요청
                const token = localStorage.getItem("token"); // 필요한 경우 토큰을 가져옴
                // 여러 ID에 대해 요청을 보내는 경우
                await Promise.all(
                    idsToDelete.map(async (id) => {
                        const response = await fetch(
                            `http://192.168.0.144:8080/members/forum/${id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`, // 토큰이 필요한 경우
                                },
                            }
                        );

                        if (!response.ok) {
                            throw new Error(
                                `삭제 오류 ${id}`
                            );
                        }
                    })
                );

                // 삭제 후 상태 업데이트
                setRows((prevRows) =>
                    prevRows.filter((row) => !selectedRows.has(row.forum_id))
                );
                setSelectedRows(new Set()); // 삭제 후 선택된 행을 초기화
                showAlert("삭제되었습니다.", "success");
            } catch (error) {
                console.error("Delete error:", error);
                showAlert("삭제 중 오류가 발생했습니다.", "error");
            }
        } else {
            showAlert("삭제가 취소되었습니다.", "info");
        }
    };

    // row 저장 BTN
    const handleSave = () => {
        const newErrors = {};

        rows.forEach((row) => {
            if (selectedRows.has(row.forum_id)) {
                if (!row.date) newErrors[`${row.forum_id}-date`] = true;
                if (!row.elec_total)
                    newErrors[`${row.forum_id}-elec_total`] = true;
                if (!row.region) newErrors[`${row.forum_id}-region`] = true;
                if (!row.subRegion)
                    newErrors[`${row.forum_id}-subRegion`] = true;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showAlert("모든 필수 값을 채워야 합니다.", "error");
            return;
        }

        // 저장 로직
        const updatedRows = rows.map((row) => {
            if (selectedRows.has(row.forum_id)) {
                return {
                    ...row,
                    // 데이터가 수정된 부분 업데이트
                };
            }
            return row;
        });

        showAlert("저장되었습니다.", "success");
        setRows(updatedRows); // 상태 업데이트
        setSelectedRows(new Set()); // 저장 후 선택된 행을 초기화
    };

    // 필드 포커싱
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // 첫 번째 에러 키 찾기
            const firstErrorKey = Object.keys(errors).find(
                (key) =>
                    key.includes("-date") ||
                    key.includes("-elec_total") ||
                    key.includes("-region") ||
                    key.includes("-subRegion")
            );
            if (firstErrorKey && inputRefs.current[firstErrorKey]) {
                // 포커스 맞추기
                inputRefs.current[firstErrorKey].focus();
            }
            console.log("errors", errors);
        }
    }, [errors]);

    //////////////////////////TABLE/////////////////////////////
    //                   체크박스  핸들러                       //
    // ////////////////////////////////////////////////////////

    // 체크박스 핸들러
    const handleSelectRow = (id) => {
        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(id)) {
                newSelectedRows.delete(id); // 이미 선택된 행은 선택 해제
            } else {
                newSelectedRows.add(id); // 선택되지 않은 행은 선택
            }
            console.log('newSelectedRows', Array.from(newSelectedRows));
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
    //                   셀 수정  핸들러                        //
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
                        // Comment가 객체 배열로 되어있으므로, idx를 활용하여 해당 인덱스의 content를 업데이트
                        return {
                            ...row,
                            comment: row.comment.map((comment, idx) =>
                                idx === commentIdx
                                    ? { ...comment, content: value }
                                    : comment
                            ),
                        };
                    } else if (field === "elecTotal") {
                        // elecTotal 업데이트
                        return {
                            ...row,
                            elec_total: value,
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

        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[`${id}-${field}`];
            return newErrors;
        });
    };
    const handleBlur = (id, field, value, unit) => {
        // kW 단위를 추가하는 로직을 포함한 handleBlur 함수 정의
        if (field === "elecTotal") {
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.forum_id === id
                        ? {
                              ...row,
                              elec_total: row.elec_total.endsWith(unit)
                                  ? row.elec_total
                                  : `${row.elec_total} ${unit}`,
                          }
                        : row
                )
            );
        }
    };
    return (
        <div className="w-full px-10  pb-10">
            <div className="w-full h-14 md:px-4 md:pr-0 flex pb-1 lg:pb-0  items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                <div className="flex items-center">
                    <InputBox
                        id="startDate"
                        type="date"
                        value={startDate}
                        max={today}
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
                <div>
                    <Btn
                        caption="조회"
                        customClass="bg-[#17458d] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm ml-1 px-1"
                        handleClick={handleSearch}
                    />
                    <Btn
                        caption="추가"
                        customClass="bg-[#17458d] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm ml-1 px-1"
                        handleClick={handleAdd}
                    />
                    <Btn
                        caption="삭제"
                        customClass="bg-[#17458d] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm ml-1 px-1"
                        handleClick={handleDelete}
                    />
                    <Btn
                        caption="저장"
                        customClass="bg-[#17458d] min-w-14 py-1 h-[30px] rounded-sm text-white text-sm ml-1 px-1"
                        handleClick={handleSave}
                    />
                </div>
            </div>
            <TableContainer
                style={{
                    marginTop: "20px",
                    border: "1px solid #CED2E2",
                    borderRadius: "0.375rem",
                }}
            >
                <Table aria-label="collapsible table">
                    <TableHead style={{ background: "#DEE0EA" }}>
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
                            <TableCell align="center">
                                {" "}
                                <span className="req">날짜</span>
                            </TableCell>
                            <TableCell align="center">
                                <span className="req">계량기 수치</span>
                            </TableCell>
                            <TableCell align="center">
                                <span className="req">시도</span>
                            </TableCell>
                            <TableCell align="center">
                                <span className="req">시군구</span>
                            </TableCell>
                            <TableCell align="center">기온</TableCell>
                            <TableCell align="center">습도</TableCell>
                            <TableCell align="center">지난 수치 대비</TableCell>
                            <TableCell align="center">합계</TableCell>
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
                                        {row.board_id}
                                    </TableCell>
                                    <TableCell align="center" itemType="date">
                                        <InputBox
                                            id={`date-${row.forum_id}`}
                                            type="datetime"
                                            max={today}
                                            value={row.date}
                                            handleChange={(e) => {
                                                handleChangeCell(
                                                    row.forum_id,
                                                    "date",
                                                    e.target.value
                                                );
                                            }}
                                            ref={(el) => {
                                                inputRefs.current[
                                                    `${row.forum_id}-date`
                                                ] = el;
                                            }}
                                            customClass=""
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <InputBox
                                            type="text"
                                            id={`elec_total-${row.forum_id}`} // 단일 id 사용
                                            key={`elec_total-${row.forum_id}`} // 단일 key 사용
                                            value={row.elec_total}
                                            unit="kW" // 단위 설정
                                            customClass="text-right"
                                            handleBlur={handleBlur}
                                            handleChange={(e) => {
                                                handleChangeCell(
                                                    row.forum_id,
                                                    "elec_total",
                                                    e.target.value
                                                );
                                            }}
                                            ref={(el) => {
                                                inputRefs.current[
                                                    `${row.forum_id}-elec_total`
                                                ] = el;
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <InputBox
                                            id={`region-${row.forum_id}`}
                                            type="dropDown"
                                            initText="선택"
                                            ops={areas.map((area) => area.name)}
                                            value={row.region}
                                            handleChange={(e) =>
                                                handleChangeCell(
                                                    row.forum_id,
                                                    "region",
                                                    e.target.value
                                                )
                                            }
                                            ref={(el) => {
                                                inputRefs.current[
                                                    `${row.forum_id}-region`
                                                ] = el;
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <InputBox
                                            id={`subRegion-${row.forum_id}`}
                                            type="dropDown"
                                            initText="선택"
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
                                            ref={(el) => {
                                                inputRefs.current[
                                                    `${row.forum_id}-subRegion`
                                                ] = el;
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className="text-red-600 font-bold">
                                            {row.temp}
                                        </span>

                                        {row.temp ? (
                                            <span className="ml-1 text-xs text-zinc-500">
                                                °C
                                            </span>
                                        ) : (
                                            <span className="ml-1 text-xs text-zinc-500">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className="text-sky-600 font-bold">
                                            {row.rh}
                                        </span>
                                        {row.rh ? (
                                            <span className="ml-1 text-xs text-zinc-500">
                                                %
                                            </span>
                                        ) : (
                                            <span className="ml-1 text-xs text-zinc-500">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <span className="text-green-600 font-bold">
                                            {row.elec_diff}
                                        </span>
                                        {row.days_dff ? (
                                            <span className="ml-1 text-zinc-500">
                                                ({row.days_dff}일 전 대비)
                                            </span>
                                        ) : (
                                            <span className="ml-1 text-xs text-zinc-500">
                                                -
                                            </span>
                                        )}
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
                                            <Box sx={{ margin: 1 }}>
                                                <div className="wrap">
                                                    {row.comment ? (
                                                        <InputBox
                                                            type="textArea"
                                                            id={`textarea-${row.forum_id}`}
                                                            key={`textarea-${row.forum_id}`}
                                                            placeholder="메모"
                                                            value={
                                                                row.comment ||
                                                                ""
                                                            }
                                                            handleChange={(e) =>
                                                                handleChangeCell(
                                                                    row.forum_id,
                                                                    "comment",
                                                                    {
                                                                        ...row.comment,
                                                                        content:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <InputBox
                                                            type="textArea"
                                                            id={`textarea-${row.forum_id}-0`} // id를 문자열 템플릿으로 수정
                                                            key={`${row.forum_id}-0`} // key를 문자열 템플릿으로 수정
                                                            placeholder="메모"
                                                            value="" // 빈 문자열로 초기화
                                                            handleChange={(e) =>
                                                                handleChangeCell(
                                                                    row.forum_id,
                                                                    "comment",
                                                                    {
                                                                        ...row.comment,
                                                                        content:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </div>
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
