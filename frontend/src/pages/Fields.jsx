import React, { useState, useRef } from 'react';
import { useField } from '../context/FieldContext';
import { fieldsAPI } from '../services/api';
import { MapPin, Crop, Maximize, Plus, Edit3, Trash2, X, Save, Check } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const EMPTY_FORM = { name: '', location: '', crop_type: '', area_hectares: '', soil_type: '' };
const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silt', 'Red', 'Black', 'Laterite', 'Alluvial', 'Peaty', 'Saline'];
const CROP_SUGGESTIONS = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Tomato', 'Potato', 'Onion', 'Groundnut', 'Mustard', 'Chickpea', 'Millet', 'Jowar', 'Bajra'];

const LOCATION_SUGGESTIONS = [
  'Punjab, India',
  'Ludhiana, Punjab, India',
  'Amritsar, Punjab, India',
  'Jalandhar, Punjab, India',
  'Bathinda, Punjab, India',
  'Patiala, Punjab, India',
  'Firozpur, Punjab, India',
  'Karnal, Haryana, India',
  'Hisar, Haryana, India',
  'Kurukshetra, Haryana, India',
  'Ambala, Haryana, India',
  'Sirsa, Haryana, India',
  'Nashik, Maharashtra, India',
  'Pune, Maharashtra, India',
  'Nagpur, Maharashtra, India',
  'Kolhapur, Maharashtra, India',
  'Solapur, Maharashtra, India',
  'Ahmednagar, Maharashtra, India',
  'Satara, Maharashtra, India',
  'Anand, Gujarat, India',
  'Rajkot, Gujarat, India',
  'Surat, Gujarat, India',
  'Vadodara, Gujarat, India',
  'Junagadh, Gujarat, India',
  'Mandya, Karnataka, India',
  'Shimoga, Karnataka, India',
  'Belgaum, Karnataka, India',
  'Davanagere, Karnataka, India',
  'Thanjavur, Tamil Nadu, India',
  'Coimbatore, Tamil Nadu, India',
  'Madurai, Tamil Nadu, India',
  'Guntur, Andhra Pradesh, India',
  'Krishna, Andhra Pradesh, India',
  'Karimnagar, Telangana, India',
  'Warangal, Telangana, India',
  'Indore, Madhya Pradesh, India',
  'Ujjain, Madhya Pradesh, India',
  'Bhopal, Madhya Pradesh, India',
  'Ganganagar, Rajasthan, India',
  'Kota, Rajasthan, India',
  'Burdwan, West Bengal, India',
  'Muzaffarpur, Bihar, India',
  'Patna, Bihar, India',
  'Wayanad, Kerala, India',
  'Palakkad, Kerala, India',
  'Meerut, Uttar Pradesh, India',
  'Agra, Uttar Pradesh, India',
  'Varanasi, Uttar Pradesh, India',
  'Lucknow, Uttar Pradesh, India',
  'California, USA',
  'Iowa, USA',
  'Queensland, Australia'
];

