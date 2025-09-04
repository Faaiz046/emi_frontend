import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import layoutReducer from './slices/layoutSlice'

// Core reducers that are always loaded
const createRootReducer = (asyncReducers = {}) => {
  return combineReducers({
    // Core reducers
    auth: authReducer,
    ui: uiReducer,
    layout: layoutReducer,
    
    // Dynamically injected reducers
    ...asyncReducers
  })
}

export default createRootReducer 