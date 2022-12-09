import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Divider,
  Input,
  List,
  Modal,
  Skeleton,
  Typography,
} from "antd";
import axios from "config/axios";
import { handleSelectChannel } from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import React from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SearchUserModal = ({ open, handleClose }: Props) => {
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
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal
      title=""
      centered
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      closable={false}
      footer={null}
      bodyStyle={{
        minHeight: 350,
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
      </List>
    </Modal>
  );
};

export default SearchUserModal;
