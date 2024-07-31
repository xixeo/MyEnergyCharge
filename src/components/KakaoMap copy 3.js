// maker 클릭 시 주소 가져오기
import React, { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

export default function KakaoMap() {
  const { kakao } = window;
	const [address, setAddress] = useState(null); // 현재 좌표의 주소를 저장할 상태

	const getAddress = (lat, lng) => {
		const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
		const coord = new kakao.maps.LatLng(37.5566803113882, 126.904501286522); // 주소로 변환할 좌표 입력
		const callback = function (result, status) {
			if (status === kakao.maps.services.Status.OK) {
				setAddress(result[0].address);
        console.log('좌표값 주소변환', result[0].address)
			}
		};
		geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
	};


  return (
    <>
    <Map center={{ lat: 37.5566803113882, lng: 126.904501286522 }} style={{ width: '800px', height: '600px' }} level={3}>
      <MapMarker onClick={getAddress} position={{ lat: 37.5566803113882, lng: 126.904501286522 }} />
      {/* <button >현재 좌표의 주소 얻기</button> */}
    </Map>

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
  )
}
