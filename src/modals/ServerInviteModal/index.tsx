import { CopyOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Input,
  List,
  Modal,
  Skeleton,
  Tooltip,
  Typography,
} from "antd";
import axios from "config/axios";
import { publishMessage } from "config/client";
import { useAppDispatch, useAppSelector } from "config/store";
import { USER_NOTIFICATION_FROM_CLIENT_TO_SERVER } from "config/subTypes";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useLocation } from "react-router-dom";

interface Props {
  open: boolean;
  handleClose: () => void;
  serverId: string;
}

const ServerInviteModal = ({ open, handleClose, serverId }: Props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const selectedServer = useAppSelector((state) => state.chat.selectedServer);
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isCopied, setCopied] = React.useState<boolean>(false);
  const [inviteLink, setLink] = React.useState<string>("");
  const [isSend, setSendInvitation] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open) {
      handleCreateInviteLink();
    }
  }, [open]);

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

  const handleCreateInviteLink = () => {
    axios
      .get(`/api/invites/create/${serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const link = window.location.origin + "/invite/" + data.linkId;
        setLink(link);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseModal = () => {
    setLink("");
    handleClose();
  };

  const handleInviteFriend = (userId: string) => {
    const payload = {
      from: currentUser?._id,
      to: userId,
      type: "SERVER_INVITATION",
      serverId,
    };
    publishMessage(
      USER_NOTIFICATION_FROM_CLIENT_TO_SERVER,
      JSON.stringify(payload)
    );
    setSendInvitation(true);
  };

  const invitationSentStatus = (userId: string): boolean => {
    if (selectedServer) {
      return selectedServer.users?.some((u: any) => u._id === userId)
        ? true
        : false;
    } else {
      return false;
    }
  };

  return (
    <Modal
      title={
        <div>
          <Typography.Title level={4}>
            Invite friends to{" "}
            <strong style={{ color: "rgb(82, 196, 26)" }}>
              {selectedServer?.name}
            </strong>
          </Typography.Title>
          <Typography.Text>#general</Typography.Text>
        </div>
      }
      centered
      open={open}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      closable={true}
      footer={null}
    >
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        size="large"
        placeholder="Search for friends"
      />

      <List className="scroll__div" style={{ maxHeight: 250, marginTop: 10 }}>
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
                  justifyContent: "space-between",
                  background: "#f7f7f7",
                  borderRadius: 10,
                  cursor: "pointer",
                  padding: "6px 15px",
                  marginBottom: 5,
                }}
                // className="item__hover"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Avatar
                    icon={<UserOutlined />}
                    shape="circle"
                    style={{ marginRight: 10 }}
                    size="small"
                  />
                  <Typography.Title level={5} style={{ color: "inherit" }}>
                    {user.username}
                  </Typography.Title>
                </div>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => handleInviteFriend(user._id)}
                  disabled={invitationSentStatus(user._id) || isSend}
                >
                  {invitationSentStatus(user._id) || isSend ? "Sent" : "Send"}
                </Button>
              </List.Item>
            ))}
          </>
        )}
      </List>
      <Divider style={{ margin: "10px 0px" }}>
        OR SEND A SERVER INVITE LINK TO A FRIEND
      </Divider>
      {inviteLink && (
        <Input.Group compact style={{ display: "flex" }}>
          <Input defaultValue={inviteLink} size="middle" />
          <Tooltip title="copy invite url">
            <CopyToClipboard
              text={inviteLink}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            >
              {isCopied ? (
                <Button>Copied</Button>
              ) : (
                <Button icon={<CopyOutlined />} />
              )}
            </CopyToClipboard>
          </Tooltip>
        </Input.Group>
      )}
    </Modal>
  );
};

export default ServerInviteModal;