const Fields = () => {
  const { fields, selectedField, setSelectedField, fetchFields } = useField();
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Location Autocomplete states
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const locationContainerRef = useRef(null);

  const openAdd = () => {
    setEditingField(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowLocDropdown(false);
    setShowModal(true);
  };

  const openEdit = (e, field) => {
    e.stopPropagation();
    setEditingField(field);
    setForm({
      name: field.name || '',
      location: field.location || '',
      crop_type: field.crop_type || '',
      area_hectares: field.area_hectares?.toString() || '',
      soil_type: field.soil_type || ''
    });
    setError('');
    setShowLocDropdown(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingField(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowLocDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'location') {
      setShowLocDropdown(value.trim().length > 0);
    }
  };

  const selectLocationSuggestion = (loc) => {
    setForm(prev => ({ ...prev, location: loc }));
    setShowLocDropdown(false);
  };

  const filteredLocations = form.location.trim() === ''
    ? LOCATION_SUGGESTIONS.slice(0, 6)
    : LOCATION_SUGGESTIONS.filter(loc => 
        loc.toLowerCase().includes(form.location.trim().toLowerCase())
      ).slice(0, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Field name is required');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      location: form.location.trim() || null,
      crop_type: form.crop_type.trim() || null,
      area_hectares: form.area_hectares ? parseFloat(form.area_hectares) : null,
      soil_type: form.soil_type || null
    };

    try {
      if (editingField) {
        await fieldsAPI.update(editingField.id, payload);
      } else {
        await fieldsAPI.create(payload);
      }
      await fetchFields();
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save field. Make sure the backend is running.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, field) => {
    e.stopPropagation();
    if (deleteConfirm !== field.id) {
      setDeleteConfirm(field.id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    try {
      await fieldsAPI.delete(field.id);
      if (selectedField?.id === field.id) setSelectedField(null);
      await fetchFields();
    } catch (err) {
      console.error('Delete failed', err);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your agricultural fields and assignments.</p>
        <button className="btn-primary" onClick={openAdd}><Plus size={18}/> Add Field</button>
      </div>

      {fields.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Crop size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Fields Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Add your first field to start monitoring soil, sensors, and crops.</p>
          <button className="btn-primary" onClick={openAdd}><Plus size={18}/> Add Your First Field</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {fields.map(field => (
          <div 
            key={field.id} 
            className="glass-card" 
            style={{ 
              cursor: 'pointer', 
              border: selectedField?.id === field.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-glass)',
              transform: selectedField?.id === field.id ? 'translateY(-4px)' : 'none',
              position: 'relative'
            }}
            onClick={() => setSelectedField(field)}
          >
            {/* Action buttons */}
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={(e) => openEdit(e, field)}
                title="Edit field"
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-glass)',
                  borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', transition: 'var(--transition)'
                }}
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={(e) => handleDelete(e, field)}
                title={deleteConfirm === field.id ? 'Click again to confirm delete' : 'Delete field'}
                style={{
                  background: deleteConfirm === field.id ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
                  border: deleteConfirm === field.id ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border-glass)',
                  borderRadius: '6px', padding: '0.35rem', cursor: 'pointer',
                  color: deleteConfirm === field.id ? 'var(--accent-red)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', transition: 'var(--transition)'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingRight: '4.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{field.name}</h3>
            </div>
            <StatusBadge status="Online" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Crop size={16} color="var(--text-muted)" /> 
                <span>{field.crop_type || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--text-muted)" /> 
                <span>{field.location || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Maximize size={16} color="var(--text-muted)" /> 
                <span>{field.area_hectares ? `${field.area_hectares} Hectares` : 'Not set'}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Soil Type:</span>
              <span style={{ fontWeight: 600 }}>{field.soil_type || 'Not set'}</span>
            </div>

            {selectedField?.id === field.id && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <span className="badge badge-online">✓ Active Field</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Field Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2>{editingField ? 'Edit Field' : 'Add New Field'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                <X size={22} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="field-name">Field Name *</label>
                <input id="field-name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. North Field Alpha" required autoFocus />
              </div>

              {/* Location Input with Interactive Autocomplete Suggestions */}
              <div className="form-group" style={{ position: 'relative' }} ref={locationContainerRef}>
                <label htmlFor="field-location">Location</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="field-location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    onFocus={() => setShowLocDropdown(true)}
                    placeholder="e.g. Type 'Punjab', 'Karnal', 'Nashik'..."
                    autoComplete="off"
                    list="location-datalist"
                  />
                  <datalist id="location-datalist">
                    {LOCATION_SUGGESTIONS.map((loc, idx) => (
                      <option key={idx} value={loc} />
                    ))}
                  </datalist>
                </div>

                {/* Floating Autocomplete Dropdown List */}
                {showLocDropdown && filteredLocations.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: '#0f1a14',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: '8px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.6), 0 0 15px rgba(34, 197, 94, 0.2)',
                    zIndex: 1100,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', fontWeight: 600 }}>
                      SUGGESTED LOCATIONS ({filteredLocations.length})
                    </div>
                    {filteredLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectLocationSuggestion(loc)}
                        style={{
                          padding: '0.6rem 0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.88rem',
                          color: form.location === loc ? 'var(--accent-primary)' : 'var(--text-primary)',
                          background: form.location === loc ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = form.location === loc ? 'rgba(34, 197, 94, 0.15)' : 'transparent'}
                      >
                        <MapPin size={14} color="var(--accent-primary)" />
                        <span>{loc}</span>
                        {form.location === loc && <Check size={14} color="var(--accent-primary)" style={{ marginLeft: 'auto' }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="field-crop">Crop Type</label>
                  <select id="field-crop" name="crop_type" value={form.crop_type} onChange={handleChange}>
                    <option value="">Select crop...</option>
                    {CROP_SUGGESTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="field-soil">Soil Type</label>
                  <select id="field-soil" name="soil_type" value={form.soil_type} onChange={handleChange}>
                    <option value="">Select soil...</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="field-area">Area (Hectares)</label>
                <input id="field-area" name="area_hectares" type="number" step="0.1" min="0" value={form.area_hectares} onChange={handleChange} placeholder="e.g. 4.5" />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : <><Save size={16} /> {editingField ? 'Update Field' : 'Create Field'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;
