import React from 'react';
import { FoodOrder } from '../types';
import {
  Utensils,
  X,
  Clock,
  MapPin,
  Train,
  CheckCircle2,
  Trash2,
  Phone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface FoodOrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: FoodOrder[];
  onDeleteOrder: (orderId: string) => void;
}

export const FoodOrdersDrawer: React.FC<FoodOrdersDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onDeleteOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">My Food Orders (Seat Delivery)</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {orders.length} Active Meal Deliveries
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300">No Food Orders Yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Order gourmet thalis, biryani, and regional dishes delivered directly to your coach and berth.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Order ID</span>
                    <span className="font-mono font-bold block text-sm">{order.orderId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {order.status}
                    </span>
                    <button
                      onClick={() => onDeleteOrder(order.orderId)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded"
                      title="Cancel Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Train & Seat</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.trainNumber} · Coach {order.coach}, Berth {order.berth}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Delivery Junction</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.deliveryStationName}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-mono">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-1.5 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                    <span>Total Bill</span>
                    <span className="font-mono text-orange-600">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Ordered at {order.orderTimestamp}</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    Est. Delivery in ~{order.estimatedDeliveryMin} mins
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
