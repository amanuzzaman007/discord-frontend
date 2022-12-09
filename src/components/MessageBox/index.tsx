import { Input, Layout, Typography } from "antd";
import ActionMenu from "components/ActionMenu";
import DirectGreetings from "components/direct-messages/DirectGreetings";
import axios from "config/axios";
import { client, publishMessage } from "config/client";
import {
  handlePushNewMessage,
  handlePushNotification,
  handleStoreMessages,
} from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import {
  CHANNEL_DIRECT_MESSAGES_CLIENT,
  CHANNEL_DIRECT_MESSAGES_SERVER,
} from "config/subTypes";
import React from "react";
import GroupGreetings from "./GroupGreetings";
import MessageItem from "./MessageItem";

const { Header, Content } = Layout;

let channelForCompare: any = null;

const MessageBox = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null)!;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const messages = useAppSelector((state) => state.chat.messages);
  const scrollAgain = useAppSelector((state) => state.chat.scrollAgain);
  const [receiver, setReceiver] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [newMessage, setNewMessage] = React.useState<string>("");

  React.useEffect(() => {
    channelForCompare = selectedChanel;
    if (selectedChanel && !selectedChanel.isGroupChat && currentUser) {
      const users = selectedChanel.users;
      const user = users.find((u) => u._id !== currentUser?._id);
      setReceiver(user);
    }

    return () => {
      channelForCompare = null;
    };
  }, [selectedChanel, currentUser]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, scrollAgain]);

  const sendMessage = (mgs: string) => {
    const payload = {
      sender: currentUser?._id,
      channelId: selectedChanel?._id,
      content: mgs,
      isRawHtml: false,
    };
    publishMessage(CHANNEL_DIRECT_MESSAGES_CLIENT, JSON.stringify(payload));
    setNewMessage("");
  };

  React.useEffect(() => {
    client.onMessageArrived = (message) => {
      if (message.destinationName === CHANNEL_DIRECT_MESSAGES_SERVER) {
        const payloadString = message.payloadString;
        const payload = JSON.parse(payloadString);
        console.log({ payload, selectedChanel });
        const { channelId, messageToPublish } = payload;
        if (channelForCompare?._id === channelId) {
          dispatch(handlePushNewMessage(messageToPublish[0]));
        } else {
          // add notifications
          console.log("adding n");
          dispatch(
            handlePushNotification({
              ...messageToPublish[0]?.messageByDate[0],
              channelId,
            })
          );
        }
      }
    };
  }, []);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/messages/${selectedChanel?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        dispatch(handleStoreMessages(data));
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [selectedChanel]);

  return (
    <Layout className="site-layout">
      <Header
        className="site-layout-background"
        style={{
          padding: "0px 20px",
          background: "#fff",
          borderBottom: "1px solid #eee",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          lineHeight: "unset",
          height: 45,
        }}
      >
        {selectedChanel?.isGroupChat ? (
          <Typography.Title level={4}>
            # {selectedChanel?.channelName}
          </Typography.Title>
        ) : (
          <Typography.Title level={4}>@ {receiver?.username}</Typography.Title>
        )}

        {/* action menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <ActionMenu />
        </div>
      </Header>
      <Content
        className="site-layout-background"
        style={{
          padding: "0px 0px 20px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <div className="mgs_box">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              minHeight: "100%",
            }}
          >
            {/* greetings */}
            {selectedChanel?.isGroupChat ? (
              <GroupGreetings channelName={selectedChanel.channelName} />
            ) : (
              <DirectGreetings receiver={receiver} />
            )}

            {messages.map((mgs) => (
              <MessageItem key={mgs._id} data={mgs} />
            ))}

            <div ref={scrollRef} />
          </div>
        </div>
        <div style={{ paddingRight: 20 }}>
          <Input
            placeholder={`Message @${
              selectedChanel?.isGroupChat
                ? selectedChanel.channelName
                : receiver?.username
            }`}
            onPressEnter={(e) => sendMessage(e.currentTarget.value)}
            size="large"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default MessageBox;
