import React, { useCallback, useState } from "react";
import { Layout, Menu, Modal } from "antd";
import { Header } from "antd/lib/layout/layout";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import { MenuInfo } from "rc-menu/lib/interface";
import { useNavigate } from "react-router";
import InstructionOverlay from "./instructionsOverlay";
import { useAppSelector } from "@redux/hooks";
const { Content } = Layout;

interface Props {
  exercise?: ExerciseData;
  children: React.ReactNode;
}

/**
 * The layout for the training page
 * @param {Props} props The props
 * @returns {JSX.Element} The component
 */
const TrainLayout: React.FC<Props> = ({
  children,
  exercise,
}: Props): JSX.Element => {
  const [overlay, setOverlay] = useState(false);

  const { t } = useTranslation();

  const currentSet = useAppSelector((state) => state.trainingScore.currentSet);

  const menuCancel = {
    key: "cancel",
    icon: <CloseCircleOutlined />,
    label: t(Translations.confirm.cancel),
  };

  const menuStatus = {
    key: "status",
    label: (
      <span style={{ color: "black" }}>
        {currentSet + 1 + "/" + exercise?.sets}
      </span>
    ),
    style: { marginLeft: "auto", marginRight: "auto", cursor: "default" },
    disabled: true,
  };

  const menuInstructions = {
    key: "instructions",
    icon: <InfoCircleOutlined />,
    label: t(Translations.training.instructions),
  };

  const navigate = useNavigate();

  const onClick = useCallback(
    (info: MenuInfo) => {
      switch (info.key) {
        case "cancel":
          Modal.confirm({
            title: t(Translations.common.confirmLeave),
            content: t(Translations.common.confirmLeaveProgress),
            okText: t(Translations.confirm.yes),
            cancelText: t(Translations.confirm.no),
            onOk: () => {
              navigate("/");
            },
          });
          break;
        case "instructions":
          setOverlay(true);
          break;
      }
    },
    [navigate, t]
  );

  const menuItems = [menuCancel, menuStatus, menuInstructions];

  return (
    <>
      <Layout style={{ height: "100%" }}>
        <Content
          className="shadow"
          style={{
            background: "#466995",
            overflow: "hidden",
            height: "100%",
          }}
        >
          {children}
        </Content>
        <Header style={{ backgroundColor: "#fff" }}>
          <Menu
            mode="horizontal"
            selectedKeys={[]}
            onClick={onClick}
            items={menuItems}
          />
        </Header>
      </Layout>
      {overlay && exercise && (
        <>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setOverlay(false)}
          />
          <div
            style={{
              position: "absolute",
              width: "calc(100% - 200px)",
              height: "calc(100% - 200px)",
              top: 0,
              left: 0,
              margin: "100px",
            }}
          >
            <InstructionOverlay
              exercise={exercise}
              onClose={() => {
                setOverlay(false);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TrainLayout;
