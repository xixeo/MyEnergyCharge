import React from "react";
import KakaoMap from "../components/map/KakaoMap";
import styles from "../assets/theme/home.module.scss";

export default function Home() {

    return (
        <div className={`w-full ${styles.home_wrap}`}>
            <div className={`w-full `}>
                <KakaoMap  />                
            </div>
        </div>
    );
}
