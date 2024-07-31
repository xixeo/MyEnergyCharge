import React from 'react'
import KakaoMap from '../components/KakaoMap'
import styles from "../assets/theme/home.module.scss";

export default function Home() {
  return (
    <div className={`w-full ${styles.home_wrap}`}>
      <p className='h-8'>카카오맵</p>
      <div className={`w-full ${styles.map_wrap}`}>
        <KakaoMap/>
      </div>
    </div>
  )
}
