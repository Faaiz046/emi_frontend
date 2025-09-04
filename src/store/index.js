import { PERSIST_STORE_NAME } from '../constants/app.constant';
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist configuration
const persistConfig = {
  key: PERSIST_STORE_NAME,
  keyPrefix: '',
  storage,
  whitelist: ['auth', 'layout'],
};

// Middleware configuration
const getMiddlewareConfig = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: {
      ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      ignoredPaths: ['items.dates'],
    },
  });

// Store configuration
const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer()),
  middleware: getMiddlewareConfig,
  devTools: process.env.NODE_ENV === 'development',
});

// Async reducers for code splitting
store.asyncReducers = {};

// Inject reducer utility for dynamic loading
export const injectReducer = (key, reducer) => {
  if (store.asyncReducers[key]) {
    return false;
  }
  
  store.asyncReducers[key] = reducer;
  store.replaceReducer(
    persistReducer(persistConfig, rootReducer(store.asyncReducers))
  );
  persistor.persist();
  
  return store;
};

export const persistor = persistStore(store);
export { store };
export default store; 