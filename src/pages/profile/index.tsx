import React, { useEffect } from "react";
import Container from "../../shared/container";
import { Col, Layout, message, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setRefreshToken, setToken } from "../../redux/token/tokenSlice";
import Helper from "../../util/helper";
import "../../styles/profile.css";
import api from "../../util/api";
import Routes from "../../util/routes";
import ProfileSider from "./components/profile_sider";
import TrainerCard from "./components/cards/trainer_card";
import {
  DoneExercise,
  getApproximateExerciseDurationMinutes,
} from "../../api/done_exercise";
import ActivityCalendarCard from "./components/cards/activity_calendar_card";
import DailySummaryCard from "./components/cards/daily_summary_card";
import UserCard from "./components/cards/user_card";
import ProfileLoadingView from "./components/profile_loading_view";
import { useNavigate } from "react-router";

function mergeData<Type>(data: Type, newData: Record<string, unknown>): Type {
  return {
    ...data,
    ...newData,
  };
}

const Profile: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [profileData, setProfileData] = React.useState<ProfileData | null>(
    null
  );

  useEffect(() => {
    if (!profileData) {
      loadProfile().catch((e) => message.error(e));
    }
  });

  const loadProfile = async () => {
    const results = await Promise.all([
      api.execute(Routes.getProfile()),
      api.execute(Routes.getTrainerContact()),
      api.execute(Routes.getDoneExercises()),
    ]);

    const profile = results[0];
    const trainerContact = results[1];
    const exercises = results[2];

    const todayDayName = Helper.getCurrentDayName();
    const doneExercises: DoneExercise[] = exercises.data.exercises ?? [];
    let trainedTodayReal = 0;
    let trainDayGoal = 0;
    for (const exercise of doneExercises) {
      const duration = getApproximateExerciseDurationMinutes(exercise);
      if (exercise.date === todayDayName) {
        trainDayGoal += duration;
        if (exercise.done) {
          trainedTodayReal += duration;
        }
      }
    }
    const dailyRating = (trainedTodayReal / trainDayGoal) * 5;

    setProfileData({
      accountCreated: profile.data.first_login ?? 0,
      avatarId: profile.data.avatar ?? "",
      dailyRating: dailyRating,
      doneExercises: doneExercises,
      minutesTrainedGoal: trainDayGoal,
      minutesTrained: trainedTodayReal,
      motivation: profile.data.motivation ?? "",
      trainerAddress: trainerContact.data.address ?? "",
      trainerEmail: trainerContact.data.email ?? "",
      trainerName: trainerContact.data.name ?? "",
      trainerPhone: trainerContact.data.telephone ?? "",
    });
  };

  if (!profileData) {
    return <ProfileLoadingView />;
  }

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

  const onClickFriends = () => {
    return navigate("/friends");
  };

  const onClickAchievements = () => {
    return navigate("/achievements");
  };

  return (
    <Container currentPage="profile" color="blue">
      <Layout style={{ height: "100%" }}>
        <ProfileSider
          onClickFriends={onClickFriends}
          onClickAchievements={onClickAchievements}
          avatarUrl={Helper.getAvatarUrl(profileData.avatarId)}
          username={Helper.getUserName(token ?? "")}
        />
        <Content style={{ paddingLeft: "200px" }}>
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
      </Layout>
    </Container>
  );
};

export default Profile;
