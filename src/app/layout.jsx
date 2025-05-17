import "./globals.css";
import RequireAuth from "../components/RequireAuth";
import LayoutClient from "../components/LayoutClient";

export const metadata = {
  title: "PTIT Food Delivery",
  description: "Ứng dụng giao hàng nhanh",
  icons: {
    icon: "/logo.png", // hoặc "/icon.png" nếu bạn dùng ảnh .png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RequireAuth>
          <LayoutClient>{children}</LayoutClient>
        </RequireAuth>
      </body>
    </html>
  );
}
