import { BorderlessTableOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import ActiveAvatar from "components/AciveAvatar";

interface Props {
  channelName: any;
}

const GroupGreetings = ({ channelName }: Props) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <ActiveAvatar
        isActive={true}
        size={90}
        offset={[18, 75]}
        dotSize={0}
        icon={<BorderlessTableOutlined />}
      />
      <Typography.Title>Welcome to #{channelName}!</Typography.Title>
      <Typography.Text>
        This is the start of the <strong>#{channelName}</strong> channel.
      </Typography.Text>
      <br />
      {/* <br />
      <Button type="primary">Add Friend</Button> */}
    </div>
  );
};

export default GroupGreetings;
