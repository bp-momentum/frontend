import { Button, Input, InputRef, Space } from "antd";
import React, { RefObject } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Translations from "@localization/translations";
import { t } from "i18next";

export const getColumnSearchProps = (
  dataIndex: string,
  searchInput: RefObject<InputRef>,
  redraw: () => void,
  searchText: string
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInput}
        placeholder={searchText}
        value={selectedKeys[0]}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        onPressEnter={() => {
          confirm();
          redraw();
        }}
        style={{ marginBottom: 8, display: "block" }}
        autoComplete="off"
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            confirm();
            redraw();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ minWidth: 90 }}
        >
          {t(Translations.userManagement.search)}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            confirm();
            redraw();
          }}
          size="small"
          style={{ minWidth: 90 }}
        >
          {t(Translations.userManagement.reset)}
        </Button>
      </Space>
    </div>
  ),

  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilter: (value: string | number | boolean, record: any) =>
    typeof value === "string" && record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "",

  onFilterDropdownVisibleChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text: string) => text,
});
