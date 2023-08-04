import React, { HTMLProps } from "react";

interface HeadingProps extends HTMLProps<HTMLHeadingElement> {
  variant: "h2" | "h2dim" | "h3";
}

const getHeadingClassName = (variant: string): string => {
  const classNames = {
    h2: "h1-3iMExa title-lXcL8p defaultColor-3Olr-9",
    h2dim: "h5-2feg8J eyebrow-2wJAoF",
    h3: "h5-2feg8J eyebrow-2wJAoF title-1HgbhV",
  };

  return `defaultMargin ${classNames[variant] || ""}`;
};

const Heading: React.FC<HeadingProps> = ({ children, variant, ...props }) => {
  const classNames = getHeadingClassName(variant);
  const variantClass = variant.slice(0, 2);

  return React.createElement(variantClass, {
    className: classNames,
    ...props,
  }, children);
};

export default Heading;
