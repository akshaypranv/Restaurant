import React from 'react';
import useMenuStore from '../../store/useMenuStore';
import VegBadge from '../ui/VegBadge';
import { formatPrice } from '../../utils/formatPrice';

const AdminMenuTable = ({ items = [], onEdit, onDelete, onToggleField }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
      <table className="w-full border-collapse text-left text-sm text-white/80">
        <thead className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/60 border-b border-white/10">
          <tr>
            <th className="px-6 py-4">Item Name</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4 text-center">Veg</th>
            <th className="px-6 py-4 text-center">Available</th>
            <th className="px-6 py-4 text-center">Popular</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-white/40">
                No menu items found. Click "Add New Item" to create one.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-white/[0.02] transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium text-white">
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.note && (
                      <span className="text-[10px] text-white/40 italic mt-0.5">{item.note}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60">
                  {item.category_name}
                </td>
                <td className="px-6 py-4 text-amber-brand font-semibold">
                  {formatPrice(item.price, item.price_alt, item.price_label)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <VegBadge isVeg={item.is_veg} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      role="checkbox"
                      aria-checked={item.is_available}
                      onClick={() => onToggleField(item.id, 'is_available', !item.is_available)}
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors ${item.is_available ? 'bg-green-500' : 'bg-white/10'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${item.is_available ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      role="checkbox"
                      aria-checked={item.is_popular}
                      onClick={() => onToggleField(item.id, 'is_popular', !item.is_popular)}
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors ${item.is_popular ? 'bg-amber-brand' : 'bg-white/10'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${item.is_popular ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-xs font-semibold uppercase tracking-wider text-amber-brand/80 hover:text-amber-brand hover:bg-amber-brand/5 border border-amber-brand/10 rounded px-2.5 py-1 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10 rounded px-2.5 py-1 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMenuTable;
