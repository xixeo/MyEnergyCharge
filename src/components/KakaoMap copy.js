// maker 클릭 시 주소 가져오기
import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function KakaoMap() {
    const { kakao } = window;
    const [location, setLocation] = useState(null); // 현재 위치를 저장할 상태
    const [address, setAddress] = useState(null); // 현재 좌표의 주소를 저장할 상태

    const getAddress = (lat, lng) => {
        const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
        const coord = new kakao.maps.LatLng(location.latitude,location.longitude); // 주소로 변환할 좌표 입력
        const callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setAddress(result[0].address);
                console.log("좌표값 주소변환", result[0].address);
            }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
    }, []);

    const successHandler = (response) => {
        // console.log(response); // coords: GeolocationCoordinates {latitude: 위도, longitude: 경도, …} timestamp: 1673446873903
        const { latitude, longitude } = response.coords;
        setLocation({ latitude, longitude });
    };

    const errorHandler = (error) => {
        console.log(error);
    };

    return (
        <>

            {location && (
                <Map
                    center={{lat: location.latitude, lng: location.longitude}}
                    style={{ width: "800px", height: "600px" }}
                    level={3}
                >
                    <MapMarker
                        onClick={getAddress}
                        position={{
                          lat: location.latitude, lng: location.longitude
                        }}
                    />
                    {/* <button >현재 좌표의 주소 얻기</button> */}
                </Map>
            )}

            {address && (
                <div>
                    현재 좌표의 주소는..
                    <p>address_name: {address.address_name}</p>
                    <p>region_1depth_name: {address.region_1depth_name}</p>
                    <p>region_2depth_name: {address.region_2depth_name}</p>
                    <p>region_3depth_name: {address.region_3depth_name}</p>
                </div>
            )}
           
        </>
    );
}
