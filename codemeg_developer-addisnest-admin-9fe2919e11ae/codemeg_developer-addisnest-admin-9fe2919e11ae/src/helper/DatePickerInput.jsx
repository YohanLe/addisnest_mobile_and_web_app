import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SvgCalendarIcon } from '../assets/svg/Svg';

const DatePickerInput = () => {
  const [startDate, setStartDate] = useState(null); 

  return (
    <div className='datepicker-input'>
      <label className='datepicker-label'>
        <div className="inputwth-icon">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yy" 
            placeholderText="DD/MM/YY" 
            className="custom-input"
          />
          <div className="input-icon">
            <span><SvgCalendarIcon /></span>
          </div>
        </div>
      </label>
    </div>
  );
};

export default DatePickerInput;
