import React, { createContext, useState, useContext } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [direction, setDirection] = useState("right");

  const navigate = (newDirection) => {
    setDirection(newDirection);
  };

  return (
    <NavigationContext.Provider value={{ direction, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
