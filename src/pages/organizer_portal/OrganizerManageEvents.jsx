import OrganizerSidebar from "../../components/organizer_portal/OrganizerSidebar";

import { useState } from "react";

import {
  Search,
  SlidersHorizontal,
  Pencil,
  X,
  Trash2,
  Eye,
  RefreshCw,
  Image,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

function OrganizerManageEvents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Riverfront Revitalization & Cleanup",
      details: "Downtown Waterfront District · Habitat...",
      date: "Oct 24, 2024",
      time: "08:00 AM - 12:00 PM",
      registrations: 45,
      total: 50,
      progress: 90,
      status: "Published",
      image: true,
    },
    {
      id: 2,
      name: "Tech Waste Recycling Drive",
      details: "Main City Plaza · Recycling Initiative",
      date: "Nov 12, 2024",
      time: "10:00 AM - 04:00 PM",
      registrations: 0,
      total: 100,
      progress: 0,
      status: "Draft",
      image: false,
    },
    {
      id: 3,
      name: "Community Garden Expansion",
      details: "Eastside Park · Urban Agriculture",
      date: "Sep 15, 2024",
      time: "Completed",
      registrations: 30,
      total: 30,
      progress: 100,
      status: "Completed",
      image: true,
    },
    {
      id: 4,
      name: "Green Technology Workshop",
      details: "Community Center · Technology Initiative",
      date: "Dec 05, 2024",
      time: "09:00 AM - 01:00 PM",
      registrations: 20,
      total: 50,
      progress: 40,
      status: "Published",
      image: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  // Search + filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Delete event
  const deleteEvent = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );
  };

  // Toggle published/draft
  const togglePublished = (id) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === id
          ? {
              ...event,
              status:
                event.status === "Published"
                  ? "Draft"
                  : "Published",
            }
          : event
      )
    );
  };

  // Simple edit action
  const editEvent = (event) => {
    const newName = window.prompt(
      "Enter the new event name:",
      event.name
    );

    if (!newName || newName.trim() === "") return;

    setEvents((currentEvents) =>
      currentEvents.map((item) =>
        item.id === event.id
          ? { ...item, name: newName.trim() }
          : item
      )
    );
  };

  // View event
  const viewEvent = (event) => {
    alert(
      `Event: ${event.name}\n\nStatus: ${event.status}\nRegistrations: ${event.registrations}/${event.total}`
    );
  };

  const activeEvents = events.filter(
    (event) => event.status === "Published"
  ).length;

  return (
    <div className="flex min-h-screen bg-[#101413] text-[#e0e3e1]">
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
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-11">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mb-6 rounded-lg border border-[#324539] bg-[#1c201f] p-3 text-[#afff66] lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* TOP SECTION */}
        <div className="mb-10 flex flex-col gap-6 lg:mb-20 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Manage Events
            </h1>

            <p className="text-base text-[#c1cab3]">
              Track, edit, and monitor the status of your organized
              eco-stewardship activities.
            </p>
          </div>

          {/* STATISTICS */}
          <div className="flex w-full gap-4 lg:w-auto">
            <div className="flex w-full items-center gap-4 rounded-xl border border-[#324539] bg-[#1c201f] p-4 sm:w-[170px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#24342A] text-[#afff66]">
                <RefreshCw size={23} />
              </div>

              <div>
                <p className="text-sm text-[#c1cab3]">Active</p>

                <h3 className="text-xl font-semibold">
                  {activeEvents}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* EVENTS CARD */}
        <section className="w-full overflow-hidden rounded-2xl border border-[#324539] bg-[#1c201f]">
          {/* SEARCH / FILTER */}
          <div className="flex flex-col gap-4 bg-[#24342A] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex h-10 w-full sm:w-[480px] items-center gap-3 rounded-md border border-[#324539] bg-[#14251d] px-4 text-[#c1cab3]">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm tracking-wide outline-none placeholder:text-[#879083]"
              />
            </div>

            {/* FILTER BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 rounded-md border border-[#324539] px-5 py-2.5 text-sm tracking-widest text-[#c1cab3] transition hover:bg-[#1c201f]"
              >
                <SlidersHorizontal size={17} />
                Filter
              </button>

              {showFilter && (
                <div className="absolute right-0 top-12 z-30 w-44 rounded-lg border border-[#324539] bg-[#1c201f] p-2 shadow-xl">
                  {["All", "Published", "Draft", "Completed"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilter(false);
                        }}
                        className={`w-full rounded-md px-4 py-3 text-left text-sm transition hover:bg-[#24342A] ${
                          statusFilter === status
                            ? "text-[#afff66]"
                            : "text-[#c1cab3]"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE FILTER */}
          {statusFilter !== "All" && (
            <div className="flex items-center justify-between border-b border-[#24342A] px-6 py-3 text-sm">
              <span className="text-[#c1cab3]">
                Showing:{" "}
                <span className="text-[#afff66]">
                  {statusFilter}
                </span>
              </span>

              <button
                onClick={() => setStatusFilter("All")}
                className="text-[#c1cab3] hover:text-[#afff66]"
              >
                Clear
              </button>
            </div>
          )}

          {/* TABLE HEADER */}
          <div className="min-w-[950px]">
            <div className="grid grid-cols-[2.3fr_1.1fr_0.9fr_0.9fr_0.6fr] bg-[#19201d] px-9 py-5 text-[11px] uppercase tracking-widest text-[#c1cab3]">
              <div>Event Name & Details</div>
              <div>Date & Time</div>
              <div>Registrations</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
          </div>

          {/* EVENTS */}
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="grid min-h-[120px] grid-cols-[2.3fr_1.1fr_0.9fr_0.9fr_0.6fr] items-center border-b border-[#24342A] px-9 py-4"
            >
              {/* EVENT INFORMATION */}
              <div className="flex items-center gap-4">
                <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-md bg-[#24342A] text-[#424938]">
                  {event.image ? (
                    <div
                      className={`h-full w-full ${
                        index === 0
                          ? "bg-gradient-to-br from-[#31503d] via-[#739e6b] to-[#17231b]"
                          : "bg-gradient-to-br from-[#202a24] via-[#4a5549] to-[#161b17]"
                      }`}
                    />
                  ) : (
                    <Image size={28} />
                  )}
                </div>

                <div>
                  <h3 className="max-w-[260px] text-[17px] font-semibold leading-7">
                    {event.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#c1cab3]">
                    {event.details}
                  </p>
                </div>
              </div>

              {/* DATE */}
              <div>
                <p className="mb-2 text-sm">{event.date}</p>

                <span className="text-xs text-[#c1cab3]">
                  {event.time}
                </span>
              </div>

              {/* REGISTRATIONS */}
              <div>
                <p className="mb-2 text-sm">
                  <strong>{event.registrations}</strong>
                  <span className="text-[#c1cab3]">
                    {" "}
                    / {event.total}
                  </span>
                </p>

                <div className="h-[7px] w-[110px] overflow-hidden rounded-full bg-[#324539]">
                  <div
                    className="h-full rounded-full bg-[#afff66]"
                    style={{
                      width: `${event.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* STATUS */}
              <div>
                {event.status === "Published" && (
                  <span className="rounded-full border border-[#324539] bg-[#213324] px-3 py-2 text-[10px] tracking-widest text-[#afff66]">
                    ● PUBLISHED
                  </span>
                )}

                {event.status === "Draft" && (
                  <span className="rounded-full border border-[#324539] bg-[#29302d] px-3 py-2 text-[10px] tracking-widest text-[#c1cab3]">
                    ◌ DRAFT
                  </span>
                )}

                {event.status === "Completed" && (
                  <span className="rounded-full border border-[#324539] px-3 py-2 text-[10px] tracking-widest text-[#a3aaa1]">
                    ◉ COMPLETED
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-between text-[#c1cab3]">
                {event.status === "Completed" ? (
                  <button
                    onClick={() => viewEvent(event)}
                    title="View Event"
                  >
                    <Eye
                      size={20}
                      className="cursor-pointer transition hover:text-[#afff66]"
                    />
                  </button>
                ) : (
                  <>
                    {/* EDIT */}
                    <button
                      onClick={() => editEvent(event)}
                      title="Edit Event"
                    >
                      <Pencil
                        size={19}
                        className="cursor-pointer transition hover:text-[#afff66]"
                      />
                    </button>

                    {/* PUBLISH / UNPUBLISH */}
                    {event.status === "Published" ? (
                      <button
                        onClick={() => togglePublished(event.id)}
                        title="Unpublish Event"
                      >
                        <X
                          size={21}
                          className="cursor-pointer transition hover:text-[#afff66]"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteEvent(event.id)}
                        title="Delete Event"
                      >
                        <Trash2
                          size={19}
                          className="cursor-pointer transition hover:text-[#afff66]"
                        />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {/* NO EVENTS */}
          {filteredEvents.length === 0 && (
            <div className="py-12 text-center text-sm text-[#c1cab3]">
              No events found.
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex flex-col gap-4 px-5 py-4 text-xs tracking-wider text-[#c1cab3] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing 1–{filteredEvents.length} of{" "}
              {filteredEvents.length} events
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled
                className="cursor-not-allowed opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#424f47] text-[#e0e3e1]">
                1
              </button>

              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#24342A]">
                2
              </button>

              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#24342A]">
                3
              </button>

              <button className="hover:text-[#afff66]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrganizerManageEvents;