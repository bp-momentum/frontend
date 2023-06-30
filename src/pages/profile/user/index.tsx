import React, { useEffect } from "react";
import Container from "@shared/container";
import { Layout, message } from "antd";
import Helper from "@util/helper";
import "@styles/profile.css";
import Routes from "@util/routes";
import ProfileSider from "./components/profileSider";
import {
  DoneExercise,
  getApproximateExerciseDurationMinutes,
} from "@api/doneExercise";
import useApi from "@hooks/api";
import SubPageProfile from "./sub_pages/profile";
import ProfileLoadingView from "./components/profileLoadingView";
import { ProfileData } from "@pages/profile/user/types";
import { useAppSelector } from "@redux/hooks";

/**
 * The profile page for users.
 * @returns {JSX.Element} The component
 */
const Profile: React.FC = (): JSX.Element => {
  const api = useApi();

  const username = useAppSelector((state) => state.profile.username) || "";

  const [profileData, setProfileData] = React.useState<ProfileData | null>(
    null
  );

  const [subPage, setSubPage] = React.useState<"profile" | "loading">(
    "loading"
  );

  useEffect(() => {
    loadProfile().catch((e) => message.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    const results = await Promise.all([
      api.execute(Routes.getProfile()),
      api.execute(Routes.getDoneExercises()),
      // TODO: fix
      // api.execute(
      //   Routes.getUserLevel({ username: Helper.getUserName(token ?? "") })
      // ),
    ]);

    const profile = results[0];
    const exercises = results[1];
    // const level = results[3];

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
      avatar: profile.data.avatar ?? {
        eyeColor: 0,
        hairColor: 0,
        hairStyle: 0,
        skinColor: 0,
      },
      dailyRating: dailyRating,
      doneExercises: doneExercises,
      minutesTrainedGoal: trainDayGoal,
      minutesTrained: trainedTodayReal,
      motivation: profile.data.motivation ?? "",
    });
    setSubPage("profile");
  };

  const onClickProfile = () => {
    setSubPage("profile");
  };

  return (
    <Container currentPage="profile">
      <Layout style={{ height: "100%" }}>
        <ProfileSider
          onClickProfile={onClickProfile}
          avatar={profileData?.avatar}
          username={username}
          selected={subPage}
        />
        {subPage === "loading" && <ProfileLoadingView />}
        {subPage === "profile" && profileData && (
          <SubPageProfile
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}
      </Layout>
    </Container>
  );
};

export default Profile;
