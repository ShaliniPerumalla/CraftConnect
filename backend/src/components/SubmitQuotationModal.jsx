import React, { useState } from 'react';
import { quotationService } from '../api/member3Services';

export default function SubmitQuotationModal({ isOpen, onClose, requirement, onSuccess }) {
  const [formData, setFormData] = useState({
    price: '',
    estimated_days: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !requirement) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic frontend checks
    if (Number(formData.price) <= 0) {
      setError('Please enter a valid price greater than zero.');
      return;
    }
    if (Number(formData.estimated_days) < 1) {
      setError('Turnaround time must be at least 1 day.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        requirement: requirement.id,
        price: parseFloat(formData.price).toFixed(2),
        estimated_days: parseInt(formData.estimated_days, 10),
        notes: formData.notes.trim(),
      };

      const response = await quotationService.submitQuotation(payload);
      
      // Reset form, notify parent, and close modal
      setFormData({ price: '', estimated_days: '', notes: '' });
      if (onSuccess) onSuccess(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to submit quote:', err);
      const serverMsg =
        err.response?.data?.detail ||
        err.response?.data?.notes?.[0] ||
        err.response?.data?.price?.[0] ||
        'Could not submit quotation. Please verify your inputs.';
      setError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#111827' }}>Submit Quotation</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
              For: <strong>{requirement.title}</strong>
            </p>
          </div>
          <button onClick={onClose} style={styles.closeBtn} disabled={submitting}>
            &times;
          </button>
        </div>

        {/* Customer Budget Reference */}
        <div style={styles.budgetBanner}>
          <span>Client Budget:</span>
          <strong>₹{Number(requirement.budget).toLocaleString('en-IN')}</strong>
        </div>

        {/* Error Notice */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Your Bid Price (₹) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="1"
                placeholder="e.g. 28000"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={submitting}
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Timeline (Days) *</label>
              <input
                type="number"
                name="estimated_days"
                min="1"
                placeholder="e.g. 14"
                value={formData.estimated_days}
                onChange={handleChange}
                required
                disabled={submitting}
                style={styles.input}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Proposal Details & Terms</label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Outline materials, polish quality, milestone timeline, or warranty specifics..."
              value={formData.notes}
              onChange={handleChange}
              disabled={submitting}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={styles.actionRow}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Submitting Bid...' : 'Submit Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '18px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    lineHeight: '1',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  budgetBanner: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    padding: '10px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    borderBottom: '1px solid #dcfce7',
  },
  errorBox: {
    margin: '14px 24px 0',
    padding: '10px 14px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '6px',
    fontSize: '0.85rem',
    border: '1px solid #fecaca',
  },
  form: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '14px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 18px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    color: '#4b5563',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#16a34a',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
  },
};