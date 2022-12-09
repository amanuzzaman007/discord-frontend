import { MessageFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Layout, Skeleton, Space, Tooltip } from "antd";
import axios from "config/axios";
import { handleSelectServer, handleStoreServers } from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import CreateServerModal from "modals/CreateServerModal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerItem from "./ServerItem";

const { Sider } = Layout;

const LeftMenuSlider = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const fetchAgain = useAppSelector((state) => state.chat.fetchAgain);
  const selectedChanel = useAppSelector((state) => state.chat.selectedChanel);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getServerList();
  }, [fetchAgain]);

  const getServerList = () => {
    setLoading(true);
    axios
      .get("/api/servers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        if (data?.length > 0) {
          setServers(data);
          dispatch(handleStoreServers(data));
          if (selectedChanel?.isGroupChat) {
            navigate(`/channel/${data[0]?._id}`);
          }
        } else {
          navigate("/channel/@me");
          dispatch(handleSelectServer(null));
          setServers([]);
          dispatch(handleStoreServers([]));
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <CreateServerModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        onSuccess={() => getServerList()}
      />
      <Sider
        trigger={null}
        collapsible={false}
        width="auto"
        theme="light"
        style={{
          padding: "8px",
          borderRight: "1px solid #eee",
          height: "100vh",
        }}
        className="scroll__div"
      >
        <Tooltip title="Direct Messages" placement="right">
          <Button
            icon={<MessageFilled />}
            style={{ cursor: "pointer" }}
            size="large"
            onClick={() => {
              navigate("/channel/@me");
              dispatch(handleSelectServer(null));
            }}
          />
        </Tooltip>
        <Divider style={{ margin: "10px 0px" }} />
        {loading ? (
          <Space direction="vertical">
            <Skeleton.Avatar active={true} size="large" shape="circle" />
            <Skeleton.Avatar active={true} size="large" shape="circle" />
            <Skeleton.Avatar active={true} size="large" shape="circle" />
            <Skeleton.Avatar active={true} size="large" shape="circle" />
          </Space>
        ) : (
          <>
            {servers.map((server: any) => (
              <ServerItem key={server._id} server={server} />
            ))}
          </>
        )}

        <div style={{ marginTop: 8 }}>
          <Tooltip title="Add a Server" placement="right">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              style={{
                color: "#fff",
              }}
              shape="circle"
              onClick={() => setOpenModal(true)}
            />
          </Tooltip>
        </div>
      </Sider>
    </>
  );
};

export default LeftMenuSlider;
