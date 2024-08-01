// KakaoMap.js
import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import AddressSearch from "./AddressSearch"; // AddressSearch 컴포넌트 임포트
import MarkerAddressDisplay from "./MarkerAddressDisplay"; // MarkerAddressDisplay 컴포넌트 임포트

export default function KakaoMap() {
    const { kakao } = window;
    const [state, setState] = useState({
        center: { lat: 37.49676871972202, lng: 127.02474726969814 },
        isPanto: true,
    });
    const [searchAddress, setSearchAddress] = useState("");
    const [location, setLocation] = useState(null); // 현재 위치를 저장할 상태
    const [markerPosition, setMarkerPosition] = useState(null); // 마커의 위치를 저장할 상태
    const [markerAddress, setMarkerAddress] = useState(""); // 마커 클릭 시 주소를 저장할 상태

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    }, []);

    const successHandler = (response) => {
        const { latitude, longitude } = response.coords;
        setLocation({ latitude, longitude });
        setState({
            center: { lat: latitude, lng: longitude }
        });
        setMarkerPosition({ lat: latitude, lng: longitude });
    };

    const errorHandler = (error) => {
        console.log(error);
    };

    const SearchMap = () => {
        const geocoder = new kakao.maps.services.Geocoder();
        let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const newSearch = result[0];
                setState({
                    center: { lat: newSearch.y, lng: newSearch.x },
                });
                setMarkerPosition({
                    lat: newSearch.y,
                    lng: newSearch.x
                });
            }
        };
        geocoder.addressSearch(`${searchAddress}`, callback);
    };

    const handleMarkerClick = () => {
        if (markerPosition) {
            const geocoder = new kakao.maps.services.Geocoder();
            const coord = new kakao.maps.LatLng(markerPosition.lat, markerPosition.lng);
            const callback = function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    const address = result[0].address.address_name;
                    setMarkerAddress(address);
                    console.log("마커 위치의 주소:", address); // 주소를 콘솔에 출력
                }
            };
            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        }
    };

    return (
        <>
            <Map
                center={state.center}
                isPanto={state.isPanto}
                style={{ width: "800px", height: "600px" }}
                level={3}
            >
                {markerPosition && (
                    <MapMarker
                        position={markerPosition}
                        title="검색된 위치"
                        onClick={handleMarkerClick}
                    />
                )}
            </Map>

            <AddressSearch 
                searchAddress={searchAddress} 
                setSearchAddress={setSearchAddress} 
                SearchMap={SearchMap} 
            />

            <MarkerAddressDisplay markerAddress={markerAddress} />
        </>
    );
}
