import React, { useState } from 'react';
import {
  MapPin,
  Wifi,
  Coffee,
  ShoppingBag,
  Shield,
  HelpCircle,
  Accessibility,
  Utensils,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface StationAmenitiesProps {
  concourseImageSrc: string;
  cateringImageSrc: string;
  onOpenFoodOrder?: (productId?: string) => void;
}

interface StationInfo {
  code: string;
  name: string;
  city: string;
  platforms: number;
  executiveLounge: string;
  wifiStatus: string;
  cloakroomLocation: string;
  batteryCartContact: string;
}

const STATIONS: StationInfo[] = [
  {
    code: 'NDLS',
    name: 'New Delhi Railway Station',
    city: 'New Delhi',
    platforms: 16,
    executiveLounge: 'Platform 1 (Paharganj side) & Platform 16 (Ajmeri Gate side)',
    wifiStatus: 'RailWire High-Speed Free 30m Wi-Fi across all 16 platforms',
    cloakroomLocation: 'Ajmeri Gate side near Reservation Hall (PF 16)',
    batteryCartContact: '+91-98188-72439 / Helpdesk PF 1',
  },
  {
    code: 'CSMT',
    name: 'Chhatrapati Shivaji Maharaj Terminus',
    city: 'Mumbai',
    platforms: 18,
    executiveLounge: 'Platform 1 Main Heritage concourse',
    wifiStatus: 'Active across suburban & outstation concourses',
    cloakroomLocation: 'Opposite Platform 8/9 passage',
    batteryCartContact: 'RPF / Station Master PF 1 Helpdesk',
  },
  {
    code: 'HWH',
    name: 'Howrah Junction',
    city: 'Kolkata',
    platforms: 23,
    executiveLounge: 'Old Complex & New Complex Terminal',
    wifiStatus: 'Full coverage over all 23 platforms',
    cloakroomLocation: 'Between Platform 8 & 9 near cab road',
    batteryCartContact: 'Senior Citizen Kiosk Platform 9',
  },
  {
    code: 'BSB',
    name: 'Varanasi Junction',
    city: 'Varanasi',
    platforms: 9,
    executiveLounge: 'Platform 1 Air-conditioned VIP lounge',
    wifiStatus: 'Fiber Wi-Fi active',
    cloakroomLocation: 'Near Main Entrance Cantt side',
    batteryCartContact: 'Station Director Office PF 1',
  },
];

const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'IRCTC Gourmet Executive Thali',
    desc: 'Paneer Makhani, Dal Makhani, Jeera Basmati Rice, 2 Lachha Parathas, Raita, Salad & Gulab Jamun',
    price: 240,
    type: 'Veg',
    deliveryTime: 'At next junction (approx 25 mins)',
  },
  {
    id: 'm2',
    name: 'Jain Satvik Special Thali',
    desc: 'Prepared without onion or garlic: Shahi Paneer, Yellow Dal, Steamed Rice, Tawa Rotis, Sweet',
    price: 220,
    type: 'Jain Veg',
    deliveryTime: 'At next junction (approx 25 mins)',
  },
  {
    id: 'm3',
    name: 'Hyderabadi Dum Biryani Box',
    desc: 'Fragrant basmati rice slow-cooked with fresh vegetables, authentic spices, Mirchi Ka Salan & Raita',
    price: 195,
    type: 'Veg',
    deliveryTime: 'At next junction (approx 20 mins)',
  },
  {
    id: 'm4',
    name: 'South Indian Executive Combo',
    desc: '2 Masala Idlis, 1 Medu Vada, 1 Mini Uttapam, authentic Drumstick Sambar & 2 fresh chutneys',
    price: 160,
    type: 'Veg',
    deliveryTime: 'At next junction (approx 15 mins)',
  },
];

