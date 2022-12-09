import { LogoutOutlined, SettingFilled } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Typography } from "antd";
import ActiveAvatar from "components/AciveAvatar";
import { handleLogoutUser } from "config/slices/auth";
import { handleClearOnLogout } from "config/slices/chat";
import { useAppDispatch, useAppSelector } from "config/store";
import { useNavigate } from "react-router-dom";

const LoggedUserBox = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const items: MenuProps["items"] = [
    {
      label: "Logout",
      key: "1",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(handleLogoutUser());
        dispatch(handleClearOnLogout());
        navigate("/");
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        minHeight: 50,
        borderTop: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <ActiveAvatar
          style={{ cursor: "pointer" }}
          size="large"
          isActive={true}
        />
        <div style={{ marginLeft: 8 }}>
          <Typography.Title
            level={5}
            style={{ fontSize: 14, fontWeight: "bolder" }}
          >
            {currentUser?.username}
          </Typography.Title>

          <Typography.Text style={{ fontSize: "12px" }}>
            {currentUser?.email}
          </Typography.Text>
        </div>
      </div>

      <Dropdown
        menu={{ items }}
        placement="topRight"
        arrow={{ pointAtCenter: true }}
      >
        <Button
          icon={<SettingFilled style={{ fontSize: 18 }} />}
          type="ghost"
        />
      </Dropdown>
    </div>
  );
};

export default LoggedUserBox;
