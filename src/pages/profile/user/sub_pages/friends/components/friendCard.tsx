import config from "@config";
import Translations from "@localization/translations";
import { useGetFriendByIdQuery } from "@redux/friends/friendApiSlice";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdPersonRemove } from "react-icons/md";
import Container from "../../../components/container";

interface Props {
  username: string;
  onRemove: VoidFunction;
  onClick: VoidFunction;
}

const FriendCard: React.FC<Props> = ({ username, onRemove, onClick }) => {
  const { data, isLoading, isError, error, refetch } =
    useGetFriendByIdQuery(username);

  const { t } = useTranslation();

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Container size={{ width: "280px", height: "90px" }}>
        {t(Translations.exercises.loading)}
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container size={{ width: "280px", height: "90px" }}>
        {error && error.toString()}
      </Container>
    );
  }

  return (
    <Container onClick={onClick} size={{ width: "280px", height: "90px" }}>
      <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "#626FE5",
            borderRadius: "50%",
            height: "50px",
            width: "50px",
            padding: "6.25px 3.125px 0px 3.125px",
            overflow: "hidden",
            marginRight: "20px",
            border: "1px solid gray",
          }}
        >
          <img
            alt="Avatar"
            key={data.avatar}
            src={config.avatarUrlFormatter(data.avatar)}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <span
          style={{
            textOverflow: "ellipsis",
            width: "140px",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {username}
          <br />
          <span style={{ fontSize: 16 }}>{data.motivation}</span>
        </span>
      </div>
      <MdPersonRemove
        style={{ cursor: "pointer", marginLeft: "auto" }}
        className="hoverRed"
        size={25}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      />
    </Container>
  );
};

export default FriendCard;
