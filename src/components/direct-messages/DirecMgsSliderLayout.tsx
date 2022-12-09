import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Layout, List, Typography } from "antd";
import axios from "config/axios";
import {
  handleSelectChannel,
  handleStoreDirectChatList,
} from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import SearchUserModal from "modals/SearchUserModal";
import React from "react";
import { useNavigate } from "react-router-dom";
import ChatItem from "./ChatItem";

const { Sider } = Layout;

const DirecMgsSliderLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const directChatList = useAppSelector((state) => state.chat.directChatList);
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const [openSearchModal, setOpenSearchModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    getDirectChatList();
  }, []);

  const getDirectChatList = () => {
    axios
      .get("/api/channel/direct-messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(handleStoreDirectChatList(data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ flex: 1 }}>
      <SearchUserModal
        open={openSearchModal}
        handleClose={() => setOpenSearchModal(false)}
      />
      <Sider
        trigger={null}
        collapsible={false}
        width={250}
        theme="light"
        style={{
          padding: "10px 0px",
          borderRight: "1px solid #eee",
          height: "100%",
        }}
      >
        <div
          style={{
            padding: "0px 10px 0px 10px",
            borderBottom: "1px solid #eee",
            minHeight: 35,
          }}
        >
          <Button block size="small" onClick={() => setOpenSearchModal(true)}>
            Find or Start a conversation
          </Button>
        </div>

        <div style={{ padding: "10px" }}>
          <List>
            <List.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                background: !selectedChanel ? "rgb(82, 196, 26)" : "#f7f7f7",
                borderRadius: 10,
                cursor: "pointer",
                padding: "6px 10px",
                color: !selectedChanel ? "#fff" : "",
              }}
              className="item__hover"
              onClick={() => {
                dispatch(handleSelectChannel(null));
                navigate(`/channel/@me`);
              }}
            >
              <span>
                <TeamOutlined
                  style={{ fontSize: 14, fontWeight: 700, marginRight: 10 }}
                />
              </span>
              <Typography.Title
                level={5}
                style={{ color: "inherit", fontSize: "14px" }}
              >
                Friends
              </Typography.Title>
            </List.Item>
          </List>

          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Typography.Title level={5}>Direct Messages</Typography.Title>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setOpenSearchModal(true)}
            />
          </div>
          <br />

          {/* Friend list for direct message */}
          <List>
            {directChatList.map((chat) => (
              <ChatItem key={chat._id} chat={chat} />
            ))}
          </List>
        </div>
      </Sider>
    </div>
  );
};

export default DirecMgsSliderLayout;
