import { CheckCircleFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, AvatarProps, Badge } from "antd";

interface Props extends AvatarProps {
  isActive?: boolean;
  offset?: [number, number];
  dotSize?: number;
}

const ActiveAvatar: React.FC<Props> = ({
  isActive = false,
  offset = [-7, 32],
  dotSize = 14,
  ...rest
}) => {
  return (
    <Badge
      count={
        <div
          style={{
            background: "#fff",
            display: "block",
            borderRadius: "100%",
            border: "1px solid #fff",
            padding: 0,
            // margin: 0,
          }}
        >
          <CheckCircleFilled style={{ color: "#52c41a", fontSize: dotSize }} />
        </div>
      }
      color="green"
      offset={offset}
      size="small"
    >
      <Avatar icon={<UserOutlined />} shape="circle" {...rest} />
    </Badge>
  );
};

export default ActiveAvatar;
