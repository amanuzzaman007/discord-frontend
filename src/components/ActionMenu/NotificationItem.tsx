import { Button, Divider, Typography } from "antd";
import axios from "config/axios";
import { handleFetchAgain } from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import React from "react";

interface Props {
  data: any;
  isLast: boolean;
}

const NotificationItem = ({ data, isLast }: Props) => {
  const dispatch = useAppDispatch();

  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const serverList = useAppSelector((state) => state.chat.serverList);

  const acceptInvitation = () => {
    setAcceptLoading(true);
    axios
      .post(
        "/api/invites/accept",
        {
          serverId: data?.server._id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      )
      .then(({ data }) => {
        setAcceptLoading(false);
        dispatch(handleFetchAgain());
        // setTimeout(() => {
        //   navigate(`/channel/${data?.result._id}`);
        // }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setAcceptLoading(false);
      });
  };

  const isJoined = serverList.some(
    (server: any) => server._id === data?.server?._id
  );
  return (
    <div>
      <div>
        <Typography.Text style={{ fontSize: 12 }}>
          <strong>{data?.from?.username}</strong> has invited you to join{" "}
          <strong>{data?.server?.name}</strong>
        </Typography.Text>
        <br />
        {isJoined ? (
          <Button type="primary" size="small" disabled>
            Joined
          </Button>
        ) : (
          <Button
            type="primary"
            size="small"
            loading={acceptLoading}
            onClick={acceptInvitation}
          >
            Join
          </Button>
        )}
      </div>
      {!isLast && <Divider style={{ margin: "8px 0px 0px 0px" }} />}
    </div>
  );
};

export default NotificationItem;
