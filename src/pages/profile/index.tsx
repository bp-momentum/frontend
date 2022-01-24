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
import ProfileSider from "./widgets/profile_sider";
import TrainerCard from "./widgets/cards/trainer_card";
import {
  DoneExercise,
  getApproximateExerciseDurationSeconds,
} from "../../api/done_exercise";
import ActivityCalendarCard from "./widgets/cards/activity_calendar_card";
import DailySummaryCard from "./widgets/cards/daily_summary_card";
import UserCard from "./widgets/cards/user_card";
import ProfileLoadingView from "./widgets/profile_loading_view";
import { useNavigate } from "react-router";

interface ProfileData {
  dailyRating: number;
  minutesTrainedGoal: number;
  doneExercises: DoneExercise[];
  accountCreated: number;
  motivation: string;
  trainerName: string;
  trainerAddress: string;
  trainerPhone: string;
  trainerEmail: string;
  avatarId: number;
  minutesTrained: number;
}

const mergeProfileData = (
  data: ProfileData,
  newData: {
    dailyRating?: number;
    minutesTrainedGoal?: number;
    doneExercises?: DoneExercise[];
    accountCreated?: number;
    motivation?: string;
    trainerName?: string;
    trainerAddress?: string;
    trainerPhone?: string;
    trainerEmail?: string;
    avatarId?: number;
    minutesTrained?: number;
  }
): ProfileData => {
  return {
    dailyRating: newData.dailyRating ?? data.dailyRating,
    avatarId: newData.avatarId ?? data.avatarId,
    motivation: newData.motivation ?? data.motivation,
    trainerName: newData.trainerName ?? data.trainerName,
    minutesTrainedGoal: newData.minutesTrainedGoal ?? data.minutesTrainedGoal,
    doneExercises: newData.doneExercises ?? data.doneExercises,
    trainerPhone: newData.trainerPhone ?? data.trainerPhone,
    trainerEmail: newData.trainerEmail ?? data.trainerEmail,
    accountCreated: newData.accountCreated ?? data.accountCreated,
    trainerAddress: newData.trainerAddress ?? data.trainerAddress,
    minutesTrained: newData.minutesTrained ?? data.minutesTrained,
  };
};

const Profile = (): JSX.Element => {
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
    const date = new Date();
    const results = await Promise.all([
      api.execute(Routes.getProfile()),
      api.execute(Routes.getTrainerContact()),
      api.execute(Routes.getDoneExercises()),
      api.execute(
        Routes.getDoneExercisesInMonth({
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        })
      ),
    ]);

    for (const result of results) {
      if (!result.success) {
        message.error(result.description);
        return;
      }
    }

    const profile = results[0];
    const trainerContact = results[1];
    const exercises = results[2];

    const todayDayName = Helper.getCurrentDayName();
    const doneExercises: DoneExercise[] = exercises.data.exercises;
    let trainedTodayReal = 0;
    let trainDayGoal = 0;
    for (const exercise of doneExercises) {
      const duration = getApproximateExerciseDurationSeconds(exercise);
      if (exercise.date === todayDayName) {
        trainDayGoal += duration;
        if (exercise.done) {
          trainedTodayReal += duration;
        }
      }
    }
    const dailyRating = (trainedTodayReal / trainDayGoal) * 5;

    setProfileData({
      accountCreated: profile.data.first_login,
      avatarId: profile.data.avatar,
      dailyRating: dailyRating,
      doneExercises: doneExercises,
      minutesTrainedGoal: Math.ceil(trainDayGoal / 60),
      minutesTrained: Math.ceil(trainedTodayReal / 60),
      motivation: profile.data.motivation,
      trainerAddress: trainerContact.data.address,
      trainerEmail: trainerContact.data.email,
      trainerName: trainerContact.data.name,
      trainerPhone: trainerContact.data.telephone,
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
    setProfileData(
      mergeProfileData(profileData, { motivation: newMotivation })
    );
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
    setProfileData(mergeProfileData(profileData, { avatarId: newAvatarId }));
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
        <Content>
          <Row gutter={16} justify="space-around" style={{ margin: 0 }}>
            <Col className="gutter-row" span={10} style={{ marginTop: "30px" }}>
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
            <Col className="gutter-row" span={10}>
              <TrainerCard
                name={profileData.trainerName}
                address={profileData.trainerAddress}
                phone={profileData.trainerPhone}
                email={profileData.trainerEmail}
              />
            </Col>
            <Col className="gutter-row" span={10}>
              <ActivityCalendarCard doneExercises={profileData.doneExercises} />
            </Col>
            <Col className="gutter-row" span={10}>
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
