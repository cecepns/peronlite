import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import SidebarNav from "./SidebarNav";
import AnnouncementModal from "@/components/announcement/AnnouncementModal";
import AppIntro from "./AppIntro";
import { SidebarLayoutProvider, useSidebarLayout } from "@/context/SidebarLayoutContext";

function AppShellContent({ children }) {
  const { hasSidebar, mainMarginClass } = useSidebarLayout();

  return (
    <div className={hasSidebar ? "lg:h-dvh lg:overflow-hidden" : "min-h-dvh"}>
      <AppIntro />
      <AnnouncementModal />
      <SidebarNav />
      <div
        className={`flex min-h-dvh min-w-0 flex-col transition-[margin] duration-300 ease-in-out ${
          hasSidebar ? `${mainMarginClass} lg:h-dvh lg:overflow-y-auto` : ""
        }`}
      >
        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 bg-white px-3 pb-24 pt-3 sm:px-4 lg:pb-6">
          {children ?? <Outlet />}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <SidebarLayoutProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarLayoutProvider>
  );
}
