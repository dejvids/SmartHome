import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export const setupHub = (onClose: (error?: Error | undefined) => void) => {
    const host = process.env.REACT_APP_SIGNALR_HOST;
    if(typeof host === "undefined")
        throw new Error("invalid host");

    const newConnection = new HubConnectionBuilder()
        .withUrl(host, {
            skipNegotiation: true,
            transport: HttpTransportType.ServerSentEvents
        })
        .withAutomaticReconnect()
        .build();

    newConnection.onclose(onClose);

    return newConnection;
}