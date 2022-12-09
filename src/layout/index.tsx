import { client } from "config/client";
import {
  CHANNEL_DIRECT_MESSAGES_CLIENT,
  CHANNEL_DIRECT_MESSAGES_SERVER,
  USER_NOTIFICATION_FROM_CLIENT_TO_SERVER,
  USER_NOTIFICATION_FROM__SERVER_TO_CLIENT,
} from "config/subTypes";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!isConnected) {
      client.connect({
        onSuccess: () => {
          setIsConnected(true);
          console.log(`You are connected with an id: ${client.clientId}`);

          // TOPIC: chanel_name/message type/ from
          client.subscribe(CHANNEL_DIRECT_MESSAGES_CLIENT);
          client.subscribe(CHANNEL_DIRECT_MESSAGES_SERVER);

          client.subscribe(USER_NOTIFICATION_FROM_CLIENT_TO_SERVER);
          client.subscribe(USER_NOTIFICATION_FROM__SERVER_TO_CLIENT);
          // client.subscribe("chat/+/group");
          // publishMessage("user_joined", `Hello from ${client.clientId}`);
        },
        onFailure: (err) => {
          setIsConnected(false);
        },
        reconnect: true,
      });

      client.onConnectionLost = (err) => {
        console.log("Client disconnected");
        // unsubscribe
        // client.unsubscribe(`channel/directMessage/client`);
      };

      // client.onMessageArrived = (message) => {
      //   console.log({ message });
      // };

      // client.onMessageDelivered = (message) => {
      //   console.log("Message Delivered: ", message);
      // };
    }
  }, [isConnected]);

  return <div>{children}</div>;
};

export default Layout;
