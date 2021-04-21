import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import React, { useEffect, useState } from 'react';
import AquariumSection from './GridComponents/AquariumSection/AquariumSection';
import DateTime from './GridComponents/DateTime';
import Room from './GridComponents/Room/Room';
import Weather from './GridComponents/Weather';
import GridItem from './GridItem';
import './GridView.scss';
import { setupHub } from '../../signalR/signalR'

export interface SensorsProps {
  roomTemp?: string;
  waterTemp?: string;
  roomHumidity?: string;
  roomPressure?: string;
  onRefresh(): void;
  connected: boolean;
}

const GridView = () => {

  const onRefresh = () => {
    console.log('onRefresh');
    setupSignalR();
  }

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [sensorsData, setSensorsData] = useState<SensorsProps>({ roomTemp: "--", waterTemp: "--", roomHumidity: "--", roomPressure: "--", onRefresh: onRefresh, connected: false });
  const [connectionLost, setConnectionLost] = useState<boolean>(false);

  useEffect(() => {
    setConnectionLost(false);
    let newConection = setupHub(_ => {
      console.log('connection closed');
      setConnectionLost(true);
    });

    setConnection(newConection);
    //setupSignalR();
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(_ => {
          console.log('Connected!');
          connection.on('RecieveDataAsync', data => {
            console.log(data);
            setSensorsData(data);
          });
        })
        .catch(e => {
          console.log('Connection failed: ', e);
          setConnectionLost(true);
        });
    }
  }, [connection]);

  const setupSignalR = () => {

    setConnectionLost(false);
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/signalr/sensorsHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    newConnection.onclose(_ => {
      console.log('connection closed');
      setConnectionLost(true);
    });

    setConnection(newConnection);
  }

  let weatherItem;
  if (connectionLost) {
    weatherItem = <button>Refresh</button>
  }
  else {
    weatherItem = <AquariumSection waterTemp={sensorsData.waterTemp} onRefresh={onRefresh} connected={connectionLost} />
  }

  return (
    <div className="grid-component noselect">
      <GridItem>
        <DateTime />
      </GridItem>
      <GridItem>
        <Room roomTemp={sensorsData.roomTemp} roomPressure={sensorsData.roomPressure} roomHumidity={sensorsData.roomHumidity} onRefresh={onRefresh} connected={connectionLost} />
      </GridItem>
      <GridItem>
        <Weather />
      </GridItem>
      <GridItem title="Akwarium">
        {weatherItem}

      </GridItem>
    </div>
  );
}

export default GridView;
