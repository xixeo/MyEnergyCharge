// MarkerAddressDisplay.js
import React from "react";

const MarkerAddressDisplay = ({ markerAddress }) => {
    return (
        markerAddress ? (
            <div>
                <p>마커 위치의 주소: {markerAddress}</p>
            </div>
        ) : null
    );
};

export default MarkerAddressDisplay;
