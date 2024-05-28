import React from 'react'
import styles from "../assets/theme/login.module.css"

export default function login() {
  return (
    <div className={`w-full h-screen ${styles.login_wrap} flex justify-center items-center`}>
        <div className='h-1/2 w-1/4 rounded-lg bg-cyan-300/[.15] flex flex-col'>
            <p className='text-white text-2xl'>login</p>
        </div>
    </div>
  )
}
