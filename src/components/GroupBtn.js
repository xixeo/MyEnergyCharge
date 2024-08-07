import React from 'react';
import '../assets/theme/gb.modules.scss';

const GroupBtn = ({ onChange, selectedValue }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event); // 이벤트 객체를 전달하여 onChange 핸들러가 value를 얻을 수 있도록 함
    }
  };

  return (
    <div className="radio-group">
      <label className={`radio-button ${selectedValue === 'day' ? 'active' : ''}`}>
        <input
          type="radio"
          value="day"
          checked={selectedValue === 'day'}
          onChange={handleChange}
        />
        일
      </label>
      <label className={`radio-button ${selectedValue === 'week' ? 'active' : ''}`}>
        <input
          type="radio"
          value="week"
          checked={selectedValue === 'week'}
          onChange={handleChange}
        />
        주
      </label>
      <label className={`radio-button ${selectedValue === 'month' ? 'active' : ''}`}>
        <input
          type="radio"
          value="month"
          checked={selectedValue === 'month'}
          onChange={handleChange}
        />
        월
      </label>
    </div>
  );
};

export default GroupBtn;
