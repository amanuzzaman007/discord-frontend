import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Layout } from "antd";
import LeftMenuSlider from "components/LeftMenuSlider";

const { Header, Sider, Content } = Layout;

const Channel: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    // navigate("/channel/@me");
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Left Slider Menu */}
      <LeftMenuSlider />

      <Outlet />
    </Layout>
  );
};
export default Channel;
