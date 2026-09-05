import { useState, useEffect } from "react";
import fetchJSON from "../../utils/api";
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
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJSON("/api/registrations")
      .then((data) => {
        if (!cancelled) {
          setRegistrations(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = async (registrationId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/registrations/${registrationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "Approved" }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to approve");

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId ? { ...reg, status: "Approved" } : reg,
        ),
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#101413] text-[#e0e3e1]">
      <OrganizerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 md:px-8 lg:px-10 lg:py-11">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mb-6 rounded-lg border border-[#324539] bg-[#1c201f] p-3 text-[#afff66] lg:hidden"
        >
          <Menu size={24} />
        </button>

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

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <div className="flex h-[48px] w-full items-center gap-3 rounded-lg border border-[#324539] bg-[#14251d] px-5 sm:w-[480px]">
            <Search size={21} className="shrink-0 text-[#c1cab3]" />
            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              className="w-full bg-transparent text-sm tracking-wider text-[#e0e3e1] outline-none placeholder:text-[#879083]"
            />
          </div>
          <button className="flex h-[48px] w-full items-center justify-between rounded-lg border border-[#324539] bg-[#1c2923] px-5 text-sm tracking-wider text-[#e0e3e1] sm:w-[185px]">
            All Events <ChevronDown size={18} className="text-[#879083]" />
          </button>
          <button className="flex h-[48px] w-full items-center justify-between rounded-lg border border-[#324539] bg-[#1c2923] px-5 text-sm tracking-wider text-[#e0e3e1] sm:w-[150px]">
            Status <ChevronDown size={18} className="text-[#879083]" />
          </button>
        </div>

        <section className="mt-6 w-full overflow-hidden rounded-2xl border border-[#324539] bg-[#1c201f]">
          <div className="overflow-x-auto">
            <div className="min-w-[950px]">
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

              {loading && (
                <div className="p-8 text-center text-[#c1cab3]">
                  Loading applications...
                </div>
              )}
              {error && (
                <div className="p-8 text-center text-red-400">{error}</div>
              )}

              {!loading &&
                !error &&
                registrations.map((reg, index) => {
                  const volunteerName =
                    reg.volunteer?.displayName ||
                    reg.volunteer?.username ||
                    "Unknown User";
                  const initials = volunteerName.substring(0, 2).toUpperCase();

                  return (
                    <div
                      key={reg._id || index}
                      className="grid min-h-[122px] grid-cols-[50px_1.5fr_1.1fr_1.55fr_0.9fr_0.5fr] items-center border-b border-[#24342A] px-4"
                    >
                      <div>
                        <div className="h-4 w-4 rounded border border-[#324539] bg-[#101413]" />
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${index % 2 === 0 ? "bg-[#34463d] text-[#afff66]" : "bg-[#1f3731] text-[#afff66]"}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-[17px] font-semibold">
                            {volunteerName}
                          </h3>
                          <p className="mt-1 text-sm text-[#c1cab3]">
                            {reg.volunteer?.username || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[17px] truncate max-w-[200px]">
                          {reg.event?.title || "Unknown Event"}
                        </p>
                        <p className="mt-1 text-xs text-[#c1cab3]">
                          {reg.event?.start_time
                            ? new Date(
                                reg.event.start_time,
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {reg.skills && reg.skills.length > 0 ? (
                          reg.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="rounded-full bg-[#303735] px-3 py-1.5 text-xs tracking-wider text-[#c1cab3]"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#525b50]">
                            No skills listed
                          </span>
                        )}
                      </div>

                      <div>
                        {reg.status === "Approved" ? (
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

                      <div className="text-right flex justify-end">
                        {reg.status !== "Approved" && (
                          <button
                            onClick={() => handleApprove(reg._id)}
                            className="rounded-lg border border-[#537244] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#afff66] transition hover:bg-[#24342A]"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm tracking-wider text-[#c1cab3]">
              Showing {registrations.length} registrations
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
