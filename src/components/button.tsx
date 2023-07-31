import React from "react";

type ButtonProps =
  & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
  & {
    children: any;
  };

const buttonClassName =
  "button-ejjZWC lookFilled-1H2Jvj colorBrand-2M3O3N sizeSmall-3R2P2p grow-2T4nbg";

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button className={buttonClassName} {...props}>
      {props.children}
    </button>
  );
};

export default Button;
