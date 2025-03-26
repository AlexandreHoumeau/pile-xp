import { SideNav } from "@/app/ui/dashboard/Sidenav";
import { NavBar } from "../ui/dashboard/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow bg-slate-50 p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
