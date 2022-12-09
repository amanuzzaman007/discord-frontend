import {
  BorderlessTableOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, List, MenuProps, Tooltip, Typography } from "antd";
import axios from "config/axios";
import {
  handleFetchAgain,
  handleRemoveNotifications,
  handleSelectChannel,
} from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import { useNavigate } from "react-router-dom";

interface Props {
  channel: any;
}

const ChannelItem = ({ channel }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const notifications = useAppSelector((state) => state.chat.notificationsList);

  const handleJoinChat = (ct: any) => {
    dispatch(handleSelectChannel(ct));
    navigate(`/channel/${channel.server}/${channel._id}`);
    const filteredNotify = notifications?.filter(
      (n) => n.channelId !== channel._id
    );
    dispatch(handleRemoveNotifications(filteredNotify));
  };

  const items: MenuProps["items"] = [
    {
      label: "Delete Channel",
      key: "1",
      icon: <DeleteOutlined />,
      style: { color: "red" },
      onClick: () => deleteChannle(channel._id),
    },
  ];

  const deleteChannle = (id: string) => {
    axios
      .delete(`/api/channel/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      })
      .then((res) => {
        console.log("Channel deleted");
        dispatch(handleFetchAgain());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <List.Item
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background:
          selectedChanel?._id === channel?._id ? "rgb(82, 196, 26)" : "#f7f7f7",
        borderRadius: 10,
        cursor: "pointer",
        padding: "6px 10px",
        color: selectedChanel?._id === channel._id ? "#fff" : "",
        marginTop: 7,
      }}
      className="item__hover"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => handleJoinChat(channel)}
        >
          <BorderlessTableOutlined
            style={{ fontSize: 12, fontWeight: 700, marginRight: 4 }}
          />
          <Tooltip title={channel.channelName} placement="right">
            <Typography.Title
              level={5}
              style={{ color: "inherit", fontSize: "14px" }}
              ellipsis
            >
              {channel.channelName}
            </Typography.Title>
          </Tooltip>
        </span>
        {channel.creator?._id === currentUser?._id && !channel?.isGeneral && (
          <Dropdown
            menu={{ items }}
            placement="topRight"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              icon={<SettingOutlined style={{ color: "#333" }} />}
              size="small"
              type="ghost"
            />
          </Dropdown>
        )}
      </div>
    </List.Item>
  );
};

export default ChannelItem;
