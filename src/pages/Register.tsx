import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input } from "antd";
import axios from "config/axios";
import { handleLoginUser } from "config/slices/auth";
import { useAppDispatch, useAppSelector } from "config/store";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  React.useEffect(() => {
    if (currentUser) {
      navigate("/channel/@me");
    }
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    axios
      .post("/api/users/register", values)
      .then((res) => {
        setLoading(false);
        dispatch(handleLoginUser(res.data.user));
        navigate("/channel/@me");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ minWidth: "320px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Image src="/images/st-logo.svg" alt="Simplitaught" preview={false} />
        </div>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: "100%" }}
            size="large"
            loading={loading}
          >
            Register
          </Button>
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <p>Or</p>
            <Link to="/" style={{ textDecoration: "underline" }}>
              Login now!
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
