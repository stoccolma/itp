export interface POI {
  id: string;
  name: string;
  city: string;
  type: 'restaurant' | 'cafe' | 'attraction' | 'shop' | 'activity';
  description: string;
  detailedDescription: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priceRange: '$' | '$$' | '$$$' | 'Free';
  timing: string;
  imageUrl?: string;
  tags: string[];
}

export interface City {
  id: string;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export interface DayPlan {
  id: string;
  date: string;
  items: POI[];
}

export interface SidequestItem {
  poi: POI;
  notes?: string;
  addedAt: Date;
}

export interface AccessibilitySettings {
  dyslexiaFont: boolean;
  darkMode: boolean;
  textOnly: boolean;
}
