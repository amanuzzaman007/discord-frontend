import * as Paho from "paho-mqtt";

const clientId = `client_${Math.round(Math.random() * 1000) + Date.now()}`;

export const client = new Paho.Client("localhost", 8080, clientId);
export const publishMessage = (
  destination: string,
  payload: string | ArrayBuffer | Paho.TypedArray
) => {
  const message = new Paho.Message(payload);
  message.destinationName = destination;
  message.qos = 2;
  message.retained = false;
  client.send(message);
};
