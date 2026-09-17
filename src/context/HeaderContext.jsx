import React, { createContext, useEffect, useRef, useState } from "react";

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Header background
      if (currentScrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide header when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHidden(true);
      }

      // Show header when scrolling up
      else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <HeaderContext.Provider
      value={{
        isScrolled,
        isHidden,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export default HeaderContext;
