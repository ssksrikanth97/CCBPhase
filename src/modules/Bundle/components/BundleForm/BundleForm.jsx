import React from 'react';
import FormField from '../../../Product/components/FormField/FormField';
import { useThemeContext } from '../../../../styles/ThemeContext';

const BundleForm = ({ form, onFieldChange, compact = false }) => {
  const { colors, fonts } = useThemeContext();

  const categoryOptions = ['Entertainment', 'Sports', 'News', 'Education', 'Lifestyle'];
  const bundleTypeOptions = ['Fixed', 'Flexible', 'Seasonal', 'Custom'];
  const discountTypeOptions = ['Percentage', 'Flat amount', 'Tiered'];

  const styles = {
    formGrid: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
      columnGap: compact ? 0 : 48,
      rowGap: compact ? 16 : 18,
    },
  };

  return (
    <div>
      <div style={styles.formGrid}>
        <FormField label="Category" value={form.category} type="dropdown" options={categoryOptions} onChange={(val) => onFieldChange('category', val)} />
        <FormField label="Discount" value={form.discount} type="add" onChange={(val) => onFieldChange('discount', val)} />
        <FormField label="SKU" value={form.sku} type="text" highlighted onChange={(val) => onFieldChange('sku', val)} />
        <FormField label="Validity end date" value={form.validityEndDate} type="text" highlighted onChange={(val) => onFieldChange('validityEndDate', val)} />
        <FormField label="Bundle type" value={form.bundleType} type="dropdown" options={bundleTypeOptions} onChange={(val) => onFieldChange('bundleType', val)} />
        <FormField label="Products" value={form.products} type="add" onChange={(val) => onFieldChange('products', val)} />
        <FormField label="Discount type" value={form.discountType || 'Percentage'} type="dropdown" options={discountTypeOptions} onChange={(val) => onFieldChange('discountType', val)} />
        <FormField label="Price" value={form.price} type="add" onChange={(val) => onFieldChange('price', val)} />
        <FormField label="Price type" value={form.priceType} type="add" onChange={(val) => onFieldChange('priceType', val)} />
      </div>
    </div>
  );
};

export default BundleForm;
