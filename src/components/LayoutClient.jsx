"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import { SocketProvider } from "../context/SocketContext";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <SocketProvider>
      {!isAuthPage && <Navbar />}
      <div className="shipper-container">
        {!isAuthPage && <Sidebar />}
        <div className="shipper-container-content">{children}</div>
      </div>
    </SocketProvider>
  );
}
