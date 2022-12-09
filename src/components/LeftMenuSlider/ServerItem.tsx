import { Avatar, Tooltip } from "antd";
import { ServerType } from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import { useNavigate } from "react-router-dom";

interface Props {
  server: ServerType;
}

const ServerItem = ({ server }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedServer = useAppSelector((state) => state.chat.selectedServer);
  const handleJoinServer = (server: any) => {
    // dispatch(handleSelectServer(server));
    navigate(`/channel/${server._id}`);
  };
  return (
    <div style={{ marginBottom: "5px", position: "relative" }}>
      {selectedServer?._id === server._id && (
        <div
          style={{
            position: "absolute",
            top: 5,
            left: -8,
            width: 6,
            height: 30,
            background: "rgb(82, 196, 26)",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
      )}

      <Tooltip title={server.name} placement="right">
        <Avatar
          shape="circle"
          style={{ cursor: "pointer" }}
          size="large"
          onClick={() => handleJoinServer(server)}
          src={server?.image?.url}
        >
          {`${server.name}`.slice(0, 2)}
        </Avatar>
      </Tooltip>
    </div>
  );
};

export default ServerItem;
