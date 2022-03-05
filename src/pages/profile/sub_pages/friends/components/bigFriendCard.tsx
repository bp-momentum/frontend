import Translations from "@/localization/translations";
import { useGetFriendByIdQuery } from "@/redux/friends/friendApiSlice";
import Helper from "@/util/helper";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import Container from "./container";

interface Props {
  reloadFriends: VoidFunction;
  username: string;
  onClose: VoidFunction;
}

const BigFriendCard: React.FC<Props> = ({
  onClose,
  reloadFriends,
  username,
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useGetFriendByIdQuery(username);

  if (isLoading) {
    return (
      <Container size={{ width: "280px", height: "90px" }}>
        {t(Translations.exercises.loading)}
      </Container>
    );
  }

  if (isError || !data) {
    console.log(error);
    return (
      <Container size={{ width: "280px", height: "90px" }}>
        {error && error.toString()}
      </Container>
    );
  }

  return (
    <Container size={{ width: "500px", height: "initial" }}>
      <MdClose
        onClick={onClose}
        style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
      />

      <div
        style={{
          backgroundColor: "#626FE5",
          borderRadius: "50%",
          height: "100px",
          width: "100px",
          cursor: "pointer",
          padding: "12.5px 6.25px 0px 6.25px",
          overflow: "hidden",
          marginRight: "20px",
          border: "1px solid gray",
        }}
      >
        <img
          alt="Avatar"
          key={data.avatar}
          src={Helper.getAvatarUrl(data.avatar)}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      </div>
      <span>{data.username}</span>
    </Container>
  );
};

export default BigFriendCard;
