import React, { useState, useEffect } from "react";
import ECharts from "echarts-for-react";
import * as echarts from "echarts";
import rawData from "../data/chartData.json"; // JSON 데이터 import
import GroupBtn from "../GroupBtn";

export default function Chart() {
    const colors = ["#5470C6", "#EE6666"]; // colors 변수를 정의
    // JSON 데이터를 ECharts 데이터로 변환하는 함수
    const transformChartData = (data, dates) => {
        const filteredData = data.filter((item) => dates.includes(item.date));

        const elecData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.elec : 0;
        });
        const tempData = dates.map((date) => {
            const found = filteredData.find((item) => item.date === date);
            return found ? found.temp : 0;
        });

        return {
            series: [
                {
                    name: "전력량",
                    type: "bar",
                    showBackground: true,
                    barWidth: 20,
                    smooth: true,
                    data: elecData,
                    yAxisIndex: 0,
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0],
                        showBackground: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "#43DCCF" },
                            { offset: 1, color: "#B0FFFF" },
                        ]),
                    },
                },
                {
                    name: "기온",
                    type: "line",
                    smooth: true,
                    data: tempData,
                    yAxisIndex: 1,
                    showBackground: true,
                    itemStyle: {
                        showBackground: true,
                        color: "#EE6666",
                        borderRadius: [10, 10, 0, 0],
                    },
                },
            ],
        };
    };

    // 선택된 기간에 대한 x축 data값 생성(일, 주, 월)
    const generateDates = (start, end, interval) => {
        const dates = [];
        const current = new Date(start);

        while (current <= end) {
            dates.push(current.toISOString().split("T")[0]); // 날짜 형식을 "YYYY-MM-DD"로 설정
            if (interval === "day") {
                break; // 일 단위에서는 시작 날짜만 포함
            } else if (interval === "week") {
                current.setDate(current.getDate() + 1);
                if (current.getDay() === 0) {
                    // 주 단위의 끝인 일요일에만 추가
                    dates.push(current.toISOString().split("T")[0]);
                }
            } else if (interval === "month") {
                current.setMonth(current.getMonth() + 1);
                current.setDate(1); // 월 단위에서는 매월 1일만 추가
                dates.push(current.toISOString().split("T")[0]);
            }
        }

        return dates;
    };

    // 날짜 설정
    const today = new Date();
    const [interval, setInterval] = useState("day");
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        return new Date(date.setDate(today.getDate())); // 초기값: 오늘로부터 7일 전
    });
    const [endDate, setEndDate] = useState(today);

    const [xdata, setXData] = useState(
        generateDates(startDate, endDate, interval)
    );
    const [series, setSeries] = useState(
        transformChartData(rawData, xdata).series
    );

    const handleXDataChange = (e) => {
        const value = e.target.value;
        setInterval(value);

        let newStartDate, newEndDate;

        if (value === "day") {
            newStartDate = today;
            newEndDate = today;
        } else if (value === "week") {
            newEndDate = today;
            newStartDate = new Date(today);
            newStartDate.setDate(today.getDate() - 5); // 7일 전
        } else if (value === "month") {
            newEndDate = today;
            newStartDate = new Date(today);
            newStartDate.setMonth(today.getMonth() - 1); // 한 달 전
        }

        const dates = generateDates(newStartDate, newEndDate, value);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setXData(dates);
        setSeries(transformChartData(rawData, dates).series);
    };

    const [options, setOptions] = useState({});

    useEffect(() => {
        setOptions({
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
            },
            grid: {
                left: 45,
                right: 45,
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
                            color: colors[0],
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
                            color: colors[1],
                        },
                    },
                    axisLabel: {
                        formatter: "{value} °C",
                    },
                },
            ],
            series: series,
        });
    }, [xdata, series]);

    return (
        <div className="p-3 border border-[#CDD1E1] rounded-md h-full">
            <div className="flex justify-between items-start">
                <div className="text-md font-semibold">전력량 사용 추이</div>
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
