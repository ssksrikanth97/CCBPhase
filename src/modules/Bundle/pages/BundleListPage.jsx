import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import { fetchBundlesRequest, removeBundleFilter, setBundleFilter, updateBundleForm, createBundleRequest, resetBundleForm } from '../store/actions';
import {
  selectFilteredBundles,
  selectBundlesLoading,
  selectBundleFilters,
  selectBundleForm,
  selectBundleCreating,
} from '../store/selectors';
import BundleCard from '../components/BundleCard/BundleCard';
import BundleListRow from '../components/BundleListRow/BundleListRow';
import BundleVoiceInputBar from '../components/BundleVoiceInputBar/BundleVoiceInputBar';
import BundleFilterBar from '../components/BundleFilterBar/BundleFilterBar';
import BundleForm from '../components/BundleForm/BundleForm';
import ViewToggle from '../../../components/ViewToggle/ViewToggle';
import SlidePanel from '../../../components/SlidePanel/SlidePanel';
import { useThemeContext } from '../../../styles/ThemeContext';

const BundleListPage = () => {
  const { colors, fonts, buttonGradient } = useThemeContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const bundles = useSelector(selectFilteredBundles);
  const loading = useSelector(selectBundlesLoading);
  const activeFilters = useSelector(selectBundleFilters);
  const form = useSelector(selectBundleForm);
  const creating = useSelector(selectBundleCreating);
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState('card');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    document.title = 'EV Phase - Bundles';
    dispatch(fetchBundlesRequest());
  }, [dispatch]);

  const handleRemoveFilter = (filter) => dispatch(removeBundleFilter(filter));
  const handleAddFilter = (filter) => dispatch(setBundleFilter(filter));
  const handleFieldChange = (field, value) => dispatch(updateBundleForm(field, value));

  const handleCreateBundle = () => {
    dispatch(createBundleRequest(form));
    setPanelOpen(false);
    dispatch(resetBundleForm());
  };

  const handleOpenPanel = () => {
    dispatch(resetBundleForm());
    setPanelOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === bundles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(bundles.map((_, i) => i));
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
    if (bundles.length === 0) return <div style={styles.emptyState}>No bundles found for the selected filters</div>;

    if (view === 'card') {
      return (
        <div style={styles.grid} role="list" aria-label="Bundle list">
          {bundles.map((bundle) => <BundleCard key={bundle.id} bundle={bundle} />)}
        </div>
      );
    }

    return (
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.thSticky, width: 36, left: 0 }}>
                <input type="checkbox" style={styles.checkbox} checked={selectedItems.length === bundles.length && bundles.length > 0} onChange={toggleSelectAll} aria-label="Select all" />
              </th>
              <th style={{ ...styles.thSticky, left: 36, minWidth: 220, borderRight: `1px solid ${colors.borderLight}` }}>Bundle Name, Type &amp; Savings</th>
              <th style={styles.th}>Discount</th>
              <th style={styles.th}>Churn ↕</th>
              <th style={styles.th}>Subscribers</th>
              <th style={styles.th}>Growth ↕</th>
              <th style={styles.th}>Retention</th>
              <th style={styles.th}>Included Products</th>
              <th style={styles.th}>Revenue ↕</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((bundle, index) => (
              <BundleListRow
                key={bundle.id}
                bundle={bundle}
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
          <h1 style={styles.heading}>Bundles</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <button style={styles.addBtn} onClick={handleOpenPanel}>
          <AddIcon style={{ fontSize: 18 }} />
          Add Bundle
        </button>
      </div>
      <p style={styles.subtitle}>
        Combine products into value-packed bundles with optimized pricing and discounts.
      </p>

      <BundleVoiceInputBar />
      <BundleFilterBar activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} onAddFilter={handleAddFilter} />

      {renderContent()}

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onExpand={() => { setPanelOpen(false); history.push('/catalogue/bundles/create'); }}
        title="New Bundle"
      >
        <BundleForm form={form} onFieldChange={handleFieldChange} compact />
        <div style={styles.panelFooter}>
          <button style={styles.panelCancelBtn} onClick={() => setPanelOpen(false)}>Cancel</button>
          <button style={styles.panelSubmitBtn} onClick={handleCreateBundle} disabled={creating}>
            {creating ? 'Creating...' : 'Create Bundle'}
          </button>
        </div>
      </SlidePanel>
    </div>
  );
};

export default BundleListPage;
