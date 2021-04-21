import * as React from 'react';
import { getWaterTemp } from '../../../../restService/restService';
import { SensorsProps } from '../../GridView';
import './AquariumSection.scss';

const AquariumSection : React.FC<SensorsProps> = ({waterTemp}) => {

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
