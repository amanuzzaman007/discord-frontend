import { UserOutlined } from "@ant-design/icons";
import { Avatar, List, Typography } from "antd";
import {
  handleRemoveNotifications,
  handleSelectChannel,
} from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  chat: any;
}

const ChatItem = ({ chat }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const notifications = useAppSelector((state) => state.chat.notificationsList);
  const [receiver, setReceiver] = React.useState<any>(null);
  const [notifyCount, setNotifyCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (notifications) {
      const count = notifications.filter((n) => n.channelId === chat._id);
      setNotifyCount(count.length);
    }
  }, [notifications]);

  React.useEffect(() => {
    if (chat && !chat.isGroupChat && currentUser) {
      const users = chat.users;
      const user = users.find((u: any) => u._id !== currentUser?._id);
      setReceiver(user);
    }
  }, [chat, currentUser]);

  const handleJoinChat = (ct: any) => {
    dispatch(handleSelectChannel(ct));
    navigate(`/channel/@me/${ct._id}`);
    const filteredNotify = notifications?.filter(
      (n) => n.channelId !== chat._id
    );
    dispatch(handleRemoveNotifications(filteredNotify));
  };

  return (
    <List.Item
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background:
          selectedChanel?._id === chat._id ? "rgb(82, 196, 26)" : "#f7f7f7",
        borderRadius: 10,
        cursor: "pointer",
        padding: "6px 10px",
        marginBottom: 10,
        color: selectedChanel?._id === chat._id ? "#fff" : "",
      }}
      className="item__hover"
      onClick={() => handleJoinChat(chat)}
    >
      <Avatar
        icon={<UserOutlined />}
        shape="circle"
        style={{ marginRight: 10 }}
        size="small"
      />
      <Typography.Title
        level={5}
        style={{ color: "inherit", fontSize: "14px" }}
      >
        {receiver?.username}{" "}
        {notifyCount > 0 && (
          <span style={{ color: "rgb(64, 150, 255)" }}>({notifyCount})</span>
        )}
      </Typography.Title>
    </List.Item>
  );
};

export default ChatItem;
