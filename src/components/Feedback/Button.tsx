import React from "react";
import { useLocation } from "@docusaurus/router";
import { useColorMode } from "@docusaurus/theme-common";
import styles from "./Button.module.css";
import { Tooltip } from "react-tooltip";

type Event = "like" | "dislike";

type Props = {
  children?: React.ReactNode;
  event: Event;
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const tooltipFadeoutTimeMs = 3500;

function Button({ children, event, isDisabled, setIsDisabled }: Props) {
  const location = useLocation();
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClick = () => {
    setIsOpen(true);
    setIsDisabled(true);
    const eventType = `docs-${event}`;
    if (window.gtag) {
      window.gtag("event", eventType, {
        event_category: "Feedback",
        event_label: location.pathname,
      });
    }
    const key = `user-feedback:${location.pathname}`;
    localStorage.setItem(key, "true");
    setTimeout(() => setIsOpen(false), tooltipFadeoutTimeMs);
  };

  return (
    <>
      <button
        data-tooltip-id={`btn-${event}`}
        aria-label={`page-${event}-button`}
        className={`${styles.button} ${isDisabled && styles.disabled}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {children}
      </button>
      <Tooltip
        id={`btn-${event}`}
        // this component doesn"t allow to set styles via className 
        style={{
          width: "200px",
          height: "80px",
          padding: "12px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "500",
          lineHeight: "18px",
          backgroundColor: colorMode === "dark" && "#232328",
          color: colorMode === "dark" && "#FFF",
        }}
        border="1px solid rgba(118, 152, 187, 0.35)"
        openOnClick={true}
        isOpen={isOpen}
        variant="light"
        content="Thank you! Your answer helps us make the docs better."
      />
    </>
  );
}

export default Button;