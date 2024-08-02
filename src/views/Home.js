import React from "react";
import KakaoMap from "../components/map/KakaoMap";
import styles from "../assets/theme/home.module.scss";
// import { ReactComponent as PieChart } from "../assets/icons/svg/PieChart.svg";
import SvgIcon from "../components/Icon";

export default function Home() {


    // const url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=5z6tzpaw1QvVPUuJx0oqunW1oo5VZ4A552Mb8LOcEwDbMOsiQCt1KzaZpK9u%2BHM8WauNtRrz6%2BMDNeCyEmY9Qg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20240801&base_time=0600&nx=55&ny=127'
    // console.log(url)
    // fetch(url)
    // .then(resp => resp.json())
    // .then(data => console.log(data))

    return (
        <div className={`w-full ${styles.home_wrap}`}>
            <SvgIcon iconClass="PieChart" width="50" height="50" />
            <div className={`w-full `}>
                <KakaoMap  />                
            </div>
        </div>
    );
}
