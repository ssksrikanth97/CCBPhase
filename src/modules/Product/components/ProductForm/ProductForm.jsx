import React from 'react';
import FormField from '../FormField/FormField';
import { useThemeContext } from '../../../../styles/ThemeContext';

const ProductForm = ({ form, onFieldChange, compact = false }) => {
  const { colors, fonts } = useThemeContext();

  const categoryOptions = ['Video', 'Audio', 'Sports', 'News', 'Entertainment'];
  const subscriptionOptions = ['Recurring', 'One-time', 'Trial'];
  const serviceTypeOptions = ['Streaming services', 'Live TV', 'On-demand', 'PPV'];
  const priceTypeOptions = ['Fixed', 'Usage-based', 'Tiered', 'Freemium'];
  const productTypeOptions = ['Digital', 'Physical', 'Hybrid', 'Add-on'];
  const unitOptions = ['Per month', 'Per year', 'Per event', 'Per GB', 'Per user'];
  const proRateOptions = ['Daily', 'Weekly', 'None'];

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
        <FormField label="Product name" value={form.name} type="add" inputType="text" placeholder="Enter product name" onChange={(val) => onFieldChange('name', val)} />
        <FormField label="Category" value={form.category} type="dropdown" options={categoryOptions} onChange={(val) => onFieldChange('category', val)} />
        <FormField label="Pro rate" value={form.proRate} type="add" inputType="select" options={proRateOptions} placeholder="Select pro rate" onChange={(val) => onFieldChange('proRate', val)} />
        <FormField label="SKU" value={form.sku} type="text" highlighted onChange={(val) => onFieldChange('sku', val)} />
        <FormField label="Validity end date" value={form.validityEndDate} type="add" inputType="date" onChange={(val) => onFieldChange('validityEndDate', val)} />
        <FormField label="Subscription as" value={form.subscriptionAs} type="dropdown" options={subscriptionOptions} onChange={(val) => onFieldChange('subscriptionAs', val)} />
        <FormField label="Unit of measure" value={form.unitOfMeasure} type="add" inputType="select" options={unitOptions} placeholder="Select unit" onChange={(val) => onFieldChange('unitOfMeasure', val)} />
        <FormField label="Service type" value={form.serviceType} type="dropdown" options={serviceTypeOptions} onChange={(val) => onFieldChange('serviceType', val)} />
        <FormField label="Price type" value={form.priceType} type="add" inputType="select" options={priceTypeOptions} placeholder="Select price type" onChange={(val) => onFieldChange('priceType', val)} />
        <FormField label="Product type" value={form.productType} type="add" inputType="multiselect" options={productTypeOptions} onChange={(val) => onFieldChange('productType', val)} />
        <FormField label="Price" value={form.price} type="add" inputType="text" placeholder="e.g. $9.99" onChange={(val) => onFieldChange('price', val)} />
      </div>
    </div>
  );
};

export default ProductForm;
