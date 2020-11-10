import React, { useEffect, useState } from 'react';
import { getWaterTemp } from '../../../../restService/restService';
import './AquariumSection.scss';

const AquariumSection = () => {

  const [waterTemp, setWaterTemp] = useState('--');

  useEffect(() => {
    setTemperatureValue();
    setInterval(
      setTemperatureValue, 
    5000)
  }, [])

  const setTemperatureValue = async () => {
    try {
      const { value } =  await getWaterTemp();

      setWaterTemp(value.toFixed(2));
    } catch (e) {
      console.log(e); 
    }
  }

  return (
    <div className="aquarium-section-component">
      <div className="water-temperature">
        <div className="text-value">
          <span>{waterTemp}°C</span>
        </div>
      </div>
    </div>
  );
}

export default AquariumSection;
