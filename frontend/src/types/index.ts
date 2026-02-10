export interface User {
  phone: string;
  token: string;
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface MeetTask {
  id: string;
  code: string;
  creatorPhone: string;
  partnerPhone?: string;
  status: 'pending' | 'matched' | 'ongoing' | 'completed' | 'cancelled';
  editCount: {
    creator: number;
    partner: number;
  };
  maxEdits: number;
  creatorLocation?: Location;
  partnerLocation?: Location;
  meetLocation?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
  cancelledBy?: string;
}

export interface MeetRecord {
  id: string;
  taskId: string;
  checkInTime: string;
  note?: string;
  photos?: string[];
}
