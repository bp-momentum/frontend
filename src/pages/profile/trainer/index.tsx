import React, { useEffect } from "react";
import Container from "../../../shared/container";
import { Alert, Button, Col, Form, Input, Row, Space, message } from "antd";
import Translations from "../../../localization/translations";
import { useTranslation } from "react-i18next";
import Routes from "../../../util/routes";
import useApi from "../../../util/api";

const TrainerProfile: React.FC = () => {
  const [data, setData] = React.useState<null | TrainerContact>(null);
  const [edited, setEdited] = React.useState(false);
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>(null);
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    loadContactInformation().catch((e) => message.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContactInformation = async () => {
    const response = await api.execute(Routes.getTrainerContact());
    if (!response || !response.success) {
      message.error(
        response.description ?? t(Translations.errors.unknownError)
      );
      return;
    }
    setData(response.data as TrainerContact);
  };

  const onFinish = async (values: Record<string, never>) => {
    setError(null);
    const academia = values["academia"] ?? "";
    const telephone = values["telephone"] ?? "";
    const street = values["street"] ?? "";
    const houseNr = values["house_nr"] ?? "";
    const city = values["city"] ?? "";
    const country = values["country"] ?? "";
    const postalCode = values["postal_code"] ?? "";
    const addressAddition = values["address_add"] ?? "";

    const responses = await Promise.all([
      api.execute(Routes.changeTelephone({ telephone: telephone })),
      api.execute(Routes.changeAcademia({ academia: academia })),
      api.execute(
        Routes.changeLocation({
          street: street,
          city: city,
          houseNr: houseNr,
          country: country,
          addressAddition: addressAddition,
          postalCode: postalCode,
        })
      ),
    ]);
    for (const response of responses) {
      if (!response || !response.success) {
        setError(response.description ?? t(Translations.errors.unknownError));
        return;
      }
    }
    setSuccess(t(Translations.trainerProfile.success));
    setEdited(false);
    setTimeout(() => setSuccess(null), 5000);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Container
      currentPage="profile"
      color="blue"
      confirmLeaveMessage={
        edited ? (t(Translations.common.confirmLeaveChanges) as string) : false
      }
    >
      <Space
        size="large"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Col>
          <Row
            justify="center"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          >
            {t(Translations.trainerProfile.title, { name: data?.name })}
          </Row>
          <Row justify="center">{t(Translations.trainerProfile.subtitle)}</Row>
        </Col>
        <Row justify="center">
          <Col>
            <Form
              name="trainer_contact"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValuesChange={() => {
                setError(null);
                setEdited(true);
              }}
              autoComplete="off"
              style={{ width: "350px" }}
            >
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: "20px" }}
                />
              )}

              {success && (
                <Alert
                  message={success}
                  type="success"
                  showIcon
                  style={{ marginBottom: "20px" }}
                />
              )}

              <Form.Item
                label={t(Translations.trainerProfile.academia)}
                name="academia"
              >
                <Input value={data?.academia} />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.telephone)}
                name="telephone"
              >
                <Input value={data?.telephone} type="tel" />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.street)}
                name="street"
              >
                <Input value={data?.street} />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.houseNr)}
                name="house_nr"
              >
                <Input value={data?.house_nr} />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.country)}
                name="country"
              >
                <Input value={data?.country} />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.postalCode)}
                name="postal_code"
              >
                <Input value={data?.postal_code} />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.city)}
                name="city"
              >
                <Input value={data?.city} />
              </Form.Item>

              <Form.Item
                label={t(Translations.trainerProfile.addressAddition)}
                name="address_add"
              >
                <Input value={data?.address_addition} />
              </Form.Item>

              <Form.Item>
                <Button
                  disabled={success !== null}
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  {t(Translations.trainerProfile.submit)}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
    </Container>
  );
};

export default TrainerProfile;
