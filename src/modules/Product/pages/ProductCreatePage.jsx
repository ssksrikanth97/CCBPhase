import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateProductForm, createProductRequest, resetProductForm } from '../store/actions';
import { selectProductForm, selectProductCreating } from '../store/selectors';
import ProductForm from '../components/ProductForm/ProductForm';
import InsightsPanel from '../components/InsightsPanel/InsightsPanel';
import { useThemeContext } from '../../../styles/ThemeContext';

const ProductCreatePage = () => {
  const { colors, fonts, shadows, buttonGradient } = useThemeContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const form = useSelector(selectProductForm);
  const creating = useSelector(selectProductCreating);

  useEffect(() => {
    document.title = 'EV Phase - Create Product';
  }, []);

  const handleFieldChange = (field, value) => {
    dispatch(updateProductForm(field, value));
  };

  const handleSubmit = () => {
    dispatch(createProductRequest(form));
    history.push('/products');
  };

  const styles = {
    root: { width: '100%' },
    header: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 24,
    },
    title: { fontFamily: fonts.heading, fontSize: 'var(--text-3xl)', fontWeight: 700, color: colors.textPrimary },
    actions: { display: 'flex', gap: 12 },
    cancelBtn: {
      padding: '10px 20px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 500, color: colors.textSecondary, backgroundColor: 'transparent',
      border: `1.5px solid ${colors.borderLight}`, borderRadius: 'var(--radius-md)', cursor: 'pointer',
    },
    submitBtn: {
      padding: '10px 24px', fontFamily: fonts.body, fontSize: 'var(--text-base)',
      fontWeight: 600, color: '#ffffff', background: buttonGradient || colors.accentPrimary,
      border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
    },
    body: { display: 'flex', gap: 24, alignItems: 'flex-start' },
    formArea: {
      flex: 1, backgroundColor: colors.bgSurface, borderRadius: 12,
      padding: '28px 32px', border: `1.5px solid ${colors.borderLight}`, boxShadow: shadows.sm,
    },
    rightPanel: { width: 280, flexShrink: 0 },
  };

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.title}>New Product</h1>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={() => history.push('/products')}>Cancel</button>
          <button style={styles.submitBtn} onClick={handleSubmit} disabled={creating}>
            {creating ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </div>
      <div style={styles.body}>
        <div style={styles.formArea}>
          <ProductForm form={form} onFieldChange={handleFieldChange} />
        </div>
        <div style={styles.rightPanel}>
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;
