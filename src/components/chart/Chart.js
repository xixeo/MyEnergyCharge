import React, { useState, useEffect } from "react";
import ECharts from "echarts-for-react";
import * as echarts from "echarts";
import rawData from "../data/chartData.json";
import GroupBtn from "../GroupBtn";

export default function Chart({ selectedDate }) {
    const colors = ["#15BEB0", "#EE6666"];

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

        if (interval === "day") {
            dates.push(current.toISOString().split("T")[0]);
        } else if (interval === "week") {
            while (current <= end) {
                dates.push(current.toISOString().split("T")[0]);
                current.setDate(current.getDate() + 1);
            }
        } else if (interval === "month") {
            while (current <= end) {
                dates.push(current.toISOString().split("T")[0]);
                current.setMonth(current.getMonth() + 1);
                current.setDate(1);
            }
        }

        return dates;
    };

    const today = new Date();
    const [interval, setInterval] = useState("day");

    const [startDate, setStartDate] = useState(() => {
        return selectedDate ? new Date(selectedDate) : today;
    });
    const [endDate, setEndDate] = useState(today);

    const [xdata, setXData] = useState(generateDates(startDate, endDate, interval));
    const [series, setSeries] = useState(transformChartData(rawData, xdata).series);

    const handleXDataChange = (e) => {
        const value = e.target.value;
        setInterval(value);

        let newStartDate, newEndDate;

        if (value === "day") {
            newStartDate = selectedDate ? new Date(selectedDate) : today;
            newEndDate = new Date(newStartDate); // 일 단위에서는 시작 날짜와 끝 날짜가 동일
        } else if (value === "week") {
            newEndDate = selectedDate ? new Date(selectedDate) : today;
            newStartDate = selectedDate
                ? new Date(selectedDate)
                : new Date(today);

            // Week 계산
            newStartDate.setDate(newEndDate.getDate() - 6);
            // newEndDate.setDate(newStartDate.getDate() + 6);
            
            // newStartDate = selectedDate ? new Date(selectedDate) : new Date(today);
            // newStartDate.setDate(today.getDate() - 6); // 주의 시작일(월요일)
            // newEndDate = new Date(today);
        } else if (value === "month") {
            newStartDate = selectedDate ? new Date(selectedDate) : new Date(today);
            newStartDate.setDate(1); // 월의 첫날
            newStartDate.setMonth(today.getMonth() - 1); // 한 달 전
            newEndDate = new Date(today);
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
                left: 48,
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
                <GroupBtn selectedValue={interval} onChange={handleXDataChange} />
            </div>
            <div>
                <ECharts option={options} notMerge={true} />
            </div>
        </div>
    );
}
