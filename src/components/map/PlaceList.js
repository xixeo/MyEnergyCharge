import React from 'react';

const PlaceList = ({ places, onPlaceSelect }) => {
  return (
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
  );
};

export default PlaceList;
