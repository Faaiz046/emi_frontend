// Utility to clear persisted Redux state
export const clearPersistedState = () => {
  // Clear all localStorage items that start with the persist key
  const persistKey = 'emi-store';
  
  // Clear all keys that start with the persist key
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(persistKey)) {
      localStorage.removeItem(key);
      console.log('Cleared persisted state:', key);
    }
  });
  
  // Also clear any sessionStorage items
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith(persistKey)) {
      sessionStorage.removeItem(key);
      console.log('Cleared session state:', key);
    }
  });
  
  console.log('Persisted state cleared successfully');
};

// Function to clear only layout state
export const clearLayoutState = () => {
  const persistKey = 'emi-store';
  
  try {
    // Get the current persisted state
    const persistedState = localStorage.getItem(`${persistKey}`);
    
    if (persistedState) {
      const state = JSON.parse(persistedState);
      
      // Remove layout from persisted state
      if (state.layout) {
        delete state.layout;
        localStorage.setItem(`${persistKey}`, JSON.stringify(state));
        console.log('Layout state cleared from persistence');
      }
    }
  } catch (error) {
    console.error('Error clearing layout state:', error);
  }
}; 