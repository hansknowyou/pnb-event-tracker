export interface Event {
  _id: string;
  name: string;
  linkedProductionId?: string; // Link to Production
  createdAt?: string;
  updatedAt?: string;
  totalClicks?: number;
  media?: MediaWithStats[];
}

export interface Media {
  _id: string;
  eventId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaWithStats extends Media {
  totalClicks?: number;
  routes?: Route[];
}

export interface Route {
  _id: string;
  mediaId: string;
  routeName: string;
  redirectUrl: string;
  clickCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventWithStats extends Event {
  totalClicks: number;
  media: MediaWithStats[];
}
