"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ReduxProvider } from "./reduxProvider";
import { QueryProvider } from "./queryProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ReduxProvider>
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-center"
            expand={true}
            richColors
            closeButton
            theme="system"
            toastOptions={{
              classNames: {
                toast: "font-sans",
              },
            }}
          />
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
