import { useState } from "react";

import OrganizerSidebar from "../../components/organizer_portal/OrganizerSidebar";

import {
  Search,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

function OrganizerManageVolunteers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const volunteers = [
    {
      initials: "EJ",
      name: "Elena Jenkins",
      email: "elena.j@example.com",
      event: "River Cleanup 2024",
      date: "Oct 12, 08:00 AM",
      skills: ["Data Collection", "Logistics"],
      status: "Pending",
    },
    {
      initials: "MT",
      name: "Marcus Thorne",
      email: "m.thorne@example.com",
      event: "Solar Grid Setup",
      date: "Oct 15, 09:30 AM",
      skills: ["Electrical", "Heavy Lifting"],
      status: "Approved",
    },
    {
      initials: "SK",
      name: "Sarah Kim",
      email: "sarah.k@example.com",
      event: "Urban Forestation",
      date: "Nov 02, 10:00 AM",
      skills: ["Botany", "Education"],
      status: "Pending",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#101413] text-[#e0e3e1]">
      {/* SIDEBAR */}
      <OrganizerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

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

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Manage Volunteers
            </h1>

            <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#c1cab3] sm:text-base sm:leading-7">
              Review, filter, and approve volunteer registrations across all
              your active eco-tech initiatives.
            </p>
          </div>

          {/* HEADER BUTTON */}
          <div className="flex w-full lg:w-auto">
            <button className="flex h-[52px] w-full items-center justify-center gap-3 rounded-lg bg-[#afff66] px-6 text-xs font-semibold uppercase tracking-widest text-[#101413] transition hover:bg-[#b7ff72] sm:w-[173px] lg:w-[173px]">
              <CheckCheck size={21} />

              <span>
                Bulk
                <br />
                Approve
              </span>
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          {/* SEARCH */}
          <div className="flex h-[48px] w-full items-center gap-3 rounded-lg border border-[#324539] bg-[#14251d] px-5 sm:w-[480px]">
            <Search size={21} className="shrink-0 text-[#c1cab3]" />

            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              className="w-full bg-transparent text-sm tracking-wider text-[#e0e3e1] outline-none placeholder:text-[#879083]"
            />
          </div>

          {/* ALL EVENTS */}
          <button className="flex h-[48px] w-full items-center justify-between rounded-lg border border-[#324539] bg-[#1c2923] px-5 text-sm tracking-wider text-[#e0e3e1] sm:w-[185px]">
            All Events
            <ChevronDown size={18} className="text-[#879083]" />
          </button>

          {/* STATUS */}
          <button className="flex h-[48px] w-full items-center justify-between rounded-lg border border-[#324539] bg-[#1c2923] px-5 text-sm tracking-wider text-[#e0e3e1] sm:w-[150px]">
            Status
            <ChevronDown size={18} className="text-[#879083]" />
          </button>
        </div>

        {/* VOLUNTEER TABLE */}
        <section className="mt-6 w-full overflow-hidden rounded-2xl border border-[#324539] bg-[#1c201f]">
          {/* SCROLLABLE TABLE AREA */}
          <div className="overflow-x-auto">
            <div className="min-w-[950px]">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-[50px_1.5fr_1.1fr_1.55fr_0.9fr_0.5fr] items-center border-b border-[#24342A] px-4 py-5 text-[11px] uppercase tracking-widest text-[#c1cab3]">
                <div>
                  <div className="h-4 w-4 rounded border border-[#324539] bg-[#101413]" />
                </div>

                <div>Volunteer</div>

                <div>Event Applied</div>

                <div>Key Skills</div>

                <div>Status</div>

                <div className="text-right">Actions</div>
              </div>

              {/* TABLE ROWS */}
              {volunteers.map((volunteer, index) => (
                <div
                  key={index}
                  className="grid min-h-[122px] grid-cols-[50px_1.5fr_1.1fr_1.55fr_0.9fr_0.5fr] items-center border-b border-[#24342A] px-4"
                >
                  {/* CHECKBOX */}
                  <div>
                    <div className="h-4 w-4 rounded border border-[#324539] bg-[#101413]" />
                  </div>

                  {/* VOLUNTEER */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        index === 0
                          ? "bg-[#34463d] text-[#afff66]"
                          : index === 1
                            ? "bg-[#1f3731] text-[#afff66]"
                            : "bg-[#353a3a] text-[#e0e3e1]"
                      }`}
                    >
                      {volunteer.initials}
                    </div>

                    <div>
                      <h3 className="text-[17px] font-semibold">
                        {volunteer.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#c1cab3]">
                        {volunteer.email}
                      </p>
                    </div>
                  </div>

                  {/* EVENT */}
                  <div>
                    <p className="text-[17px]">{volunteer.event}</p>

                    <p className="mt-1 text-xs text-[#c1cab3]">
                      {volunteer.date}
                    </p>
                  </div>

                  {/* SKILLS */}
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full bg-[#303735] px-3 py-1.5 text-xs tracking-wider text-[#c1cab3]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* STATUS */}
                  <div>
                    {volunteer.status === "Approved" ? (
                      <span className="whitespace-nowrap rounded-full border border-[#afff66] bg-[#24342A] px-4 py-2 text-xs tracking-wider text-[#afff66]">
                        • Approved
                      </span>
                    ) : (
                      <span className="whitespace-nowrap rounded-full border border-[#324539] bg-[#2a342d] px-4 py-2 text-xs tracking-wider text-[#c1cab3]">
                        <span className="mr-2 text-yellow-400">•</span>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="text-right"></div>
                </div>
              ))}
            </div>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm tracking-wider text-[#c1cab3]">
              Showing 1–3 of 45 volunteers
            </p>

            <div className="flex gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded bg-[#0d1411] text-[#c1cab3] transition hover:bg-[#24342A]">
                <ChevronLeft size={19} />
              </button>

              <button className="flex h-11 w-11 items-center justify-center rounded bg-[#0d1411] text-[#c1cab3] transition hover:bg-[#24342A]">
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrganizerManageVolunteers;
