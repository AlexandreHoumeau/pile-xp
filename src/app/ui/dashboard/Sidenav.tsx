"use client";

export const SideNav = () => {
  return (
    <div className="border-r-[1px] h-full items-start bg-slate-50">
      <div className="h-screen w-64 text-black flex flex-col">
        <nav className="flex flex-col p-4 space-y-2">
          <a
            href="/admin"
            className="flex items-center p-2 rounded hover:bg-slate-50"
          >
            Home
          </a>
          <a
            href="/admin/projects"
            className="flex items-center p-2 rounded hover:bg-slate-50"
          >
            Projects
          </a>
          <a
            href="#"
            className="flex items-center p-2 rounded hover:bg-slate-50"
          >
            About
          </a>
        </nav>
      </div>
    </div>
  );
};
