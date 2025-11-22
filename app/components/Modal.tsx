// import React from "react";
// type Props = {
//   children: React.ReactNode;
//   onClose: () => void;
// };

// export const Modal = ({ children, onClose }: Props) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
//       <div className="bg-white rounded-lg p-10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>{children}</div>
//     </div>
//   );
// };
import React from "react";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ children, onClose }: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};