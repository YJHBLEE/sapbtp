import React, { useState, useEffect } from 'react';
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/Tab.js";
import "@ui5/webcomponents/dist/TabSeparator.js";
import "@ui5/webcomponents/dist/ShellBar.js";
import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents/dist/BusyIndicator.js";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import "@ui5/webcomponents-fiori/dist/ProductSwitch.js";
import "@ui5/webcomponents-fiori/dist/ProductSwitchItem.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/insurance-life.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents-icons/dist/company-view.js";
import "@ui5/webcomponents-icons/dist/customer.js";

import EmployeeSearch from './EmployeeSearch';
import BenefitsTab from './BenefitsTab';

const EmployeePortal = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("employees");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user information
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/user-api/currentUser");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Fallback for demo/development
        setCurrentUser({
          firstname: "Demo",
          lastname: "User",
          email: "demo.user@example.com"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleTabSelect = (e) => {
    setActiveTab(e.detail.tab.getAttribute("data-key"));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ui5-busy-indicator size="Large" active></ui5-busy-indicator>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* ShellBar */}
      <ui5-shellbar
        primary-title="Employee Hub"
        secondary-title="HR Self-Service Portal"
        show-co-pilot
        logo="/api/placeholder/40/40"
      >
        <ui5-avatar 
          slot="profile"
          initials={currentUser ? `${currentUser.firstname?.[0] || ''}${currentUser.lastname?.[0] || ''}` : 'DU'}
        ></ui5-avatar>
      </ui5-shellbar>

      {/* Main Content with Tabs */}
      <div className="flex flex-col flex-grow">
        <ui5-tab-container 
          fixed
          className="w-full"
          onTabSelect={handleTabSelect}
        >
          <ui5-tab icon="employee" text="Employee Directory" data-key="employees" selected={activeTab === "employees"}></ui5-tab>
          <ui5-tab icon="insurance-life" text="Benefits" data-key="benefits" selected={activeTab === "benefits"}></ui5-tab>
          <ui5-tab icon="settings" text="Administration" data-key="admin" selected={activeTab === "admin"}></ui5-tab>
        </ui5-tab-container>

        <div className="flex-grow p-4 overflow-auto">
          {activeTab === "employees" && <EmployeeSearch />}
          {activeTab === "benefits" && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700">Benefits Management</h2>
              <p className="text-gray-500 mt-2">Benefits module is coming soon.</p>
            </div>
          )}
          {activeTab === "admin" && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700">Administration Panel</h2>
              <p className="text-gray-500 mt-2">Administration module is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;