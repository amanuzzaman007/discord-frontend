import { CaretRightOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Tooltip, Typography } from "antd";
import axios from "config/axios";
import { useAppSelector } from "config/store";
import CreateChannelModal from "modals/CreateChannelModal";
import React from "react";
import ChannelItem from "./ChannelItem";
import "./styles.css";

const { Panel } = Collapse;

interface Props {
  category: any;
  getCategoryList: () => void;
}

const CategoryItem: React.FC<Props> = ({ category, getCategoryList }) => {
  const token = useAppSelector((state) => state.auth.currentUser?.token);

  const [openChannelModal, setOpenChannelModal] =
    React.useState<boolean>(false);
  const [channelList, setChannelList] = React.useState<any[]>([]);

  React.useEffect(() => {
    getChannelList();
  }, []);

  const getChannelList = () => {
    axios
      .get(
        `/api/channel/category-channels/${category?.server}/${category._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        setChannelList(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const headerTemplate = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography.Title
        level={5}
        style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}
        ellipsis
      >
        {category.name}
      </Typography.Title>
      <Tooltip title="Create Channel">
        <Button
          icon={<PlusOutlined />}
          size="small"
          onClick={() => setOpenChannelModal(true)}
        />
      </Tooltip>
    </div>
  );
  return (
    <>
      <CreateChannelModal
        open={openChannelModal}
        handleClose={() => setOpenChannelModal(false)}
        onSuccess={() => {
          getChannelList();
        }}
        serverId={`${category.server}`}
        categoryId={category._id}
      />

      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{
          marginTop: 10,
          background: "none",
          padding: 0,
        }}
      >
        <Panel header={headerTemplate} key={1} style={{ padding: 0 }}>
          {channelList?.map((channel: any) => (
            <ChannelItem key={channel._id} channel={channel} />
          ))}
        </Panel>
      </Collapse>
    </>
  );
};

export default CategoryItem;
