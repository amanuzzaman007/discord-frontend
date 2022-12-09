import { Button, Form, Input, Modal } from "antd";
import axios from "config/axios";
import { useAppDispatch, useAppSelector } from "config/store";
import React from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
  serverId: string;
}

const CreateCategoryModal = ({
  open,
  handleClose,
  serverId,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const [loading, setLoading] = React.useState<boolean>(false);

  // form
  const onFinish = (values: any) => {
    const payload: any = {
      name: values?.name,
      serverId: serverId,
    };
    setLoading(true);
    axios
      .post(`/api/servers/create-category`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        onSuccess();
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Modal
      title="Create Category"
      centered
      open={open}
      onOk={handleClose}
      onCancel={handleClose}
      closable={true}
      footer={null}
      style={{ maxWidth: 360 }}
      bodyStyle={{
        textAlign: "center",
      }}
    >
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        style={{ textAlign: "left" }}
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: "Please input your server name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCategoryModal;
