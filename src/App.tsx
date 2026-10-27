import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { LiveTrainTracker } from './components/LiveTrainTracker';
import { PnrStatusView } from './components/PnrStatusView';
import { TrainSearchView } from './components/TrainSearchView';
import { CoachPositionViewer } from './components/CoachPositionViewer';
import { StationAmenities } from './components/StationAmenities';
import { RailMadadEmergency } from './components/RailMadadEmergency';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { HalloweenMovingCreatures } from './components/HalloweenMovingCreatures';
import { HalloweenSoundControlBar } from './components/HalloweenSoundControlBar';
import { SeatBookingModal } from './components/SeatBookingModal';
import { FoodOrderModal } from './components/FoodOrderModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { FoodOrdersDrawer } from './components/FoodOrdersDrawer';
import { ALL_INDIAN_TRAINS, ComprehensiveTrain } from './data/trainsData';
import { TrainLiveStatus, PnrData, SearchTrain, ComplaintRecord, BookedTicket, FoodOrder } from './types';
import {
  Navigation,
  Ticket,
  Train,
  Layers,
  Sparkles,
  PhoneCall,
  MapPin,
  Utensils,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

// High-fidelity image assets generated via generate_image
const HERO_TRAIN_IMAGE = '/src/assets/images/railsaarthi_halloween_campus_1793091336083.jpg';
const COACH_INTERIOR_IMAGE = '/src/assets/images/train_interior_coach_1793089668105.jpg';
const CONCOURSE_IMAGE = '/src/assets/images/railway_station_concourse_1793089669934.jpg';
const CATERING_IMAGE = '/src/assets/images/irctc_catering_thali_1793089669505.jpg';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiAssistantQuery, setAiAssistantQuery] = useState('');

  // Live status state
  const [currentTrainNum, setCurrentTrainNum] = useState('22436');
  const [liveStatus, setLiveStatus] = useState<TrainLiveStatus | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  // PNR state
  const [pnrData, setPnrData] = useState<PnrData | null>(null);
  const [isPnrLoading, setIsPnrLoading] = useState(false);

  // Search trains state
  const [fromStation, setFromStation] = useState('NDLS');
  const [toStation, setToStation] = useState('BSB');
  const [searchTrains, setSearchTrains] = useState<SearchTrain[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Coach rake state
  const [selectedCoachTrain, setSelectedCoachTrain] = useState('12952');

  // Seat Booking state
  const [isSeatBookingOpen, setIsSeatBookingOpen] = useState(false);
  const [selectedBookingTrain, setSelectedBookingTrain] = useState<ComprehensiveTrain | null>(ALL_INDIAN_TRAINS[0]);
  const [selectedBookingClass, setSelectedBookingClass] = useState<string>('3A');
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>(() => {
    const saved = localStorage.getItem('railsaarthi_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        pnr: '4829104812',
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        from: 'NDLS',
        fromName: 'New Delhi',
        to: 'BSB',
        toName: 'Varanasi Junction',
        doj: '2026-10-29',
        departureTime: '06:00',
        arrivalTime: '14:00',
        travelClass: 'CC',
        quota: 'General (GN)',
        passengers: [
          {
            name: 'Rohan Sharma',
            age: 32,
            gender: 'Male',
            berthPreference: 'Lower Berth (LB)',
            foodChoice: 'Veg Thali',
            assignedCoach: 'C4',
            assignedBerth: 27,
            assignedBerthType: 'Window',
          },
        ],
        totalFare: 1838,
        baseFare: 1750,
        tax: 88,
        bookingTimestamp: '2026-10-27 10:14',
        ticketStatus: 'CONFIRMED',
      },
    ];
  });

  // Food Order state
  const [isFoodOrderOpen, setIsFoodOrderOpen] = useState(false);
  const [foodInitialProductId, setFoodInitialProductId] = useState<string | undefined>(undefined);
  const [isFoodOrdersDrawerOpen, setIsFoodOrdersDrawerOpen] = useState(false);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>(() => {
    const saved = localStorage.getItem('railsaarthi_food_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        orderId: 'FOD-2026-8912',
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        pnr: '4829104812',
        coach: 'C4',
        berth: '27',
        deliveryStation: 'Kanpur Central',
        deliveryStationName: 'Kanpur Central (CNB)',
        deliveryTime: 'At Platform 4 halt',
        passengerName: 'Rohan Sharma',
        phoneNumber: '9876543210',
        items: [
          {
            id: 'f1',
            name: 'IRCTC Gourmet Executive Thali',
            price: 240,
            quantity: 1,
            category: 'thali',
            type: 'Veg',
          },
          {
            id: 'f9',
            name: 'Railway Kulhad Masala Chai Flask',
            price: 70,
            quantity: 1,
            category: 'beverages',
            type: 'Veg',
          },
        ],
        subtotal: 310,
        discount: 62,
        gst: 12,
        deliveryFee: 0,
        totalAmount: 260,
        paymentMethod: 'Cash on Delivery to Seat',
        status: 'Confirmed',
        orderTimestamp: '10:20 AM',
        estimatedDeliveryMin: 20,
      },
    ];
  });

  const handleStartSeatBooking = (trainNum?: string, classCode?: string) => {
    if (trainNum) {
      const found = ALL_INDIAN_TRAINS.find((t) => t.trainNumber === trainNum);
      if (found) {
        setSelectedBookingTrain(found);
      }
    } else if (!selectedBookingTrain) {
      setSelectedBookingTrain(ALL_INDIAN_TRAINS[0]);
    }
    if (classCode) {
      setSelectedBookingClass(classCode);
    }
    setIsSeatBookingOpen(true);
  };

  const handleBookingComplete = (ticket: BookedTicket) => {
    const updated = [ticket, ...bookedTickets];
    setBookedTickets(updated);
    try {
      localStorage.setItem('railsaarthi_tickets', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteTicket = (pnr: string) => {
    const updated = bookedTickets.filter((t) => t.pnr !== pnr);
    setBookedTickets(updated);
    try {
      localStorage.setItem('railsaarthi_tickets', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleStartFoodOrder = (productId?: string) => {
    setFoodInitialProductId(productId);
    setIsFoodOrderOpen(true);
  };

  const handleFoodOrderPlaced = (order: FoodOrder) => {
    const updated = [order, ...foodOrders];
    setFoodOrders(updated);
    try {
      localStorage.setItem('railsaarthi_food_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteFoodOrder = (orderId: string) => {
    const updated = foodOrders.filter((o) => o.orderId !== orderId);
    setFoodOrders(updated);
    try {
      localStorage.setItem('railsaarthi_food_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  // Load default data on mount
  useEffect(() => {
    fetchLiveStatus('22436');
    fetchPnrData('4829104812');
    fetchSearchTrains('NDLS', 'BSB');
  }, []);

  const fetchLiveStatus = async (trainNum: string) => {
    setIsLiveLoading(true);
    setCurrentTrainNum(trainNum);
    try {
      const res = await fetch(`/api/trains/live/${encodeURIComponent(trainNum)}`);
      const data = await res.json();
      setLiveStatus(data);
    } catch (e) {
      console.error('Failed to load train status', e);
    } finally {
      setIsLiveLoading(false);
    }
  };

  const fetchPnrData = async (pnrNum: string) => {
    setIsPnrLoading(true);
    try {
      const res = await fetch(`/api/pnr/${encodeURIComponent(pnrNum)}`);
      const data = await res.json();
      if (!data.error) {
        setPnrData(data);
      }
    } catch (e) {
      console.error('Failed to load PNR', e);
    } finally {
      setIsPnrLoading(false);
    }
  };

  const fetchSearchTrains = async (from: string, to: string) => {
    setIsSearchLoading(true);
    setFromStation(from);
    setToStation(to);
    try {
      const res = await fetch(`/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await res.json();
      setSearchTrains(data.trains || []);
    } catch (e) {
      console.error('Failed to search trains', e);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleFileComplaint = async (payload: {
    category: string;
    pnr: string;
    trainNumber: string;
    coach: string;
    berth: string;
    description: string;
    phone: string;
  }): Promise<ComplaintRecord | null> => {
    try {
      const res = await fetch('/api/rail-madad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.complaint || null;
    } catch (e) {
      console.error('Error filing complaint', e);
      return null;
    }
  };

  const handleAskAi = (query: string) => {
    setAiAssistantQuery(query);
    setIsAiAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Header conforming to Top Bar Contract */}
      <Header
        activeSection={activeSection}
        onNavigate={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiAssistant={() => {
          setAiAssistantQuery('');
          setIsAiAssistantOpen(true);
        }}
        onOpenSeatBooking={() => handleStartSeatBooking()}
        onOpenFoodOrder={() => handleStartFoodOrder()}
        bookedTicketsCount={bookedTickets.length}
        onOpenBookingsDrawer={() => setIsBookingsDrawerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Search Section on Home or top of page */}
        {activeSection === 'home' && (
          <HeroSearch
            heroImageSrc={HERO_TRAIN_IMAGE}
            onSearchTrainLive={(num) => {
              fetchLiveStatus(num);
              setActiveSection('live');
            }}
            onSearchPnr={(pnr) => {
              fetchPnrData(pnr);
              setActiveSection('pnr');
            }}
            onSearchBetweenStations={(from, to) => {
              fetchSearchTrains(from, to);
              setActiveSection('search');
            }}
            onSelectCoachRake={(trainNum) => {
              setSelectedCoachTrain(trainNum);
              setActiveSection('coach');
            }}
            onOpenSeatBooking={() => handleStartSeatBooking()}
            onOpenFoodOrder={() => handleStartFoodOrder()}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Quick Feature Navigation Cards when on home */}
          {activeSection === 'home' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Core Railway Services
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time IRCTC synchronization and safety assistance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => handleStartSeatBooking()}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span>Book Train Seats</span>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select 2D coach berths, manage passengers, and generate instant confirmed e-Tickets.
                  </p>
                </button>

                <button
                  onClick={() => handleStartFoodOrder()}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left hover:border-orange-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span>Book Food to Seat</span>
                    <span className="text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                      IRCTC
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Order hot gourmet thalis, biryani, and regional dishes delivered directly to your berth.
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection('live')}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Live GPS Tracker
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Live speed, current station, platform numbers & delay telemetry.
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection('pnr')}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    PNR Confirmation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Algorithmic WL confirmation forecast, berth type & chart status.
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection('coach')}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Coach & Berth Map
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Platform rake sequence and 2D compartment cabin layouts.
                  </p>
                </button>

                <button
                  onClick={() => setActiveSection('madad')}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left hover:border-red-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    139 Rail Madad SOS
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Immediate RPF escort, doctor on board, and onboard grievance dispatch.
                  </p>
                </button>
              </div>
            </section>
          )}

          {/* Live Train Tracker Section */}
          {(activeSection === 'home' || activeSection === 'live') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Live Running Telemetry
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time satellite & station feed GPS coordinates
                  </p>
                </div>
              </div>

              <LiveTrainTracker
                statusData={liveStatus}
                isLoading={isLiveLoading}
                onRefresh={() => fetchLiveStatus(currentTrainNum)}
                onSearchOther={(num) => fetchLiveStatus(num)}
              />
            </section>
          )}

          {/* PNR Status Section */}
          {(activeSection === 'home' || activeSection === 'pnr') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    PNR Enquiry & Probability Forecast
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Historical clearance algorithms with real-time chart status
                  </p>
                </div>
              </div>

              <PnrStatusView
                pnrData={pnrData}
                isLoading={isPnrLoading}
                onViewCoachLayout={(num) => {
                  setSelectedCoachTrain(num);
                  setActiveSection('coach');
                }}
              />
            </section>
          )}

          {/* Search Trains Section */}
          {(activeSection === 'home' || activeSection === 'search') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Trains Between Stations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct timetable, seat availability, and fare comparison
                  </p>
                </div>
              </div>

              <TrainSearchView
                fromStation={fromStation}
                toStation={toStation}
                trains={searchTrains}
                isLoading={isSearchLoading}
                onTrackTrain={(num) => {
                  fetchLiveStatus(num);
                  setActiveSection('live');
                }}
                onViewCoachLayout={(num) => {
                  setSelectedCoachTrain(num);
                  setActiveSection('coach');
                }}
                onAskAiAboutTrain={(name) => handleAskAi(`Tell me about ${name}, its punctuality, food, and amenities`)}
                onBookSeat={(num, cls) => handleStartSeatBooking(num, cls)}
                onOrderFood={(num) => handleStartFoodOrder()}
              />
            </section>
          )}

          {/* Coach Layout Section */}
          {(activeSection === 'coach') && (
            <section className="space-y-4">
              <CoachPositionViewer
                trainNumber={selectedCoachTrain}
                coachInteriorImageSrc={COACH_INTERIOR_IMAGE}
              />
            </section>
          )}

          {/* Station Amenities & Food Section */}
          {(activeSection === 'amenities') && (
            <section className="space-y-4">
              <StationAmenities
                concourseImageSrc={CONCOURSE_IMAGE}
                cateringImageSrc={CATERING_IMAGE}
                onOpenFoodOrder={(productId) => handleStartFoodOrder(productId)}
              />
            </section>
          )}

          {/* Rail Madad Section */}
          {(activeSection === 'madad') && (
            <section className="space-y-4">
              <RailMadadEmergency onFileComplaint={handleFileComplaint} />
            </section>
          )}
        </div>
      </main>

      {/* AI Assistant Drawer Modal */}
      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        initialQuery={aiAssistantQuery}
      />

      {/* Seat Booking Modal */}
      <SeatBookingModal
        isOpen={isSeatBookingOpen}
        onClose={() => setIsSeatBookingOpen(false)}
        train={selectedBookingTrain}
        initialClass={selectedBookingClass}
        onBookingComplete={handleBookingComplete}
      />

      {/* Food Order Booking Modal */}
      <FoodOrderModal
        isOpen={isFoodOrderOpen}
        onClose={() => setIsFoodOrderOpen(false)}
        trainNumber={currentTrainNum}
        trainName={liveStatus?.trainName || 'Vande Bharat Express'}
        pnr={pnrData?.pnr || '4829104812'}
        coach="B3"
        berth="27"
        initialProductId={foodInitialProductId}
        onOrderPlaced={handleFoodOrderPlaced}
      />

      {/* Booked Tickets Drawer */}
      <BookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        tickets={bookedTickets}
        onCheckPnr={(pnr) => {
          fetchPnrData(pnr);
          setActiveSection('pnr');
        }}
        onDeleteTicket={handleDeleteTicket}
      />

      {/* Food Orders Tracking Drawer */}
      <FoodOrdersDrawer
        isOpen={isFoodOrdersDrawerOpen}
        onClose={() => setIsFoodOrdersDrawerOpen(false)}
        orders={foodOrders}
        onDeleteOrder={handleDeleteFoodOrder}
      />

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 from mobile touch guidelines) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-5 items-center h-16 px-2">
          <button
            onClick={() => setActiveSection('home')}
            className={`flex flex-col items-center justify-center min-h-[44px] ${
              activeSection === 'home'
                ? 'text-orange-600 dark:text-orange-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Train className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Home</span>
          </button>

          <button
            onClick={() => handleStartSeatBooking()}
            className="flex flex-col items-center justify-center min-h-[44px] text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            <Ticket className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Book Seat</span>
          </button>

          <button
            onClick={() => handleStartFoodOrder()}
            className="flex flex-col items-center justify-center min-h-[44px] text-orange-600 dark:text-orange-400 font-semibold"
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Order Food</span>
          </button>

          <button
            onClick={() => setActiveSection('live')}
            className={`flex flex-col items-center justify-center min-h-[44px] ${
              activeSection === 'live'
                ? 'text-orange-600 dark:text-orange-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Live</span>
          </button>

          <button
            onClick={() => {
              setAiAssistantQuery('');
              setIsAiAssistantOpen(true);
            }}
            className="flex flex-col items-center justify-center min-h-[44px] text-amber-600 dark:text-amber-400 font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">AI Help</span>
          </button>
        </div>
      </div>

      {/* Clean Desktop/Mobile Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-orange-500 dark:text-orange-400">RailSaarthi Ghost on a Campus</span>
            <span aria-hidden="true">·</span>
            <span>Spooky University Terminal & IRCTC Travel Companion</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {foodOrders.length > 0 && (
              <button
                onClick={() => setIsFoodOrdersDrawerOpen(true)}
                className="text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Active Food Orders ({foodOrders.length})</span>
              </button>
            )}
            {bookedTickets.length > 0 && (
              <button
                onClick={() => setIsBookingsDrawerOpen(true)}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>My Tickets ({bookedTickets.length})</span>
              </button>
            )}
            <span>Helpline: 139</span>
            <span aria-hidden="true">·</span>
            <span>IRCTC Live Sync</span>
          </div>
        </div>
      </footer>

      {/* Floating Halloween Moving Creatures (Ghosts, Bats, Jack-o'-Lanterns) */}
      <HalloweenMovingCreatures />

      {/* Continuous Halloween Background Soundtrack Controls */}
      <HalloweenSoundControlBar />
    </div>
  );
}
