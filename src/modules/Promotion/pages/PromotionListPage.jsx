import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import { fetchPromotionsRequest, removePromotionFilter, setPromotionFilter, updatePromotionForm, createPromotionRequest, resetPromotionForm } from '../store/actions';
import {
  selectFilteredPromotions,
  selectPromotionsLoading,
  selectPromotionFilters,
  selectPromotionForm,
  selectPromotionCreating,
} from '../store/selectors';
import PromotionCard from '../components/PromotionCard/PromotionCard';
import PromotionListRow from '../components/PromotionListRow/PromotionListRow';
import PromotionVoiceInputBar from '../components/PromotionVoiceInputBar/PromotionVoiceInputBar';
import PromotionFilterBar from '../components/PromotionFilterBar/PromotionFilterBar';
import PromotionForm from '../components/PromotionForm/PromotionForm';
import ViewToggle from '../../../components/ViewToggle/ViewToggle';
import SlidePanel from '../../../components/SlidePanel/SlidePanel';
import AIInsightsCards from '../../../components/AIInsightsCards/AIInsightsCards';
import { useThemeContext } from '../../../styles/ThemeContext';

const PromotionListPage = () => {
  const { colors, fonts, buttonGradient } = useThemeContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const promotions = useSelector(selectFilteredPromotions);
  const loading = useSelector(selectPromotionsLoading);
  const activeFilters = useSelector(selectPromotionFilters);
  const form = useSelector(selectPromotionForm);
  const creating = useSelector(selectPromotionCreating);
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState('card');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    document.title = 'EV Phase - Promotions';
    dispatch(fetchPromotionsRequest());
  }, [dispatch]);

  const handleRemoveFilter = (filter) => dispatch(removePromotionFilter(filter));
  const handleAddFilter = (filter) => dispatch(setPromotionFilter(filter));
  const handleFieldChange = (field, value) => dispatch(updatePromotionForm(field, value));

  const handleCreatePromotion = () => {
    dispatch(createPromotionRequest(form));
    setPanelOpen(false);
    dispatch(resetPromotionForm());
  };

  const handleOpenPanel = () => {
    dispatch(resetPromotionForm());
    setPanelOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === promotions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(promotions.map((_, i) => i));
    }
  };

  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const styles = {
    root: { width: '100%' },
    headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
    heading: { fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700, color: colors.textPrimary },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: buttonGradient || colors.accentPrimary,
      color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)',
      padding: '10px 20px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
    },
    subtitle: { fontFamily: fonts.body, fontSize: 'var(--text-base)', color: colors.textSecondary, marginBottom: 24 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
    loadingContainer: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
    emptyState: { textAlign: 'center', padding: '60px 0', color: colors.textSecondary, fontFamily: fonts.body },
    tableWrap: { overflowX: 'auto', borderRadius: 10, border: `1px solid ${colors.borderLight}`, backgroundColor: colors.bgSurface, position: 'relative' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: fonts.body, fontSize: 'var(--text-sm)', minWidth: 1000 },
    th: {
      padding: '12px 12px', textAlign: 'left', fontWeight: 600,
      fontSize: 'var(--text-xs)', color: colors.textMuted,
      borderBottom: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.bgPrimary, whiteSpace: 'nowrap',
    },
    thSticky: {
      padding: '12px 12px', textAlign: 'left', fontWeight: 600,
      fontSize: 'var(--text-xs)', color: colors.textMuted,
      borderBottom: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.bgPrimary, whiteSpace: 'nowrap',
      position: 'sticky', zIndex: 2,
    },
    checkbox: { width: 16, height: 16, borderRadius: 3, cursor: 'pointer', accentColor: colors.accentPrimary },
    panelFooter: { display: 'flex', gap: 12, paddingTop: 24, marginTop: 24, borderTop: `1px solid ${colors.borderLight}` },
    panelSubmitBtn: { flex: 1, padding: '12px', fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 600, color: '#ffffff', background: buttonGradient || colors.accentPrimary, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' },
    panelCancelBtn: { padding: '12px 20px', fontFamily: fonts.body, fontSize: 'var(--text-base)', fontWeight: 500, color: colors.textSecondary, backgroundColor: 'transparent', border: `1.5px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', cursor: 'pointer' },
  };

  const renderContent = () => {
    if (loading) return <div style={styles.loadingContainer}><CircularProgress size={36} style={{ color: colors.accentPrimary }} /></div>;
    if (promotions.length === 0) return <div style={styles.emptyState}>No promotions found for the selected filters</div>;

    if (view === 'card') {
      return (
        <div style={styles.grid} role="list" aria-label="Promotion list">
          {promotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} />)}
        </div>
      );
    }

    return (
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.thSticky, width: 36, left: 0 }}>
                <input type="checkbox" style={styles.checkbox} checked={selectedItems.length === promotions.length && promotions.length > 0} onChange={toggleSelectAll} aria-label="Select all" />
              </th>
              <th style={{ ...styles.thSticky, left: 36, minWidth: 220, borderRight: `1px solid ${colors.borderLight}` }}>Promotion Name, Type &amp; Validity</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Discount</th>
              <th style={styles.th}>Status ↕</th>
              <th style={styles.th}>Redemptions</th>
              <th style={styles.th}>Conversion</th>
              <th style={styles.th}>Growth ↕</th>
              <th style={styles.th}>Revenue ↕</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion, index) => (
              <PromotionListRow
                key={promotion.id}
                promotion={promotion}
                selected={selectedItems.includes(index)}
                onSelect={() => toggleSelect(index)}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={styles.root}>
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <h1 style={styles.heading}>Promotions</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <button style={styles.addBtn} onClick={handleOpenPanel}>
          <AddIcon style={{ fontSize: 18 }} />
          Add Promotion
        </button>
      </div>
      <p style={styles.subtitle}>
        Create and manage promotional campaigns — discounts, free trials, referrals, and loyalty rewards.
      </p>

      <PromotionVoiceInputBar />
      <AIInsightsCards />
      <PromotionFilterBar activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} onAddFilter={handleAddFilter} />

      {renderContent()}

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onExpand={() => { setPanelOpen(false); history.push('/catalogue/promotions/create'); }}
        title="New Promotion"
      >
        <PromotionForm form={form} onFieldChange={handleFieldChange} compact />
        <div style={styles.panelFooter}>
          <button style={styles.panelCancelBtn} onClick={() => setPanelOpen(false)}>Cancel</button>
          <button style={styles.panelSubmitBtn} onClick={handleCreatePromotion} disabled={creating}>
            {creating ? 'Creating...' : 'Create Promotion'}
          </button>
        </div>
      </SlidePanel>
    </div>
  );
};

export default PromotionListPage;
