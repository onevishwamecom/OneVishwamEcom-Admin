import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function AdminBatchItemModal({ isOpen, onClose, onSave, item, batchCategory, isSaving }) {
  const isEdit = Boolean(item);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    subcategory: '',
    city: 'Bengaluru',
    area: '',
    description: '',
    status: 'pending',
    imagesText: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || item.name || '',
        price: String(item.price || item.numericPrice || '').replace(/[^\d.]/g, ''),
        subcategory: item.subcategory || item.propertyType || '',
        city: item.city || 'Bengaluru',
        area: item.area || item.location || '',
        description: item.description || '',
        status: item.status || 'pending',
        imagesText: Array.isArray(item.images) ? item.images.join('\n') : '',
      });
    } else {
      setFormData({
        title: '',
        price: '',
        subcategory: '',
        city: 'Bengaluru',
        area: '',
        description: '',
        status: 'pending',
        imagesText: '',
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      Swal.fire({ icon: 'warning', title: 'Title Required', text: 'Please enter a product title or name.' });
      return;
    }
    if (!formData.price.trim()) {
      Swal.fire({ icon: 'warning', title: 'Price Required', text: 'Please enter a price.' });
      return;
    }

    const images = formData.imagesText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      category: batchCategory,
      images,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Admin Edit Batch Item' : 'Admin Add Item to Batch'}
            </h3>
            <p className="text-xs text-slate-500">
              Category: <span className="font-semibold capitalize text-brand-blue">{batchCategory}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 3 BHK Luxury Apartment or Toyota Fortuner"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Price (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 7500000"
                  className="w-full text-xs rounded-xl border border-slate-200 pl-7 pr-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subcategory / Type
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Flat/Villa or SUV"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Bengaluru"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. Whitefield"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
              />
            </div>
          </div>

          {/* Admin Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Review Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 text-slate-800 bg-white"
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="changes-required">Changes Required</option>
              <option value="rejected">Rejected / Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product details..."
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Image URL(s)
            </label>
            <textarea
              rows={2}
              value={formData.imagesText}
              onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
              placeholder="https://example.com/image1.jpg"
              className="w-full text-xs font-mono rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check" /> {isEdit ? 'Update Item' : 'Add Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
