"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import QRCodeModal from "@/components/QRCodeModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import { EventWithStats } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Production } from "@/types/production";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("eventTracking");
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
      alert(t("baseUrlSaved"));
    } catch (error) {
      console.error("Failed to save base URL:", error);
      alert(t("baseUrlSaveFailed"));
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
      alert(t("createEventFailed"));
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await fetch(`/api/events?id=${eventId}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert(t("deleteEventFailed"));
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
      alert(t("addMediaFailed"));
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      await fetch(`/api/media?id=${mediaId}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete media:", error);
      alert(t("deleteMediaFailed"));
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
      alert(t("addRouteFailed"));
    }
  };

  const deleteRoute = async (routeId: string) => {
    try {
      await fetch(`/api/routes?id=${routeId}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete route:", error);
      alert(t("deleteRouteFailed"));
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
      alert(t("adjustRouteFailed"));
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
      alert(t("generateQrFailed"));
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
      alert(t("updateEventFailed"));
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
      alert(t("updateMediaFailed"));
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
      alert(t("updateRouteFailed"));
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} message={t("loading")} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              {t("title")}
            </h1>
            <p className="text-gray-600">
              {t("subtitle")}
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>{t("baseUrlTitle")}</CardTitle>
              <CardDescription>
                {t("baseUrlDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  type="url"
                  placeholder={t("baseUrlPlaceholder")}
                  value={baseUrlInput}
                  onChange={(e) => setBaseUrlInput(e.target.value)}
                />
                <Button onClick={saveBaseUrl} className="md:self-start">
                  {t("saveBaseUrl")}
                </Button>
              </div>
              {baseUrl && (
                <p className="text-sm text-muted-foreground">
                  {t("baseUrlCurrent")}{" "}
                  <span className="font-semibold text-gray-900">{baseUrl}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <CardTitle>{t("createEventTitle")}</CardTitle>
                <CardDescription>
                  {t("createEventDescription")}
                </CardDescription>
              </div>
              <Button
                variant={isAddingEvent ? "outline" : "default"}
                onClick={() => setIsAddingEvent(!isAddingEvent)}
              >
                {isAddingEvent ? t("cancel") : t("createEventToggle")}
              </Button>
            </CardHeader>
            {isAddingEvent && (
              <CardContent>
                <form onSubmit={createEvent} className="flex flex-col gap-3 md:flex-row">
                  <Input
                    type="text"
                    placeholder={t("eventNamePlaceholder")}
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                  <Button type="submit">{t("createEventSubmit")}</Button>
                </form>
              </CardContent>
            )}
          </Card>

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
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    {t("noEvents")}
                  </p>
                </CardContent>
              </Card>
            )
          )}

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
