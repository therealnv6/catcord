import React from "react";

type ButtonProps =
  & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
  & {
    children: any;
  };

type ButtonContainerProps =
  & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  & {
    children: any;
  };

const buttonClassName =
  "button-ejjZWC lookFilled-1H2Jvj colorBrand-2M3O3N sizeSmall-3R2P2p grow-2T4nbg";

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className={buttonClassName}
      {...props}
    >
      {props.children}
    </button>
  );
};

export const ButtonContainer: React.FC<ButtonContainerProps> = (props) => {
  return (
    <div
      style={{
        display: "flex",
      }}
      {...props}
    >
      {props.children}
    </div>
  );
};
