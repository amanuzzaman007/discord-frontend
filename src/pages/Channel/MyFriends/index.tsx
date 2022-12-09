import DirecMgsSliderLayout from "components/direct-messages/DirecMgsSliderLayout";
import ViewLayout from "components/direct-messages/ViewLayout";
import LoggedUserBox from "components/LoggedUserBox";
import { handleSelectServer } from "config/slices/chat";
import React from "react";
import { useDispatch } from "react-redux";

const MyFriends: React.FC = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(handleSelectServer(null));
  }, []);
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

      <ViewLayout />
    </>
  );
};

export default MyFriends;
