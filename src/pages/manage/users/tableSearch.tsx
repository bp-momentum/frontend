import { Button, Input, InputRef, Space } from "antd";
import React, { RefObject } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Translations from "@localization/translations";
import { t } from "i18next";
import { ColumnProps } from "antd/lib/table/Column";

/**
 *
 * @param {string} dataIndex The data index of the column.
 * @param {RefObject<InputRef>} searchInput The search input.
 * @param {void} redraw The redraw function.
 * @param {string} searchText The search text.
 * @returns {ColumnSearchProps} The column props.
 */
export function getColumnSearchProps<Type>(
  dataIndex: string,
  searchInput: RefObject<InputRef>,
  redraw: () => void,
  searchText: string
): ColumnProps<Type> {
  return {
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
            {t(Translations.userManagement.search) as string}
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
            {t(Translations.userManagement.reset) as string}
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
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) => text,
  };
}
