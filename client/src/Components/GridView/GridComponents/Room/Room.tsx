import * as React from 'react';
import './Room.scss';
import Icon from '../../../Icon/Icon';
import { SensorsProps } from '../../GridView';

const Room : React.FC<SensorsProps> = ({roomTemp, roomPressure, roomHumidity, onRefresh, connected: connectionLost}) => {
  const onClick = () => {
    onRefresh();
  }
  return (
    <div className="room-section-component">
      <div className="room-tile">
        <Icon name='thermometer' width={'30px'} />
        <span className="text-title">Temperatura</span>
        <span className="text-value">{roomTemp} °C</span>
      </div>
      <div className="room-tile">
        <Icon name='barometer' width={'30px'} />
        <span className="text-title">Ciśnienie</span>
        <span className="text-value">{roomPressure} hPa</span>
      </div>
      <div className="room-tile">
        <Icon name='humidity' width={'30px'} />
        <span className="text-title">Wilgotność</span>
        <span className="text-value">{roomHumidity} %</span>
      </div>
      {connectionLost &&
        <button onClick={onClick}>Refresh</button>
      }
    </div>
  );
}

export default Room;
