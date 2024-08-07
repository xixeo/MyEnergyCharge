import React, { useState, useEffect } from 'react';
import ECharts from 'echarts-for-react';
import chartData from '../data/chartData.json'; // JSON 데이터 import
import GroupBtn from '../GroupBtn';

// 날짜 변환 함수
const generateDates = (start, end, interval) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]); // YYYY-MM-DD 형식

        if (interval === 'day' || null) {
            current.setDate(current.getDate() + 1);
        } else if (interval === 'week') {
            current.setDate(current.getDate() + 7);
        } else if (interval === 'month') {
            current.setDate(current.getDate() + 1);
        }
    }
    return dates;
};

// JSON 데이터를 ECharts 데이터로 변환하는 함수
const transformData = (data, xData) => {
    const dates = xData;
    const filteredData = data.filter(item => dates.includes(item.date));

    const elecData = dates.map(date => {
        const found = filteredData.find(item => item.date === date);
        return found ? found.elec : 0;
    });
    const tempData = dates.map(date => {
        const found = filteredData.find(item => item.date === date);
        return found ? found.temp : 0;
    });

    return {
        dates,
        series: [
            { name: '전력량', type: 'bar', smooth: true, data: elecData },
            { name: '기온', type: 'line', smooth: true, data: tempData },
        ]
    };
};

const colors = ['#5470C6', '#EE6666'];

export default function Chart() {
    const today = new Date();
    const [startDate, setStartDate] = useState(() => {
        const date = new Date(today);
        date.setMonth(today.getMonth() - 1); // 기본값: 한 달 전
        return date;
    });
    const [endDate, setEndDate] = useState(today);
    const [xdata, setXData] = useState(generateDates(startDate, endDate, 'day'));
    const [options, setOptions] = useState({});
    const [selectedInterval, setSelectedInterval] = useState('day');

    // 날짜 범위 업데이트 함수
    const updateDateRange = (interval) => {
        const end = new Date();
        let start;

        if (interval === 'day') {
            start = new Date(end);
            start.setDate(end.getDate() - 1); // 어제
        } else if (interval === 'week') {
            start = new Date(end);
            start.setDate(end.getDate() - 7); // 7일 전
        } else if (interval === 'month') {
            start = new Date(end);
            start.setDate(end.getDate() - 30); // 30일 전
        }

        setStartDate(start);
        setEndDate(end);
        return generateDates(start, end, interval);
    };

    // 날짜 범위와 차트 데이터 업데이트
    useEffect(() => {
        const dates = updateDateRange(selectedInterval);
        setXData(dates);
    }, [selectedInterval]);

    useEffect(() => {
        const { dates, series } = transformData(chartData, xdata);
        setOptions({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
            },
            grid: {
                left: 50,
                right: 50,
                top: 10,
                bottom: 50,
            },
            color: colors,
            legend: {
                data: series.map(s => s.name),
                bottom: 'bottom',
                icon: 'circle',
                itemGap: 25,
            },
            xAxis: {
                type: 'category',
                data: dates,
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: true,
                },
            },
            series: series,
        });
    }, [xdata]);

    // 기간 선택 핸들러
    const handlexDataChange = (e) => {
        const value = e.target.value;
        setSelectedInterval(value);
    };

    return (
        <div className="p-3 border border-[#CDD1E1] rounded-md h-full">
            <div className="flex justify-between items-start">
                <div className="text-md font-semibold">전력량 사용 추이</div>
                <GroupBtn defaultValue={selectedInterval} onChange={handlexDataChange} />
            </div>
            <div>
                <ECharts option={options} notMerge={true} />
            </div>
        </div>
    );
}
