import { Typography } from "antd";
import ActiveAvatar from "components/AciveAvatar";

interface Props {
  receiver: any;
}

const DirectGreetings = ({ receiver }: Props) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <ActiveAvatar isActive={true} size={90} offset={[-18, 75]} dotSize={22} />
      <Typography.Title>{receiver?.username}</Typography.Title>
      <Typography.Text>
        This is the beginning of your direct message with{" "}
        <strong>@{`${receiver?.username}`.split(" ").join("").trim()}</strong>
      </Typography.Text>
      <br />
      {/* <br />
      <Button type="primary">Add Friend</Button> */}
    </div>
  );
};

export default DirectGreetings;
