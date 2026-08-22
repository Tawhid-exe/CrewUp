import OrganizerSidebar from "../../components/organizer_portal/OrganizerSidebar";

import {
  Search,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function OrganizerManageVolunteers() {
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
      <OrganizerSidebar />

      {/* ----------------- MAIN CONTENT -------------------- */}
      <main className="flex-1 px-10 py-11">
        {/* ----------------- PAGE HEADER --------------------- */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-semibold">Manage Volunteers</h1>

            <p className="mt-3 max-w-[720px] text-base leading-7 text-[#c1cab3]">
              Review, filter, and approve volunteer registrations across all
              your active eco-tech initiatives.
            </p>
          </div>

          {/* Header Button */}
          <div className="flex items-center gap-6 pt-2">
            <button className="flex h-[52px] min-w-[173px] items-center justify-center gap-3 rounded-lg bg-[#afff66] px-6 text-xs font-semibold uppercase tracking-widest text-[#101413] transition hover:bg-[#b7ff72]">
              <CheckCheck size={21} />
              <span>
                Bulk
                <br />
                Approve
              </span>
            </button>
          </div>
        </div>

        {/* ----------------- FILTERS --------------------- */}
        <div className="mt-7 flex items-center gap-4">
          {/* Search */}
          <div className="flex h-[48px] w-[480px] items-center gap-3 rounded-lg border border-[#324539] bg-[#14251d] px-5">
            <Search size={21} className="text-[#c1cab3]" />

            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              className="w-full bg-transparent text-sm tracking-wider text-[#e0e3e1] outline-none placeholder:text-[#879083]"
            />
          </div>

          {/* All Events */}
          <button className="flex h-[48px] w-[185px] items-center justify-between rounded-lg border border-[#324539] bg-[#1c2923] px-5 text-sm tracking-wider text-[#e0e3e1]">
            All Events
            <ChevronDown size={18} className="text-[#879083]" />
          </button>

          {/* Status */}
          <button className="flex h-[48px] w-[150px] items-center justify-between rounded-lg border border-[#324539] bg-[#1c2923] px-5 text-sm tracking-wider text-[#e0e3e1]">
            Status
            <ChevronDown size={18} className="text-[#879083]" />
          </button>
        </div>

        {/* ----------------------- VOLUNTEER TABLE ------------------------------- */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#324539] bg-[#142019]">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_1.5fr_1.1fr_1.55fr_0.9fr_0.5fr] items-center border-b border-[#24342A] px-4 py-5 text-[11px] uppercase tracking-widest text-[#c1cab3]">
            {/* Checkbox */}
            <div>
              <div className="h-4 w-4 rounded border border-[#324539] bg-[#101413]" />
            </div>

            <div>Volunteer</div>

            <div>Event Applied</div>

            <div>Key Skills</div>

            <div>Status</div>

            <div className="text-right">Actions</div>
          </div>

          {/* ------------------ TABLE ROWS --------------------- */}
          {volunteers.map((volunteer, index) => (
            <div
              key={index}
              className="grid min-h-[122px] grid-cols-[50px_1.5fr_1.1fr_1.55fr_0.9fr_0.5fr] items-center border-b border-[#24342A] px-4"
            >
              {/* Checkbox */}
              <div>
                <div className="h-4 w-4 rounded border border-[#324539] bg-[#101413]" />
              </div>

              {/* Volunteer */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${
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

              {/* Event */}
              <div>
                <p className="text-[17px]">{volunteer.event}</p>

                <p className="mt-1 text-xs text-[#c1cab3]">{volunteer.date}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`rounded-full px-3 py-1.5 text-xs tracking-wider ${
                      skill === "Electrical"
                        ? "border border-[#537244] bg-[#24342A] text-[#afff66]"
                        : "bg-[#303735] text-[#c1cab3]"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div>
                {volunteer.status === "Approved" ? (
                  <span className="rounded-full border border-[#afff66] bg-[#24342A] px-4 py-2 text-xs tracking-wider text-[#afff66]">
                    • Approved
                  </span>
                ) : (
                  <span className="rounded-full border border-[#324539] bg-[#2a342d] px-4 py-2 text-xs tracking-wider text-[#c1cab3]">
                    <span className="mr-2 text-yellow-400">•</span>
                    Pending
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="text-right"> </div>
            </div>
          ))}

          {/* ----------------- PAGINATION --------------------- */}
          <div className="flex items-center justify-between px-4 py-5">
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
