import React, { useState } from 'react';

const PlaceList = ({ places, onPlaceSelect }) => {
    // 페이지 상태와 항목 수를 설정합니다.
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 총 페이지 수를 계산합니다.
    const totalPages = Math.ceil(places.length / itemsPerPage);

    // 현재 페이지의 항목만 가져옵니다.
    const paginatedPlaces = places.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 페이지 네비게이션 컨트롤 렌더링
    const renderPaginationControls = () => {
        const controls = [];
        for (let i = 1; i <= totalPages; i++) {
            controls.push(
                <a
                    key={i}
                    href="#"
                    className={i === currentPage ? 'on' : ''}
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i);
                    }}
                >
                    {i}
                </a>
            );
        }
        return controls;
    };

    return (
        <div className="placeList">
            <ul id="placesList">
                {paginatedPlaces.map((place) => {
                    const position = new window.kakao.maps.LatLng(place.y, place.x);
                    const marker = new window.kakao.maps.Marker({ position });

                    const handleClick = () => onPlaceSelect(place, marker);

                    return (
                        <li key={place.id} className="item" onClick={handleClick}>
                            <div className="info">
                                <div className="flex items-center">
                                    <span className={`markerbg marker_${place.id}`}></span>
                                    <h5>{place.place_name}</h5>
                                </div>
                                <div className="px-5">
                                    {place.road_address_name ? (
                                        <>
                                            <span>{place.road_address_name}</span>
                                            <span className="text-sm text-gray-500 flex items-center">
                                                <img
                                                    src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png"
                                                    alt="jibun"
                                                />
                                                {place.address_name}
                                            </span>
                                        </>
                                    ) : (
                                        <span>{place.address_name}</span>
                                    )}
                                    <span className="tel">{place.phone}</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div id="pagination">
                {renderPaginationControls()}
            </div>
        </div>
    );
};

export default PlaceList;
