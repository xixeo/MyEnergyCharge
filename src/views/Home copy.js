// Home.js
import React, { useState, useCallback, useRef, useEffect } from "react";
import KakaoMap from "../components/map/KakaoMap";
import PlaceList from "../components/map/PlaceList";
import SearchBar from "../components/map/SearchBar";
import InputBox from "../components/InputBox";

const Home = () => {
    // KakaoMap
    const [places, setPlaces] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [map, setMap] = useState(null);
    const infowindowRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");

    // KakaoMap에서 검색 결과를 받아오는 핸들러
    const handleSearchResults = useCallback((places, pagination) => {
        setPlaces(places);
        setPagination(pagination);
    }, []);

    // KakaoMap에서 map 객체가 준비되었을 때 호출되는 핸들러
    const handleMapReady = useCallback((mapInstance) => {
        setMap(mapInstance);
        infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    }, []);

    // SearchBar에서 검색어를 받아서 처리하는 핸들러
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    // 검색어가 변경되면 KakaoMap에서 검색을 실행
    useEffect(() => {
        if (map && searchQuery) {
            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(searchQuery, (data, status, pagination) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    handleSearchResults(data, pagination);

                    infowindowRef.current.close();
                    const bounds = new window.kakao.maps.LatLngBounds();
                    map.setLevel(3);

                    data.forEach((place) => {
                        const position = new window.kakao.maps.LatLng(
                            place.y,
                            place.x
                        );
                        const marker = new window.kakao.maps.Marker({
                            map,
                            position,
                        });

                        window.kakao.maps.event.addListener(
                            marker,
                            "click",
                            () => {
                                if (infowindowRef.current) {
                                    infowindowRef.current.setContent(
                                        `<span>${place.place_name}</span>`
                                    );
                                    infowindowRef.current.open(map, marker);

                                    const currentLevel = map.getLevel();
                                    const newLevel =
                                        currentLevel > 3 ? 3 : currentLevel;
                                    map.setLevel(newLevel, {
                                        anchor: position,
                                    });
                                    map.panTo(position);
                                }
                            }
                        );

                        bounds.extend(position);
                    });
                    map.setBounds(bounds);
                } else {
                    alert("검색 결과 중 오류가 발생했습니다.");
                }
            });
        }
    }, [map, searchQuery, handleSearchResults]);

    // PlaceList에서 장소를 선택했을 때의 처리
    const handlePlaceSelect = useCallback(
        (place, marker) => {
            if (map && infowindowRef.current) {
                // InfoWindow가 열려 있을 경우 닫기
                infowindowRef.current.close();

                const position = new window.kakao.maps.LatLng(place.y, place.x);
                infowindowRef.current.setContent(
                    `<span>${place.place_name}</span>`
                );
                infowindowRef.current.open(map, marker);

                const currentLevel = map.getLevel();
                const newLevel = currentLevel > 3 ? 3 : currentLevel;
                map.setLevel(newLevel, { anchor: position });
                map.panTo(position);
            }
        },
        [map]
    );

    // PlaceList에서 페이지가 변경됐을 때의 처리
    const handlePageChange = useCallback(
        (page) => {
            if (pagination) {
                pagination.gotoPage(page);
            }
        },
        [pagination]
    );

    // 지역 선택 dropDown
    const [siOps, setSiOps] = useState(); //지역 선택
    const [guOps, setGuOps] = useState(); //지역 선택
    const selRef = useRef(); //옵션 선택

    //구선택
    const handleGuSelect = () => {
        console.log(selRef.current.value);
        if (!ops) return;
        let tm = tdata
            .filter((item) => item["GUGUN_NM"] === selRef.current.value)
            .map((item) => (
                <GalleryCard
                    key={item.UC_SEQ}
                    title={item.TITLE}
                    content={item.SUBTITLE}
                    imgUrl={item.MAIN_IMG_NORMAL}
                    spTag={item.MAIN_PLACE}
                />
            ));
        setCards(tm);
    };

    return (
        <div>
            {/* 조회조건 */}
            <div className="w-full h-10 flex items-center border-b border-b-zinc-200">
                <div className="sido">
                    <label
                        htmlFor="op"
                        className="text-xl font-bold
                              inline-flex justify-center items-center mb-5 md:mb-0 mr-5
                             text-gray-900 dark:text-white"
                    >
                        지역
                    </label>
                    {ops && (
                        <InputBox
                            id="op"
                            selRef={selRef}
                            ops={siOps}
                            initText="시/도 선택"
                            handleChange={handleSiSelect}
                            customClass={"border p-2"}
                        />
                    )}
                </div>
                <div className="gugun">
                    <label
                        htmlFor="op"
                        className="text-xl font-bold
                              inline-flex justify-center items-center mb-5 md:mb-0 mr-5
                             text-gray-900 dark:text-white"
                    >
                        지역
                    </label>
                    {ops && (
                        <InputBox
                            id="op"
                            selRef={selRef}
                            ops={guOps}
                            initText="시/도 선택"
                            handleChange={handleGuSelect}
                            customClass={"border p-2"}
                        />
                    )}
                </div>
            </div>

            {/* 컨텐츠 */}
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-5 gap-4 mt-6">
                {/* 지도 */}
                <div className="col-span-3">
                    <KakaoMap
                        onSearchResults={handleSearchResults}
                        onMapReady={handleMapReady}
                    />
                </div>

                {/* 차트 */}
                <div className="col-span-2">
                    <PlaceList
                        places={places}
                        onPlaceSelect={handlePlaceSelect} // 여기에 onPlaceSelect 전달
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
