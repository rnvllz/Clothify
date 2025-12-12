import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ScrollArea } from "../components/ui/scroll-area";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />
    <ScrollArea className="grow pt-16 w-full">
      <main className="px-4">
        {children}
      </main>
      <Footer />
    </ScrollArea>
  </div>
);

export default Layout;
