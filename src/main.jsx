import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegistered() {
    console.log('PWA: Service Worker successfully registered');
  },
  onOfflineReady() {
    console.log('PWA: App ready to work fully offline');
  },
  onNeedRefresh() {
    console.log('PWA: New content available, refresh to update');
  },
  onRegisterError(error) {
    console.error('PWA: Error registering the Service Worker', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)