"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface NavigationProgressContextValue {
  isNavigating: boolean;
  progress: number;
  startNavigation: () => void;
  completeNavigation: () => void;
}

const NavigationProgressContext = createContext<NavigationProgressContextValue>({
  isNavigating: false,
  progress: 0,
  startNavigation: () => {},
  completeNavigation: () => {},
});

export function NavigationProgressProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);

    // Simulate progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 90) {
        clearInterval(interval);
        setProgress(90);
      } else {
        setProgress(current);
      }
    }, 200);
  }, []);

  const completeNavigation = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);
  }, []);

  return (
    <NavigationProgressContext.Provider
      value={{ isNavigating, progress, startNavigation, completeNavigation }}
    >
      {children}
    </NavigationProgressContext.Provider>
  );
}

export function useNavigationProgressContext() {
  return useContext(NavigationProgressContext);
}
