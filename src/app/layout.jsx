"use client";

import Sidebar from "../components/Sidebar/Sidebar";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import RequireAuth from "../components/RequireAuth";
import { SocketProvider } from "../context/SocketContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../redux/store";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  const content = (
    <SocketProvider>
      {!isAuthPage && <Navbar />}
      <div className="shipper-container">
        {!isAuthPage && <Sidebar />}
        <div className="shipper-container-content">{children}</div>
      </div>
    </SocketProvider>
  );

  return (
    <html lang="en">
      <body>{isAuthPage ? content : <RequireAuth>{content}</RequireAuth>}</body>
    </html>
  );
}
