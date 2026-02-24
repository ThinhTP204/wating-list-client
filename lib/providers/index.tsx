"use client";

import { ReactNode } from "react";
import { ReduxProvider } from "./reduxProvider";
import { QueryProvider } from "./queryProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster
          position="top-right"
          expand={true}
          richColors
          closeButton
          theme="light"
          toastOptions={{
            classNames: {
              toast: "font-sans",
            },
          }}
        />
      </QueryProvider>
    </ReduxProvider>
  );
}
