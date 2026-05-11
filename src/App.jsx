import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ProductListPage from './modules/Product/pages/ProductListPage';
import ProductCreatePage from './modules/Product/pages/ProductCreatePage';
import LoginPage from './modules/Auth/pages/LoginPage';
import InvitePage from './modules/Auth/pages/InvitePage';
import DashboardPage from './modules/Dashboard/pages/DashboardPage';
import ConfigurationPage from './modules/Configuration/pages/ConfigurationPage';
import ExplorePage from './modules/Explore/pages/ExplorePage';
import PlaceholderPage from './modules/Placeholder/PlaceholderPage';
import ChatPage from './modules/Support/pages/ChatPage';
import TicketsPage from './modules/Support/pages/TicketsPage';
import TicketDetailPage from './modules/Support/pages/TicketDetailPage';
import EmailInboxPage from './modules/Support/pages/EmailInboxPage';

const AppRoutes = () => {
  return (
    <Switch>
      {/* Public routes */}
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/invite" component={InvitePage} />

      {/* Protected routes */}
      <PrivateRoute path="/dashboard" component={() => (<Layout><DashboardPage /></Layout>)} />
      <PrivateRoute path="/explore" component={() => (<Layout><ExplorePage /></Layout>)} />
      <PrivateRoute path="/configuration" component={() => (<Layout><ConfigurationPage /></Layout>)} />

      {/* Catalogue */}
      <PrivateRoute exact path="/catalogue/products/create" component={() => (<Layout><ProductCreatePage /></Layout>)} />
      <PrivateRoute path="/catalogue/products" component={() => (<Layout><ProductListPage /></Layout>)} />
      <PrivateRoute path="/catalogue/bundles" component={() => (<Layout><PlaceholderPage title="Bundles" description="Create and manage product bundles" /></Layout>)} />
      <PrivateRoute path="/catalogue/promotions" component={() => (<Layout><PlaceholderPage title="Promotions" description="Create and manage promotional offers" /></Layout>)} />
      <PrivateRoute path="/catalogue/rules" component={() => (<Layout><PlaceholderPage title="Catalogue Rules" description="Define pricing and eligibility rules" /></Layout>)} />

      {/* Customers */}
      <PrivateRoute path="/customers/add" component={() => (<Layout><PlaceholderPage title="Add Customer" description="Create a new customer account" /></Layout>)} />
      <PrivateRoute path="/customers/view" component={() => (<Layout><PlaceholderPage title="View Customers" description="Browse and manage customer accounts" /></Layout>)} />
      <PrivateRoute path="/customers/configuration" component={() => (<Layout><PlaceholderPage title="Customer Configuration" description="Configure customer settings and segments" /></Layout>)} />

      {/* Support */}
      <PrivateRoute path="/support/tickets/:id" component={() => (<Layout><TicketDetailPage /></Layout>)} />
      <PrivateRoute path="/support/tickets" component={() => (<Layout><TicketsPage /></Layout>)} />
      <PrivateRoute path="/support/chats" component={() => (<Layout><ChatPage /></Layout>)} />
      <PrivateRoute path="/support/email" component={() => (<Layout><EmailInboxPage /></Layout>)} />
      <PrivateRoute path="/support/tools" component={() => (<Layout><PlaceholderPage title="External Tools" description="Integrated support tools" /></Layout>)} />
      <PrivateRoute path="/support/rules" component={() => (<Layout><PlaceholderPage title="Support Rules" description="Automation and routing rules" /></Layout>)} />

      {/* Try */}
      <PrivateRoute path="/try/services" component={() => (<Layout><PlaceholderPage title="Services" description="Available services and APIs" /></Layout>)} />
      <PrivateRoute path="/try/libraries" component={() => (<Layout><PlaceholderPage title="External Tools/Libraries" description="Third-party integrations and libraries" /></Layout>)} />
      <PrivateRoute path="/try/api-docs" component={() => (<Layout><PlaceholderPage title="API Docs" description="API documentation and references" /></Layout>)} />
      <PrivateRoute path="/try/contact" component={() => (<Layout><PlaceholderPage title="Contact Us" description="Get in touch with our team" /></Layout>)} />

      {/* Online Store */}
      <PrivateRoute path="/store/preferences" component={() => (<Layout><PlaceholderPage title="Preferences" description="Store preferences and settings" /></Layout>)} />
      <PrivateRoute path="/store/theme" component={() => (<Layout><ConfigurationPage /></Layout>)} />
      <PrivateRoute path="/store/pages" component={() => (<Layout><PlaceholderPage title="Pages" description="Manage store pages" /></Layout>)} />

      {/* BU Settings */}
      <PrivateRoute path="/settings/general" component={() => (<Layout><PlaceholderPage title="General" description="General business unit settings" /></Layout>)} />
      <PrivateRoute path="/settings/plan" component={() => (<Layout><PlaceholderPage title="Plan" description="Subscription plan details" /></Layout>)} />
      <PrivateRoute path="/settings/billing" component={() => (<Layout><PlaceholderPage title="Billing" description="Billing information and invoices" /></Layout>)} />
      <PrivateRoute path="/settings/users" component={() => (<Layout><PlaceholderPage title="Users" description="Manage users and roles" /></Layout>)} />
      <PrivateRoute path="/settings/payments" component={() => (<Layout><PlaceholderPage title="Payments" description="Payment methods and gateways" /></Layout>)} />
      <PrivateRoute path="/settings/taxes" component={() => (<Layout><PlaceholderPage title="Taxes and Duties" description="Tax configuration and duty rates" /></Layout>)} />
      <PrivateRoute path="/settings/locations" component={() => (<Layout><PlaceholderPage title="Locations" description="Business locations and regions" /></Layout>)} />
      <PrivateRoute path="/settings/notifications" component={() => (<Layout><PlaceholderPage title="Notifications" description="Notification preferences and channels" /></Layout>)} />
      <PrivateRoute path="/settings/policies" component={() => (<Layout><PlaceholderPage title="Policies" description="Business policies and compliance" /></Layout>)} />

      {/* Legacy redirects */}
      <Redirect from="/products/create" to="/catalogue/products/create" />
      <Redirect from="/products" to="/catalogue/products" />

      <Redirect from="/" to="/login" />
    </Switch>
  );
};

export default AppRoutes;
