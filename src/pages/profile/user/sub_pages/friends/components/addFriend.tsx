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

/**
 * A form for adding a new friend.
 * @param {Props} props
 * @returns {JSX.Element}
 */
const AddFriend: React.FC<Props> = ({ reloadFriends }: Props): JSX.Element => {
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
      <Form.Item name="username">
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
          {t(Translations.friends.addFriend)}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddFriend;
