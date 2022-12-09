import { Divider, Typography } from "antd";
import { format } from "date-fns";
import EachContent from "./EachContent";

interface Props {
  data: any;
}

const MessageItem = ({ data }: Props) => {
  return (
    <div style={{ width: "100%" }}>
      <Divider>
        <Typography.Text>
          {format(new Date(data?._id), "dd MMM, yyyy")}
        </Typography.Text>
      </Divider>

      {/* messages */}
      <div>
        {data.messageByDate?.map((message: any) => (
          <EachContent key={message._id} content={message} />
        ))}
      </div>
    </div>
  );
};

export default MessageItem;
