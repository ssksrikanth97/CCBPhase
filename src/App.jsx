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

const AppRoutes = () => {
  return (
    <Switch>
      {/* Public routes */}
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/invite" component={InvitePage} />

      {/* Protected routes */}
      <PrivateRoute path="/explore" component={() => (<Layout><ExplorePage /></Layout>)} />
      <PrivateRoute path="/dashboard" component={() => (<Layout><DashboardPage /></Layout>)} />
      <PrivateRoute path="/configuration" component={() => (<Layout><ConfigurationPage /></Layout>)} />
      <PrivateRoute path="/products/create" component={() => (<Layout><ProductCreatePage /></Layout>)} />
      <PrivateRoute path="/products" component={() => (<Layout><ProductListPage /></Layout>)} />
      <PrivateRoute path="/bundles" component={() => (<Layout><PlaceholderPage title="Bundles" description="Create and manage product bundles" /></Layout>)} />
      <PrivateRoute path="/promotions" component={() => (<Layout><PlaceholderPage title="Promotions" description="Create and manage promotional offers" /></Layout>)} />
      <PrivateRoute path="/customers" component={() => (<Layout><PlaceholderPage title="Customers" description="View and manage customer accounts" /></Layout>)} />
      <PrivateRoute path="/tickets" component={() => (<Layout><PlaceholderPage title="Tickets" description="Support tickets and issue tracking" /></Layout>)} />

      <Redirect from="/" to="/login" />
    </Switch>
  );
};

export default AppRoutes;
