"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import QRCodeModal from "@/components/QRCodeModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import { EventWithStats } from "@/types";
import type { Production } from "@/types/production";

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("");
  const [baseUrlInput, setBaseUrlInput] = useState("");
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [linkedProductions, setLinkedProductions] = useState<Record<string, Production>>({});
  const [loading, setLoading] = useState(true);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventName, setEventName] = useState("");
  const [qrModal, setQrModal] = useState<{
    qrCode: string;
    routeName: string;
  } | null>(null);

  // Fetch base URL and initial data
  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setBaseUrl(data.baseUrl || "");
      setBaseUrlInput(data.baseUrl || "");
    } catch (error) {
      console.error("Failed to fetch config:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats");
      const data = await res.json();
      setEvents(data.events || []);

      // Fetch linked productions
      await fetchLinkedProductions(data.events || []);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedProductions = async (events: EventWithStats[]) => {
    try {
      // Get unique production IDs from events
      const productionIds = events
        .filter(e => e.linkedProductionId)
        .map(e => e.linkedProductionId)
        .filter((id, index, self) => id && self.indexOf(id) === index); // Remove duplicates

      if (productionIds.length === 0) {
        setLinkedProductions({});
        return;
      }

      // Fetch production details
      const productionPromises = productionIds.map(async (id) => {
        const res = await fetch(`/api/productions/${id}`);
        if (res.ok) {
          return await res.json();
        }
        return null;
      });

      const productions = await Promise.all(productionPromises);

      // Map productions by their ID for quick lookup
      const productionsMap: Record<string, Production> = {};
      events.forEach(event => {
        if (event.linkedProductionId) {
          const production = productions.find(p => p && p._id === event.linkedProductionId);
          if (production) {
            productionsMap[event._id] = production;
          }
        }
      });

      setLinkedProductions(productionsMap);
    } catch (error) {
      console.error("Failed to fetch linked productions:", error);
    }
  };

  const saveBaseUrl = async () => {
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: baseUrlInput }),
      });
      const data = await res.json();
      setBaseUrl(data.baseUrl);
      alert("Base URL saved successfully!");
    } catch (error) {
      console.error("Failed to save base URL:", error);
      alert("Failed to save base URL");
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: eventName }),
      });
      setEventName("");
      setIsAddingEvent(false);
      fetchStats();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event");
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await fetch(`/api/events?id=${eventId}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  const addMedia = async (eventId: string, mediaName: string) => {
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name: mediaName }),
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to add media:", error);
      alert("Failed to add media");
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      await fetch(`/api/media?id=${mediaId}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete media:", error);
      alert("Failed to delete media");
    }
  };

  const addRoute = async (
    mediaId: string,
    routeName: string,
    redirectUrl: string
  ) => {
    try {
      await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, routeName, redirectUrl }),
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to add route:", error);
      alert("Failed to add route");
    }
  };

  const deleteRoute = async (routeId: string) => {
    try {
      await fetch(`/api/routes?id=${routeId}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete route:", error);
      alert("Failed to delete route");
    }
  };

  const adjustRouteClick = async (routeId: string, adjustment: number) => {
    try {
      await fetch("/api/routes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: routeId, adjustment }),
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to adjust route click:", error);
      alert("Failed to adjust route click");
    }
  };

  const generateQRCode = async (url: string, routeName: string) => {
    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setQrModal({ qrCode: data.qrCode, routeName });
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      alert("Failed to generate QR code");
    }
  };

  const updateEvent = async (eventId: string, name: string) => {
    try {
      await fetch("/api/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId, name }),
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to update event:", error);
      alert("Failed to update event");
    }
  };

  const updateMedia = async (mediaId: string, name: string) => {
    try {
      await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mediaId, name }),
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to update media:", error);
      alert("Failed to update media");
    }
  };

  const updateRoute = async (routeId: string, routeName: string) => {
    try {
      await fetch("/api/routes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: routeId, routeName }),
      });
      fetchStats();
    } catch (error) {
      console.error("Failed to update route:", error);
      alert("Failed to update route");
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} message="Loading..." />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Event Tracking Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your events, media campaigns, and track link clicks
          </p>
        </header>

        {/* Base URL Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Base URL Configuration
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="Enter your base URL (e.g., https://yourdomain.com)"
              value={baseUrlInput}
              onChange={(e) => setBaseUrlInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={saveBaseUrl}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
            >
              Save Base URL
            </button>
          </div>
          {baseUrl && (
            <p className="mt-2 text-sm text-gray-600">
              Current base URL: <span className="font-semibold">{baseUrl}</span>
            </p>
          )}
        </div>

        {/* Add Event Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg"
          >
            {isAddingEvent ? "Cancel" : "+ Create New Event"}
          </button>

          {isAddingEvent && (
            <form
              onSubmit={createEvent}
              className="mt-4 bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Event name (e.g., Chinese New Year Show)"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium"
                >
                  Create Event
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Events List */}
        {!loading && (
          events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  baseUrl={baseUrl}
                  linkedProduction={linkedProductions[event._id] || null}
                  onDelete={() => deleteEvent(event._id)}
                  onAddMedia={addMedia}
                  onDeleteMedia={deleteMedia}
                  onUpdateMedia={updateMedia}
                  onAddRoute={addRoute}
                  onDeleteRoute={deleteRoute}
                  onUpdateRoute={updateRoute}
                  onAdjustRouteClick={adjustRouteClick}
                  onGenerateQR={generateQRCode}
                  onUpdateEvent={updateEvent}
                  onUpdate={fetchStats}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">
                No events yet. Create one above!
              </p>
            </div>
          )
        )}

        {/* QR Code Modal */}
        {qrModal && (
          <QRCodeModal
            qrCode={qrModal.qrCode}
            routeName={qrModal.routeName}
            onClose={() => setQrModal(null)}
          />
        )}
        </div>
      </div>
    </>
  );
}
