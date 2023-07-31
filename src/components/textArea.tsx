import React from "react";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const containerClassName = "container-3i3IzO";
const textAreaStyle: React.CSSProperties = {
  color: "white",
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
