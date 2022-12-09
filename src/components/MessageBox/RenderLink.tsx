import { LoadingOutlined } from "@ant-design/icons";
import { Image, Typography } from "antd";
import axios from "config/axios";
import { handleScrollAgain } from "config/slices/chat";
import { useAppDispatch } from "config/store";
import React from "react";
import ReactPlayer from "react-player";

interface Props {
  link: any;
  isMyMessage: boolean;
}

const RenderLink = ({ link, isMyMessage }: Props) => {
  const dispatch = useAppDispatch();
  const [details, setDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    setLoading(true);
    axios
      .post("/api/messages/generate-link", {
        link: link.value,
      })
      .then(({ data }) => {
        setLoading(false);
        setDetails(data);
        dispatch(handleScrollAgain());
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  return (
    <div>
      {!details ? (
        <Typography.Link
          style={{
            fontWeight: 500,
            background: isMyMessage ? "rgb(82 196 26 / 30%)" : "#eee",
            padding: "6px 15px",
            borderRadius: 15,
            display: "inline-block",
          }}
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          {link.value} {loading && <LoadingOutlined />}
        </Typography.Link>
      ) : (
        <div
          style={{
            fontWeight: 500,
            background: isMyMessage ? "rgb(82 196 26 / 30%)" : "#eee",
            padding: "6px 15px",
            borderRadius: 15,
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {details?.mediaType === "video.other" && (
            <ReactPlayer
              width={"100%"}
              height={250}
              url={"https://www.youtube.com/watch?v=MejbOFk7H6c"}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 },
                },
              }}
              style={{ borderRadius: 10, overflow: "hidden" }}
            />
          )}

          {details?.mediaType === "website" && (
            <Image
              src={details?.favicons[0]}
              alt={details?.title}
              style={{ width: "100px", height: "100px" }}
              preview={false}
            />
          )}

          <Typography.Title level={4}>{details?.title}</Typography.Title>
          <Typography.Text>{details?.description}</Typography.Text>
          <br />
          <Typography.Link href={details.url} target="_blank" rel="noreferrer">
            {details.url}
          </Typography.Link>
        </div>
      )}
    </div>
  );
};

export default React.memo(RenderLink);
