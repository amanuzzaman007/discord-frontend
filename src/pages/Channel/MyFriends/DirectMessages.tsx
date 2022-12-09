import DirecMgsSliderLayout from "components/direct-messages/DirecMgsSliderLayout";
import LoggedUserBox from "components/LoggedUserBox";
import MessageBox from "components/MessageBox";
import { useAppSelector } from "config/store";
import React from "react";
import { useNavigate } from "react-router-dom";

const DirectMessages: React.FC = () => {
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!selectedChanel) {
      navigate("/channel/@me");
    }
  }, [selectedChanel, navigate]);

  return (
    <>
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

      <MessageBox />
    </>
  );
};

export default DirectMessages;
