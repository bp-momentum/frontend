import { Col, message, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setRefreshToken, setToken } from "../../../../redux/token/tokenSlice";
import useApi from "../../../../util/api";
import Helper from "../../../../util/helper";
import Routes from "../../../../util/routes";
import ActivityCalendarCard from "./components/cards/activity_calendar_card";
import DailySummaryCard from "./components/cards/daily_summary_card";
import TrainerCard from "./components/cards/trainer_card";
import UserCard from "./components/cards/user_card";

function mergeData<Type>(data: Type, newData: Record<string, unknown>): Type {
  return {
    ...data,
    ...newData,
  };
}

interface Props {
  profileData: ProfileData;
  setProfileData: (profileData: ProfileData) => void;
}

const SubPageProfile: React.FC<Props> = ({ profileData, setProfileData }) => {
  const token = useAppSelector((state) => state.token.token);

  const api = useApi();
  const dispatch = useAppDispatch();

  const saveUsername = async (newUsername: string) => {
    if (newUsername === Helper.getUserName(token ?? "")) {
      return;
    }
    const result = await api.execute(
      Routes.changeUsername({ username: newUsername })
    );
    if (!result.success) {
      message.error(result.description);
    }

    const sessionToken = result.data.session_token;
    const refreshToken = result.data.refresh_token;
    dispatch(setToken(sessionToken));
    dispatch(setRefreshToken(refreshToken));
  };

  const saveMotivation = async (newMotivation: string) => {
    if (newMotivation === profileData.motivation) {
      return;
    }
    const result = await api.execute(
      Routes.changeMotivation({ motivation: newMotivation })
    );
    if (!result.success) {
      message.error(result.description);
    }
    setProfileData(mergeData(profileData, { motivation: newMotivation }));
  };

  const saveNewAvatar = async (newAvatarId: number) => {
    if (newAvatarId === profileData.avatarId) {
      return;
    }
    const result = await api.execute(
      Routes.changeAvatar({ avatarId: newAvatarId })
    );
    if (!result.success) {
      message.error(result.description);
    }
    setProfileData(mergeData(profileData, { avatarId: newAvatarId }));
  };

  const onClickShare = () => {
    message.error("Coming soon™");
  };

  return (
    <Content style={{ height: "100%", overflow: "auto" }}>
      <Row gutter={16} justify="space-around" style={{ margin: 0 }}>
        <Col
          className="gutter-row"
          span={10}
          style={{ marginTop: "30px", minWidth: "450px" }}
        >
          <UserCard
            avatarId={profileData.avatarId}
            username={Helper.getUserName(token ?? "")}
            accountCreated={profileData.accountCreated}
            motivation={profileData.motivation}
            saveNewUsername={saveUsername}
            saveNewMotivation={saveMotivation}
            saveNewAvatarId={saveNewAvatar}
          />
        </Col>
        <Col className="gutter-row" span={10} style={{ minWidth: "450px" }}>
          <TrainerCard
            name={profileData.trainerName}
            address={profileData.trainerAddress}
            phone={profileData.trainerPhone}
            email={profileData.trainerEmail}
          />
        </Col>
        <Col className="gutter-row" span={10} style={{ minWidth: "450px" }}>
          <ActivityCalendarCard />
        </Col>
        <Col
          className="gutter-row"
          span={10}
          style={{ marginBottom: "30px", minWidth: "450px" }}
        >
          <DailySummaryCard
            rating={profileData.dailyRating}
            minutesTrained={profileData.minutesTrained}
            minutesTrainedGoal={profileData.minutesTrainedGoal}
            doneExercises={profileData.doneExercises}
            onClickShare={onClickShare}
          />
        </Col>
      </Row>
    </Content>
  );
};

export default SubPageProfile;
