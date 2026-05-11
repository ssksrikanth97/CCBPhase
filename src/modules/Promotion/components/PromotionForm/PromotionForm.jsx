import React from 'react';
import FormField from '../../../Product/components/FormField/FormField';
import { useThemeContext } from '../../../../styles/ThemeContext';

const PromotionForm = ({ form, onFieldChange, compact = false }) => {
  const { colors, fonts } = useThemeContext();

  const typeOptions = ['Discount', 'Free Trial', 'Cashback', 'Referral', 'Bundle Offer'];
  const audienceOptions = ['All Subscribers', 'New Users', 'Existing Users', 'Churned Users', 'VIP'];
  const applicableOptions = ['All Products', 'Specific Products', 'Bundles Only', 'Premium Tier'];

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
        <FormField label="Promo type" value={form.type} type="dropdown" options={typeOptions} onChange={(val) => onFieldChange('type', val)} />
        <FormField label="Discount" value={form.discount} type="add" onChange={(val) => onFieldChange('discount', val)} />
        <FormField label="Promo code" value={form.code} type="add" onChange={(val) => onFieldChange('code', val)} />
        <FormField label="End date" value={form.validityEndDate} type="text" highlighted onChange={(val) => onFieldChange('validityEndDate', val)} />
        <FormField label="Target audience" value={form.targetAudience} type="dropdown" options={audienceOptions} onChange={(val) => onFieldChange('targetAudience', val)} />
        <FormField label="Min purchase" value={form.minPurchase} type="add" onChange={(val) => onFieldChange('minPurchase', val)} />
        <FormField label="Applicable to" value={form.applicableTo || 'All Products'} type="dropdown" options={applicableOptions} onChange={(val) => onFieldChange('applicableTo', val)} />
        <FormField label="Max uses" value={form.maxUses} type="add" onChange={(val) => onFieldChange('maxUses', val)} />
      </div>
    </div>
  );
};

export default PromotionForm;
