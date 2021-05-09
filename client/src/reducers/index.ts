import { combineReducers } from "redux"
import { SensorsState } from "./sensors/types";
import { session } from "./session/session"
import { SessionState } from "./session/types";
import { WeatherState } from "./weather/types";
import { weather } from "./weather/weather";
import {sensors} from "./sensors/sensors";

export interface ApplicationState {
    session: SessionState,
    weather: WeatherState,
    sensors: SensorsState
}

export default combineReducers<ApplicationState>({
    session,
    weather,
    sensors
});
