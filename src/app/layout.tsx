import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "@/store/ReduxProvider";
import CurrentUser from "@/components/admin-view/CurrentUser";
import SmoothScroll from "@/common/SmoothScroll";
import "react-vertical-timeline-component/style.min.css";
import ServiceWorker from "@/components/client-view/ServiceWorker";
import { DM_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Hello, I am Shubhanshu Tiwari",
  description:
    "Crafting Seamless Software Experiences with 3+ years of professional expertise in modern Software development and Web Development.",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
   className={`${dmSans.className} min-h-screen w-full relative bg-white overflow-x-hidden`}
      >
        {/* PatternCraft / Funsel Background */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
              radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
              radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
            `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          }}
        />

        {/* Redux + Current User Init */}
        <ReduxProvider>
          <ServiceWorker />
          <SmoothScroll>
            <CurrentUser />
            {children}
          </SmoothScroll>
        </ReduxProvider>

        {/* Toast */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </body>
    </html>
  );
}
