import React from 'react';
import FormField from '../FormField/FormField';
import { useThemeContext } from '../../../../styles/ThemeContext';

const ProductForm = ({ form, onFieldChange, compact = false }) => {
  const { colors, fonts, shadows } = useThemeContext();

  const categoryOptions = ['Video', 'Audio', 'Sports', 'News', 'Entertainment'];
  const subscriptionOptions = ['Recurring', 'One-time', 'Trial'];
  const serviceTypeOptions = ['Streaming services', 'Live TV', 'On-demand', 'PPV'];
  const priceTypeOptions = ['Fixed', 'Usage-based', 'Tiered', 'Freemium'];
  const productTypeOptions = ['Digital', 'Physical', 'Hybrid', 'Add-on'];
  const unitOptions = ['Per month', 'Per year', 'Per event', 'Per GB', 'Per user'];
  const proRateOptions = ['Daily', 'Weekly', 'None'];

  const sectionStyle = {
    marginBottom: compact ? 16 : 24,
    padding: compact ? '12px 0' : '16px 20px',
    borderRadius: compact ? 0 : 10,
    backgroundColor: compact ? 'transparent' : colors.bgPrimary,
    border: compact ? 'none' : `1px solid ${colors.borderLight}`,
  };

  const sectionTitle = {
    fontFamily: fonts.body,
    fontSize: '10px',
    fontWeight: 500,
    color: colors.mutedTan || colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: compact ? 10 : 14,
    opacity: 0.6,
  };

  const gridStyle = () => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: compact ? '12px 16px' : '14px 24px',
    alignItems: 'center',
  });

  return (
    <div>
      {/* Basic Info */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Basic Information</div>
        <div style={gridStyle()}>
          <FormField label="Product name" value={form.name} type="add" inputType="text" placeholder="Enter product name" onChange={(val) => onFieldChange('name', val)} />
          <FormField label="Category" value={form.category} type="add" inputType="text" placeholder="Enter category" onChange={(val) => onFieldChange('category', val)} />
          <FormField label="SKU" value={form.sku} type="add" inputType="text" placeholder="Enter SKU" highlighted onChange={(val) => onFieldChange('sku', val)} />
          <FormField label="Product type" value={form.productType} type="add" inputType="multiselect" options={productTypeOptions} onChange={(val) => onFieldChange('productType', val)} />
        </div>
      </div>

      {/* Subscription & Service */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Subscription & Service</div>
        <div style={gridStyle()}>
          <FormField label="Subscription as" value={form.subscriptionAs} type="add" inputType="select" options={subscriptionOptions} placeholder="Select subscription" onChange={(val) => onFieldChange('subscriptionAs', val)} />
          <FormField label="Service type" value={form.serviceType} type="add" inputType="select" options={serviceTypeOptions} placeholder="Select service type" onChange={(val) => onFieldChange('serviceType', val)} />
          <FormField label="Unit of measure" value={form.unitOfMeasure} type="add" inputType="select" options={unitOptions} placeholder="Select unit" onChange={(val) => onFieldChange('unitOfMeasure', val)} />
          <FormField label="Pro rate" value={form.proRate} type="add" inputType="select" options={proRateOptions} placeholder="Select pro rate" onChange={(val) => onFieldChange('proRate', val)} />
        </div>
      </div>

      {/* Pricing & Validity */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Pricing & Validity</div>
        <div style={gridStyle()}>
          <FormField label="Price" value={form.price} type="add" inputType="currency" placeholder="9.99" onChange={(val) => onFieldChange('price', val)} />
          <FormField label="Price type" value={form.priceType} type="add" inputType="select" options={priceTypeOptions} placeholder="Select price type" onChange={(val) => onFieldChange('priceType', val)} />
          <FormField label="Validity end date" value={form.validityEndDate} type="add" inputType="date" onChange={(val) => onFieldChange('validityEndDate', val)} />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
