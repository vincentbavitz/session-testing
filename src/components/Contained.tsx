import classNames from "classnames";
import React, { ReactNode } from "react";

interface Props {
  backgroundColor?: "primary" | "secondary" | "secondary-alt";
  children: ReactNode;
}

export function Contained(props: Props) {
  const { backgroundColor, children } = props;

  const containerStyle = {
    paddingLeft: "5vw",
    paddingRight: "5vw",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
  };

  return (
    <div
      className={classNames(
        "w-full",
        backgroundColor && `bg-${backgroundColor}`
      )}
    >
      <div className="relative" style={containerStyle}>
        {children}
      </div>
    </div>
  );
}
