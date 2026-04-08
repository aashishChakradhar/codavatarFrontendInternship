import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
export default function usePrompt(message: string, when: boolean) {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(message);

      if (confirmLeave) {
        blocker.proceed(); // allow navigation
      } else {
        blocker.reset(); // stay on page
      }
    }
  }, [blocker, message]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!when) return;

      event.preventDefault();
      event.returnValue = ""; // required for browser to show dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when]);

  return;
}
