import { Col, message, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import ActivityCalendarCard from "./components/cards/activityCalendarCard";
import DailySummaryCard from "./components/cards/dailySummaryCard";
import UserCard from "./components/cards/userCard";
import { Avatar, ProfileData } from "@pages/profile/user/types";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { changeUsername } from "@redux/profile/profileSlice";

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

/**
 * The user's profile page.
 * @param {Props} props The props
 * @returns {JSX.Element} The component
 */
const SubPageProfile: React.FC<Props> = ({
  profileData,
  setProfileData,
}: Props): JSX.Element => {
  const api = useApi();

  const username = useAppSelector((state) => state.profile.username) || "";

  const dispatch = useAppDispatch();

  const saveUsername = async (newUsername: string) => {
    if (newUsername === username) {
      return;
    }
    const result = await api.execute(
      Routes.changeUsername({ username: newUsername })
    );
    dispatch(changeUsername(newUsername));
    if (!result.success) {
      message.error(result.description);
    }
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

  const saveNewAvatar = async (newAvatar: Avatar) => {
    if (
      newAvatar.hairColor === profileData.avatar.hairColor &&
      newAvatar.hairStyle === profileData.avatar.hairStyle &&
      newAvatar.eyeColor === profileData.avatar.eyeColor &&
      newAvatar.skinColor === profileData.avatar.skinColor
    ) {
      return;
    }
    const result = await api.execute(
      Routes.changeAvatar({ avatar: newAvatar })
    );
    if (!result.success) {
      message.error(result.description);
    }
    setProfileData(mergeData(profileData, { avatar: newAvatar }));
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
            avatar={profileData.avatar}
            username={username}
            accountCreated={profileData.accountCreated}
            motivation={profileData.motivation}
            saveNewUsername={saveUsername}
            saveNewMotivation={saveMotivation}
            saveNewAvatar={saveNewAvatar}
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
