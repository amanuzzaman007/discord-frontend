import { LogoutOutlined } from "@ant-design/icons";
import { Layout, MenuProps } from "antd";
import DirecMgsSliderLayout from "components/direct-messages/DirecMgsSliderLayout";
import ViewLayout from "components/direct-messages/ViewLayout";
import LeftMenuSlider from "components/LeftMenuSlider";
import LoggedUserBox from "components/LoggedUserBox";
import MessageBox from "components/MessageBox";
import { handleLogoutUser } from "config/slices/auth";
import { useAppDispatch, useAppSelector } from "config/store";
import React, { useState } from "react";

const { Header, Sider, Content } = Layout;

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: "1",
      icon: <LogoutOutlined />,
      onClick: () => dispatch(handleLogoutUser()),
    },
  ];

  const menuProps = {
    items,
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Left Slider Menu */}
      <LeftMenuSlider />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* direct message */}
        <DirecMgsSliderLayout />

        {/* logged user box */}
        <LoggedUserBox />
      </div>

      {selectedChanel ? <MessageBox /> : <ViewLayout />}
    </Layout>
  );
};

export default Chat;
