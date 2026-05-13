import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import { fetchProductsRequest, removeFilter, setActiveFilter, updateProductForm, createProductRequest, resetProductForm } from '../store/actions';
import {
  selectFilteredProducts,
  selectProductsLoading,
  selectActiveFilters,
  selectProductForm,
  selectProductCreating,
} from '../store/selectors';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductListRow from '../components/ProductListRow/ProductListRow';
import VoiceInputBar from '../components/VoiceInputBar/VoiceInputBar';
import FilterBar from '../components/FilterBar/FilterBar';
import ProductForm from '../components/ProductForm/ProductForm';
import ViewToggle from '../../../components/ViewToggle/ViewToggle';
import SlidePanel from '../../../components/SlidePanel/SlidePanel';
import AIInsightsCards from '../../../components/AIInsightsCards/AIInsightsCards';
import { useThemeContext } from '../../../styles/ThemeContext';

const ProductListPage = () => {
  const { colors, fonts, buttonGradient } = useThemeContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const products = useSelector(selectFilteredProducts);
  const loading = useSelector(selectProductsLoading);
  const activeFilters = useSelector(selectActiveFilters);
  const form = useSelector(selectProductForm);
  const creating = useSelector(selectProductCreating);
  const [panelOpen, setPanelOpen] = useState(false);
  const [view, setView] = useState('card');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    document.title = 'EV Phase - Products';
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleRemoveFilter = (filter) => dispatch(removeFilter(filter));
  const handleAddFilter = (filter) => dispatch(setActiveFilter(filter));
  const handleFieldChange = (field, value) => dispatch(updateProductForm(field, value));

  const handleCreateProduct = () => {
    dispatch(createProductRequest(form));
    setPanelOpen(false);
    dispatch(resetProductForm());
  };

  const handleOpenPanel = () => {
    dispatch(resetProductForm());
    setPanelOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map((_, i) => i));
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
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: fonts.body, fontSize: 'var(--text-sm)', minWidth: 1200 },
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
    if (products.length === 0) return <div style={styles.emptyState}>No products found for the selected filters</div>;

    if (view === 'card') {
      return (
        <div style={styles.grid} role="list" aria-label="Product list">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      );
    }

    return (
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.thSticky, width: 36, left: 0 }}>
                <input type="checkbox" style={styles.checkbox} checked={selectedItems.length === products.length && products.length > 0} onChange={toggleSelectAll} aria-label="Select all" />
              </th>
              <th style={{ ...styles.thSticky, left: 36, minWidth: 220, borderRight: `1px solid ${colors.borderLight}` }}>Product Name &amp; SKU</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Subscription</th>
              <th style={styles.th}>Service Type</th>
              <th style={styles.th}>Churn ↕</th>
              <th style={styles.th}>Subscribers ↕</th>
              <th style={styles.th}>Growth ↕</th>
              <th style={styles.th}>ARPU</th>
              <th style={styles.th}>LTV</th>
              <th style={styles.th}>Engagement</th>
              <th style={styles.th}>Region</th>
              <th style={styles.th}>Revenue ↕</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductListRow
                key={product.id}
                product={product}
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
          <h1 style={styles.heading}>Products</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <button style={styles.addBtn} onClick={handleOpenPanel}>
          <AddIcon style={{ fontSize: 18 }} />
          Add Product
        </button>
      </div>
      <p style={styles.subtitle}>
        Manage your product catalogue — streaming services, subscriptions, and one-time offerings.
      </p>

      <VoiceInputBar />
      <AIInsightsCards />
      <FilterBar activeFilters={activeFilters} onRemoveFilter={handleRemoveFilter} onAddFilter={handleAddFilter} />

      {renderContent()}

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onExpand={() => { setPanelOpen(false); history.push('/catalogue/products/create'); }}
        title="New Product"
      >
        <ProductForm form={form} onFieldChange={handleFieldChange} compact />
        <div style={styles.panelFooter}>
          <button style={styles.panelCancelBtn} onClick={() => setPanelOpen(false)}>Cancel</button>
          <button style={styles.panelSubmitBtn} onClick={handleCreateProduct} disabled={creating}>
            {creating ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </SlidePanel>
    </div>
  );
};

export default ProductListPage;
