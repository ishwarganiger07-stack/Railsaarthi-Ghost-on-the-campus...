import React, { useState } from 'react';
import { FoodOrder, FoodOrderItem } from '../types';
import { halloweenAudio } from '../utils/halloweenSound';
import {
  X,
  Utensils,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  Clock,
  MapPin,
  Train,
  Tag,
  Phone,
  User,
  ShieldCheck,
  Printer,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Coffee,
} from 'lucide-react';

export interface FoodProduct {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: 'thali' | 'biryani' | 'regional' | 'snacks' | 'beverages' | 'halloween';
  type: 'Veg' | 'Non-Veg' | 'Jain Veg';
  image?: string;
  bestseller?: boolean;
  spicyLevel?: 'Mild' | 'Medium' | 'Spicy';
  stationDelivered: string;
}

export const FOOD_MENU: FoodProduct[] = [
  // Thalis
  {
    id: 'f1',
    name: 'IRCTC Gourmet Executive Thali',
    desc: 'Paneer Makhani, Dal Makhani, Jeera Basmati Rice, 2 Lachha Parathas, Boondi Raita, Salad & Gulab Jamun',
    price: 240,
    category: 'thali',
    type: 'Veg',
    bestseller: true,
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (25 mins)',
    image: '/src/assets/images/irctc_catering_thali_1793089669505.jpg',
  },
  {
    id: 'f2',
    name: 'Jain Satvik Special Thali',
    desc: 'Prepared without onion or garlic: Shahi Paneer, Yellow Tadka Dal, Steamed Rice, 3 Tawa Rotis, Sweet',
    price: 220,
    category: 'thali',
    type: 'Jain Veg',
    spicyLevel: 'Mild',
    stationDelivered: 'Next Junction (25 mins)',
  },
  {
    id: 'f3',
    name: 'South Indian Deluxe Thali',
    desc: 'Avial, Poriyal, Drumstick Sambar, Tomato Rasam, Curd Rice, Papad, 2 Poori & Payasam',
    price: 190,
    category: 'thali',
    type: 'Veg',
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (20 mins)',
  },

  // Biryanis
  {
    id: 'f4',
    name: 'Hyderabadi Veg Dum Biryani',
    desc: 'Aromatic long-grain basmati rice slow-cooked in handi with fresh cottage cheese, mint, Mirchi Ka Salan & Raita',
    price: 195,
    category: 'biryani',
    type: 'Veg',
    bestseller: true,
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (20 mins)',
  },
  {
    id: 'f5',
    name: 'Awadhi Shahi Paneer Pulao',
    desc: 'Fragrant saffron rice garnished with caramelized onions, roasted cashews, paneer cubes, and cucumber pachadi',
    price: 210,
    category: 'biryani',
    type: 'Veg',
    spicyLevel: 'Mild',
    stationDelivered: 'Next Junction (20 mins)',
  },

  // Regional
  {
    id: 'f6',
    name: "Haldiram's Chole Bhature Platter",
    desc: 'Two fluffy golden bhaturas served with spicy Pindi chole, pickled green chillies, and onion salad',
    price: 160,
    category: 'regional',
    type: 'Veg',
    bestseller: true,
    spicyLevel: 'Spicy',
    stationDelivered: 'Next Junction (15 mins)',
  },
  {
    id: 'f7',
    name: 'South Indian Tiffin Combo',
    desc: '2 Steamed Podi Idlis, 1 Crispy Medu Vada, 1 Mini Onion Uttapam, authentic Sambar & 2 Chutneys',
    price: 140,
    category: 'regional',
    type: 'Veg',
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (15 mins)',
  },
  {
    id: 'f8',
    name: 'Amritsari Aloo Kulcha with Chana',
    desc: 'Crispy tandoori stuffed kulcha with spiced potato filling, served with Amritsari chana and fresh butter',
    price: 175,
    category: 'regional',
    type: 'Veg',
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (20 mins)',
  },

  // Snacks & Beverages
  {
    id: 'f9',
    name: 'Railway Kulhad Masala Chai Flask',
    desc: 'Brewed with fresh ginger, cardamom, and clove in a thermal insulated flask (serves 2-3 cups)',
    price: 70,
    category: 'beverages',
    type: 'Veg',
    bestseller: true,
    spicyLevel: 'Mild',
    stationDelivered: 'Next Junction (10 mins)',
  },
  {
    id: 'f10',
    name: 'Crispy Samosa Duo with Sweet Chutney',
    desc: '2 Golden hand-crafted Punjabi samosas packed with spiced peas and potatoes, served with tamarind chutney',
    price: 60,
    category: 'snacks',
    type: 'Veg',
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (10 mins)',
  },
  {
    id: 'f11',
    name: 'Royal Kaju Katli Gift Box (250g)',
    desc: 'Pure cashew diamond sweet with edible silver leaf from certified railway confectionary partner',
    price: 220,
    category: 'snacks',
    type: 'Veg',
    spicyLevel: 'Mild',
    stationDelivered: 'Next Junction (15 mins)',
  },

  // Halloween Campus Specials
  {
    id: 'f12',
    name: 'Campus Midnight Spiced Pumpkin Halwa',
    desc: 'Slow-simmered caramelized pumpkin with desi ghee, roasted almonds, pistachios, and saffron aroma',
    price: 110,
    category: 'halloween',
    type: 'Veg',
    bestseller: true,
    spicyLevel: 'Mild',
    stationDelivered: 'Next Junction (15 mins)',
  },
  {
    id: 'f13',
    name: "Ghost Train Cauldron Kadai Paneer Box",
    desc: 'Rich smoky cottage cheese tossed in crushed coriander and bell peppers with 2 flaky butter naans',
    price: 230,
    category: 'halloween',
    type: 'Veg',
    spicyLevel: 'Medium',
    stationDelivered: 'Next Junction (20 mins)',
  },
];

