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
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const ButtonContact: React.FC<Props> = ({
  type,
  contact,
  label,
}: Props): JSX.Element => {
  const getLink = () => {
    switch (type) {
      case ContactType.email:
        return contact.startsWith("mailto:") ? contact : `mailto:${contact}`;
      case ContactType.phone:
        return contact.startsWith("tel:") ? contact : `tel:${contact}`;
    }
  };

  const getIcon = (): JSX.Element => {
    switch (type) {
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
      {label}
      {getIcon()}
    </Link>
  );
};

export default ButtonContact;
export { ContactType };