export const StationAmenities: React.FC<StationAmenitiesProps> = ({
  concourseImageSrc,
  cateringImageSrc,
  onOpenFoodOrder,
}) => {
  const [selectedStation, setSelectedStation] = useState<StationInfo>(STATIONS[0]);
  const [orderedItem, setOrderedItem] = useState<string | null>(null);
  const [coachInput, setCoachInput] = useState('B3');
  const [berthInput, setBerthInput] = useState('27');

  const handleOrder = (itemId: string, itemName: string) => {
    if (onOpenFoodOrder) {
      onOpenFoodOrder(itemId);
    } else {
      setOrderedItem(itemName);
    }
  };

  return (
    <div className="space-y-8">
      {/* Station Terminal Amenities Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>STATION CONCOURSE GUIDE</span>
              <span aria-hidden="true">·</span>
              <span>Platforms & Amenities</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Station Facilities & Platform Directory
            </h2>
          </div>

          {/* Station Selector Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none">
            {STATIONS.map((stn) => (
              <button
                key={stn.code}
                onClick={() => setSelectedStation(stn)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
                  selectedStation.code === stn.code
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              >
                {stn.code} ({stn.city})
              </button>
            ))}
          </div>
        </div>

        {/* Station Overview Banner with Concourse Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-6">
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[240px] border border-slate-200 dark:border-slate-800">
            <img
              src={concourseImageSrc}
              alt="Railway Station Concourse Terminal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {selectedStation.code} Terminal
              </span>
              <h3 className="text-lg font-extrabold">{selectedStation.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedStation.platforms} Active Broad-Gauge Platforms
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-1.5 text-blue-700 dark:text-blue-400">
                <Coffee className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Executive Lounge</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {selectedStation.executiveLounge}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">
                ₹150 for 2 hours with Wi-Fi, recliner seating, and complimentary beverage.
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Station Wi-Fi</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {selectedStation.wifiStatus}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">
                Select 'RailWire' network, enter mobile number, verify OTP.
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-1.5 text-amber-600 dark:text-amber-400">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cloak Room & Lockers</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {selectedStation.cloakroomLocation}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">
                Official tariff: ₹30 per package for first 24 hrs. Lockers: ₹40. (Valid ticket required).
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-1.5 text-purple-600 dark:text-purple-400">
                <Accessibility className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Senior & Divyang Cart</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {selectedStation.batteryCartContact}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">
                Free battery car transfer between platforms for senior citizens & patients.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* IRCTC e-Catering & Food on Track Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>FOOD ON TRACK</span>
              <span aria-hidden="true">·</span>
              <span>Hygienic IRCTC Partner Kitchens</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Order Warm Gourmet Meals to Your Seat
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Delivered directly inside your coach and berth when the train halts at intermediate junctions.
            </p>
          </div>

          {/* Quick Coach & Berth Assignment */}
          <div className="flex items-center gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block font-semibold">Coach</label>
              <input
                type="text"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value.toUpperCase())}
                className="w-16 h-8 text-center font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block font-semibold">Berth</label>
              <input
                type="text"
                value={berthInput}
                onChange={(e) => setBerthInput(e.target.value)}
                className="w-16 h-8 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Success toast if ordered */}
        {orderedItem && (
          <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Order Placed for <strong>{orderedItem}</strong>! Delivery scheduled at next junction directly to Coach {coachInput}, Berth {berthInput}.
              </span>
            </div>
            <button
              onClick={() => setOrderedItem(null)}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Food Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {MENU_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:shadow-sm transition-shadow"
            >
              <div>
                {/* Food photography for first item */}
                {index === 0 && (
                  <div className="relative h-36 rounded-lg overflow-hidden mb-3 border border-slate-200 dark:border-slate-700">
                    <img
                      src={cateringImageSrc}
                      alt="IRCTC Deluxe Thali"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Bestseller
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                  <span className="text-base font-black font-mono text-slate-900 dark:text-white tabular-nums">
                    ₹{item.price}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {item.desc}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {item.deliveryTime}
                </span>

                <button
                  onClick={() => handleOrder(item.id, item.name)}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Book Food Order to Seat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
