import React from 'react';
import { createRoot } from 'react-dom/client';
import EmployeePortal from './components/EmployeePortal';

// Import required UI5 Web Components base
import "@ui5/webcomponents/dist/Assets.js";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";

// Set the theme to Horizon (modern SAP theme)
setTheme("sap_horizon");

// Bootstrap the application
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root') || document.createElement('div');
  
  if (!document.getElementById('root')) {
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }
  
  const root = createRoot(rootElement);
  root.render(<EmployeePortal />);
});