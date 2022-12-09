import { UserOutlined } from "@ant-design/icons";
import { Avatar, Typography } from "antd";
import { useAppSelector } from "config/store";
import * as linkify from "linkifyjs";
import React from "react";
import RenderLink from "./RenderLink";

interface Props {
  content: any;
}

const EachContent = ({ content }: Props) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [isMyMessage, setIsMyMessage] = React.useState<boolean>(false);
  const [mgs, setmgs] = React.useState<string | React.ReactNode>("");
  const [otherLinks, setOtherLinks] = React.useState<any[]>([]);
  const [siteLinks, setSiteLinks] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (content.user[0]?._id === currentUser?._id) {
      setIsMyMessage(true);
    }
  }, [content, currentUser]);

  React.useEffect(() => {
    const results = linkify.find(content.content);
    if (results.length) {
      const otherLinks = results.filter((link) => link.type !== "url");
      const siteLinks = results.filter((link) => link.type === "url");

      if (otherLinks.length) {
        setOtherLinks(otherLinks);
      }
      if (siteLinks.length) {
        setSiteLinks(siteLinks);
      }

      // const requests = results.map((data) => {
      //   return axios
      //     .post("/api/messages/generate-link", {
      //       link: data.value,
      //     })
      //     .then((data) => data);
      // });

      // console.log({ requests });
    } else {
      setmgs(content.content);
    }
  }, []);

  console.log({ mgs });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        margin: "10px 0px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMyMessage ? "row-reverse" : "row",
          alignItems: "flex-end",
          maxWidth: 450,
        }}
      >
        <div>
          <Avatar icon={<UserOutlined />} />
        </div>
        <span
          style={{
            marginLeft: isMyMessage ? 0 : 10,
            marginRight: isMyMessage ? 10 : 0,
            textAlign: isMyMessage ? "right" : "left",
          }}
        >
          <Typography.Text
            style={{
              fontSize: 10,
              marginLeft: isMyMessage ? 0 : 10,
              marginRight: isMyMessage ? 10 : 0,
              fontWeight: 500,
              color: "#a29c9c",
            }}
          >
            {content.user[0]?.username}
          </Typography.Text>
          <br />
          {mgs && (
            <Typography.Text
              style={{
                fontWeight: 500,
                background: isMyMessage ? "rgb(82 196 26 / 30%)" : "#eee",
                padding: "6px 15px",
                borderRadius: 15,
                display: "inline-block",
              }}
            >
              {mgs}
            </Typography.Text>
          )}

          {otherLinks.length > 0 &&
            otherLinks.map((lnk, idx) => (
              <Typography.Link
                key={idx}
                style={{
                  fontWeight: 500,
                  background: isMyMessage ? "rgb(82 196 26 / 30%)" : "#eee",
                  padding: "6px 15px",
                  borderRadius: 15,
                  display: "inline-block",
                }}
                href={lnk.href}
              >
                {lnk.value}
              </Typography.Link>
            ))}

          {siteLinks.length > 0 &&
            siteLinks.map((lnk, idx) => (
              <RenderLink key={idx} link={lnk} isMyMessage={isMyMessage} />
            ))}
        </span>
      </div>
    </div>
  );
};

export default React.memo(EachContent);