interface FoodOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainNumber?: string;
  trainName?: string;
  pnr?: string;
  coach?: string;
  berth?: string;
  initialProductId?: string;
  onOrderPlaced: (order: FoodOrder) => void;
}

export const FoodOrderModal: React.FC<FoodOrderModalProps> = ({
  isOpen,
  onClose,
  trainNumber = '22436',
  trainName = 'Vande Bharat Express',
  pnr = '4829104812',
  coach = 'B3',
  berth = '27',
  initialProductId,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'menu' | 'delivery' | 'success'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state: map of productId -> quantity
  const [cart, setCart] = useState<Record<string, number>>(() => {
    if (initialProductId) {
      return { [initialProductId]: 1 };
    }
    return { f1: 1 };
  });

  // Delivery & Passenger Details
  const [inputTrain, setInputTrain] = useState(trainNumber);
  const [inputPnr, setInputPnr] = useState(pnr);
  const [inputCoach, setInputCoach] = useState(coach);
  const [inputBerth, setInputBerth] = useState(berth);
  const [passengerName, setPassengerName] = useState('Rohan Sharma');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [deliveryStation, setDeliveryStation] = useState('Kanpur Central (CNB)');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery to Seat' | 'UPI' | 'Card'>(
    'Cash on Delivery to Seat'
  );
  const [couponCode, setCouponCode] = useState('GHOST20');
  const [isCouponApplied, setIsCouponApplied] = useState(true);
  const [confirmedOrder, setConfirmedOrder] = useState<FoodOrder | null>(null);

  // Categories
  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'thali', label: '🍱 Royal Thalis' },
    { id: 'biryani', label: '🍚 Biryani & Rice' },
    { id: 'regional', label: '🍛 Regional Flavors' },
    { id: 'snacks', label: '🥪 Snacks & Sweets' },
    { id: 'beverages', label: '☕ Masala Chai & Drinks' },
    { id: 'halloween', label: '🎃 Halloween Campus Special' },
  ];

  // Cart modifications
  const handleAddToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  // Calculations
  const cartItems: FoodOrderItem[] = Object.entries(cart)
    .map(([id, qty]) => {
      const p = FOOD_MENU.find((item) => item.id === id);
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: qty,
        category: p.category,
        type: p.type,
      };
    })
    .filter(Boolean) as FoodOrderItem[];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = isCouponApplied ? Math.round(subtotal * 0.2) : 0;
  const gst = Math.round((subtotal - discount) * 0.05);
  const deliveryFee = 0; // Free train berth delivery
  const totalAmount = subtotal - discount + gst + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'GHOST20' || couponCode.toUpperCase() === 'RAILMEAL') {
      setIsCouponApplied(true);
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    halloweenAudio.playHauntedBell();

    const orderId = `FOD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: FoodOrder = {
      orderId,
      trainNumber: inputTrain,
      trainName: trainName || 'Vande Bharat Express',
      pnr: inputPnr,
      coach: inputCoach,
      berth: inputBerth,
      deliveryStation: deliveryStation.split(' ')[0],
      deliveryStationName: deliveryStation,
      deliveryTime: 'At next junction platform halt (approx 25 mins)',
      passengerName: passengerName || 'Passenger',
      phoneNumber,
      items: cartItems,
      subtotal,
      discount,
      gst,
      deliveryFee,
      totalAmount,
      paymentMethod,
      status: 'Confirmed',
      orderTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryMin: 25,
    };

    setConfirmedOrder(newOrder);
    onOrderPlaced(newOrder);
    setStep('success');
  };

  const filteredMenu = FOOD_MENU.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  IRCTC e-Catering & Campus Food
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Deliver to Coach {inputCoach}, Berth {inputBerth}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Book Warm Food Order to Seat
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Step 1: Menu & Cart */}
          {step === 'menu' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Menu */}
              <div className="lg:col-span-8 space-y-4">
                {/* Search & Category Filter */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                          selectedCategory === c.id
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Items List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredMenu.map((item) => {
                    const qtyInCart = cart[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-orange-500/40 transition-all group"
                      >
                        <div>
                          {item.image && (
                            <div className="h-28 rounded-lg overflow-hidden mb-2.5 relative border border-slate-200 dark:border-slate-700">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                              {item.bestseller && (
                                <span className="absolute top-1.5 right-1.5 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                item.type === 'Veg'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : item.type === 'Jain Veg'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.type}
                            </span>

                            <span className="text-sm font-black font-mono text-slate-900 dark:text-white tabular-nums">
                              ₹{item.price}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {item.stationDelivered}
                          </span>

                          {qtyInCart > 0 ? (
                            <div className="flex items-center gap-2 bg-orange-600 text-white px-2 py-1 rounded-lg">
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="hover:opacity-80 active:scale-95"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold font-mono px-1">{qtyInCart}</span>
                              <button
                                onClick={() => handleAddToCart(item.id)}
                                className="hover:opacity-80 active:scale-95"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Order Summary & Seat Delivery Bar */}
              <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                    <span>Selected Meal Basket</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Items in Basket */}
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Your meal basket is empty. Select delicious items from the menu.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 text-xs py-1"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold block truncate text-slate-800 dark:text-slate-200">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ₹{item.price} × {item.quantity}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Promo Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon (GHOST20)"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg uppercase font-mono font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {isCouponApplied && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>20% Halloween Special Discount Applied!</span>
                  </div>
                )}

                {/* Bill Breakdown */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Item Subtotal</span>
                    <span className="font-mono">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Promo Discount (20%)</span>
                      <span className="font-mono">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST (5%)</span>
                    <span className="font-mono">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Station Berth Delivery</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <span>Total To Pay</span>
                    <span className="font-mono text-orange-600 dark:text-orange-400">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('delivery')}
                  disabled={cartItems.length === 0}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Proceed to Seat Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery Details & Payment */}
          {step === 'delivery' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <h4 className="font-bold text-sm">Where should we deliver your food?</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">
                      Train Number & Name
                    </label>
                    <div className="flex items-center gap-2">
                      <Train className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={inputTrain}
                        onChange={(e) => setInputTrain(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">
                      10-Digit PNR Number
                    </label>
                    <input
                      type="text"
                      value={inputPnr}
                      onChange={(e) => setInputPnr(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">
                      Coach (e.g. B3, A1, S5)
                    </label>
                    <input
                      type="text"
                      value={inputCoach}
                      onChange={(e) => setInputCoach(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">
                      Berth Number (e.g. 27)
                    </label>
                    <input
                      type="text"
                      value={inputBerth}
                      onChange={(e) => setInputBerth(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">
                      Passenger Full Name
                    </label>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">
                      Mobile Number (for Delivery SMS)
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Delivery Junction Halt
                  </label>
                  <select
                    value={deliveryStation}
                    onChange={(e) => setDeliveryStation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold"
                  >
                    <option value="Kanpur Central (CNB)">Kanpur Central (CNB) - Halting in 25 mins (Platform 4)</option>
                    <option value="Prayagraj Junction (PRYJ)">Prayagraj Junction (PRYJ) - Halting in 1h 45m (Platform 1)</option>
                    <option value="Varanasi Junction (BSB)">Varanasi Junction (BSB) - Destination Terminal (Platform 1)</option>
                    <option value="New Delhi (NDLS)">New Delhi (NDLS) - Origin Concourse (Platform 16)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Select Payment Option
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Cash on Delivery to Seat', label: 'Cash on Delivery', desc: 'Pay delivery boy at berth' },
                    { id: 'UPI', label: 'Instant UPI', desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'Card', label: 'Card / NetBanking', desc: 'Debit / Credit cards' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-3 text-left rounded-xl border text-xs transition-all ${
                        paymentMethod === p.id
                          ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold block">{p.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('menu')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  ← Back to Menu
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Confirm & Dispatch Food (₹{totalAmount})</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Order Confirmation & Live Tracking */}
          {step === 'success' && confirmedOrder && (
            <div className="max-w-xl mx-auto space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                  IRCTC e-Catering Order Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Meal Being Cooked for Your Seat!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Delivery scheduled at <strong>{confirmedOrder.deliveryStationName}</strong> directly to Coach <strong>{confirmedOrder.coach}</strong>, Berth <strong>{confirmedOrder.berth}</strong>.
                </p>
              </div>

              {/* Order Tracking Card */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Order ID</span>
                    <span className="font-mono font-bold block text-sm">{confirmedOrder.orderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase">Payment Mode</span>
                    <span className="font-semibold block text-xs">{confirmedOrder.paymentMethod}</span>
                  </div>
                </div>

                {/* 4-Step Animated Timeline */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Live Delivery Telemetry
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-300 dark:border-emerald-800 font-bold">
                      ✓ Confirmed
                    </div>
                    <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-300 dark:border-amber-800 font-bold animate-pulse">
                      🍳 Kitchen
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg">
                      🏃 Platform
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg">
                      🍱 At Seat
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  {confirmedOrder.items.map((i) => (
                    <div key={i.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="font-mono">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <span>Total Paid</span>
                    <span className="font-mono text-orange-600">₹{confirmedOrder.totalAmount}</span>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-xl border border-orange-200 dark:border-orange-900/60 text-xs text-orange-900 dark:text-orange-200 flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-orange-600" />
                  <span>
                    Delivery agent <strong>Ramesh (RPF ID #7819)</strong> will meet you at Coach {confirmedOrder.coach}, Berth {confirmedOrder.berth}. OTP sent to {confirmedOrder.phoneNumber}.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
                >
                  Done & Back to Travel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
