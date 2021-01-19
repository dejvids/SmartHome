import React, { useState } from 'react';
import { connect } from 'react-redux';
import DailyItem from './DailyItem/DailyItem';
import './Weather.scss';
import Modal from '../../../Modal';
import HourlyItem from './HourlyItem/HourlyItem';
import { Chart } from "react-google-charts";
import Icon from '../../../Icon/Icon';

const Weather = ({ current, daily, hourly }) => {

  const [hourlyDaySelected, setHourlyDaySelected] = useState([]);
  const [daySelected, setDaySelected] = useState({});

  const handleHourlyDaySelect = (day) => {
    setHourlyDaySelected(hourly.filter(hour => hour.day === day));
    if (day !== new Date().getDate()){
      const filteredDay = daily.find(dayItem => dayItem.day === day);

      setDaySelected({...filteredDay});
    } else {
      const { humidity, pressure, sunrise, sunset, temp: dayTemp, icon, dt } = current;
      setDaySelected({
        dt,
        icon,
        dayTemp,
        nightTemp: null,
        humidity,
        pressure,
        sunrise,
        sunset
      })
    }
  }

  const handleHourlyClose = () => {
    setHourlyDaySelected([]);
  }

  const prepareChartData = () => {
    return hourlyDaySelected.map((hour) => [hour.hour, hour.temp, hour.temp]);
  }

  const displayModalTitle = () => {
    const date = new Date(daySelected.dt * 1000);
    return `Pogoda ${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}`;
  }

  return (
    <div className="weather-component">
        <div className="weather-row current" onClick={() => handleHourlyDaySelect(new Date().getDate())}>
          {current && <>
            <div className="weather-city">
              <span>{'Warszawa'}</span>
            </div>
            <div className="weather-icon">
              <Icon name={current.icon}/>
            </div>
            <div className="weather-temperature">
              <span>{`${current.temp || '--'}°C`}</span>
              <div className="weather-desc">
                  <span className="weather-desc">{current.description}</span>
              </div>
            </div>
          </>}
        </div>
        <div className="weather-row forecast">
          {daily.map((day) => <DailyItem key={day.day} onClick={() => handleHourlyDaySelect(day.day)} {...day} />)}
        </div>
        <Modal show={!!hourlyDaySelected.length} title={displayModalTitle()} onClose={handleHourlyClose}>
          <div className="weather-hourly">
            <div className="values">
              <div className="weather-icon">
                <Icon name={daySelected.icon}/>
              </div>
              <div className="weather-temperature">
                <div>
                  {daySelected.dayTemp !== null && <Icon name={'sun'}/>}
                  <span>{`${daySelected.dayTemp} °C`}</span>
                </div>
                {daySelected.nightTemp !== null && 
                  <div>
                    <Icon name={'moon'}/>
                    <span>{`${daySelected.nightTemp} °C`}</span>
                  </div>
                }
              </div>
              <div className="weather-other">
                <div className="other-value">
                  <Icon name='humidity' width={'30px'}/>
                  <span>{`${daySelected.humidity} %`}</span>
                </div>
                <div className="other-value">
                  <Icon name='barometer' width={'30px'}/>
                  <span>{`${daySelected.pressure} hPa`}</span>
                </div>
              </div>
            </div>
            <div className="chart">
              <Chart
                width={'100%'}
                height={100}
                chartType="AreaChart"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    { type: 'number', label: 'x' },
                    { id: 'i0', type: 'number' },
                    { type: 'number', role: 'annotation' },
                  ],
                  ...prepareChartData()
                ]}
                options={{
                  intervals: { style: 'none' },
                  legend: 'none',
                  curveType: 'function',
                  vAxis: {
                    gridlines: {
                      count: 0
                    },
                    textPosition: 'none',
                    viewWindow: {
                      max: Math.max.apply(Math, hourlyDaySelected.map(o => o.temp)) + 10
                    }
                  },
                  hAxis: {
                    gridlines: {
                      count: 0
                    },
                    textPosition: 'none'
                  },
                  annotations: {
                    stemColor : 'none'
                  },
                  backgroundColor: { fill:'transparent' },
                  enableInteractivity: false
                }}
              />
            </div>
            <div className="temperatures">
              {hourlyDaySelected.map((hour) => <HourlyItem key={hour.hour} {...hour} />)}
            </div>
          </div>
        </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { weather: { current, daily, hourly } } = state;

  return {
    current,
    daily,
    hourly
  }
};

export default connect(
  mapStateToProps,
  {}
)(Weather)
