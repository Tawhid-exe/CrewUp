import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Plus,
  LogOut,
} from "lucide-react";

function OrganizerSidebar() {
  return (
    <aside className="flex min-h-screen w-[275px] shrink-0 flex-col justify-between border-r border-[#24342A] bg-[#1c201f] px-6 py-7">
      <div>
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-[#424938] bg-[#24342A]" />

          <div>
            <h2 className="text-lg font-semibold tracking-wide text-[#afff66]">
              Organizer Portal
            </h2>

            <p className="text-xs tracking-wider text-[#c1cab3]">
              Eco-Tech Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/organizer/dashboard"
            className={({ isActive }) =>
              `flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left text-xs uppercase tracking-widest transition ${
                isActive
                  ? "bg-[#424f47] text-[#afff66]"
                  : "text-[#c1cab3] hover:bg-[#24342A]"
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          {/* Manage Events */}
          <NavLink
            to="/organizer/events"
            className={({ isActive }) =>
              `flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left text-xs uppercase tracking-widest transition ${
                isActive
                  ? "bg-[#424f47] text-[#afff66]"
                  : "text-[#c1cab3] hover:bg-[#24342A]"
              }`
            }
          >
            <CalendarDays size={20} />
            Manage Events
          </NavLink>

          {/* Volunteers */}
          <NavLink
            to="/organizer/volunteers"
            className={({ isActive }) =>
              `flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left text-xs uppercase tracking-widest transition ${
                isActive
                  ? "bg-[#424f47] text-[#afff66]"
                  : "text-[#c1cab3] hover:bg-[#24342A]"
              }`
            }
          >
            <Users size={20} />
            Volunteers
          </NavLink>
        </nav>
      </div>

      {/* Bottom Buttons */}
      <div className="space-y-3">
        {/* Sign Out */}
        <NavLink
          to="/"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#324539] py-4 font-medium tracking-wide text-[#c1cab3] transition hover:bg-[#24342A] hover:text-[#afff66]"
        >
          <LogOut size={20} />
          Sign Out
        </NavLink>

        {/* Create Event */}
        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#afff66] py-4 font-medium tracking-wide text-[#101413] transition hover:bg-[#b7ff72]">
          <Plus size={21} />
          Create Event
        </button>
      </div>
    </aside>
  );
}

export default OrganizerSidebar;
