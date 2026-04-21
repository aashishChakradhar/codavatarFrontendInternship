import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../../styles/portals/portals.module.css";

export interface PortalProps {
  title?: string | null;
  content?: string | null;
  buttonText?: string | null;
  handleButton?: () => void;
}

function Portals({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div className={styles.overlayContainer}>
      <div className={styles.contentContainer}>{children}</div>
    </div>,
    document.body,
  );
}

export default function DisplayPortals({
  title,
  content,
  buttonText,
}: PortalProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section>
      <Portals isOpen={isOpen}>
        {title ? <h3>{title}</h3> : <h3>Portal Heading</h3>}
        {content ? <p>{content}</p> : <p>Portal Content</p>}
        <button className={styles.button} onClick={() => setIsOpen(false)}>
          {buttonText?.toUpperCase() ?? "close".toUpperCase()}
        </button>
      </Portals>
    </section>
  );
}
