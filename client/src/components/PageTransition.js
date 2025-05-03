import React, { useState, useEffect } from "react";

const PageTransition = ({ children, direction = "right" }) => {
  const [isActive, setIsActive] = useState(false);

  // Set initial position based on direction
  const initialPosition =
    direction === "right" ? "translate-x-full" : "-translate-x-full";

  useEffect(() => {
    // Trigger the animation after mount
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        absolute w-full transition-all duration-300 ease-in-out
        ${
          isActive
            ? "translate-x-0 opacity-100"
            : `${initialPosition} opacity-0`
        }
      `}
    >
      {children}
    </div>
  );
};

export default PageTransition;
