import ChannelList from "components/ChannelLayouts/ChannelList";
import LoggedUserBox from "components/LoggedUserBox";
import { useAppSelector } from "config/store";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ChatServer: React.FC = () => {
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const navigate = useNavigate();
  // React.useEffect(() => {
  //   if (!selectedChanel) {
  //     navigate("/channel/@me");
  //   }
  // }, [selectedChanel, navigate]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* channel message */}
        <ChannelList />

        {/* logged user box */}
        <LoggedUserBox />
      </div>
      <Outlet />
      {/* <MessageBox /> */}
    </>
  );
};

export default ChatServer;
