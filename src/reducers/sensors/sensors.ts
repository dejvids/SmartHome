import { ActionCreator, Reducer } from "redux";
import { SetWeatherData, SensorsState } from "./types";

const SENSORS_SET = 'SENSORS_SET';

const defaultState: SensorsState = {
    roomHumidity : '--',
    roomPressure: '--',
    roomTemp:'--',
    waterTemp:'--'
}

export const sensors: Reducer<SensorsState> = (state = defaultState, action) => {
    switch (action.type) {
      case SENSORS_SET:
        return {
          ...state,
          ...action.payload
        }
      default:
        return state
    }
}

export const setSensorsData: ActionCreator<SetWeatherData> = (data: SensorsState) => ({
  type: SENSORS_SET,
  payload: data
});