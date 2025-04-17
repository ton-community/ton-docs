import React from "react";
import { useLocation } from "@docusaurus/router";
import { useColorMode } from "@docusaurus/theme-common";
import { IconLikeLight, IconLikeDark, IconDislikeLight, IconDislikeDark } from "../../assets/icons";
import styles from "./index.module.css";
import Button from "./Button";

function Feedback() {
  const location = useLocation();
  const [isFeedbackDisabled, setIsFeedbackDisabled] = React.useState(false);
  const { colorMode } = useColorMode();
  const opacity = isFeedbackDisabled ? 0.56 : 1.0;

  React.useEffect(() => {
    const key = `user-feedback:${location.pathname}`;
    const alreadyClicked = localStorage.getItem(key);
    if (alreadyClicked === "true") {
      setIsFeedbackDisabled(true);
    }
  }, [setIsFeedbackDisabled, location.pathname])

  return (
    <div className={styles.container}>
      <span className={styles.label}>Was this article useful?</span>
      <div className={styles.buttons}>
        <Button event="like" isDisabled={isFeedbackDisabled} setIsDisabled={setIsFeedbackDisabled}>
          {colorMode === "light" ?
            <IconLikeLight style={{ opacity }} /> :
            <IconLikeDark style={{ opacity }} />}
          <span className={styles.text}>Yes</span>
        </Button>
        <Button event="dislike" isDisabled={isFeedbackDisabled} setIsDisabled={setIsFeedbackDisabled}>
          {colorMode === "light" ?
            <IconDislikeLight style={{ opacity }} /> :
            <IconDislikeDark style={{ opacity }} />}
          <span className={styles.text}>No</span>
        </Button>
      </div>
    </div>
  );
}

export default Feedback;