import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

export const setupHub = () => {
    const host = process.env.REACT_APP_SIGNALR_HOST;
    if(typeof host === "undefined")
        throw new Error("invalid host");

    const newConnection = new HubConnectionBuilder()
        .withUrl(host, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    return newConnection;
}