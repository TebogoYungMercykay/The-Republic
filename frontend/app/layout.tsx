import { Providers } from "./providers";
import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Header from '../components/Header/Header';
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4">{children}</main>
              <RightSidebar />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
