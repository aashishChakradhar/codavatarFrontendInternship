import { useState } from "react";
import { createPortal } from "react-dom";

function Portals({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: any;
  children: any;
}) {
  if (!isOpen) return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Portal Display,{children}
      <button onClick={onClose}>Close</button>
    </div>,
    document.body,
  );
}

export default function DisplayPortals() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Portal</button>
      <Portals isOpen={isOpen} onClose={() => setIsOpen(false)}>
        This is the portal
      </Portals>
    </div>
  );
}
