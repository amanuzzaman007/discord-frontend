import {
  BorderlessTableOutlined,
  DeleteOutlined,
  DownOutlined,
  FolderAddOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Layout,
  List,
  MenuProps,
  Space,
  Typography,
} from "antd";
import axios from "config/axios";
import {
  handleFetchAgain,
  handleRemoveNotifications,
  handleSelectChannel,
  handleSelectServer,
} from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import CreateCategoryModal from "modals/CreateCategoryModal";
import CreateChannelModal from "modals/CreateChannelModal";
import SearchUserModal from "modals/SearchUserModal";
import ServerInviteModal from "modals/ServerInviteModal";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryItem from "./CategoryItem";
import ChannelItem from "./ChannelItem";

const { Sider } = Layout;

const ChannelList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const selectedServer = useAppSelector((state) => state.chat.selectedServer);
  const notifications = useAppSelector((state) => state.chat.notificationsList);
  const fetchAgain = useAppSelector((state) => state.chat.fetchAgain);
  const [openSearchModal, setOpenSearchModal] = React.useState<boolean>(false);
  const [openCategoryModal, setOpenCategoryModal] =
    React.useState<boolean>(false);
  const [openChannelModal, setOpenChannelModal] =
    React.useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = React.useState<boolean>(false);
  const [channelList, setChannelList] = React.useState<any[]>([]);
  const [categoryList, setCategoryList] = React.useState<any[]>([]);
  const { serverId } = params;
  React.useEffect(() => {
    if (serverId) {
      getServer();
      getChannelList();
      getCategoryList();
    }
  }, [serverId, fetchAgain]);

  const handleJoinChat = (ct: any) => {
    dispatch(handleSelectChannel(ct));
    navigate(`/channel/${ct.server}/${ct._id}`);
    const filteredNotify = notifications?.filter((n) => n.channelId !== ct._id);
    dispatch(handleRemoveNotifications(filteredNotify));
  };

  const getServer = () => {
    axios
      .get(`/api/servers/${params?.serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(handleSelectServer(data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getChannelList = () => {
    axios
      .get(`/api/channel/server-channels/${params?.serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setChannelList(data.data);
        if (data.data?.length > 0) {
          handleJoinChat(data.data[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategoryList = () => {
    axios
      .get(`/api/servers/category-list/${params?.serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setCategoryList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteServer = () => {
    axios
      .delete(`/api/servers/delete/${params?.serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(handleFetchAgain());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const leaveFromServer = () => {
    axios
      .put(
        `/api/servers/leave/${params?.serverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        dispatch(handleFetchAgain());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "1") {
      setOpenInviteModal(true);
    } else if (key === "2") {
      setOpenCategoryModal(true);
    } else if (key === "3") {
      setOpenChannelModal(true);
    } else if (key === "4") {
      if (selectedServer?.creator._id === currentUser?._id) {
        deleteServer();
      } else {
        leaveFromServer();
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Invite People",
      key: "1",
      icon: <UserAddOutlined style={{ fontSize: 18 }} />,
    },
    {
      label: "Create Category",
      key: "2",
      icon: <FolderAddOutlined style={{ fontSize: 18 }} />,
    },
    {
      label: "Create Channel",
      key: "3",
      icon: <BorderlessTableOutlined style={{ fontSize: 18 }} />,
    },
    {
      label:
        selectedServer?.creator._id === currentUser?._id
          ? "Delete Server"
          : "Leave Server",
      key: "4",
      icon:
        selectedServer?.creator._id === currentUser?._id ? (
          <DeleteOutlined style={{ fontSize: 18 }} />
        ) : (
          <LogoutOutlined style={{ fontSize: 18 }} />
        ),
      style: { color: "red" },
    },
  ];

  return (
    <div style={{ flex: 1 }}>
      <SearchUserModal
        open={openSearchModal}
        handleClose={() => setOpenSearchModal(false)}
      />
      <CreateChannelModal
        open={openChannelModal}
        handleClose={() => setOpenChannelModal(false)}
        onSuccess={() => getChannelList()}
        serverId={`${params.serverId}`}
      />
      <CreateCategoryModal
        open={openCategoryModal}
        handleClose={() => setOpenCategoryModal(false)}
        onSuccess={() => getCategoryList()}
        serverId={`${params.serverId}`}
      />
      <ServerInviteModal
        open={openInviteModal}
        handleClose={() => setOpenInviteModal(false)}
        serverId={`${params.serverId}`}
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
            padding: "0px 10px 10px 10px",
            borderBottom: "1px solid #eee",
            minHeight: 35,
            overflow: "hidden",
          }}
        >
          <Dropdown menu={{ items, onClick }} arrow placement="bottomRight">
            <Space style={{ justifyContent: "space-between" }}>
              <div style={{ overflow: "hidden", width: 195 }}>
                <Typography.Title level={5} ellipsis>
                  {selectedServer?.name}
                </Typography.Title>
              </div>
              <Button icon={<DownOutlined />} size="small" />
            </Space>
          </Dropdown>
        </div>

        <div style={{ padding: "10px" }}>
          <List>
            {channelList.map((channel) => (
              <ChannelItem key={channel._id} channel={channel} />
            ))}
          </List>

          {/* category with channels */}
          {categoryList.map((category) => (
            <CategoryItem
              key={category._id}
              category={category}
              getCategoryList={getCategoryList}
            />
          ))}
        </div>
      </Sider>
    </div>
  );
};

export default ChannelList;
