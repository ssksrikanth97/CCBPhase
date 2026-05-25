/**
 * EVA Agent Modules
 * Each module handles a specific domain and connects to backend APIs
 * Replace mock implementations with real API calls
 */

import { INTENTS } from './intents';
import { conversationContext } from './context';

// ============ MOCK API LAYER ============
// Replace these with actual fetch/axios calls to your backend

const mockApi = {
  catalogue: {
    searchProducts: async (query) => {
      // TODO: Replace with GET /api/v1/catalogue/products?search={query}
      await delay(800);
      const allProducts = [
        { id: 'PRD-001', name: 'OTT Streaming Basic', category: 'Video', price: '$9.99/mo', status: 'Active' },
        { id: 'PRD-002', name: 'Sports Live Pack', category: 'Sports', price: '$14.99/mo', status: 'Active' },
        { id: 'PRD-003', name: 'News Premium', category: 'News', price: '$7.99/mo', status: 'Active' },
        { id: 'PRD-004', name: 'Entertainment Bundle', category: 'Entertainment', price: '$12.99/mo', status: 'Active' },
        { id: 'PRD-005', name: 'Kids Zone', category: 'Entertainment', price: '$3.99/mo', status: 'Active' },
        { id: 'PRD-006', name: 'Live Concert Pass', category: 'Audio', price: '$19.99/mo', status: 'Active' },
      ];
      if (query) {
        const q = query.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        return { success: true, data: filtered.length > 0 ? filtered : allProducts.slice(0, 3) };
      }
      return { success: true, data: allProducts.slice(0, 3) };
    },
    createProduct: async (data) => {
      // TODO: Replace with POST /api/v1/catalogue/products
      await delay(1200);
      return { success: true, data: { id: 'PRD-' + Date.now(), ...data } };
    },
    getProductStats: async () => {
      // TODO: Replace with GET /api/v1/catalogue/products/stats
      await delay(600);
      return { success: true, data: { total: 24, active: 18, topProduct: 'OTT Streaming Basic', revenue: '$127M' } };
    },
  },

  customer: {
    search: async (query) => {
      // TODO: Replace with GET /api/v1/customers?search={query}
      await delay(800);
      const allCustomers = [
        { id: 'CUS-001', name: 'James Anderson', email: 'james@email.com', status: 'Active', segment: 'VIP' },
        { id: 'CUS-002', name: 'Sarah Mitchell', email: 'sarah@email.com', status: 'Active', segment: 'Premium' },
        { id: 'CUS-003', name: 'Michael Chen', email: 'michael@email.com', status: 'Active', segment: 'Standard' },
        { id: 'CUS-004', name: 'Emma Williams', email: 'emma@email.com', status: 'Suspended', segment: 'Standard' },
        { id: 'CUS-005', name: 'Carlos Rodriguez', email: 'carlos@email.com', status: 'Active', segment: 'VIP' },
      ];
      if (query) {
        const q = query.toLowerCase();
        const filtered = allCustomers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q));
        return { success: true, data: filtered.length > 0 ? filtered : allCustomers.slice(0, 2) };
      }
      return { success: true, data: allCustomers.slice(0, 2) };
    },
    getBalance: async (customerId) => {
      // TODO: Replace with GET /api/v1/customers/{id}/balance
      await delay(600);
      return { success: true, data: { customerId, balance: '$10.00', dueDate: '30/05/2025', status: 'Due' } };
    },
    get360: async (customerId) => {
      // TODO: Replace with GET /api/v1/customers/{id}/360
      await delay(700);
      return { success: true, data: { id: customerId, subscriptions: 2, tickets: 1, equipments: 2 } };
    },
  },

  support: {
    searchTickets: async (query) => {
      // TODO: Replace with GET /api/v1/support/tickets?search={query}
      await delay(800);
      return { success: true, data: [
        { id: 'RVT435', title: 'Playback not working', status: 'In-Progress', priority: 'High' },
        { id: 'RVT436', title: 'Billing discrepancy', status: 'Open', priority: 'Medium' },
      ]};
    },
    createTicket: async (data) => {
      // TODO: Replace with POST /api/v1/support/tickets
      await delay(1000);
      return { success: true, data: { id: 'RVT-' + Date.now(), ...data } };
    },
    getStats: async () => {
      // TODO: Replace with GET /api/v1/support/tickets/stats
      await delay(500);
      return { success: true, data: { open: 24, critical: 6, avgResolution: '2.4 hrs', csat: '92.7%' } };
    },
  },

  analytics: {
    getRevenue: async () => {
      // TODO: Replace with GET /api/v1/analytics/revenue
      await delay(600);
      return { success: true, data: { mrr: '$127M', growth: '+8.2%', forecast: '$142M', period: 'monthly' } };
    },
    getChurn: async () => {
      // TODO: Replace with GET /api/v1/analytics/churn
      await delay(500);
      return { success: true, data: { rate: '2.4%', change: '-0.3%', status: 'healthy', atRisk: 218 } };
    },
    getSubscribers: async () => {
      // TODO: Replace with GET /api/v1/analytics/subscribers
      await delay(500);
      return { success: true, data: { total: '6.8M', growth: '+12.4%', newThisMonth: '84K', vip: 842 } };
    },
    getGrowth: async () => {
      // TODO: Replace with GET /api/v1/analytics/growth
      await delay(600);
      return { success: true, data: { overall: '+18.7%', topRegion: 'Asia Pacific', forecast: '+22% next quarter' } };
    },
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============ MODULE HANDLERS ============

const moduleHandlers = {
  [INTENTS.CREATE_PRODUCT]: async (entities) => {
    const result = await mockApi.catalogue.createProduct({ name: entities.name || 'New Product' });
    return { speech: `I've initiated product creation. The new product has been assigned ID ${result.data.id}. Would you like me to open the product form to fill in the details?`, action: 'navigate', target: '/catalogue/products/create' };
  },

  [INTENTS.SEARCH_PRODUCT]: async (entities) => {
    const result = await mockApi.catalogue.searchProducts(entities.name || '');
    const products = result.data;
    if (entities.name && products.length === 1) {
      return { speech: `Found it! ${products[0].name} is in the ${products[0].category} category, priced at ${products[0].price}, currently ${products[0].status}.`, action: 'navigate', target: '/catalogue/products', data: products };
    }
    if (entities.name && products.length > 1) {
      return { speech: `I found ${products.length} products matching "${entities.name}". Top result is ${products[0].name} at ${products[0].price}.`, action: 'navigate', target: '/catalogue/products', data: products };
    }
    return { speech: `I found ${products.length} products. The top result is ${products[0].name}, priced at ${products[0].price}, currently ${products[0].status}. Would you like to view the full list?`, action: 'navigate', target: '/catalogue/products', data: products };
  },

  [INTENTS.LIST_PRODUCTS]: async () => {
    const stats = await mockApi.catalogue.getProductStats();
    return { speech: `You have ${stats.data.total} products in the catalogue, ${stats.data.active} are active. Top performer is ${stats.data.topProduct} generating ${stats.data.revenue} in revenue. Shall I open the catalogue?`, action: 'navigate', target: '/catalogue/products' };
  },

  [INTENTS.CREATE_BUNDLE]: async (entities) => {
    return { speech: `I'll help you create a new bundle. Opening the bundle creation form now. You can add products, set pricing, and configure the discount.`, action: 'navigate', target: '/catalogue/bundles/create' };
  },

  [INTENTS.CREATE_PROMOTION]: async (entities) => {
    return { speech: `Starting promotion creation. I'll open the form where you can set the promo type, target audience, discount, and validity period.`, action: 'navigate', target: '/catalogue/promotions/create' };
  },

  [INTENTS.SEARCH_CUSTOMER]: async (entities) => {
    const result = await mockApi.customer.search(entities.name || '');
    const customers = result.data;
    if (entities.name && customers.length === 1) {
      return { speech: `Found ${customers[0].name}. They are a ${customers[0].segment} customer, currently ${customers[0].status}. Email: ${customers[0].email}.`, action: 'navigate', target: '/customers/view', data: customers };
    }
    if (entities.name && customers.length > 1) {
      return { speech: `I found ${customers.length} customers matching "${entities.name}". Top result is ${customers[0].name}, a ${customers[0].segment} customer.`, action: 'navigate', target: '/customers/view', data: customers };
    }
    if (customers.length > 0) {
      return { speech: `Here are the customers I found. ${customers[0].name} is a ${customers[0].segment} customer with status ${customers[0].status}. Would you like to view their profile?`, action: 'navigate', target: '/customers/view', data: customers };
    }
    return { speech: `I couldn't find any customers matching that. Try a different name or say "list customers" to see all.`, action: 'none' };
  },

  [INTENTS.VIEW_CUSTOMER]: async (entities) => {
    const result = await mockApi.customer.get360(entities.id || 'CUS-001');
    return { speech: `Opening customer 360 view. This customer has ${result.data.subscriptions} active subscriptions, ${result.data.tickets} open tickets, and ${result.data.equipments} registered devices.`, action: 'navigate', target: `/customers/${entities.id || 'CUS-001'}` };
  },

  [INTENTS.CUSTOMER_BALANCE]: async (entities) => {
    const result = await mockApi.customer.getBalance(entities.id || 'CUS-001');
    return { speech: `The customer's current balance is ${result.data.balance}, due by ${result.data.dueDate}. Status is ${result.data.status}.`, action: 'navigate', target: '/customers/view', data: [
      { name: 'Balance', status: result.data.balance, category: result.data.status },
      { name: 'Due Date', status: result.data.dueDate },
    ]};
  },

  [INTENTS.SEARCH_TICKET]: async (entities) => {
    const result = await mockApi.support.searchTickets(entities.id || entities.name || '');
    const tickets = result.data;
    return { speech: `I found ${tickets.length} tickets. The most recent is ${tickets[0].id}, "${tickets[0].title}", currently ${tickets[0].status} with ${tickets[0].priority} priority.`, action: 'navigate', target: '/support/tickets', data: tickets };
  },

  [INTENTS.CREATE_TICKET]: async (entities) => {
    const result = await mockApi.support.createTicket({ title: entities.name || 'New Support Ticket' });
    return { speech: `Ticket created successfully with ID ${result.data.id}. I'll open it so you can add the details and assign it to a team.`, action: 'navigate', target: '/support/tickets' };
  },

  [INTENTS.TICKET_STATUS]: async () => {
    const stats = await mockApi.support.getStats();
    return { speech: `There are ${stats.data.open} open tickets, ${stats.data.critical} are critical. Average resolution time is ${stats.data.avgResolution}. Customer satisfaction is at ${stats.data.csat}.`, action: 'navigate', target: '/support/tickets', data: [
      { name: 'Open Tickets', status: stats.data.open, category: 'Critical: ' + stats.data.critical },
      { name: 'Avg Resolution', status: stats.data.avgResolution },
      { name: 'CSAT', status: stats.data.csat },
    ]};
  },

  [INTENTS.REVENUE_REPORT]: async () => {
    const data = await mockApi.analytics.getRevenue();
    return { speech: `Monthly recurring revenue is ${data.data.mrr}, that's ${data.data.growth} compared to last month. The forecast for next quarter is ${data.data.forecast}.`, action: 'navigate', target: '/dashboard', data: data.data };
  },

  [INTENTS.CHURN_REPORT]: async () => {
    const data = await mockApi.analytics.getChurn();
    return { speech: `Current churn rate is ${data.data.rate}, which is ${data.data.change} from last period. Status is ${data.data.status}. There are ${data.data.atRisk} customers flagged as at-risk.`, action: 'navigate', target: '/dashboard', data: [
      { name: 'Churn Rate', status: data.data.rate, category: data.data.change },
      { name: 'Status', status: data.data.status },
      { name: 'At Risk', status: String(data.data.atRisk) + ' customers' },
    ]};
  },

  [INTENTS.SUBSCRIBER_REPORT]: async () => {
    const data = await mockApi.analytics.getSubscribers();
    return { speech: `Total subscriber base is ${data.data.total} with ${data.data.growth} growth. ${data.data.newThisMonth} new subscribers this month. VIP segment has ${data.data.vip} customers.`, action: 'navigate', target: '/dashboard', data: [
      { name: 'Total Subscribers', status: data.data.total, category: data.data.growth },
      { name: 'New This Month', status: data.data.newThisMonth },
      { name: 'VIP Segment', status: String(data.data.vip) },
    ]};
  },

  [INTENTS.GROWTH_REPORT]: async () => {
    const data = await mockApi.analytics.getGrowth();
    return { speech: `Overall growth is ${data.data.overall}. Top performing region is ${data.data.topRegion}. Forecast shows ${data.data.forecast}.`, action: 'navigate', target: '/dashboard', data: [
      { name: 'Overall Growth', status: data.data.overall },
      { name: 'Top Region', status: data.data.topRegion },
      { name: 'Forecast', status: data.data.forecast },
    ]};
  },

  [INTENTS.EDIT_PRODUCT]: async (entities) => {
    return { speech: `I'll open the product editor. You can modify pricing, category, subscription type, and other details.`, action: 'navigate', target: '/catalogue/products' };
  },

  [INTENTS.VIEW_PRODUCT]: async (entities) => {
    const result = await mockApi.catalogue.searchProducts(entities.name || '');
    const product = result.data[0];
    if (entities.name && result.data.length > 0) {
      return { speech: `Here are the details for ${product.name}. Category: ${product.category}. Price: ${product.price}. Status: ${product.status}. Would you like to view it in the catalogue?`, action: 'navigate', target: '/catalogue/products', data: result.data };
    }
    return { speech: `I found ${result.data.length} products. The top one is ${product.name} at ${product.price}. Which product would you like to see details for?`, action: 'navigate', target: '/catalogue/products', data: result.data };
  },

  [INTENTS.LIST_BUNDLES]: async () => {
    return { speech: `Opening the bundles catalogue. You have active bundles including Sports plus Live Events and Entertainment packages.`, action: 'navigate', target: '/catalogue/bundles' };
  },

  [INTENTS.LIST_PROMOTIONS]: async () => {
    return { speech: `Opening promotions. You have 12 active promotions. The best performer is WELCOME20 with 34 percent conversion.`, action: 'navigate', target: '/catalogue/promotions' };
  },

  [INTENTS.CUSTOMER_SUBSCRIPTIONS]: async (entities) => {
    return { speech: `This customer has 2 active subscriptions: Premium 4K at 18.99 per month and Sports Add-on at 7.99 per month. Total monthly spend is 26.98.`, action: 'data', data: {} };
  },

  [INTENTS.CUSTOMER_TICKETS]: async (entities) => {
    return { speech: `This customer has 1 open ticket regarding a playback issue, currently in progress with high priority.`, action: 'data', data: {} };
  },

  [INTENTS.ASSIGN_TICKET]: async (entities) => {
    conversationContext.setPendingAction({ type: 'assign_ticket', ticketId: entities.id });
    return { speech: `Which team would you like to assign this ticket to? Options are Support Team, Billing Team, Tech Team, or Security Team.`, action: 'none' };
  },

  [INTENTS.ESCALATE_TICKET]: async (entities) => {
    return { speech: `Ticket has been escalated to critical priority. The on-call team has been notified and SLA timer has been reset.`, action: 'data', data: {} };
  },

  [INTENTS.COMPARE_REPORT]: async () => {
    return { speech: `Month over month comparison: Revenue up 8.2 percent, subscribers up 12.4 percent, churn down 0.3 percent. All metrics trending positively.`, action: 'data', data: {} };
  },

  // Navigation handlers
  [INTENTS.NAV_DASHBOARD]: async () => {
    return { speech: `Opening the dashboard with real-time analytics.`, action: 'navigate', target: '/dashboard' };
  },
  [INTENTS.NAV_PRODUCTS]: async () => {
    return { speech: `Opening the product catalogue.`, action: 'navigate', target: '/catalogue/products' };
  },
  [INTENTS.NAV_BUNDLES]: async () => {
    return { speech: `Opening bundles.`, action: 'navigate', target: '/catalogue/bundles' };
  },
  [INTENTS.NAV_PROMOTIONS]: async () => {
    return { speech: `Opening promotions.`, action: 'navigate', target: '/catalogue/promotions' };
  },
  [INTENTS.NAV_CUSTOMERS]: async () => {
    return { speech: `Opening customer list.`, action: 'navigate', target: '/customers/view' };
  },
  [INTENTS.NAV_TICKETS]: async () => {
    return { speech: `Opening support tickets.`, action: 'navigate', target: '/support/tickets' };
  },
  [INTENTS.NAV_CONFIGURATION]: async () => {
    return { speech: `Opening configuration settings.`, action: 'navigate', target: '/configuration' };
  },
  [INTENTS.NAV_EXPLORE]: async () => {
    return { speech: `Going back to the main screen.`, action: 'navigate', target: '/explore' };
  },
  [INTENTS.NAV_EMAIL]: async () => {
    return { speech: `Opening email inbox.`, action: 'navigate', target: '/support/email' };
  },
  [INTENTS.NAV_CHAT]: async () => {
    return { speech: `Opening support chat.`, action: 'navigate', target: '/support/chats' };
  },
  [INTENTS.NAV_STORE]: async () => {
    return { speech: `Opening the online store.`, action: 'navigate', target: '/store/preferences' };
  },

  // Contextual follow-ups
  [INTENTS.CONFIRM_YES]: async () => {
    const pending = conversationContext.getPendingAction();
    if (pending) {
      conversationContext.clearPendingAction();
      if (pending.type === 'navigate') return { speech: `Navigating now.`, action: 'navigate', target: pending.target };
      if (pending.type === 'create') return { speech: `Creating now. I'll open the form for you.`, action: 'navigate', target: pending.target };
      if (pending.type === 'assign_ticket') return { speech: `Ticket assigned successfully.`, action: 'none' };
    }
    return { speech: `Got it. What would you like to do next?`, action: 'none' };
  },

  [INTENTS.CONFIRM_NO]: async () => {
    conversationContext.clearPendingAction();
    return { speech: `No problem. Let me know if there's anything else I can help with.`, action: 'none' };
  },

  [INTENTS.SHOW_MORE]: async (entities) => {
    const lastModule = conversationContext.getLastModule();
    if (lastModule === 'analytics') return { speech: `Here's more detail. Revenue breakdown by region: North America 45 percent, Europe 30 percent, Asia Pacific 25 percent. Top growth segment is Asia Pacific at 28 percent quarter over quarter.`, action: 'data', data: {} };
    if (lastModule === 'catalogue') return { speech: `Additional details: You have 24 total products, 8 bundles, and 12 active promotions. The catalogue was last updated 2 hours ago.`, action: 'data', data: {} };
    if (lastModule === 'customer') return { speech: `More customer details: Average ARPU is 24.50, VIP segment contributes 35 percent of revenue. 218 customers are flagged for churn risk.`, action: 'data', data: {} };
    if (lastModule === 'support') return { speech: `More ticket details: Average first response time is 12 minutes. 38 percent of tickets are auto-resolved by AI. Top category is playback issues.`, action: 'data', data: {} };
    return { speech: `What specific area would you like more details on? I can elaborate on analytics, catalogue, customers, or support.`, action: 'none' };
  },

  [INTENTS.GO_BACK]: async () => {
    return { speech: `Going back.`, action: 'navigate', target: '/explore' };
  },

  [INTENTS.STATUS]: async () => {
    return { speech: `System overview: Revenue is 127 million, up 8.2 percent. 6.8 million subscribers. Churn at 2.4 percent. 24 open tickets, 6 critical. All systems operational.`, action: 'none' };
  },

  [INTENTS.ENABLE_SKILL]: async (entities) => {
    const { skillsManager, SKILLS } = await import('./skills');
    const text = (entities._rawText || '').toLowerCase();

    // Enable all
    if (text.includes('all')) {
      skillsManager.enableAll();
      return { speech: `All skills have been enabled. EVA is now fully connected to Catalogue, Customers, Support, Analytics, and Online Store.`, action: 'skill_update' };
    }

    // Match specific skill
    let skillId = null;
    let skillName = '';
    if (text.includes('catalogue') || text.includes('catalog') || text.includes('product')) { skillId = 'catalogue'; skillName = 'Catalogue'; }
    else if (text.includes('customer')) { skillId = 'customers'; skillName = 'Customers'; }
    else if (text.includes('support') || text.includes('ticket')) { skillId = 'support'; skillName = 'Support'; }
    else if (text.includes('analytics') || text.includes('analytic') || text.includes('revenue')) { skillId = 'analytics'; skillName = 'Analytics'; }
    else if (text.includes('store') || text.includes('online')) { skillId = 'store'; skillName = 'Online Store'; }

    if (skillId) {
      skillsManager.enable(skillId);
      return { speech: `${skillName} skill has been enabled. EVA can now handle ${skillName} related requests.`, action: 'skill_update' };
    }
    return { speech: `Which skill would you like to enable? Say "enable catalogue", "enable customers", "enable support", "enable analytics", or "enable store". You can also say "enable all".`, action: 'none' };
  },

  [INTENTS.DISABLE_SKILL]: async (entities) => {
    const { skillsManager } = await import('./skills');
    const text = (entities._rawText || '').toLowerCase();

    // Disable all
    if (text.includes('all')) {
      Object.values(SKILLS).forEach(s => skillsManager.disable(s.id));
      return { speech: `All skills have been disabled. EVA will only respond to greetings, help, and navigation until you re-enable skills.`, action: 'skill_update' };
    }

    let skillId = null;
    let skillName = '';
    if (text.includes('catalogue') || text.includes('catalog') || text.includes('product')) { skillId = 'catalogue'; skillName = 'Catalogue'; }
    else if (text.includes('customer')) { skillId = 'customers'; skillName = 'Customers'; }
    else if (text.includes('support') || text.includes('ticket')) { skillId = 'support'; skillName = 'Support'; }
    else if (text.includes('analytics') || text.includes('analytic') || text.includes('revenue')) { skillId = 'analytics'; skillName = 'Analytics'; }
    else if (text.includes('store') || text.includes('online')) { skillId = 'store'; skillName = 'Online Store'; }

    if (skillId) {
      skillsManager.disable(skillId);
      return { speech: `${skillName} skill has been disabled. EVA will no longer handle ${skillName} requests until re-enabled.`, action: 'skill_update' };
    }
    return { speech: `Which skill would you like to disable? Active skills are: ${skillsManager.getEnabled().map(s => s.name).join(', ')}.`, action: 'none' };
  },

  [INTENTS.LIST_SKILLS]: async () => {
    const { skillsManager } = await import('./skills');
    const all = skillsManager.getAll();
    const enabled = all.filter(s => s.enabled).map(s => s.name);
    const disabled = all.filter(s => !s.enabled).map(s => s.name);
    let speech = `You have ${enabled.length} skills enabled: ${enabled.join(', ')}.`;
    if (disabled.length > 0) speech += ` Disabled: ${disabled.join(', ')}.`;
    return { speech, action: 'none' };
  },

  [INTENTS.NAVIGATE]: async (entities) => {
    const target = entities.target || '/dashboard';
    const pageName = target.split('/').pop() || 'dashboard';
    return { speech: `Navigating to ${pageName}.`, action: 'navigate', target };
  },

  [INTENTS.GREETING]: async () => {
    const { skillsManager } = await import('./skills');
    const alreadyGreeted = conversationContext.getSessionData('greeted');
    if (alreadyGreeted) {
      return { speech: `Hey! How can I help you?`, action: 'none' };
    }
    conversationContext.setSessionData('greeted', true);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const enabled = skillsManager.getEnabled().map(s => s.name);
    return { speech: `${greeting}! I'm EVA, your AI assistant. I currently have ${enabled.length} skills enabled: ${enabled.join(', ')}. You can ask me to search products, find customers, check tickets, or show analytics. You can also enable or disable skills".`, action: 'none' };
  },

  [INTENTS.HELP]: async () => {
    return { speech: `I can help you with several things. I can create products, bundles, and promotions. I can search for customers and view their profiles. I can find and create support tickets. I can also show you revenue, churn, and subscriber analytics. Just ask naturally!`, action: 'none' };
  },

  [INTENTS.UNKNOWN]: async () => {
    return { speech: `I didn't quite catch that. You can ask me to find products, search customers, check tickets, show analytics, or navigate to any page. Try saying something like "show me the revenue" or "find customer James".`, action: 'none' };
  },
};

/**
 * Process an intent through the appropriate module
 * Updates conversation context after processing
 * @param {string} intent
 * @param {object} entities
 * @param {string} userText - Original user text
 * @returns {Promise<{ speech: string, action: string, target?: string, data?: any }>}
 */
export const processIntent = async (intent, entities, userText = '') => {
  const handler = moduleHandlers[intent];
  const enrichedEntities = { ...entities, _rawText: userText };
  if (!handler) {
    const response = await moduleHandlers[INTENTS.UNKNOWN]();
    conversationContext.addTurn(userText, intent, entities, response);
    return response;
  }
  const response = await handler(enrichedEntities);
  conversationContext.addTurn(userText, intent, entities, response);
  return response;
};
