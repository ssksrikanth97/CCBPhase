import React from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeContext } from '../../styles/ThemeContext';

const insightsData = {
  products: [
    { icon: '📊', label: 'Top Product', value: 'OTT Streaming Basic', detail: '$127M revenue, 2.1% churn' },
    { icon: '📈', label: 'Growth Leader', value: 'Exclusive Premier', detail: '+31.2% subscribers MoM' },
    { icon: '⚠️', label: 'Needs Attention', value: 'Live Concert Pass', detail: '4.8% churn — recommend retention campaign' },
    { icon: '💰', label: 'Revenue', value: '$311M MRR', detail: '+18.5% vs last quarter' },
  ],
  promotions: [
    { icon: '🎯', label: 'Best Performing', value: 'WELCOME20', detail: '34% conversion rate, 2.4K redemptions' },
    { icon: '💸', label: 'Highest ROI', value: 'Referral Program', detail: '5.2x return on spend' },
    { icon: '⏰', label: 'Expiring Soon', value: 'FLASH50', detail: 'Ends in 3 days — 890 uses remaining' },
    { icon: '📈', label: 'Active Promos', value: '12', detail: '3 new this week' },
  ],
  bundles: [
    { icon: '📦', label: 'Top Bundle', value: 'Sports + Live Events', detail: '$24.99/mo, 42% attach rate' },
    { icon: '💡', label: 'AI Suggested', value: 'Entertainment + News', detail: 'Predicted 18% uptake in Q2' },
    { icon: '📉', label: 'Underperforming', value: 'Education Pack', detail: 'Only 2.1K subs — consider repricing' },
    { icon: '🔥', label: 'Trending', value: 'Family Pack', detail: '+28% growth this month' },
  ],
  tickets: [
    { icon: '🎫', label: 'Open Tickets', value: '24', detail: '6 critical, 12 high priority' },
    { icon: '⏱️', label: 'Avg Resolution', value: '2.4 hrs', detail: 'Down 18% from last week' },
    { icon: '🤖', label: 'Auto-resolved', value: '38%', detail: '14 tickets resolved by AI this week' },
    { icon: '😊', label: 'CSAT Score', value: '4.6/5', detail: '+0.3 improvement this month' },
  ],
  customers: [
    { icon: '👥', label: 'Total Customers', value: '6.8K', detail: '+12.4% growth this month' },
    { icon: '⭐', label: 'VIP Customers', value: '842', detail: '$59.95 avg monthly spend' },
    { icon: '⚠️', label: 'Churn Risk', value: '3.2%', detail: '218 customers flagged for win-back' },
    { icon: '💰', label: 'Avg ARPU', value: '$24.50', detail: '+8% vs last quarter' },
  ],
};

const AIInsightsCards = () => {
  const { colors, fonts, shadows } = useThemeContext();
  const location = useLocation();

  let insights = insightsData.products;
  if (location.pathname.includes('/catalogue/promotions')) insights = insightsData.promotions;
  else if (location.pathname.includes('/catalogue/bundles')) insights = insightsData.bundles;
  else if (location.pathname.includes('/support/tickets')) insights = insightsData.tickets;
  else if (location.pathname.includes('/customers')) insights = insightsData.customers;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${insights.length}, 1fr)`, gap: 14, marginBottom: 20 }}>
      {insights.map((insight, i) => (
        <div key={i} style={{
          backgroundColor: colors.bgSurface, borderRadius: 10, padding: '14px 16px',
          border: `1px solid ${colors.borderLight}`, boxShadow: shadows.sm,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: '20px', lineHeight: 1 }}>{insight.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--text-xs)', color: colors.textMuted, fontFamily: fonts.body, marginBottom: 2 }}>{insight.label}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.heading }}>{insight.value}</div>
            <div style={{ fontSize: '10px', color: colors.textMuted, fontFamily: fonts.body, marginTop: 3 }}>{insight.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsightsCards;
