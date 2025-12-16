
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Role } from './types';
import { MOCK_USERS } from './services/mockData';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { VehicleMapPage } from './pages/VehicleMap';
import { TireInventoryPage } from './pages/TireInventory';
import { LifecyclePage } from './pages/Lifecycle';
import { MaintenancePage } from './pages/Maintenance';
import { ReportsPage } from './pages/Reports';
import { SuperAdminPage } from './pages/SuperAdmin';
import { ManageVehiclesPage } from './pages/ManageVehicles';
import { ManageBrandsPage } from './pages/ManageBrands';
import { ManageTiresPage } from './pages/ManageTires';
import { ManageSuppliersPage } from './pages/ManageSuppliers';
import { ManageCustomersPage } from './pages/ManageCustomers';
import { ManagePlansPage } from './pages/ManagePlans';
import { CompanyProfilePage } from './pages/CompanyProfile';
import { ManageCollaboratorsPage } from './pages/ManageCollaborators';
import { AlertsPage } from './pages/Alerts';
import { WelcomePage } from './pages/Welcome';

// Wrapper to handle redirection logic inside Router context
const AppRoutes = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [setupComplete, setSetupComplete] = useState<boolean>(() => {
    return localStorage.getItem('dbi_setup_complete') === 'true';
  });

  // Listen for setup completion event to update state dynamically without reload
  useEffect(() => {
    const handleSetupComplete = () => {
      setSetupComplete(true);
    };
    
    window.addEventListener('dbi:setupComplete', handleSetupComplete);
    
    // Check local storage one more time in case event was missed (fallback)
    if (localStorage.getItem('dbi_setup_complete') === 'true') {
        setSetupComplete(true);
    }

    return () => {
      window.removeEventListener('dbi:setupComplete', handleSetupComplete);
    };
  }, []);

  // Effect to redirect to welcome if setup not complete and user is ADMIN
  if (user.role === Role.ADMIN && !setupComplete) {
     return (
       <Routes>
         <Route path="/welcome" element={<WelcomePage />} />
         <Route path="/alerts" element={<Layout user={user} onLogout={onLogout}><AlertsPage /></Layout>} />
         <Route path="*" element={<Navigate to="/welcome" replace />} />
       </Routes>
     );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
        <Routes>
          {/* Redirect root based on role */}
          <Route path="/" element={<Navigate to={user.role === Role.SUPER_ADMIN ? "/super-admin" : "/dashboard"} replace />} />

          {/* Operational Routes */}
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/vehicles" element={<VehicleMapPage user={user} />} />
          <Route path="/inventory" element={<TireInventoryPage user={user} />} />
          <Route path="/lifecycle" element={<LifecyclePage user={user} />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          
          {/* Management (Cadastros) Routes */}
          <Route path="/manage-vehicles" element={<ManageVehiclesPage />} />
          <Route path="/manage-brands" element={<ManageBrandsPage />} />
          <Route path="/manage-tires" element={<ManageTiresPage />} />
          <Route path="/manage-suppliers" element={<ManageSuppliersPage />} />
          <Route path="/manage-customers" element={<ManageCustomersPage />} />

          {/* Config Routes */}
          <Route path="/company-profile" element={<CompanyProfilePage />} />
          <Route path="/collaborators" element={<ManageCollaboratorsPage />} />

          {/* Restricted Routes */}
          <Route 
            path="/reports" 
            element={
              [Role.ADMIN, Role.AUDITOR].includes(user.role) 
                ? <ReportsPage /> 
                : <Navigate to="/dashboard" />
            } 
          />

          <Route 
            path="/super-admin" 
            element={
              user.role === Role.SUPER_ADMIN 
                ? <SuperAdminPage /> 
                : <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/manage-plans" 
            element={
              user.role === Role.SUPER_ADMIN 
                ? <ManagePlansPage /> 
                : <Navigate to="/dashboard" />
            } 
          />
          
          {/* Fallback for manually typing /welcome after setup */}
          <Route path="/welcome" element={<Navigate to="/dashboard" />} />
        </Routes>
    </Layout>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (role: Role) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppRoutes user={currentUser} onLogout={handleLogout} />
    </Router>
  );
};

export default App;
