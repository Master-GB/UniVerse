import { useEffect, useMemo, useState } from "react";

const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  border: 0,
};

const wrapperStyles = {
  display: "inline-block",
  whiteSpace: "pre-wrap",
};

export default function DecryptedText({
  text,
  speed = 45,
  letterClassName = "",
  wrapperClassName = "",
  ...rest
}) {
  const [visibleChars, setVisibleChars] = useState(() => text.split("").map(() => ""));

  useEffect(() => {
    const characters = text.split("");
    setVisibleChars(characters.map(() => ""));

    let index = 0;
    let timeoutId;

    const revealNext = () => {
      setVisibleChars((prev) => {
        if (index >= characters.length) {
          return prev;
        }

        const next = [...prev];
        next[index] = characters[index];
        index += 1;

        if (index >= characters.length) {
          timeoutId = undefined;
        }

        return next;
      });

      if (index < characters.length) {
        timeoutId = window.setTimeout(revealNext, speed);
      }
    };

    timeoutId = window.setTimeout(revealNext, speed);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [text, speed]);

  const hiddenText = useMemo(() => text, [text]);

  return (
    <span className={wrapperClassName} style={wrapperStyles} {...rest}>
      <span style={srOnlyStyles}>{hiddenText}</span>
      <span aria-hidden="true">
        {visibleChars.map((char, index) => (
          <span key={`${char}-${index}`} className={letterClassName}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
