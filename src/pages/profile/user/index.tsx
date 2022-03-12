import React, { useEffect } from "react";
import Container from "@shared/container";
import { Layout, message } from "antd";
import { useAppSelector } from "@redux/hooks";
import Helper from "@util/helper";
import "@styles/profile.css";
import Routes from "@util/routes";
import ProfileSider from "./components/profile_sider";
import {
  DoneExercise,
  getApproximateExerciseDurationMinutes,
} from "@api/done_exercise";
import useApi from "@hooks/api";
import SubPageProfile from "./sub_pages/profile";
import ProfileLoadingView from "./components/profile_loading_view";
import SubPageFriends from "./sub_pages/friends";
import SubPageAchievements from "./sub_pages/achievements";
import config from "@config";
import { ProfileData } from "@pages/profile/user/types";

const Profile: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);
  const api = useApi();

  const [profileData, setProfileData] = React.useState<ProfileData | null>(
    null
  );

  const [subPage, setSubPage] = React.useState<
    "profile" | "friends" | "achievements" | "loading"
  >("loading");

  useEffect(() => {
    loadProfile().catch((e) => message.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    const results = await Promise.all([
      api.execute(Routes.getProfile()),
      api.execute(Routes.getTrainerContact()),
      api.execute(Routes.getDoneExercises()),
      api.execute(
        Routes.getUserLevel({ username: Helper.getUserName(token ?? "") })
      ),
    ]);

    const profile = results[0];
    const trainerContact = results[1];
    const exercises = results[2];
    const level = results[3];

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
      level: level.data.level ?? 0,
      levelProgress: level.data.progress ?? "",
    });
    setSubPage("profile");
  };

  const onClickProfile = () => {
    setSubPage("profile");
  };

  const onClickFriends = () => {
    return setSubPage("friends");
  };

  const onClickAchievements = () => {
    return setSubPage("achievements");
  };

  return (
    <Container currentPage="profile" color="blue">
      <Layout style={{ height: "100%" }}>
        <ProfileSider
          onClickFriends={onClickFriends}
          onClickAchievements={onClickAchievements}
          onClickProfile={onClickProfile}
          avatarUrl={config.avatarUrlFormatter(
            profileData ? profileData.avatarId : 0
          )}
          username={Helper.getUserName(token ?? "")}
          selected={subPage}
        />
        {subPage === "loading" && <ProfileLoadingView />}
        {subPage === "profile" && profileData && (
          <SubPageProfile
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}
        {subPage === "friends" && <SubPageFriends />}
        {subPage === "achievements" && <SubPageAchievements />}
      </Layout>
    </Container>
  );
};

export default Profile;
