import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import ConverterContainer from "../../components/converter/converterContainer.component";
import ConverterPresentation from "../../components/converter/converterPresentation.component";
import ConverterClass from "../../components/currencyConverter/currencyConverter.container";
import DisplayPortals from "../../components/portals/portals.component";
import usePrompt from "../prompt.page";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: string | null;
  errorInfo?: string | null;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error.message,
      errorInfo: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>
          Something went wrong.{this.state.error}:{this.state.errorInfo}
        </h1>
      );
    }

    return this.props.children;
  }
}

const JunkContent = () => {
  const [count, setCount] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(true);
  useEffect(() => {
    setCount((prev) => prev + 1);
  }, []);

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
    <div>
      {/* onClick={() => setIsDirty(true)} */}
      <NavLink to="/">Form</NavLink>
      <ConverterClass />
      <ConverterContainer
        render={(props) => <ConverterPresentation {...props} />}
      />
      <DisplayPortals />
      <div>{count}</div>
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
