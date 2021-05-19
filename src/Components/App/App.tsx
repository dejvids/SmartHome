import * as React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import Header from '../Header';
import Footer from '../Footer';
import Content from '../Content';
import Admin from '../Admin';
import AlertBar from '../AlertBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { setWeatherData } from '../../reducers/weather/weather';
import { setSensorsData } from '../../reducers/sensors/sensors';
import { getCurrentUser, getCurrentWeather, getDailyWeather, getHourlyWeather } from '../../restService/restService';
import { setSessionData, clearSession } from '../../reducers/session/session';
import { getCookie, eraseCookie } from '../../helpers';
import { ApplicationState } from '../../reducers';

import { HubConnection } from '@microsoft/signalr';
import { useState } from 'react';
import { setupHub } from '../../signalR/signalR';
import { SensorsState } from '../../reducers/sensors/types';

const { useEffect } = React;

interface AppProps {
  authToken: string,
  username: string,
  setWeatherData: Function,
  setSessionData: Function,
  setSensorsData: Function,
  clearSession: Function
}

const App: React.FC<AppProps> = ({ authToken, username, setWeatherData, setSessionData, setSensorsData, clearSession }) => {

  const onRefresh = () => {
    console.log('onRefresh');
    createConnection();
  }

  const createConnection = () => {
    setConnectionLost(false);
    const defaultState: SensorsState = {
      roomHumidity: '--',
      roomPressure: '--',
      roomTemp: '--',
      waterTemp: '--'
    }
    setSensorsData(defaultState);
    try {
      let newConnection = setupHub();
      newConnection.onclose(_ => {
        console.log('connection  closed');
        setConnectionLost(true);

        setSensorsData(defaultState);
      });

      setConnection(newConnection);
    }
    catch {
      setSensorsData(defaultState);
    }
  }

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionLost, setConnectionLost] = useState<boolean>(false);

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      setSessionData({ authToken: token });
    }

    createConnection();
  }, [])

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(_ => {
          console.log('Connected!');
          connection.on('RecieveDataAsync', data => {
            console.log(data);
            setSensorsData(data);
          });
          connection.on('SensorsDisconnectedAsync', _ => {
            setConnectionLost(true);
          })
        })
        .catch(e => {
          console.log('Connection failed: ', e);
          setConnectionLost(true);
        });
    }
  }, [connection]);

  useEffect(() => {
    const setCurrentUser = async () => {
      getCurrentUser(authToken).then(res => {
        setSessionData(res);
      }).catch(e => {
        if (e.code === 'ERR0001') {
          eraseCookie('token');
          clearSession();
        }
      });
    }

    if (authToken && !username) {
      setCurrentUser();
    }
  }, [authToken, username])



  useEffect(() => {
    fetchCurrentWeather();
    const weatherRequestInterval = setInterval(
      fetchCurrentWeather,
      60000 // update every minute
    );

    fetchDailyWeather();
    const weatherDailyRequestInterval = setInterval(
      fetchCurrentWeather,
      3600000 // update every hour
    );

    fetchHourlyWeather();
    const weatherHourlyRequestInterval = setInterval(
      fetchHourlyWeather,
      3600000 // update every hour
    );

    return () => {
      clearInterval(weatherRequestInterval);
      clearInterval(weatherDailyRequestInterval);
      clearInterval(weatherHourlyRequestInterval);
    }
  })

  const fetchCurrentWeather = async () => {
    const current = await getCurrentWeather();
    setWeatherData({ current });
  }

  const fetchDailyWeather = async () => {
    const daily = await getDailyWeather();
    setWeatherData({ daily });
  }

  const fetchHourlyWeather = async () => {
    const hourly = await getHourlyWeather();
    setWeatherData({ hourly });
  }



  return (
    <div className="App">
      <Router>
        <Header />
        {connectionLost && <AlertBar onRefreshClicked={onRefresh} />}
        <div className="appMiddle">
          <Switch>
            <Route path="/" exact>
              <Content />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

const mapStateToProps = (state: ApplicationState) => {
  const { session: { username, authToken } } = state;
  return {
    username,
    authToken
  }
};

export default connect(
  mapStateToProps,
  {
    setWeatherData,
    setSessionData,
    setSensorsData,
    clearSession
  }
)(App)
