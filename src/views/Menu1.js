import React, { useState, useEffect, useRef } from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Checkbox,
    IconButton,
    Collapse,
    Box,
    Pagination,
    Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import InputBox from "../components/InputBox";
import Btn from "../components/Btn";
import { useAlert } from "../components/AlertContext";
import { useLoading } from "../components/LoadingContext";

import tableData from "../components/data/table.json"; // JSON 파일 import
import areas from "../components/data/area.json";

export default function Menu1() {
    const [rows, setRows] = useState([]);
    const [openRows, setOpenRows] = useState({}); // 각 행의 확장 상태를 저장하는 객체
    const [selectedRows, setSelectedRows] = useState(new Set()); // 선택된 행을 저장하는 Set
    const [errors, setErrors] = useState({}); // 필드 오류 상태
    const inputRefs = useRef({}); // Ref 저장용
    // 데이터 fetch
     // const baseUrl = 'http://192.168.0.144:8080/';
     const baseUrl = 'http://localhost:8080';
     const url =`${baseUrl}/members/forum`
    // const url = `http://192.168.0.144:8080/admin/forum`; admin/abcd 파라미터:username
    const [allData, setAllData] = useState([]); //패치된 데이터 저장
    const { setLoading } = useLoading(); // 로딩 컴포넌트
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // 초기 페이지당 행의 수

    // useEffect를 사용하여 컴포넌트가 마운트될 때 초기 데이터를 설정
    // 조회버튼을 누르지 않아도 초기에 전체 데이터 한번 렌더링 시키기
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                showAlert("토큰이 저장되지 않았습니다.", "error");
                return;
            }
            setLoading(true); // 로딩 시작
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, //토큰도 함께 가져오기
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                const extractDate = (dateString) => {
                    if (!dateString) return null;
                    const date = new Date(dateString);
                    // 날짜 문자열을 yyyy-mm-dd 형식으로 변환
                    return formatDate(date); // yyyy-mm-dd 형식으로 변환
                };
                console.log("dataaaaaa", data);
                const initialRows = data.map((item, index) => ({
                    board_id: index + 1,
                    forum_id: item.forum_id,
                    date: extractDate(item.date), // 날짜만 추출
                    elec_total: `${item.elec_total} kWh` || "",
                    city: item.city,
                    region: item.region,
                    min_temp: item.min_temp,
                    avg_temp: item.avg_temp,
                    max_temp: item.max_temp,
                    min_rh: item.min_rh,
                    avg_rh: item.avg_rh,
                    max_rh: item.max_rh,
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
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchData();
    }, [url]); // url이 변경될 때만 새로 요청

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
    // 조회 BTN
    const handleSearch = async () => {
        setLoading(true); // 조회 버튼 클릭 시 로딩 상태를 true로 설정
        try {
            const token = localStorage.getItem("token");
            const url = `${baseUrl}/members/forum`; // 데이터 가져올 API 엔드포인트

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    // 'headers'로 수정
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Fetch Error:", errorData);
                throw new Error(
                    `데이터 로드 오류: ${
                        errorData.message || response.statusText
                    }`
                );
            }

            const data = await response.json(); // 서버에서 가져온 데이터를 `data`로 저장
            const extractDate = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                // 날짜 문자열을 yyyy-mm-dd 형식으로 변환
                return formatDate(date); // yyyy-mm-dd 형식으로 변환
            };
            // 필터링 로직 적용
            const filteredRows = data
                .filter((item) => {
                    const itemDate = extractDate(item.date);
                    const start = extractDate(startDate);
                    const end = extractDate(endDate);

                    // 날짜 필터링
                    const dateRange =
                        (!startDate || itemDate >= start) &&
                        (!endDate || itemDate <= end);

                    // 지역 필터링
                    const matchingArea =
                        !selectedArea || item.city === selectedArea;

                    // 하위 지역 필터링
                    const matchingSubArea =
                        !selectedSubArea || item.region === selectedSubArea;

                    // 키워드 검색 부분에서 undefined 체크 추가
                    const keywordValue = (
                        inRef.current?.value || ""
                    ).toLowerCase(); // null 처리
                    const matchingKeyword =
                        keywordValue === "" ||
                        Object.values(item).some(
                            (val) =>
                                val != null && // undefined와 null 체크
                                val
                                    .toString()
                                    .toLowerCase()
                                    .includes(keywordValue)
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
                    date: extractDate(item.date),
                    elec_total: item.elec_total ? `${item.elec_total} kWh` : "", // unit 추가
                    city: item.city,
                    region: item.region,
                    min_temp: item.min_temp,
                    avg_temp: item.avg_temp,
                    max_temp: item.max_temp,
                    min_rh: item.min_rh,
                    avg_rh: item.avg_rh,
                    max_rh: item.max_rh,
                    elec_diff: item.elec_diff ? `${item.elec_diff} kWh` : "", // unit 추가
                    days_diff: item.days_diff,
                    sum: item.sum,
                    comment: item.comment || [], // 메모 데이터 포함
                }));

            showAlert("조회되었습니다.", "success");
            setRows(filteredRows); // 필터링된 데이터를 상태로 설정하여 테이블에 표시
        } catch (error) {
            console.error("Data fetch error:", error);
            showAlert("데이터 로드 중 오류가 발생했습니다.", "error");
        } finally {
            setLoading(false); // 데이터 로드가 완료되면 로딩 상태를 false로 설정
        }
    };

    // row 추가 BTN
    const handleAdd = async () => {
        const newId = rows.length + 10; // 임시 ID (서버에서 생성된 ID아님)
        const newRow = {
            forum_id: newId, // 임시 ID로 시작
            date: "",
            elec_total: "",
            city: "",
            region: "",
            comment: "", // 기본적으로 빈 배열로 초기화
        };

        // 새 행을 기존의 rows 배열 앞에 추가하여 첫 줄에 생성되도록 함
        setRows((prevRows) => [newRow, ...prevRows]);

        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            newSelectedRows.add(newId); // 새로 추가된 행의 체크박스 체크
            return newSelectedRows;
        });
    };

    // row 삭제 BTN
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
                            `${baseUrl}/members/forum/${id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`, // 토큰이 필요한 경우
                                },
                            }
                        );

                        if (!response.ok) {
                            throw new Error(`삭제 오류 ${id}`);
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
    const handleSave = async () => {
        const newErrors = {};

        // 유효성 검사
        rows.forEach((row) => {
            if (selectedRows.has(row.forum_id)) {
                if (!row.date) newErrors[`${row.forum_id}-date`] = true;
                if (!row.elec_total || isNaN(parseFloat(row.elec_total))) {
                    newErrors[`${row.forum_id}-elec_total`] = true;
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showAlert("모든 필수 값을 채워야 합니다.", "error");
            return;
        }

        // 숫자 추출 함수
        const extractNumber = (str) => {
            const match = str.match(/\d+(\.\d+)?/); // 정규 표현식으로 숫자 추출
            return match ? parseFloat(match[0]) : null;
        };

        // 저장 로직
        try {
            const token = localStorage.getItem("token");
            const url = `${baseUrl}/members/forum`;

            const requestBody = rows
                .filter((row) => selectedRows.has(row.forum_id))
                .map((row) => {
                    // elec_total에서 숫자만 추출
                    const elecTotal = extractNumber(row.elec_total);

                    return {
                        forum_id: row.forum_id || null,
                        date: row.date || "",
                        elec_total: elecTotal !== null ? elecTotal : "", // 유효한 숫자인 경우만 설정
                        city: row.city || "",
                        region: row.region || "",
                        comment: row.comment || "",
                    };
                });

            // 요청 본문 및 헤더 로그
            console.log("Request URL:", url);
            console.log("Request Headers:", {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            });
            console.log("Request Body:", JSON.stringify(requestBody));

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody), // 배열 형태로 전송
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Response Error:", errorData);
                throw new Error(
                    `업데이트 오류: ${errorData.message || response.statusText}`
                );
            }

            const data = await response.json();
            // 응답 데이터가 객체(HashMap) 형태로 온다
            if (typeof data === "object" && data !== null) {
                const updatedRows = rows.map((row) => {
                    // forum_id를 키로 사용해 data에서 해당 row 찾기
                    const updatedRow = data[row.forum_id];
                    return updatedRow ? updatedRow : row;
                });

                showAlert("저장되었습니다.", "success");
                setRows(updatedRows); // 상태 업데이트
                setSelectedRows(new Set()); // 저장 후 선택된 행을 초기화
            } else {
                console.error("Unexpected response format:", data);
                showAlert("서버 응답 형식이 예상과 다릅니다.", "error");
            }
        } catch (error) {
            console.error("Save error:", error);
            showAlert("저장 중 오류가 발생했습니다.", "error");
        } finally {
            handleSearch();
        }
    };

    // 필드 포커싱
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // 첫 번째 에러 키 찾기
            const firstErrorKey = Object.keys(errors).find(
                (key) =>
                    key.includes("-date") ||
                    key.includes("-elec_total") ||
                    key.includes("-city") ||
                    key.includes("-region")
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
            console.log("newSelectedRows", Array.from(newSelectedRows));
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

    const handleChangeCell = (id, field, value, commentKey = null) => {
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.forum_id === id) {
                    if (field === "comment" && commentKey) {
                        // `comment`가 객체일 때 특정 필드를 업데이트
                        return {
                            ...row,
                            comment: {
                                ...row.comment,
                                [commentKey]: value, // 특정 필드를 업데이트
                            },
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
        // kWh 단위를 추가하는 로직을 포함한 handleBlur 함수 정의
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

    ////////////////////////////////////////////////////////////
    //               페이지네이션                               //
    ////////////////////////////////////////////////////////////
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setCurrentPage(1); // 페이지 수가 변경되면 첫 페이지로 이동
    };
    // 현재 페이지에 맞는 데이터를 필터링
    const paginatedRows = rows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="w-full flex flex-col justify-between h-full px-10 pb-10">
            <div>
                <div className="w-full h-14 md:px-4 md:pr-0 flex pb-1 lg:pb-0  items-end lg:items-center justify-between border-b border-[#CDD1E1]">
                    <div className="flex items-center">
                        <InputBox
                            id="startDate"
                            type="date"
                            value={startDate}
                            max={today}
                            handleChange={(e) => setStartDate(e.target.value)}
                            customClass="min-w-40 mr-2"
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
                            customClass="xl:mr-10 mr-4 min-w-40"
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
                        <InputBox
                            id="search"
                            ref={inRef}
                            labelText="검색"
                            initText="입력하세요"
                            customClass="xl:mr-10 mr-4 min-w-40"
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
                                                            (row) =>
                                                                row.forum_id
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
                                <TableCell align="center">시도</TableCell>
                                <TableCell align="center">시군구</TableCell>
                                <TableCell align="center">평균기온</TableCell>
                                <TableCell align="center">평균습도</TableCell>
                                <TableCell align="center">
                                    전력 사용량
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRows.map((row) => (
                                <React.Fragment key={row.forum_id}>
                                    <TableRow
                                        style={{
                                            borderTop: "1px solid #e4e4e4",
                                        }}
                                    >
                                        <TableCell style={{ width: "50px" }}>
                                            <Checkbox
                                                checked={selectedRows.has(
                                                    row.forum_id
                                                )}
                                                onChange={() =>
                                                    handleSelectRow(
                                                        row.forum_id
                                                    )
                                                }
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.board_id}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            itemType="date"
                                        >
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
                                                ref={(el) => {
                                                    inputRefs.current[
                                                        `${row.forum_id}-date`
                                                    ] = el;
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <InputBox
                                                type="text"
                                                id={`elec_total-${row.forum_id}`} // 단일 id 사용
                                                key={`elec_total-${row.forum_id}`} // 단일 key 사용
                                                value={row.elec_total}
                                                unit="kWh" // 단위 설정
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
                                                id={`city-${row.forum_id}`}
                                                type="dropDown"
                                                initText="선택"
                                                ops={areas.map(
                                                    (area) => area.name
                                                )}
                                                value={row.city}
                                                handleChange={(e) =>
                                                    handleChangeCell(
                                                        row.forum_id,
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                ref={(el) => {
                                                    inputRefs.current[
                                                        `${row.forum_id}-city`
                                                    ] = el;
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <InputBox
                                                id={`region-${row.forum_id}`}
                                                type="dropDown"
                                                initText="선택"
                                                ops={
                                                    areas.find(
                                                        (area) =>
                                                            area.name ===
                                                            row.city
                                                    )?.subArea || []
                                                }
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
                                            <span className="text-[#ff5252] font-bold">
                                                {row.avg_temp}
                                            </span>

                                            {row.avg_temp ? (
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
                                            <span className="text-[#0058ff] font-bold">
                                                {row.avg_rh}
                                            </span>
                                            {row.avg_rh ? (
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
                                            colSpan={14}
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
                                                        <InputBox
                                                            type="textArea"
                                                            id={`textarea-${row.forum_id}`}
                                                            key={`textarea-${row.forum_id}`}
                                                            placeholder="메모"
                                                            value={
                                                                row.comment
                                                                    ?.content ||
                                                                ""
                                                            } // comment 객체가 있으면 content 필드를 사용하고, 없으면 빈 문자열
                                                            handleChange={(
                                                                e
                                                            ) => {
                                                                const newContent =
                                                                    e.target
                                                                        .value;
                                                                handleChangeCell(
                                                                    row.forum_id,
                                                                    "comment",
                                                                    {
                                                                        ...row.comment,
                                                                        content:
                                                                            newContent,
                                                                    }
                                                                );
                                                            }}
                                                        />
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
            <div className="flex w-full items-center relative">
                <InputBox
                    id="rowPage"
                    type="dropDown"
                    value={rowsPerPage}
                    ops={[5, 10, 15, 20]}
                    handleChange={handleRowsPerPageChange}
                    customClass="xl:mr-10 mr-4 min-w-40"
                    initText="선택하세요" // 기본 선택 옵션 텍스트 설정
                />
                {/* 페이지네이션 컴포넌트 */}
                <Stack
                    spacing={2}
                    className="flex items-center absolute left-1/2 -translate-x-1/2"
                >
                    <Pagination
                        count={Math.ceil(rows.length / rowsPerPage)} // 전체 페이지 수 계산
                        page={currentPage} // 현재 페이지 설정
                        onChange={handlePageChange} // 페이지 변경 핸들러
                        variant="outlined"
                        color="primary"
                        shape="rounded"
                    />
                </Stack>
            </div>
        </div>
    );
}
