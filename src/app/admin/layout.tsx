import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      <div className="flex-grow bg-white p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
