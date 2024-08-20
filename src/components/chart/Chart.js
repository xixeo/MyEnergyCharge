import React, { useState, useEffect } from "react";
import ECharts from "echarts-for-react";
import * as echarts from "echarts";
import GroupBtn from "../GroupBtn";

export default function Chart({
    area: propArea,
    subArea: propSubArea,
    selectedDate: propSelectedDate,
}) {
    const [rowData, setRowData] = useState([]);
    const [interval, setInterval] = useState("day");
    const [startDate, setStartDate] = useState(new Date()); // 기본값: 오늘 날짜
    const [endDate, setEndDate] = useState(new Date());
    const [xdata, setXData] = useState([]);
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    const [area, setArea] = useState(propArea);
    const [subArea, setSubArea] = useState(propSubArea);
    const [selectedDate, setSelectedDate] = useState(propSelectedDate);

    // useEffect 훅을 사용해 props가 변경될 때 상태를 업데이트
    useEffect(() => {
        if (propArea) setArea(propArea);
        if (propSubArea) setSubArea(propSubArea);
        if (propSelectedDate) setSelectedDate(propSelectedDate);
    }, [propArea, propSubArea, propSelectedDate]);

    // 조회버튼 누를 때 interval을 "day"로 default 설정
    useEffect(() => {
        if (propArea || propSubArea || propSelectedDate) {
            setInterval("day");
        }
    }, [propArea, propSubArea, propSelectedDate]);

    // 상태가 업데이트될 때 데이터를 가져옴
    useEffect(() => {
        if (selectedDate && area && subArea) {
            const url = `http://192.168.0.144:8080/electricity?date=${selectedDate}&city=${area}&county=${subArea}`;
            getFetchData(url);
        }
    }, [selectedDate, area, subArea]);

    const getFetchData = (url) => {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data);
                if (Array.isArray(data)) {
                    setRowData(data);
                } else {
                    setRowData([data]);
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    };

    const transformChartData = (rowData, dates) => {
        const filteredData = rowData.filter((item) =>
            dates.includes(item.date)
        );

        const elecData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.elec_avg : 0;
        });
        const maxTempData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.max_temp : 0;
        });
        const minTempData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.min_temp : 0;
        });
        const avgTempData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.avg_temp : 0;
        });
        const maxRhData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.max_rh : 0;
        });
        const minRhData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.min_rh : 0;
        });
        const avgRhData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.avg_rh : 0;
        });

        return {
            series: [
                {
                    name: "전력량",
                    type: "bar",
                    showBackground: true,
                    barWidth: 20,
                    data: elecData,
                    yAxisIndex: 0,
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "#43DCCF" },
                            { offset: 1, color: "#B0FFFF" },
                        ]),
                    },
                },
                {
                    name: "최고기온",
                    type: "line",
                    smooth: true,
                    data: maxTempData,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#FF0000",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
                {
                    name: "평균기온",
                    type: "line",
                    smooth: true,
                    data: avgTempData,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#ff4900",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
                {
                    name: "최저기온",
                    type: "line",
                    smooth: true,
                    data: minTempData,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#ff8f00",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
                {
                    name: "최고습도",
                    type: "line",
                    smooth: true,
                    data: maxRhData,
                    yAxisIndex: 2,
                    itemStyle: {
                        color: "#0006ff",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
                {
                    name: "평균습도",
                    type: "line",
                    smooth: true,
                    data: avgRhData,
                    yAxisIndex: 2,
                    itemStyle: {
                        color: "#0058ff",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
                {
                    name: "최저습도",
                    type: "line",
                    smooth: true,
                    data: minRhData,
                    yAxisIndex: 2,
                    itemStyle: {
                        color: "#00a9ff",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
            ],
        };
    };

    const generateDates = (start, end, interval) => {
        const dates = [];
        const current = new Date(start);

        if (interval === "day") {
            dates.push(current.toISOString().split("T")[0]);
        } else if (interval === "week") {
            while (current <= end) {
                dates.push(current.toISOString().split("T")[0]);
                current.setDate(current.getDate() + 1);
            }
        } else if (interval === "month") {
            let tempDate = new Date(start);
            while (tempDate <= end) {
                dates.push(tempDate.toISOString().split("T")[0]);
                tempDate.setDate(tempDate.getDate() + 1);
            }
        }

        return dates;
    };

    const handleXDataChange = (e) => {
        const value = e.target.value;
        setInterval(value);

        let newStartDate, newEndDate;

        if (value === "day") {
            newStartDate = selectedDate ? new Date(selectedDate) : new Date();
            newEndDate = new Date(newStartDate);
        } else if (value === "week") {
            newEndDate = selectedDate ? new Date(selectedDate) : new Date();
            newStartDate = new Date(newEndDate);
            newStartDate.setDate(newEndDate.getDate() - 6);
        } else if (value === "month") {
            newEndDate = selectedDate ? new Date(selectedDate) : new Date();
            newStartDate = new Date(newEndDate);
            newStartDate.setDate(newEndDate.getDate() - 29); // 30일 전
        }

        const dates = generateDates(newStartDate, newEndDate, value);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setXData(dates);
        setSeries(transformChartData(rowData, dates).series);
    };

    useEffect(() => {
        const dates = generateDates(startDate, endDate, interval);
        setXData(dates);
        setSeries(transformChartData(rowData, dates).series);
    }, [startDate, endDate, interval, rowData]);

    useEffect(() => {
        const newStartDate = selectedDate ? new Date(selectedDate) : new Date();
        const newEndDate = selectedDate ? new Date(selectedDate) : new Date();
        const dates = generateDates(newStartDate, newEndDate, interval);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setXData(dates);
        setSeries(transformChartData(rowData, dates).series);
    }, [selectedDate]);

    useEffect(() => {
        setOptions({
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
            },
            grid: {
                right: "18%",
                top: 40,
                bottom: 40,
                containLabel: false,
            },
            legend: {
                data: series.map((s) => s.name),
                bottom: "0%",
                icon: "circle",
                itemGap: 5,
            },
            xAxis: {
                type: "category",
                data: xdata,
                boundaryGap: true,
            },
            yAxis: [
                {
                    type: "value",
                    position: "left",
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#15BEB0",
                        },
                    },
                    axisLabel: {
                        formatter: "{value} kW",
                    },
                },
                {
                    type: "value",
                    position: "right",
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#EE6666",
                        },
                    },
                    axisLabel: {
                        formatter: "{value} °C",
                    },
                },
                {
                    type: "value",
                    position: "right",
                    offset: 55,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#6E74E7",
                        },
                    },
                    axisLabel: {
                        formatter: "{value} %",
                    },
                },
            ],
            series: series,
        });
    }, [xdata, series]);

    return (
        <div className="p-3 border border-[#CDD1E1] rounded-md h-full">
            <div className="flex justify-between items-start">
                <div className="text-md font-semibold">
                    가구별 평균 전력사용량 추이
                    <span className="text-xs ml-2 text-gray-600 font-normal">
                        {area} {subArea}
                    </span>
                </div>

                <GroupBtn
                    selectedValue={interval}
                    onChange={handleXDataChange}
                />
            </div>
            <div>
                <ECharts option={options} notMerge={true} />
            </div>
        </div>
    );
}
