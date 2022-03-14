import React from "react";
import { Link } from "react-router-dom";
import { MailOutlined, PhoneFilled } from "@ant-design/icons";

enum ContactType {
  email,
  phone,
}

interface Props {
  type: ContactType;
  contact: string;
  label: string;
}

/**
 * A simple component which displays an email or phone number and can be clicked
 * to open the email or phone app of a device.
 */
const ButtonContact: React.FC<Props> = ({ ...props }) => {
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

  const getIcon = (): JSX.Element => {
    switch (props.type) {
      case ContactType.email:
        return (
          <MailOutlined style={{ marginTop: "5px", paddingLeft: "5px" }} />
        );
      case ContactType.phone:
        return <PhoneFilled style={{ marginTop: "5px", paddingLeft: "5px" }} />;
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
      {getIcon()}
    </Link>
  );
};

export default ButtonContact;
export { ContactType };
