import React from "react";

const Button = ({
  handleClick,
  children,
}: {
  children: React.ReactNode;
  handleClick: () => void;
}) => {
  return (
    <>
      <button
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className="text-white shadow-xl bg-gradient-to-r gap-2 flex items-center justify-center px-6 w-40 from-orange-600 to-orange-400 font-semibold py-2 rounded-full border border-orange-600"
      >
        {children}
      </button>
    </>
  );
};

export default Button;
