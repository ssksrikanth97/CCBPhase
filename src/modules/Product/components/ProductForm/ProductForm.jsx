import React from 'react';
import FormField from '../FormField/FormField';
import { useThemeContext } from '../../../../styles/ThemeContext';

const ProductForm = ({ form, onFieldChange, compact = false }) => {
  const { colors, fonts } = useThemeContext();

  const categoryOptions = ['Video', 'Audio', 'Sports', 'News', 'Entertainment'];
  const subscriptionOptions = ['Recurring', 'One-time', 'Trial'];
  const serviceTypeOptions = ['Streaming services', 'Live TV', 'On-demand', 'PPV'];

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
        <FormField label="Pro rate" value={form.proRate} type="add" onChange={(val) => onFieldChange('proRate', val)} />
        <FormField label="SKU" value={form.sku} type="text" highlighted onChange={(val) => onFieldChange('sku', val)} />
        <FormField label="Validity end date" value={form.validityEndDate} type="text" highlighted onChange={(val) => onFieldChange('validityEndDate', val)} />
        <FormField label="Subscription as" value={form.subscriptionAs} type="dropdown" options={subscriptionOptions} onChange={(val) => onFieldChange('subscriptionAs', val)} />
        <FormField label="Unit of measure" value={form.unitOfMeasure} type="add" onChange={(val) => onFieldChange('unitOfMeasure', val)} />
        <FormField label="Service type" value={form.serviceType} type="dropdown" options={serviceTypeOptions} onChange={(val) => onFieldChange('serviceType', val)} />
        <FormField label="Price type" value={form.priceType} type="add" onChange={(val) => onFieldChange('priceType', val)} />
        <FormField label="Product type" value={form.productType} type="add" onChange={(val) => onFieldChange('productType', val)} />
        <FormField label="Price" value={form.price} type="add" onChange={(val) => onFieldChange('price', val)} />
      </div>
    </div>
  );
};

export default ProductForm;
