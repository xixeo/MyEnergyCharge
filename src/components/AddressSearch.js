// AddressSearch.js
import React from "react";

const AddressSearch = ({ searchAddress, setSearchAddress, SearchMap }) => {
    const handleChange = (e) => {
        setSearchAddress(e.target.value);
    };

    return (
        <div>
            <input
                value={searchAddress}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
            />
            <button onClick={SearchMap}>주소 검색</button>
        </div>
    );
};

export default AddressSearch;
