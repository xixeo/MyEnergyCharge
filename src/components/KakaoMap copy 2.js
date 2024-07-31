/// 기 저장된 좌표값을 지도에 표현하기
import React, { useState } from 'react';
import { Map, MapMarker, useMap } from 'react-kakao-maps-sdk';
import { markerdata } from './data/markerData';

const KakaoMap = () => {
  const EventMarkerContainer = ({ position, content }) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)

    return (
      <MapMarker
        position={position} // 마커를 표시할 위치
        onClick={(marker) => map.panTo(marker.getPosition())}
        onMouseOver={() => setIsVisible(true)}
        onMouseOut={() => setIsVisible(false)}
      >
        {isVisible && content}
      </MapMarker>
    )
  }
    return (
        <Map
            center={{ lat: 35.23585691442383, lng: 129.0768975881095 }} // 지도가 표현될때 처음 보여줄 위치 지정 (위도,경도)
            style={{
                width: "100%",
                height: "100%",
                borderRadius: "4px",
                overflow: "hidden",
            }}
            level={3} //레벨 조정 가능
        >

            {markerdata.map((item, index) => (
                <EventMarkerContainer
                    key={index}
                    position={{ lat: item.lat, lng: item.lng }}
                    title={item.title}
                    style={{ border: "0" }}
                >
                </EventMarkerContainer>
            ))}
        </Map>
    );
};

export default KakaoMap;
