import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useMenuStore from '../../store/useMenuStore';
import ErrorBanner from '../ui/ErrorBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const EditItemModal = ({ isOpen, onClose, item, categories = [], onSuccess }) => {
  const { adminToken } = useMenuStore();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [priceAlt, setPriceAlt] = useState('');
  const [priceLabel, setPriceLabel] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state with selected item when opened
  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategoryId(item.category_id || '');
      setPrice(item.price || '');
      setPriceAlt(item.price_alt || '');
      setPriceLabel(item.price_label || '');
      setIsVeg(item.is_veg !== undefined ? item.is_veg : true);
      setIsAvailable(item.is_available !== undefined ? item.is_available : true);
      setIsPopular(item.is_popular !== undefined ? item.is_popular : false);
      setNote(item.note || '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      category_id: parseInt(categoryId, 10),
      name,
      price: parseFloat(price),
      price_alt: priceAlt ? parseFloat(priceAlt) : null,
      price_label: priceLabel || null,
      is_veg: isVeg,
      is_available: isAvailable,
      is_popular: isPopular,
      note: note || null
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/admin/menu/${item.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      if (response.data && response.data.status === 'success') {
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to update menu item');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error occurred while saving item.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface-white border border-surface-gray rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-surface-gray">
          <h3 className="text-lg font-bold text-text-dark uppercase tracking-wide">
            Edit Menu Item
          </h3>
          <button 
            onClick={onClose} 
            className="text-accent-taupe hover:text-text-dark"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-text-dark/80 font-medium">Item Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Loaded Fries"
              className="input-field"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-text-dark/80 font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-text-dark/80 font-medium">Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="190"
                className="input-field"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-text-dark/80 font-medium">Alt Price (₹) (Optional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceAlt}
                onChange={(e) => setPriceAlt(e.target.value)}
                placeholder="250"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-text-dark/80 font-medium">Price Label (e.g. VEG / CHICKEN) (Optional)</label>
            <input
              type="text"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              placeholder="VEG / CHICKEN"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 p-3 bg-surface-white border border-surface-gray rounded-xl">
            <div className="flex flex-col items-center gap-1.5 border-r border-surface-gray">
              <span className="text-text-dark/60 font-medium text-xs">Vegetarian</span>
              <button
                type="button"
                onClick={() => setIsVeg(!isVeg)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${isVeg ? 'bg-green-600' : 'bg-brand-red'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isVeg ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-r border-surface-gray">
              <span className="text-text-dark/60 font-medium text-xs">Available</span>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${isAvailable ? 'bg-green-600' : 'bg-surface-gray'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-text-dark/60 font-medium text-xs">Popular</span>
              <button
                type="button"
                onClick={() => setIsPopular(!isPopular)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${isPopular ? 'bg-brand-red' : 'bg-surface-gray'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isPopular ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-text-dark/80 font-medium">Add-on Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. With Fries - Add 75"
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-surface-gray text-accent-taupe hover:text-text-dark hover:bg-surface-gray/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-5 py-2.5 rounded-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
