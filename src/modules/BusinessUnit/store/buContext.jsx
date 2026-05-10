import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Business Units with their services
const businessUnits = [
  {
    id: 'evphase',
    name: 'EV Phase',
    services: ['Streaming Service', 'OTT', 'Broadband'],
    products: [
      { id: 1, name: 'EV Streaming Basic', type: 'OTT', subscribers: '2.1M', revenue: '$45M', growth: '+22.4%', churn: 'low' },
      { id: 2, name: 'EV Broadband Pro', type: 'Broadband', subscribers: '890K', revenue: '$32M', growth: '+14.2%', churn: 'low' },
      { id: 3, name: 'EV Live Sports', type: 'Streaming Service', subscribers: '1.4M', revenue: '$28M', growth: '+18.7%', churn: 'medium' },
    ],
    metrics: { totalSubscribers: '4.39M', mrr: '$105M', churnRate: '2.8%', healthScore: '89%' },
  },
  {
    id: 'directv',
    name: 'DirecTV',
    services: ['Streaming Service', 'OTT', 'Broadband'],
    products: [
      { id: 4, name: 'DirecTV Premium', type: 'OTT', subscribers: '6.8M', revenue: '$127M', growth: '+25.4%', churn: 'low' },
      { id: 5, name: 'DirecTV Sports Pass', type: 'Streaming Service', subscribers: '3.2M', revenue: '$89M', growth: '+18.7%', churn: 'medium' },
      { id: 6, name: 'DirecTV Fiber', type: 'Broadband', subscribers: '1.5M', revenue: '$52M', growth: '+31.2%', churn: 'low' },
    ],
    metrics: { totalSubscribers: '11.5M', mrr: '$268M', churnRate: '3.1%', healthScore: '87%' },
  },
  {
    id: 'streamco',
    name: 'StreamCo',
    services: ['Streaming Service', 'OTT'],
    products: [
      { id: 7, name: 'StreamCo Originals', type: 'OTT', subscribers: '4.2M', revenue: '$78M', growth: '+28.9%', churn: 'low' },
      { id: 8, name: 'StreamCo Live', type: 'Streaming Service', subscribers: '2.8M', revenue: '$56M', growth: '+15.3%', churn: 'medium' },
      { id: 9, name: 'StreamCo Kids', type: 'OTT', subscribers: '1.9M', revenue: '$24M', growth: '+42.1%', churn: 'low' },
    ],
    metrics: { totalSubscribers: '8.9M', mrr: '$158M', churnRate: '2.4%', healthScore: '92%' },
  },
];

// Roles and permissions
const roles = {
  superAdmin: {
    id: 'superAdmin',
    name: 'Super Admin',
    permissions: ['catalogue', 'products', 'bundles', 'promotions', 'customers', 'tickets', 'explore', 'configuration', 'users'],
  },
  productAdmin: {
    id: 'productAdmin',
    name: 'Product Admin',
    permissions: ['catalogue', 'products', 'bundles', 'promotions', 'explore'],
  },
  csrAgent: {
    id: 'csrAgent',
    name: 'CSR Agent',
    permissions: ['customers', 'tickets', 'products'],
  },
  backOfficeAdmin: {
    id: 'backOfficeAdmin',
    name: 'Back Office Admin',
    permissions: ['catalogue', 'products', 'bundles', 'promotions', 'customers', 'tickets', 'configuration'],
  },
};

const BUContext = createContext(null);

export const BUProvider = ({ children }) => {
  const [activeBUId, setActiveBUId] = useState(
    () => localStorage.getItem('activeBU') || 'evphase'
  );
  const [activeRole, setActiveRole] = useState(
    () => localStorage.getItem('activeRole') || 'superAdmin'
  );

  const activeBU = useMemo(
    () => businessUnits.find((bu) => bu.id === activeBUId) || businessUnits[0],
    [activeBUId]
  );

  const currentRole = useMemo(() => roles[activeRole] || roles.superAdmin, [activeRole]);

  const switchBU = useCallback((buId) => {
    setActiveBUId(buId);
    localStorage.setItem('activeBU', buId);
  }, []);

  const switchRole = useCallback((roleId) => {
    setActiveRole(roleId);
    localStorage.setItem('activeRole', roleId);
  }, []);

  const hasPermission = useCallback((permission) => {
    return currentRole.permissions.includes(permission);
  }, [currentRole]);

  return (
    <BUContext.Provider value={{
      activeBU,
      activeBUId,
      currentRole,
      activeRole,
      businessUnits,
      roles,
      switchBU,
      switchRole,
      hasPermission,
    }}>
      {children}
    </BUContext.Provider>
  );
};

export const useBU = () => {
  const context = useContext(BUContext);
  if (!context) throw new Error('useBU must be used within a BUProvider');
  return context;
};
