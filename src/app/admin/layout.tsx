import { SideNav } from "@/app/ui/dashboard/Sidenav";
import { Toaster } from "react-hot-toast";
import Navbar from "../ui/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      {/* <div className="flex h-screen flex-col md:flex-row md:overflow-hidden"> */}
      <div className="sticky top-0 z-50">

        <Navbar />
      </div>
      {/* <div className="w-full flex-none md:w-64">
          <SideNav />
        </div> */}
      <div className="flex-grow bg-white p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
      {/* </div> */}
    </div>
  );
}
