export interface VisitLocation {
  readonly name: string;
  readonly address: readonly string[];
  readonly description: string;
  readonly mapUrl: string;
  readonly parking: string;
  readonly accessibility: string;
  readonly phone?: string;
}

export interface OpeningHour {
  readonly day: string;
  readonly dayIndex: number;
  readonly opensAt?: string;
  readonly closesAt?: string;
  readonly closed?: boolean;
  readonly notice?: string;
}

export interface VisitContent {
  readonly location: VisitLocation;
  readonly hours: readonly OpeningHour[];
  readonly hoursNotice: string;
}

export const visitContent: VisitContent = {
  location: {
    name: 'Last Stop Brewing',
    address: ['525 Main Street', 'Shelbyville, KY 40065', 'United States'],
    description:
      'Find Last Stop Brewing in downtown Shelbyville. Open the map for turn-by-turn directions.',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Last%20Stop%20Brewing%2C%20525%20Main%20Street%2C%20Shelbyville%2C%20KY%2040065',
    parking: 'Parking details pending verification.',
    accessibility:
      'Accessibility, step-free access, restroom, and accommodation details are pending verification.',
  },
  hours: [
    { day: 'Sunday', dayIndex: 0, opensAt: '12 PM', closesAt: '12 AM' },
    { day: 'Monday', dayIndex: 1, opensAt: '2 PM', closesAt: '12 AM' },
    { day: 'Tuesday', dayIndex: 2, opensAt: '2 PM', closesAt: '12 AM' },
    { day: 'Wednesday', dayIndex: 3, opensAt: '2 PM', closesAt: '12 AM' },
    { day: 'Thursday', dayIndex: 4, opensAt: '2 PM', closesAt: '12 AM' },
    { day: 'Friday', dayIndex: 5, opensAt: '12 PM', closesAt: '12 AM' },
    { day: 'Saturday', dayIndex: 6, opensAt: '12 PM', closesAt: '12 AM' },
  ],
  hoursNotice:
    'Hours shown are regular brewery hours. Holiday changes and kitchen hours are not currently published.',
};

export function openingHoursLabel(hour: OpeningHour): string {
  if (hour.closed) {
    return 'Closed';
  }
  if (hour.opensAt && hour.closesAt) {
    return `${hour.opensAt}–${hour.closesAt}`;
  }
  return 'Hours pending verification';
}
