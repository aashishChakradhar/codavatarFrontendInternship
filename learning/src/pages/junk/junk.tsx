import { useState, useEffect } from "react";
import usePrompt from "../prompt";
import ErrorBoundary from "../../components/errorBoundry/errorBoundry";
import ConverterClassComponent from "../../components/currencyConverter/currencyConverter.container";
import DisplayPortals from "../../components/portals/portals.component";
const JunkContent = () => {
  const [count, setCount] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  useEffect(() => {
    setCount((prev) => prev + 1);
  }, []);
  let title: string = "You Clicked";
  let content: string =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis repellendus deleniti, eius nobis voluptatem obcaecati eaque unde dolor? Quae dignissimos cupiditate quidem mollitia nihil iusto doloremque enim dolorum veritatis ullam.";

  usePrompt(
    "You have unsaved changes. Are you sure you want to leave?",
    isDirty,
  );

  //prompt to prevent navigation(beforeunload)
  // const [isDirty, setIsDirty] = useState<boolean>(true);
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     if (!isDirty) return;

  //     event.preventDefault();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [isDirty]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "antiquewhite",
      }}
    >
      <ConverterClassComponent />
      <DisplayPortals title={title} content={content} />
      ok
    </div>
  );
};

const JunkApp = () => {
  return (
    <ErrorBoundary>
      <JunkContent />
    </ErrorBoundary>
  );
};

export default JunkApp;
