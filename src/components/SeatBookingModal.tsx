import React, { useState } from 'react';
import { ComprehensiveTrain } from '../data/trainsData';
import { BookedTicket, BookedTicketPassenger } from '../types';
import {
  X,
  Train,
  Calendar,
  User,
  CheckCircle2,
  Ticket,
  Printer,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface SeatBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: ComprehensiveTrain | null;
  initialClass?: string;
  onBookingComplete: (ticket: BookedTicket) => void;
}

export const SeatBookingModal: React.FC<SeatBookingModalProps> = ({
  isOpen,
  onClose,
  train,
  initialClass,
  onBookingComplete,
}) => {
  if (!isOpen || !train) return null;

  const [step, setStep] = useState<'details' | 'seats' | 'confirmation'>('details');
  const [selectedClass, setSelectedClass] = useState<string>(
    initialClass || train.classes[0]?.code || '3A'
  );
  const [selectedQuota, setSelectedQuota] = useState<string>('General (GN)');
  const [journeyDate, setJourneyDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );

  // Passengers list
  const [passengers, setPassengers] = useState<
    Array<{
      name: string;
      age: number;
      gender: 'Male' | 'Female' | 'Transgender';
      berthPreference: string;
      foodChoice: string;
    }>
  >([
    {
      name: 'Rohan Sharma',
      age: 32,
      gender: 'Male',
      berthPreference: 'Lower Berth (LB)',
      foodChoice: 'Veg Thali',
    },
  ]);

  // Selected Berths
  const [selectedBerths, setSelectedBerths] = useState<number[]>([27]);
  const [bookedTicket, setBookedTicket] = useState<BookedTicket | null>(null);

  const activeClassObj =
    train.classes.find((c) => c.code === selectedClass) || train.classes[0];
  const baseFarePerPassenger = activeClassObj?.fare || 1450;
  const tatkalSurcharge = selectedQuota.includes('Tatkal') ? 350 : 0;
  const reservationFee = 40;
  const superfastCharge = 45;
  const gstRate = selectedClass === 'SL' || selectedClass === '2S' ? 0 : 0.05;

  const totalBaseFare = (baseFarePerPassenger + tatkalSurcharge) * passengers.length;
  const totalTaxes = Math.round(totalBaseFare * gstRate) + (reservationFee + superfastCharge) * passengers.length;
  const grandTotal = totalBaseFare + totalTaxes;

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers((prev) => [
      ...prev,
      {
        name: '',
        age: 28,
        gender: 'Female',
        berthPreference: 'Middle Berth (MB)',
        foodChoice: 'Veg Thali',
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBerthClick = (berthNum: number) => {
    if (selectedBerths.includes(berthNum)) {
      setSelectedBerths(selectedBerths.filter((b) => b !== berthNum));
    } else {
      if (selectedBerths.length < passengers.length) {
        setSelectedBerths([...selectedBerths, berthNum]);
      } else {
        // Replace first
        setSelectedBerths([...selectedBerths.slice(1), berthNum]);
      }
    }
  };

  const getBerthTypeName = (berthNum: number) => {
    const mod = berthNum % 8;
    if (mod === 1 || mod === 4) return 'Lower Berth (LB)';
    if (mod === 2 || mod === 5) return 'Middle Berth (MB)';
    if (mod === 3 || mod === 6) return 'Upper Berth (UB)';
    if (mod === 7) return 'Side Lower (SL)';
    return 'Side Upper (SU)';
  };

  const handleConfirmBooking = () => {
    // Generate authentic 10 digit PNR
    const prefix = '4829';
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const pnr = `${prefix}${randomSuffix}`;

    const coachPrefix =
      selectedClass === '1A' ? 'H1' :
      selectedClass === '2A' ? 'A1' :
      selectedClass === '3A' ? 'B3' :
      selectedClass === 'CC' ? 'C2' :
      selectedClass === 'EC' ? 'E1' : 'S3';

    const bookedPassengers: BookedTicketPassenger[] = passengers.map((p, idx) => {
      const assignedBerth = selectedBerths[idx] || (24 + idx);
      return {
        name: p.name || `Passenger ${idx + 1}`,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berthPreference,
        foodChoice: p.foodChoice,
        assignedCoach: coachPrefix,
        assignedBerth: assignedBerth,
        assignedBerthType: getBerthTypeName(assignedBerth),
      };
    });

    const newTicket: BookedTicket = {
      pnr,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      from: train.from,
      fromName: train.fromName,
      to: train.to,
      toName: train.toName,
      doj: journeyDate,
      departureTime: train.departure,
      arrivalTime: train.arrival,
      travelClass: selectedClass,
      quota: selectedQuota,
      passengers: bookedPassengers,
      totalFare: grandTotal,
      baseFare: totalBaseFare,
      tax: totalTaxes,
      bookingTimestamp: new Date().toLocaleString(),
      ticketStatus: 'CONFIRMED',
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('railsaarthi_booked_tickets') || '[]');
      existing.unshift(newTicket);
      localStorage.setItem('railsaarthi_booked_tickets', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    setBookedTicket(newTicket);
    setStep('confirmation');
    onBookingComplete(newTicket);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <span className="font-mono">{train.trainNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{train.trainName}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {step === 'confirmation' ? 'e-Ticket Confirmation Pass' : 'Book Confirmed Seats'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: Details & Passenger Info */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Route Summary Strip */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">From</span>
                  <span className="font-extrabold text-sm">{train.fromName} ({train.from})</span>
                  <span className="font-mono text-slate-500 block">Dep: {train.departure}</span>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-500">{train.duration}</span>
                  <div className="w-20 h-0.5 bg-blue-600 mx-auto my-1" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {train.punctuality} On Time
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">To</span>
                  <span className="font-extrabold text-sm">{train.toName} ({train.to})</span>
                  <span className="font-mono text-slate-500 block">Arr: {train.arrival}</span>
                </div>
              </div>

              {/* Class, Quota & Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Travel Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {train.classes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name} (₹{c.fare})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Booking Quota
                  </label>
                  <select
                    value={selectedQuota}
                    onChange={(e) => setSelectedQuota(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="General (GN)">General Quota (GN)</option>
                    <option value="Tatkal (TQ)">Tatkal Quota (TQ)</option>
                    <option value="Premium Tatkal (PT)">Premium Tatkal (PT)</option>
                    <option value="Ladies (LD)">Ladies Quota (LD)</option>
                    <option value="Senior Citizen (SS)">Senior Citizen (Lower Berth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Journey Date
                  </label>
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Passengers Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Passenger Details ({passengers.length} of 6)
                  </h4>
                  {passengers.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddPassenger}
                      className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Passenger</span>
                    </button>
                  )}
                </div>

                {passengers.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Passenger {idx + 1}
                      </span>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(idx)}
                          className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                          Full Name (as per Govt ID)
                        </label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                            );
                          }}
                          placeholder="e.g. Rahul Verma"
                          className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">Age</label>
                        <input
                          type="number"
                          min={1}
                          max={110}
                          value={p.age}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 18;
                            setPassengers((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, age: val } : item))
                            );
                          }}
                          className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">Gender</label>
                        <select
                          value={p.gender}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setPassengers((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, gender: val } : item))
                            );
                          }}
                          className="w-full h-9 px-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                          Berth Preference
                        </label>
                        <select
                          value={p.berthPreference}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, berthPreference: val } : item
                              )
                            );
                          }}
                          className="w-full h-9 px-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium"
                        >
                          <option value="No Preference">No Preference</option>
                          <option value="Lower Berth (LB)">Lower Berth (LB)</option>
                          <option value="Middle Berth (MB)">Middle Berth (MB)</option>
                          <option value="Upper Berth (UB)">Upper Berth (UB)</option>
                          <option value="Side Lower (SL)">Side Lower (SL)</option>
                          <option value="Side Upper (SU)">Side Upper (SU)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                          Onboard Catering Choice
                        </label>
                        <select
                          value={p.foodChoice}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPassengers((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, foodChoice: val } : item
                              )
                            );
                          }}
                          className="w-full h-9 px-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium"
                        >
                          <option value="Veg Thali">Vegetarian Standard Meal</option>
                          <option value="Jain Thali">Jain Satvik Meal</option>
                          <option value="Non-Veg Thali">Non-Vegetarian Meal</option>
                          <option value="No Food">No Food Opted</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fare Summary Strip */}
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Ticket Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
                  <span className="font-mono tabular-nums font-bold">₹{totalBaseFare}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Taxes, Reservation & Superfast Surcharge</span>
                  <span className="font-mono tabular-nums font-bold">₹{totalTaxes}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Grand Total</span>
                  <span className="font-mono tabular-nums text-blue-700 dark:text-blue-400">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep('seats')}
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <span>Select Berths & Confirm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Interactive Berth Picker */}
          {step === 'seats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select {passengers.length} Preferred Berth{passengers.length > 1 ? 's' : ''} on Coach
                  </h4>
                  <p className="text-xs text-slate-500">
                    Selected: {selectedBerths.join(', ') || 'None'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-600" />
                    <span>LB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-slate-600" />
                    <span>MB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-purple-600" />
                    <span>UB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-amber-600" />
                    <span>SL</span>
                  </div>
                </div>
              </div>

              {/* Berth Selector Grid */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {[0, 1, 2, 3].map((bayIndex) => {
                  const startBerth = bayIndex * 8 + 1;
                  const berths = Array.from({ length: 8 }, (_, i) => startBerth + i);

                  return (
                    <div
                      key={bayIndex}
                      className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                        Cabin {bayIndex + 1}
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {berths.map((bNum) => {
                          const isSelected = selectedBerths.includes(bNum);
                          const typeName = getBerthTypeName(bNum);

                          return (
                            <button
                              key={bNum}
                              type="button"
                              onClick={() => handleBerthClick(bNum)}
                              className={`h-11 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white ring-3 ring-emerald-400 scale-105 z-10 shadow-md'
                                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
                              }`}
                            >
                              <span>{bNum}</span>
                              <span className="text-[9px] font-sans opacity-75">{typeName.split(' ')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Issue Ticket (₹{grandTotal})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Ticket Confirmation Pass */}
          {step === 'confirmation' && bookedTicket && (
            <div className="space-y-6">
              {/* Official Ticket Pass Layout */}
              <div
                id="printable-ticket"
                className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Train className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                        Electronic Reservation Slip (ERS)
                      </span>
                      <h4 className="text-base font-extrabold text-white">RailSaarthi Verified e-Ticket</h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">PNR Number</span>
                    <span className="text-lg font-black font-mono tracking-widest text-emerald-400">
                      {bookedTicket.pnr}
                    </span>
                  </div>
                </div>

                {/* Train & Journey Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Train</span>
                    <span className="font-bold text-white text-sm">{bookedTicket.trainNumber}</span>
                    <span className="text-slate-300 truncate block">{bookedTicket.trainName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Departure</span>
                    <span className="font-bold text-white text-sm">{bookedTicket.from} ({bookedTicket.departureTime})</span>
                    <span className="text-slate-300 truncate block">{bookedTicket.fromName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Arrival</span>
                    <span className="font-bold text-white text-sm">{bookedTicket.to} ({bookedTicket.arrivalTime})</span>
                    <span className="text-slate-300 truncate block">{bookedTicket.toName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Journey Date</span>
                    <span className="font-bold text-white text-sm">{bookedTicket.doj}</span>
                    <span className="text-emerald-400 font-bold block">{bookedTicket.ticketStatus}</span>
                  </div>
                </div>

                {/* Passenger & Berth Allocation Table */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2.5">
                    Passenger & Allocated Seat Inventory
                  </div>
                  <div className="space-y-2">
                    {bookedTicket.passengers.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold">{p.name}</span>
                          <span className="text-slate-400">({p.age} Yrs · {p.gender})</span>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="bg-blue-600/60 px-2 py-0.5 rounded text-[11px] font-bold">
                            Coach {p.assignedCoach}
                          </span>
                          <span className="bg-emerald-600/60 text-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                            Berth {p.assignedBerth} ({p.assignedBerthType})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code & Total Fare footer */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center text-slate-900">
                      <QrCode className="w-10 h-10" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Ticket Verification</span>
                      <span className="text-[11px] text-slate-300">Scan at TTE Handheld Terminal (HHT)</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Fare Paid</span>
                    <span className="text-xl font-black font-mono text-emerald-400">
                      ₹{bookedTicket.totalFare}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket / Save PDF</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Done & View Bookings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
