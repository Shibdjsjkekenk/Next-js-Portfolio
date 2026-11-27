import Footer from "@/components/client-view/Footer";
import Navbar from "@/components/client-view/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer/>
    </>
  );
}
