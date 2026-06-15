import React from 'react';
import useMenuStore from '../../store/useMenuStore';
import VegBadge from '../ui/VegBadge';
import { formatPrice } from '../../utils/formatPrice';

const AdminMenuTable = ({ items = [], onEdit, onDelete, onToggleField }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-gray bg-surface-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-text-dark">
        <thead className="bg-surface-gray/50 text-xs font-semibold uppercase tracking-wider text-accent-taupe border-b border-surface-gray">
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
        <tbody className="divide-y divide-surface-gray">
          {items.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-accent-taupe">
                No menu items found. Click "Add New Item" to create one.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-surface-gray/10 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium text-text-dark">
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.note && (
                      <span className="text-[10px] text-accent-taupe italic mt-0.5">{item.note}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-accent-taupe">
                  {item.category_name}
                </td>
                <td className="px-6 py-4 text-brand-red font-semibold">
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
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors ${item.is_available ? 'bg-green-600' : 'bg-surface-gray'}`}
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
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors ${item.is_popular ? 'bg-brand-red' : 'bg-surface-gray'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${item.is_popular ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-xs font-semibold uppercase tracking-wider text-accent-taupe hover:text-text-dark hover:bg-surface-gray/50 border border-surface-gray rounded px-2.5 py-1 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-xs font-semibold uppercase tracking-wider text-brand-red hover:text-brand-red-dark hover:bg-brand-red/5 border border-brand-red/10 rounded px-2.5 py-1 transition-all"
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
