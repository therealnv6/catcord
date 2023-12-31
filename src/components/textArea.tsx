import React from "react";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const containerClassName = "container-3i3IzO";
const textAreaStyle: React.CSSProperties = {
  color: "white",
  cursor: "text",
  overflow: "hidden",
  border: "none",
  outline: "none",
};

const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <textarea
      className={containerClassName}
      style={textAreaStyle}
      {...props}
    />
  );
};

export default TextArea;
