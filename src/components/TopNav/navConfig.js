// Navigation structure configuration
export const navItems = [
  {
    id: 'catalogue',
    label: 'Catalogue',
    icon: 'CategoryIcon',
    permission: 'catalogue',
    children: [
      { label: 'Products', path: '/catalogue/products' },
      { label: 'Promotions', path: '/catalogue/promotions' },
      { label: 'Bundles', path: '/catalogue/bundles' },
      { label: 'Rules', path: '/catalogue/rules' },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'PeopleIcon',
    permission: 'customers',
    children: [
      { label: 'Add', path: '/customers/add' },
      { label: 'View', path: '/customers/view' },
      { label: 'Configuration', path: '/customers/configuration' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    icon: 'SupportIcon',
    permission: 'support',
    children: [
      { label: 'Tickets', path: '/support/tickets' },
      { label: 'Support Chat', path: '/support/chats' },
      { label: 'Email Inbox', path: '/support/email' },
      { label: 'External Tools', path: '/support/tools' },
      { label: 'Rules', path: '/support/rules' },
    ],
  },
  {
    id: 'try',
    label: 'Try',
    icon: 'CodeIcon',
    permission: 'try',
    children: [
      { label: 'Services', path: '/try/services' },
      { label: 'External Tools/Libraries', path: '/try/libraries' },
      { label: 'API Docs', path: '/try/api-docs' },
      { label: 'Contact Us', path: '/try/contact' },
    ],
  },
  {
    id: 'store',
    label: 'Online Store',
    icon: 'StorefrontIcon',
    permission: 'store',
    children: [
      { label: 'Preferences', path: '/store/preferences' },
      { label: 'Theme Configuration', path: '/store/theme' },
      { label: 'Pages', path: '/store/pages' },
    ],
  },
  {
    id: 'settings',
    label: 'BU Settings',
    icon: 'SettingsIcon',
    permission: 'settings',
    children: [
      { label: 'General', path: '/settings/general' },
      { label: 'Plan', path: '/settings/plan' },
      { label: 'Billing', path: '/settings/billing' },
      { label: 'Users', path: '/settings/users' },
      { label: 'Payments', path: '/settings/payments' },
      { label: 'Taxes and Duties', path: '/settings/taxes' },
      { label: 'Locations', path: '/settings/locations' },
      { label: 'Notifications', path: '/settings/notifications' },
      { label: 'Policies', path: '/settings/policies' },
    ],
  },
];
