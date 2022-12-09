import { BellFilled, InboxOutlined, TeamOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Popover, Tooltip, Typography } from "antd";

import axios from "config/axios";
import { client } from "config/client";
import {
  handlePushUserNotification,
  handleSetUserNotifications,
} from "config/slices/auth";
import { useAppDispatch, useAppSelector } from "config/store";
import { USER_NOTIFICATION_FROM__SERVER_TO_CLIENT } from "config/subTypes";
import React from "react";
import NotificationItem from "./NotificationItem";

const ActionMenu = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const notifications = useAppSelector((state) => state.auth.notifications);

  React.useEffect(() => {
    axios
      .get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      })
      .then(({ data }) => {
        dispatch(handleSetUserNotifications(data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    client.onMessageArrived = (message) => {
      if (
        message.destinationName === USER_NOTIFICATION_FROM__SERVER_TO_CLIENT
      ) {
        const payloadString = message.payloadString;
        const payload = JSON.parse(payloadString);
        if (currentUser?._id === payload.to) {
          dispatch(handlePushUserNotification(payload));
        }
      }
    };
  }, []);

  const content = (
    <div
      style={{ width: 260, maxHeight: 350, paddingRight: 10 }}
      className="scroll__div"
    >
      <Divider style={{ margin: 0 }} />
      {notifications.length > 0 ? (
        <>
          {notifications.map((nt: any, idx: number) => (
            <NotificationItem
              key={nt._id}
              data={nt}
              isLast={notifications.length - 1 === idx}
            />
          ))}
        </>
      ) : (
        <div style={{ textAlign: "center", minHeight: 100 }}>
          <Typography.Text>No new notifications</Typography.Text>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Popover
        content={content}
        title="Notifications"
        trigger="hover"
        placement="bottomRight"
        style={{ paddingRight: 0 }}
        overlayClassName="notifications"
      >
        <Badge count={notifications.length} size="small">
          <Button
            icon={<BellFilled style={{ fontSize: "16px" }} />}
            type="ghost"
            shape="circle"
            size="small"
          />
        </Badge>
      </Popover>

      <Tooltip title="Show Member List" placement="bottomRight">
        <Button
          icon={<TeamOutlined style={{ fontSize: "16px" }} />}
          type="ghost"
          shape="circle"
          size="small"
        />
      </Tooltip>
      <Tooltip title="Inbox" placement="bottomRight">
        <Button
          icon={<InboxOutlined style={{ fontSize: "16px" }} />}
          type="ghost"
          shape="circle"
          size="small"
        />
      </Tooltip>
    </div>
  );
};

export default ActionMenu;
