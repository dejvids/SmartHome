import { Action } from 'redux'

export interface SensorsState {
    roomTemp: string;
    waterTemp: string;
    roomHumidity: string;
    roomPressure: string;
}

export interface SetWeatherData extends Action {
    type:string;
    payload: SensorsState;
}