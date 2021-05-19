import * as React from 'react';
import Icon from '../../../../Icon/Icon';
import './HourlyItem.scss';

interface HourlyItemProps {
  hour: number;
  temp: number;
  icon: string;
}

const HourlyItem: React.FC<HourlyItemProps> = ({ hour, temp, icon}) => {

  return (
    <div className="weather-forecast-hour">
        <span className="hour-title">{`${("0" + hour).slice(-2)}:00`}</span>
        <div className="day-image">
          <Icon name={icon}/>
        </div>
        <span className="temperature">{temp}°C</span>
    </div>
  );
}

export default HourlyItem;
