import React from "react";
import { Link } from "react-router-dom";

enum ContactType {
  email,
  phone,
}

const ButtonContact = (props: {
  type: ContactType;
  contact: string;
  label: string;
  children?: React.ReactNode;
}): JSX.Element => {
  const getLink = () => {
    switch (props.type) {
      case ContactType.email:
        return props.contact.startsWith("mailto:")
          ? props.contact
          : `mailto:${props.contact}`;
      case ContactType.phone:
        return props.contact.startsWith("tel:")
          ? props.contact
          : `tel:${props.contact}`;
    }
  };

  return (
    <Link
      to="#"
      style={{ color: "black" }}
      onClick={(e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location = getLink();
        e.preventDefault();
      }}
    >
      {props.label}
      {props.children}
    </Link>
  );
};

export default ButtonContact;
export { ContactType };
