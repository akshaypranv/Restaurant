import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useMenuStore from '../store/useMenuStore';
import AdminLogin from '../components/admin/AdminLogin';
import AdminMenuTable from '../components/admin/AdminMenuTable';
import AdminMessagesPanel from '../components/admin/AdminMessagesPanel';
import AddItemModal from '../components/admin/AddItemModal';
import EditItemModal from '../components/admin/EditItemModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBanner from '../components/ui/ErrorBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AdminPage = () => {
  const { adminToken } = useMenuStore();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');

  // Modal control states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchAdminData = async () => {
    if (!adminToken) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch categories
      const catRes = await axios.get(`${API_BASE_URL}/api/v1/categories`);
      if (catRes.data && catRes.data.status === 'success') {
        setCategories(catRes.data.data);
      }

      // Fetch all items (including hidden ones)
      const menuRes = await axios.get(`${API_BASE_URL}/api/v1/admin/menu`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (menuRes.data && menuRes.data.status === 'success') {
        setItems(menuRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [adminToken]);

  // Handle inline switches (is_available, is_popular)
  const handleToggleField = async (itemId, field, value) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/admin/menu/${itemId}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (response.data && response.data.status === 'success') {
        // Optimistic/direct update to state
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, [field]: value } : item));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to toggle item state.');
    }
  };

  // Handle soft deletion
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item? It will be archived and hidden from public view.')) {
      return;
    }
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/admin/menu/${itemId}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (response.data && response.data.status === 'success') {
        // Soft deletion removes the item from the dashboard table view
        setItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete item.');
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  if (!adminToken) {
    return <AdminLogin />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold uppercase text-text-dark tracking-wide">
            Admin Dashboard
          </h2>
          <p className="text-accent-taupe text-xs mt-1">
            Manage your menu items and view customer messages
          </p>
        </div>
        {activeTab === 'menu' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary flex items-center gap-1.5 active:scale-95"
          >
            <span>+</span> Add New Item
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-surface-gray mb-8">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider transition-all relative ${
            activeTab === 'menu'
              ? 'text-brand-red'
              : 'text-accent-taupe hover:text-text-dark'
          }`}
        >
          Menu Items
          {activeTab === 'menu' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider transition-all relative ${
            activeTab === 'messages'
              ? 'text-brand-red'
              : 'text-accent-taupe hover:text-text-dark'
          }`}
        >
          Messages
          {activeTab === 'messages' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red rounded-full" />
          )}
        </button>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      {/* Tab Content */}
      {activeTab === 'menu' ? (
        <>
          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="text-accent-taupe text-sm mt-4 animate-pulse">Loading items table...</p>
            </div>
          ) : (
            <AdminMenuTable
              items={items}
              onEdit={handleEditClick}
              onDelete={handleDeleteItem}
              onToggleField={handleToggleField}
            />
          )}
        </>
      ) : (
        <AdminMessagesPanel adminToken={adminToken} />
      )}

      {/* Add Modal */}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        categories={categories}
        onSuccess={fetchAdminData}
      />

      {/* Edit Modal */}
      <EditItemModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        categories={categories}
        onSuccess={fetchAdminData}
      />
    </div>
  );
};

export default AdminPage;

