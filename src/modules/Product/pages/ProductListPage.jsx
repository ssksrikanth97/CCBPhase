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
import VoiceInputBar from '../components/VoiceInputBar/VoiceInputBar';
import FilterBar from '../components/FilterBar/FilterBar';
import ProductForm from '../components/ProductForm/ProductForm';
import SlidePanel from '../../../components/SlidePanel/SlidePanel';
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

  useEffect(() => {
    document.title = 'EV Phase - Products';
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleRemoveFilter = (filter) => {
    dispatch(removeFilter(filter));
  };

  const handleAddFilter = (filter) => {
    dispatch(setActiveFilter(filter));
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateProductForm(field, value));
  };

  const handleCreateProduct = () => {
    dispatch(createProductRequest(form));
    setPanelOpen(false);
    dispatch(resetProductForm());
  };

  const handleOpenPanel = () => {
    dispatch(resetProductForm());
    setPanelOpen(true);
  };

  const styles = {
    root: { width: '100%' },
    headerRow: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 8,
    },
    heading: {
      fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700,
      color: colors.textPrimary,
    },
    addBtn: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: buttonGradient || colors.accentPrimary,
      color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)',
      padding: '10px 20px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
    },
    subtitle: {
      fontFamily: fonts.body, fontSize: 'var(--text-base)',
      color: colors.textSecondary, marginBottom: 24,
    },
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20,
    },
    loadingContainer: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
    emptyState: { textAlign: 'center', padding: '60px 0', color: colors.textSecondary, fontFamily: fonts.body },
    panelFooter: {
      display: 'flex', gap: 12, paddingTop: 24, marginTop: 24,
      borderTop: `1px solid ${colors.borderLight}`,
    },
    panelSubmitBtn: {
      flex: 1, padding: '12px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 600, color: '#ffffff', background: buttonGradient || colors.accentPrimary,
      border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
    },
    panelCancelBtn: {
      padding: '12px 20px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 500, color: colors.textSecondary, backgroundColor: 'transparent',
      border: `1.5px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', cursor: 'pointer',
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.headerRow}>
        <h1 style={styles.heading}>What will you build next?</h1>
        <button style={styles.addBtn} onClick={handleOpenPanel}>
          <AddIcon style={{ fontSize: 18 }} />
          Add Product
        </button>
      </div>
      <p style={styles.subtitle}>
        Hint: Create a new product bundle with best-fit pricing based on historical sales.
      </p>

      <VoiceInputBar />
      <FilterBar
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onAddFilter={handleAddFilter}
      />

      {loading ? (
        <div style={styles.loadingContainer}>
          <CircularProgress size={36} style={{ color: colors.accentPrimary }} />
        </div>
      ) : products.length === 0 ? (
        <div style={styles.emptyState}>No products found for the selected filters</div>
      ) : (
        <div style={styles.grid} role="list" aria-label="Product list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Slide-in Create Product Panel */}
      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onExpand={() => { setPanelOpen(false); history.push('/products/create'); }}
        title="New Product"
      >
        <ProductForm form={form} onFieldChange={handleFieldChange} compact />
        <div style={styles.panelFooter}>
          <button style={styles.panelCancelBtn} onClick={() => setPanelOpen(false)}>
            Cancel
          </button>
          <button style={styles.panelSubmitBtn} onClick={handleCreateProduct} disabled={creating}>
            {creating ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </SlidePanel>
    </div>
  );
};

export default ProductListPage;
