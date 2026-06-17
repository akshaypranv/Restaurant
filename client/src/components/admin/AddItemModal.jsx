import React, { useState } from 'react';
import axios from 'axios';
import useMenuStore from '../../store/useMenuStore';
import ErrorBanner from '../ui/ErrorBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AddItemModal = ({ isOpen, onClose, categories = [], onSuccess }) => {
  const { adminToken } = useMenuStore();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [price, setPrice] = useState('');
  const [priceAlt, setPriceAlt] = useState('');
  const [priceLabel, setPriceLabel] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync categoryId when categories load or modal opens
  React.useEffect(() => {
    if (isOpen && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [isOpen, categories, categoryId]);

  if (!isOpen) return null;

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
      note: note || null
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/admin/menu`,
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
        // Reset form
        setName('');
        setPrice('');
        setPriceAlt('');
        setPriceLabel('');
        setIsVeg(true);
        setNote('');
        setCategoryId('');
      } else {
        throw new Error(response.data?.message || 'Failed to add menu item');
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
            Add New Menu Item
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

          <div className="flex items-center justify-between p-3 bg-surface-white border border-surface-gray rounded-xl">
            <span className="text-text-dark/80 font-medium">Vegetarian</span>
            <button
              type="button"
              onClick={() => setIsVeg(!isVeg)}
              className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors ${isVeg ? 'bg-green-600' : 'bg-brand-red'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isVeg ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
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
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
