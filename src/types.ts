export interface StationHalt {
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival: string;
  actualDeparture: string;
  delayMinutes: number;
  platform: string;
  status: 'passed' | 'current' | 'upcoming';
}

export interface TrainLiveStatus {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  currentStation: string;
  nextStation: string;
  delayMinutes: number;
  statusText: string;
  speedKmh: number;
  lastUpdated: string;
  totalDistanceKm: number;
  coveredDistanceKm: number;
  halts: StationHalt[];
}

export interface Passenger {
  number: number;
  bookingStatus: string;
  currentStatus: string;
  coach: string;
  berth: number | string;
  berthType: string;
}

export interface PnrData {
  pnr: string;
  trainNumber: string;
  trainName: string;
  doj: string;
  boardingStation: string;
  destinationStation: string;
  chartStatus: string;
  travelClass: string;
  quota: string;
  passengers: Passenger[];
  confirmationProbability: number;
  probabilityGrade: string;
}

export interface TrainClassOption {
  code: string;
  name: string;
  fare: number;
  status: string;
  availableSeats?: number;
}

export interface SearchTrain {
  trainNumber: string;
  trainName: string;
  type?: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  days: string[];
  punctuality: string;
  classes: TrainClassOption[];
}

export interface ComplaintRecord {
  referenceId: string;
  category: string;
  pnr: string;
  trainNumber: string;
  coach: string;
  berth: string;
  phone: string;
  description: string;
  status: string;
  createdAt: string;
  expectedResolution: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface BookedTicketPassenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender';
  berthPreference: string;
  foodChoice: string;
  assignedCoach: string;
  assignedBerth: number;
  assignedBerthType: string;
}

export interface BookedTicket {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  doj: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  quota: string;
  passengers: BookedTicketPassenger[];
  totalFare: number;
  baseFare: number;
  tax: number;
  bookingTimestamp: string;
  ticketStatus: 'CONFIRMED' | 'RAC';
}

export interface FoodOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'thali' | 'biryani' | 'regional' | 'snacks' | 'beverages' | 'halloween';
  type: 'Veg' | 'Non-Veg' | 'Jain Veg';
}

export interface FoodOrder {
  orderId: string;
  trainNumber: string;
  trainName: string;
  pnr: string;
  coach: string;
  berth: string;
  deliveryStation: string;
  deliveryStationName: string;
  deliveryTime: string;
  passengerName: string;
  phoneNumber: string;
  items: FoodOrderItem[];
  subtotal: number;
  discount: number;
  gst: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash on Delivery to Seat';
  status: 'Confirmed' | 'Preparing in Kitchen' | 'Out for Platform Delivery' | 'Delivered to Seat';
  orderTimestamp: string;
  estimatedDeliveryMin: number;
}
