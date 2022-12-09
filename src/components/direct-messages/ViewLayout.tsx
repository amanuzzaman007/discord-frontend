import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Divider,
  Input,
  Layout,
  List,
  Skeleton,
  Typography,
} from "antd";
import ActionMenu from "components/ActionMenu";
import axios from "config/axios";
import { handleSelectChannel } from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import * as animationData from "lottie-files/finduser.json";
import React from "react";
import Lottie from "react-lottie";

const { Header, Content } = Layout;

const ViewLayout = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSearch = (keywords: string) => {
    setQuery(keywords);
    setLoading(true);
    axios
      .get(`/api/users?search=${keywords}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setResults(data.users);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleCreateDirectMessage = (user: any) => {
    axios
      .post(
        `/api/channel/create-direct-message`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        dispatch(handleSelectChannel(data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 10 }}>
              <TeamOutlined style={{ fontSize: 22 }} />
            </span>
            <Typography.Title level={3}>Friends</Typography.Title>
          </div>
          <Divider type="vertical" style={{ height: 25 }} />
        </div>
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
          padding: 24,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          size="large"
          placeholder="Where would you like to go?"
        />
        <Divider />
        <List>
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              {results.map((user) => (
                <List.Item
                  key={user._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    background: "#f7f7f7",
                    borderRadius: 10,
                    cursor: "pointer",
                    padding: "6px 15px",
                  }}
                  className="item__hover"
                  onClick={() => handleCreateDirectMessage(user)}
                >
                  <Avatar
                    icon={<UserOutlined />}
                    shape="circle"
                    style={{ marginRight: 10 }}
                  />
                  <Typography.Title level={5}>{user.username}</Typography.Title>
                </List.Item>
              ))}
            </>
          )}

          {results.length === 0 && !loading && (
            <Lottie options={defaultOptions} height={400} width={400} />
          )}
        </List>
      </Content>
    </Layout>
  );
};

export default ViewLayout;
