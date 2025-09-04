import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectIsAuthenticated, selectIsInitialized, initializeAuth } from './store/slices/authSlice';
import LoginPage from './features/auth/pages/LoginPage';
import AppRouter from './core/router';
import { ToastContainer } from './shared/components';
import './App.css';

// Loading component for initialization
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p className="mt-4 text-gray-600">Initializing...</p>
    </div>
  </div>
);

// Main app content component
const AppContent = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Show loading while initializing
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {isAuthenticated ? <AppRouter /> : <LoginPage />}
      <ToastContainer />
    </div>
  );
};

// Root app component with providers
const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContent />
    </PersistGate>
  </Provider>
);

export default App;
