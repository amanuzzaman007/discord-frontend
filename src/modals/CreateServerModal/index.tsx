import { CameraFilled } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import axios from "config/axios";
import { useAppDispatch, useAppSelector } from "config/store";
import React from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

const CreateServerModal = ({ open, handleClose, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const form = Form.useFormInstance();
  const token = useAppSelector((state) => state.auth.currentUser?.token);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file) {
      console.log({ info });
      if (info.file.originFileObj) {
        setFile(info.file.originFileObj);
      }
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageUrl(url);
        console.log({ url });
      });
    }
  };

  // form
  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (file) {
      formData.append("image", file);
    }
    setLoading(true);
    axios
      .post("/api/servers/create-server", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLoading(false);
        onSuccess();
        handleCloseModal();
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    console.log("close");
    setImageUrl("");
    setFile(null);
    handleClose();
    console.log("close done");
  };

  const uploadButton = (
    <div>
      <span style={{ fontSize: 30 }}>
        <CameraFilled />
      </span>
      <Typography.Title level={4}>Upload</Typography.Title>
    </div>
  );

  return (
    <Modal
      title="Customize your server"
      centered
      open={open}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      closable={true}
      footer={null}
      style={{ maxWidth: 360 }}
      bodyStyle={{
        textAlign: "center",
      }}
    >
      <Typography.Text style={{ fontWeight: 500 }} type="secondary">
        Give your new server a personality with a name and icon. You can always
        change it later.
      </Typography.Text>
      <br />
      <br />
      <Upload
        name="avatar"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        style={{
          borderRadius: 100,
        }}
      >
        {imageUrl ? (
          <Avatar src={imageUrl} alt="Server icon" size={100} />
        ) : (
          uploadButton
        )}
      </Upload>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        style={{ textAlign: "left" }}
      >
        <Form.Item
          label="SERVER NAME"
          name="name"
          rules={[
            { required: true, message: "Please input your server name!" },
          ]}
        >
          <Input placeholder="Server" />
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

export default CreateServerModal;
