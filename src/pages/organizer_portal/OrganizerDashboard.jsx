import { useState } from "react";
import OrganizerSidebar from "../../components/organizer_portal/OrganizerSidebar";

import {
  CalendarCheck,
  User,
  ClipboardCheck,
  Filter,
  Mail,
  MoreVertical,
  Menu,
} from "lucide-react";

function OrganizerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const [volunteers, setVolunteers] = useState([
    {
      name: "Jane Doe",
      email: "jane.d@example.com",
      role: "Team Lead",
      status: "Registered",
      initials: "JD",
      image: false,
    },
    {
      name: "Marcus Wright",
      email: "m.wright@domain.com",
      role: "Logistics Support",
      status: "Approved",
      initials: "MW",
      image: false,
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Event Coordinator",
      status: "Registered",
      initials: "SJ",
      image: false,
    },
  ]);

  // Approve a volunteer
  const approveVolunteer = (index) => {
    setVolunteers((currentVolunteers) =>
      currentVolunteers.map((volunteer, i) =>
        i === index
          ? { ...volunteer, status: "Approved" }
          : volunteer
      )
    );
  };

  // Filter volunteers
  const filteredVolunteers =
    filter === "All"
      ? volunteers
      : volunteers.filter((volunteer) => volunteer.status === filter);

  // Pending count
  const pendingCount = volunteers.filter(
    (volunteer) => volunteer.status === "Registered"
  ).length;

  return (
    <div
      className="flex min-h-screen bg-[#101413] text-[#e0e3e1]"
      onClick={() => setOpenMenu(null)}
    >
      {/* SIDEBAR */}
      <OrganizerSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 md:px-8 lg:px-10 lg:py-11">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mb-6 rounded-lg border border-[#324539] bg-[#1c201f] p-3 text-[#afff66] lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* PAGE HEADING */}
        <div className="mb-8 sm:mb-10 lg:mb-11">
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Dashboard Overview
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c1cab3] sm:text-base sm:leading-7">
            Welcome back. Here is the current status of your volunteer events
            and activities.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mb-11 lg:grid-cols-3 lg:gap-6">
          {/* ACTIVE EVENTS */}
          <div className="relative h-[180px] overflow-hidden rounded-2xl border border-[#324539] bg-[#1c201f] p-5 sm:h-[200px] sm:p-6 lg:h-[214px] lg:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[#c1cab3]">
                Active Events
              </p>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#24342A] text-[#afff66]">
                <CalendarCheck size={20} />
              </div>
            </div>

            <h2 className="absolute bottom-8 text-4xl font-semibold sm:text-5xl lg:bottom-12">
              12
            </h2>
          </div>

          {/* TOTAL VOLUNTEERS */}
          <div className="h-[180px] rounded-2xl border border-[#324539] bg-[#1c201f] p-5 sm:h-[200px] sm:p-6 lg:h-[214px] lg:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[#c1cab3]">
                Total Volunteers
              </p>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#24342A] text-[#afff66]">
                <User size={20} />
              </div>
            </div>

            <h2 className="mt-10 text-4xl font-semibold sm:mt-12 sm:text-5xl">
              1,450
            </h2>
          </div>

          {/* PENDING APPROVALS */}
          <div className="h-[180px] rounded-2xl border border-[#324539] bg-[#1c201f] p-5 sm:h-[200px] sm:p-6 lg:h-[214px] lg:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[#c1cab3]">
                Pending Approvals
              </p>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7f1111] text-white">
                <ClipboardCheck size={20} />
              </div>
            </div>

            <h2 className="mt-8 text-4xl font-semibold sm:mt-10 sm:text-5xl">
              {pendingCount}
            </h2>

            <a
              href="/organizer/volunteers"
              className="mt-4 inline-block text-xs font-medium uppercase tracking-widest text-[#afff66] sm:mt-5 sm:text-sm"
            >
              Review Now
            </a>
          </div>
        </div>

        {/* RECENT REGISTRATIONS HEADER */}
        <div className="mb-4 flex flex-col gap-4 border-b border-[#24342A] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">
              Recent Registrations
            </h2>
          </div>

          {/* FILTER */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(
                  openMenu === "filter" ? null : "filter"
                );
              }}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#324539] py-3 text-xs uppercase tracking-widest text-[#afff66] transition hover:bg-[#24342A] sm:w-auto sm:border-0 sm:p-0"
            >
              <Filter size={20} />
              Filter
            </button>

            {openMenu === "filter" && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 z-20 w-40 rounded-lg border border-[#324539] bg-[#1c201f] p-2 shadow-lg"
              >
                {["All", "Registered", "Approved"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFilter(item);
                      setOpenMenu(null);
                    }}
                    className={`w-full rounded-md px-4 py-3 text-left text-sm hover:bg-[#24342A] ${
                      filter === item
                        ? "text-[#afff66]"
                        : "text-[#c1cab3]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VOLUNTEER TABLE */}
        <section className="w-full overflow-hidden rounded-2xl border border-[#324539] bg-[#1c201f]">
          <div className="overflow-x-auto">
            <div className="min-w-[750px]">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-[1.5fr_1.1fr_0.8fr_0.7fr] bg-[#2a302d] px-5 py-5 text-[11px] uppercase tracking-widest text-[#c1cab3]">
                <div>Volunteer Name</div>
                <div>Assigned Role</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* TABLE ROWS */}
              {filteredVolunteers.map((volunteer, index) => (
                <div
                  key={volunteer.email}
                  className="grid min-h-[82px] grid-cols-[1.5fr_1.1fr_0.8fr_0.7fr] items-center border-b border-[#24342A] px-5"
                >
                  {/* VOLUNTEER */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c1cab3] text-sm font-medium text-[#24342A]">
                      {volunteer.initials}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {volunteer.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#c1cab3]">
                        {volunteer.email}
                      </p>
                    </div>
                  </div>

                  {/* ROLE */}
                  <div className="text-sm">{volunteer.role}</div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-2 text-[10px] uppercase tracking-wider ${
                        volunteer.status === "Approved"
                          ? "bg-[#324539] text-[#afff66]"
                          : "bg-[#303735] text-[#c1cab3]"
                      }`}
                    >
                      {volunteer.status}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="relative flex items-center justify-end gap-5">
                    {/* MAIL */}
                    <a
                      href={`mailto:${volunteer.email}`}
                      title="Send Email"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail
                        size={20}
                        className="cursor-pointer text-[#c1cab3] transition hover:text-[#afff66]"
                      />
                    </a>

                    {/* APPROVE / MENU */}
                    {volunteer.status === "Registered" ? (
                      <button
                        onClick={() => approveVolunteer(index)}
                        className="rounded-lg border border-[#537244] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#afff66] transition hover:bg-[#24342A]"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(
                            openMenu === index ? null : index
                          );
                        }}
                      >
                        <MoreVertical
                          size={21}
                          className="cursor-pointer text-[#c1cab3] transition hover:text-[#afff66]"
                        />
                      </button>
                    )}

                    {openMenu === index && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-[#324539] bg-[#1c201f] p-2 shadow-lg"
                      >
                        <button
                          onClick={() => {
                            alert(
                              `${volunteer.name} is already approved.`
                            );
                            setOpenMenu(null);
                          }}
                          className="w-full rounded-md px-3 py-2 text-left text-sm text-[#c1cab3] hover:bg-[#24342A] hover:text-[#afff66]"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => {
                            setVolunteers((current) =>
                              current.map((v, i) =>
                                i === index
                                  ? {
                                      ...v,
                                      status: "Registered",
                                    }
                                  : v
                              )
                            );
                            setOpenMenu(null);
                          }}
                          className="w-full rounded-md px-3 py-2 text-left text-sm text-[#c1cab3] hover:bg-[#24342A] hover:text-[#afff66]"
                        >
                          Undo Approval
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredVolunteers.length === 0 && (
                <div className="py-10 text-center text-sm text-[#c1cab3]">
                  No volunteers found.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrganizerDashboard;