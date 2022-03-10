import { Button, Form, Input, message } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/api";
import Routes from "@util/routes";

interface Props {
  reloadFriends: VoidFunction;
}

const AddFriend: React.FC<Props> = ({ reloadFriends }) => {
  const { t } = useTranslation();
  const api = useApi();

  const addFriend = (values: Record<string, never>) => {
    const username = values.username;
    api.execute(Routes.addFriend({ friendId: username })).then((response) => {
      if (!response) return;
      if (!response.success) {
        message.error(response.description ?? Translations.errors.unknownError);
        return;
      }
      message.success(response.description);
      reloadFriends();
    });
  };

  return (
    <Form onFinish={addFriend}>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={t(Translations.user.username)}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ display: "block", margin: "auto", width: "100%" }}
        >
          Add Fren
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddFriend;