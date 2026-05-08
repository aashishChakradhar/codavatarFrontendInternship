import { createPortal } from "react-dom";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  date: string;
  place: string;
  time: string;
  description: string;
}

type ModalContentProps = {
  isOpen: boolean;
  children: ReactNode;
};

function ModalContent({ isOpen, children }: ModalContentProps) {
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
    <div className=" fixed top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center backdrop-blur-xs bg-white/30 p-6 rounded ">
      <div className="bg-white p-10 rounded-md max-w-3/5 min-w-2/5">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default function Modal({
  isOpen,
  onClose,
  name,
  date,
  time,
  description,
  place,
}: ModalProps): ReactElement | null {
  return (
    <ModalContent isOpen={isOpen}>
      <div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div>{date}</div>
            <div>{time}</div>
          </div>
          <div className="">{place}</div>
        </div>
        <h2 className="text-xl font-semibold text-center">{name}</h2>
        <p>{description}</p>
        <button
          className="border rounded-md cursor-pointer mt-5 px-15 py-5"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </ModalContent>
  );
}
