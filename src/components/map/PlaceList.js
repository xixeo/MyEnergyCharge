import React, { useEffect, useRef } from 'react';

const PlaceList = ({ places, onPlaceSelect, pagination, onPageChange }) => {
  const paginationRef = useRef(null);

  useEffect(() => {
    const displayPagination = (pagination) => {
      const paginationEl = paginationRef.current;
      const fragment = document.createDocumentFragment();
      while (paginationEl?.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (let i = 1; i <= pagination.last; i++) {
        const el = document.createElement("a");
        el.href = "#";
        el.innerHTML = String(i);

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = (event) => {
            event.preventDefault();
            onPageChange(i);
          };
        }

        fragment.appendChild(el);
      }
      paginationEl?.appendChild(fragment);
    };

    if (pagination) {
      displayPagination(pagination);
    }
  }, [pagination, onPageChange]);

  return (
    <div>
      <ul id="placesList">
        {places.map((place, index) => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);
          const marker = new window.kakao.maps.Marker({ position });
          const handleClick = () => onPlaceSelect(place, marker);

          return (
            <li key={index} className="item" onClick={handleClick}>
              <span className={`markerbg marker_${index + 1}`}></span>
              <div className="info">
                <h5>{place.place_name}</h5>
                {place.road_address_name ? (
                  <>
                    <span>{place.road_address_name}</span>
                    <span className="jibun gray">
                      <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png" alt="jibun" />
                      {place.address_name}
                    </span>
                  </>
                ) : (
                  <span>{place.address_name}</span>
                )}
                <span className="tel">{place.phone}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <div ref={paginationRef} id="pagination"></div>
    </div>
  );
};

export default PlaceList;
