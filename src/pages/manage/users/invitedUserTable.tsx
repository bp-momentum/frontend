import { Button, Input, message, Popconfirm, Table } from "antd";
import React, {
  createRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Routes from "../../../util/routes";
import { getColumnSearchProps } from "./tableSearch";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AlignType } from "rc-table/lib/interface";
import Translations from "../../../localization/translations";
import { t } from "i18next";
import useApi from "../../../util/api";

interface User {
  key: string;
  name: string;
  email: string;
}

interface invitedUserTableProps {
  updateValue: number;
  setUpdateValue: Dispatch<SetStateAction<number>>;
}

const InvitedUserTable: React.FC<invitedUserTableProps> = ({ ...props }) => {
  const { updateValue } = props;

  const searchInput = createRef<Input>();
  const [data, setData] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  const [update, setUpdate] = useState(updateValue);

  const api = useApi();

  const fetchUsers = async () => {
    const response = await api.execute(Routes.getInvited());

    if (!response) return [];

    if (!response.success) {
      message.error(response.description);
      return [];
    }

    const userList: User[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data.invited.forEach((invite: Record<string, any>) => {
      userList.push({
        key: invite.id,
        name: `${invite.first_name} ${invite.last_name}`,
        email: invite.email || <i>{t(Translations.userManagement.noEmail)}</i>,
      });
    });
    userList.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
    return userList;
  };

  const loadData = () => {
    fetchUsers().then((users) => {
      if (!isMounted) return;
      setData(users);
    });
  };

  if (updateValue !== update) {
    setUpdate(updateValue);
    loadData();
  }

  const cancelInvitation = async (id: string) => {
    api
      .execute(Routes.invalidateInvitation({ invitationId: id }))
      .then((resp) => {
        if (!resp.success) {
          message.error(t(Translations.errors.internalServerError));
        } else {
          message.success(t(Translations.userManagement.canceledInvite));
        }
        loadData();
      });
  };

  useEffect(() => {
    loadData();

    return () => {
      // clean up
      setIsMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: t(Translations.userManagement.name),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps(
        "name",
        searchInput,
        loadData,
        t(Translations.userManagement.SearchName)
      ),
      render: (text: string) => (
        <span style={{ minWidth: "100px", display: "block" }}>{text}</span>
      ),
    },
    {
      title: t(Translations.userManagement.email),
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps(
        "email",
        searchInput,
        loadData,
        t(Translations.userManagement.SearchEmail)
      ),
      render: (text: string) => (
        <span style={{ minWidth: "150px", display: "block" }}>{text}</span>
      ),
    },
    {
      title: t(Translations.userManagement.revoke),
      key: "cancel",
      align: "right" as AlignType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: unknown, record: any) => (
        <div style={{ minWidth: "150px" }}>
          <Popconfirm
            title={t(Translations.userManagement.cancelInviteConfirm)}
            onConfirm={() => cancelInvitation(record.key)}
            okText={t(Translations.confirm.yes)}
            okType="danger"
            cancelText={t(Translations.confirm.no)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger value={record}>
              {t(Translations.userManagement.revoke)}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      style={{ background: "transparent" }}
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
    ></Table>
  );
};

export default InvitedUserTable;
