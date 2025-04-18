"use client";

import Sidebar from "../components/Sidebar/Sidebar";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import RequireAuth from "../components/RequireAuth";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  const content = (
    <>
      {!isAuthPage && <Navbar />}
      <div className="shipper-container">
        {!isAuthPage && <Sidebar />}
        <div className="shipper-container-content">{children}</div>
      </div>
    </>
  );

  return (
    <html lang="en">
      <body>
        {isAuthPage ? content : <RequireAuth>{content}</RequireAuth>}
      </body>
    </html>
  );
}
