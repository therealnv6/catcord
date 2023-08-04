import React from "react";

type CardProps = {
  display: string;
  value: string;
};

const subtextClasses = `
  colorStandard-1Xxp1s default-h5DUM7 
  formText-2UzJT0 modeDefault-3Warim
`;
const wrapDivClasses = `
  cardPrimary-pAe8Ed card-2guEcY 
  eyebrow-2wJAoF h5-2feg8J 
  defaultMarginh5-3THN2O
`;

const subtextStyles: React.CSSProperties = {
  fontSize: "8px",
  textTransform: "none",
  width: "65%",
};

const wrapDivStyles: React.CSSProperties = {
  padding: "0.5em",
  marginBottom: "0.5em",
  marginTop: "0.5em",
};

type ValueIndicatorProps = {
  value: string;
};

export const ValueIndicator: React.FC<ValueIndicatorProps> = ({ value }) => {
  const result = value === "true"
    ? {
      color: "green",
      icon: "✅",
    }
    : {
      color: "red",
      icon: "❌",
    };

  return (
    <span
      style={{ color: result.color }}
    >
      {result.icon}
    </span>
  );
};

/**
 * Displays a value indicator along with a display text and optional subtext.
 * @param {CardProps} props - The component props.
 * @param {string} props.display - The main display text.
 * @param {string} props.value - The value to indicate.
 * @param {React.ReactNode} props.children - Optional child element for subtext.
 */
export const CardComponent: React.FC<CardProps> = ({ display, value }) => {
  return (
    <div className={wrapDivClasses} style={wrapDivStyles}>
      <h1 style={{ overflowWrap: "break-word", width: "65%" }}>
        <ValueIndicator
          value={value}
        />
        <strong>{display}</strong>
      </h1>
      {value !== "true" && (
        <div className={subtextClasses} style={subtextStyles}>
          {value}
        </div>
      )}
    </div>
  );
};
