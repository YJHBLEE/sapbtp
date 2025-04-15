import React, { useState, useEffect } from 'react';
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/Tab.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/BusyIndicator.js";
import "@ui5/webcomponents/dist/Badge.js";
import "@ui5/webcomponents/dist/Slider.js";
import "@ui5/webcomponents/dist/ProgressIndicator.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/Timeline.js";
import "@ui5/webcomponents/dist/TimelineItem.js";
import "@ui5/webcomponents-fiori/dist/IllustratedMessage.js";
import "@ui5/webcomponents-fiori/dist/illustrations/NoData.js";
import "@ui5/webcomponents-fiori/dist/illustrations/SearchIllustration.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/email.js";
import "@ui5/webcomponents-icons/dist/phone.js";
import "@ui5/webcomponents-icons/dist/locate-me.js";
import "@ui5/webcomponents-icons/dist/building.js";
import "@ui5/webcomponents-icons/dist/calendar.js";
import "@ui5/webcomponents-icons/dist/education.js";
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents-icons/dist/chain-link.js";
import "@ui5/webcomponents-icons/dist/checklist-item.js";
import "@ui5/webcomponents-icons/dist/badge.js";
import "@ui5/webcomponents-icons/dist/family-care.js";
import "@ui5/webcomponents-icons/dist/group.js";
import "@ui5/webcomponents-icons/dist/business-card.js";

// Import our mock data for development
import mockEmployeeData from '../services/MockApi';

const EmployeeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchError, setSearchError] = useState(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchError(null);
  };

  // Perform search when user clicks search button
  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term");
      return;
    }
    
    setIsLoading(true);
    setSearchError(null);
    
    try {
      // In a development environment, use mock data
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter mock data based on search query
        const filteredResults = mockEmployeeData.d.results.filter(employee => {
          const query = searchQuery.toLowerCase();
          return (
            employee.username.toLowerCase().includes(query) ||
            employee.firstName.toLowerCase().includes(query) ||
            employee.lastName.toLowerCase().includes(query) ||
            employee.email.toLowerCase().includes(query) ||
            (employee.jobTitle && employee.jobTitle.toLowerCase().includes(query))
          );
        });
        
        setSearchResults(filteredResults);
      } else {
        // Call the SuccessFactors API through our configured destination
        const response = await fetch(`/sfsf-api/odata/v2/User?$format=json&$filter=substringof('${searchQuery}',username) or substringof('${searchQuery}',firstName) or substringof('${searchQuery}',lastName) or substringof('${searchQuery}',email)&$top=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        
        const data = await response.json();
        setSearchResults(data.d.results || []);
      }
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery) && searchQuery.trim()) {
        setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error searching employees:', error);
      setSearchError("An error occurred while searching. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pressing Enter in search field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  // Select an employee from search results
  const selectEmployee = async (employee) => {
    setIsLoading(true);
    try {
      // Simulate fetching more detailed employee information
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real scenario, we'd fetch more details about the employee
      // For now, we'll just use what we have
      setSelectedEmployee(employee);
      
      // Clear search results to clean up the UI
      setSearchResults([]);
      
      // Reset search error
      setSearchError(null);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setSearchError("Failed to load employee details");
    } finally {
      setIsLoading(false);
    }
  };

  // Change active tab
  const handleTabSelect = (e) => {
    setActiveTab(e.detail.tab.getAttribute("data-key"));
  };

  // Clear selection and go back to search
  const handleBackToSearch = () => {
    setSelectedEmployee(null);
  };
  
  // Use a recent search
  const useRecentSearch = (term) => {
    setSearchQuery(term);
    performSearch(term);
  };
  
  // Generate random skills data for employee profile visualization
  const getEmployeeSkills = (employee) => {
    // This would normally come from the API
    // For demo purposes, we'll generate some random skills based on job title
    const skills = [];
    
    if (employee.jobTitle?.toLowerCase().includes('engineer') || 
        employee.jobTitle?.toLowerCase().includes('developer')) {
      skills.push(
        { name: "JavaScript", level: Math.floor(Math.random() * 30) + 70 },
        { name: "Java", level: Math.floor(Math.random() * 40) + 60 },
        { name: "Python", level: Math.floor(Math.random() * 25) + 70 },
        { name: "Problem Solving", level: Math.floor(Math.random() * 15) + 80 },
        { name: "System Design", level: Math.floor(Math.random() * 20) + 75 }
      );
    } else if (employee.jobTitle?.toLowerCase().includes('design')) {
      skills.push(
        { name: "UI Design", level: Math.floor(Math.random() * 20) + 80 },
        { name: "Figma", level: Math.floor(Math.random() * 10) + 85 },
        { name: "User Research", level: Math.floor(Math.random() * 25) + 70 },
        { name: "Wireframing", level: Math.floor(Math.random() * 15) + 80 },
        { name: "Visual Design", level: Math.floor(Math.random() * 20) + 75 }
      );
    } else if (employee.jobTitle?.toLowerCase().includes('product')) {
      skills.push(
        { name: "Product Strategy", level: Math.floor(Math.random() * 20) + 75 },
        { name: "User Stories", level: Math.floor(Math.random() * 10) + 85 },
        { name: "Roadmapping", level: Math.floor(Math.random() * 25) + 70 },
        { name: "Stakeholder Management", level: Math.floor(Math.random() * 15) + 80 },
        { name: "Market Analysis", level: Math.floor(Math.random() * 20) + 75 }
      );
    } else if (employee.department?.toLowerCase().includes('hr')) {
      skills.push(
        { name: "Employee Relations", level: Math.floor(Math.random() * 15) + 80 },
        { name: "Talent Acquisition", level: Math.floor(Math.random() * 20) + 75 },
        { name: "Policy Development", level: Math.floor(Math.random() * 10) + 85 },
        { name: "Conflict Resolution", level: Math.floor(Math.random() * 25) + 70 },
        { name: "Compliance", level: Math.floor(Math.random() * 15) + 80 }
      );
    } else {
      // Default skills for anyone else
      skills.push(
        { name: "Communication", level: Math.floor(Math.random() * 20) + 75 },
        { name: "Teamwork", level: Math.floor(Math.random() * 15) + 80 },
        { name: "Problem Solving", level: Math.floor(Math.random() * 25) + 70 },
        { name: "Leadership", level: Math.floor(Math.random() * 30) + 65 },
        { name: "Time Management", level: Math.floor(Math.random() * 20) + 75 }
      );
    }
    
    return skills;
  };
  
  // Generate career history for employee
  const getEmployeeHistory = (employee) => {
    // This would normally come from the API
    // For demo purposes, we'll generate some career history based on job title
    const history = [];
    
    // Parse hire date if available
    let hireDate = null;
    if (employee.hireDate) {
      try {
        hireDate = new Date(employee.hireDate);
      } catch (e) {
        console.error("Error parsing hire date:", e);
      }
    }
    
    // Current position (always in history)
    history.push({
      title: employee.jobTitle || "Employee",
      company: "Our Company",
      startDate: hireDate ? hireDate.toLocaleDateString() : "Current",
      endDate: "Present",
      description: `Working as ${employee.jobTitle} in the ${employee.department} department.`
    });
    
    // Generate previous positions based on seniority in job title
    if (employee.jobTitle?.toLowerCase().includes('senior') || 
        employee.jobTitle?.toLowerCase().includes('director') ||
        employee.jobTitle?.toLowerCase().includes('manager')) {
      
      // Calculate random previous job dates
      const prevEndDate = hireDate ? new Date(hireDate) : new Date();
      prevEndDate.setDate(prevEndDate.getDate() - 30); // 1 month gap
      
      const prevStartDate = new Date(prevEndDate);
      prevStartDate.setFullYear(prevStartDate.getFullYear() - Math.floor(Math.random() * 3) - 1); // 1-3 years
      
      // Previous job
      history.push({
        title: employee.jobTitle?.replace('Senior', 'Junior').replace('Director', 'Manager').replace('Manager', 'Team Lead') || "Previous Role",
        company: Math.random() > 0.5 ? "Previous Company" : "Our Company",
        startDate: prevStartDate.toLocaleDateString(),
        endDate: prevEndDate.toLocaleDateString(),
        description: "Worked on various projects and initiatives to build experience and expertise in the field."
      });
      
      // For very senior roles, add one more previous job
      if (employee.jobTitle?.toLowerCase().includes('director') || 
          employee.jobTitle?.toLowerCase().includes('manager')) {
        
        const prevPrevEndDate = new Date(prevStartDate);
        prevPrevEndDate.setDate(prevPrevEndDate.getDate() - 60); // 2 month gap
        
        const prevPrevStartDate = new Date(prevPrevEndDate);
        prevPrevStartDate.setFullYear(prevPrevStartDate.getFullYear() - Math.floor(Math.random() * 2) - 1); // 1-2 years
        
        history.push({
          title: "Associate " + employee.jobTitle?.split(' ')[0] || "Entry Role",
          company: Math.random() > 0.7 ? "First Company" : "Previous Company",
          startDate: prevPrevStartDate.toLocaleDateString(),
          endDate: prevPrevEndDate.toLocaleDateString(),
          description: "Started career with focus on building core skills and understanding of the industry."
        });
      }
    }
    
    return history;
  };

  return (
    <div className="flex flex-col w-full h-full p-4 bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <ui5-busy-indicator size="Large" active></ui5-busy-indicator>
        </div>
      )}
      
      {!selectedEmployee ? (
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-xl font-semibold mb-6 text-blue-800">Employee Directory</h1>
            
            <div className="flex gap-2 mb-6">
              <ui5-input
                className="w-full"
                placeholder="Search by name, email, or job title..."
                value={searchQuery}
                onInput={handleSearchChange}
                onKeyPress={handleKeyPress}
                show-clear-icon
              ></ui5-input>
              <ui5-button 
                design="Emphasized" 
                icon="search"
                onClick={performSearch}
              >Search</ui5-button>
            </div>
            
            {searchError && (
              <ui5-message-strip 
                design="Negative" 
                className="mb-4"
              >{searchError}</ui5-message-strip>
            )}
            
            {recentSearches.length > 0 && searchResults.length === 0 && !searchError && (
              <div className="mb-6">
                <ui5-title level="H5">Recent Searches</ui5-title>
                <div className="flex gap-2 mt-2">
                  {recentSearches.map((term, index) => (
                    <ui5-button 
                      key={index} 
                      design="Transparent"
                      onClick={() => useRecentSearch(term)}
                    >{term}</ui5-button>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.length === 0 && !searchError && searchQuery && (
              <ui5-illustrated-message
                name="SearchIllustration"
                title="No results found"
                subtitle="Try adjusting your search to find what you're looking for."
              ></ui5-illustrated-message>
            )}
            
            {searchResults.length === 0 && !searchError && !searchQuery && (
              <ui5-illustrated-message
                name="NoData"
                title="Search the employee directory"
                subtitle="Enter a name, email or job title to find employees."
              ></ui5-illustrated-message>
            )}
            
            {searchResults.length > 0 && (
              <ui5-list className="w-full" header-text={`Search Results (${searchResults.length})`}>
                {searchResults.map((employee) => (
                  <ui5-standard-list-item
                    key={employee.userId}
                    description={employee.email}
                    info={employee.jobTitle || employee.department || ""}
                    info-state={employee.department === "Engineering" ? "Positive" : 
                               employee.department === "Product" ? "Neutral" : 
                               employee.department === "Design" ? "Information" : "None"}
                    icon="employee"
                    image={employee.photo || ""}
                    onClick={() => selectEmployee(employee)}
                  >
                    {`${employee.firstName} ${employee.lastName}`}
                  </ui5-standard-list-item>
                ))}
              </ui5-list>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <ui5-button 
              design="Transparent" 
              onClick={handleBackToSearch}
              icon="arrow-left"
            >Back to Search</ui5-button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-blue-700 p-6 flex flex-col md:flex-row md:items-center">
              <ui5-avatar 
                size="XL" 
                initials={`${selectedEmployee.firstName?.charAt(0) || ''}${selectedEmployee.lastName?.charAt(0) || ''}`}
                color-scheme="Accent6"
                className="mr-4 mb-4 md:mb-0"
              ></ui5-avatar>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</h1>
                <p className="opacity-90 flex items-center">
                  <ui5-icon name="business-card" className="mr-2"></ui5-icon>
                  {selectedEmployee.jobTitle || "Employee"}
                </p>
                <div className="flex mt-2">
                  <p className="opacity-75 text-sm flex items-center mr-4">
                    <ui5-icon name="building" className="mr-1"></ui5-icon>
                    {selectedEmployee.department || "Department"}
                  </p>
                  <p className="opacity-75 text-sm flex items-center">
                    <ui5-icon name="locate-me" className="mr-1"></ui5-icon>
                    {selectedEmployee.location || "Location"}
                  </p>
                </div>
              </div>
              <div className="ml-auto mt-4 md:mt-0">
                <ui5-button design="Transparent" icon="email" tooltip="Send Email"></ui5-button>
                <ui5-button design="Transparent" icon="phone" tooltip="Call"></ui5-button>
                <ui5-button design="Transparent" icon="calendar" tooltip="Schedule Meeting"></ui5-button>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <ui5-tab-container 
              fixed
              className="w-full"
              onTabSelect={handleTabSelect}
            >
              <ui5-tab icon="employee" text="Profile" data-key="profile" selected={activeTab === "profile"}></ui5-tab>
              <ui5-tab icon="email" text="Contact" data-key="contact" selected={activeTab === "contact"}></ui5-tab>
              <ui5-tab icon="activities" text="Career" data-key="career" selected={activeTab === "career"}></ui5-tab>
              <ui5-tab icon="education" text="Skills" data-key="skills" selected={activeTab === "skills"}></ui5-tab>
            </ui5-tab-container>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <ui5-card>
                    <ui5-card-header title="Employee Summary" subtitle="Basic Information"></ui5-card-header>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <ui5-label>Employee ID</ui5-label>
                          <p className="text-lg">{selectedEmployee.userId || "N/A"}</p>
                        </div>
                        <div>
                          <ui5-label>Username</ui5-label>
                          <p className="text-lg">{selectedEmployee.username || "N/A"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <ui5-label>Full Name</ui5-label>
                          <p className="text-lg">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</p>
                        </div>
                        <div>
                          <ui5-label>Manager</ui5-label>
                          <p className="text-lg">{selectedEmployee.manager || "N/A"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <ui5-label>Division</ui5-label>
                          <p className="text-lg">{selectedEmployee.division || "N/A"}</p>
                        </div>
                        <div>
                          <ui5-label>Hire Date</ui5-label>
                          <p className="text-lg">{selectedEmployee.hireDate || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </ui5-card>
                  
                  <ui5-card>
                    <ui5-card-header title="Team Information" subtitle="Team and Organization"></ui5-card-header>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center mb-4">
                        <ui5-icon name="group" className="mr-2"></ui5-icon>
                        <ui5-title level="H5">Department</ui5-title>
                      </div>
                      <p className="mb-4">{selectedEmployee.department || "N/A"}</p>
                      
                      <div className="flex items-center mb-4">
                        <ui5-icon name="chain-link" className="mr-2"></ui5-icon>
                        <ui5-title level="H5">Reporting Structure</ui5-title>
                      </div>
                      <p className="mb-2">Reports to: <strong>{selectedEmployee.manager || "N/A"}</strong></p>
                      
                      <div className="flex items-center mb-4">
                        <ui5-icon name="locate-me" className="mr-2"></ui5-icon>
                        <ui5-title level="H5">Work Location</ui5-title>
                      </div>
                      <p>{selectedEmployee.location || "N/A"}</p>
                    </div>
                  </ui5-card>
                </div>
              )}
              
              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <ui5-card>
                    <ui5-card-header title="Contact Information" subtitle="How to reach this employee"></ui5-card-header>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ui5-icon name="email" className="mr-4 text-blue-700"></ui5-icon>
                        <div>
                          <ui5-label>Email</ui5-label>
                          <p className="text-lg">{selectedEmployee.email || "N/A"}</p>
                        </div>
                        <ui5-button design="Transparent" icon="email" className="ml-auto" tooltip="Send Email"></ui5-button>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ui5-icon name="phone" className="mr-4 text-blue-700"></ui5-icon>
                        <div>
                          <ui5-label>Phone</ui5-label>
                          <p className="text-lg">{selectedEmployee.phoneNumber || "N/A"}</p>
                        </div>
                        <ui5-button design="Transparent" icon="phone" className="ml-auto" tooltip="Call"></ui5-button>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ui5-icon name="building" className="mr-4 text-blue-700"></ui5-icon>
                        <div>
                          <ui5-label>Office Location</ui5-label>
                          <p className="text-lg">{selectedEmployee.location || "N/A"}</p>
                        </div>
                        <ui5-button design="Transparent" icon="locate-me" className="ml-auto" tooltip="View on Map"></ui5-button>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <ui5-icon name="calendar" className="mr-4 text-blue-700"></ui5-icon>
                        <div>
                          <ui5-label>Schedule Meeting</ui5-label>
                          <p className="text-lg">Book time with {selectedEmployee.firstName}</p>
                        </div>
                        <ui5-button design="Transparent" icon="calendar" className="ml-auto" tooltip="Schedule Meeting"></ui5-button>
                      </div>
                    </div>
                  </ui5-card>
                  
                  <ui5-card>
                    <ui5-card-header title="Emergency Contact" subtitle="For HR use only"></ui5-card-header>
                    <div className="p-4">
                      <ui5-message-strip design="Information">
                        Emergency contact information is restricted. Please contact HR for details.
                      </ui5-message-strip>
                    </div>
                  </ui5-card>
                </div>
              )}
              
              {/* Career Tab */}
              {activeTab === "career" && (
                <div className="space-y-6">
                  <ui5-card>
                    <ui5-card-header title="Career History" subtitle="Professional journey"></ui5-card-header>
                    <div className="p-4">
                      <ui5-timeline>
                        {getEmployeeHistory(selectedEmployee).map((position, index) => (
                          <ui5-timeline-item
                            key={index}
                            title-text={position.title}
                            subtitle-text={position.company}
                            icon="business-card"
                            name={`${position.startDate} - ${position.endDate}`}
                          >
                            {position.description}
                          </ui5-timeline-item>
                        ))}
                      </ui5-timeline>
                    </div>
                  </ui5-card>
                  
                  <ui5-card>
                    <ui5-card-header title="Achievements" subtitle="Recognition and achievements"></ui5-card-header>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center">
                        <ui5-icon name="badge" className="mr-2"></ui5-icon>
                        <div>
                          <ui5-label>Work Anniversary</ui5-label>
                          <p>
                            {selectedEmployee.hireDate ? 
                              `${new Date().getFullYear() - new Date(selectedEmployee.hireDate).getFullYear()} years with the company` : 
                              "Date not available"}
                          </p>
                        </div>
                      </div>
                      
                      {Math.random() > 0.5 && (
                        <div className="flex items-center">
                          <ui5-icon name="badge" className="mr-2"></ui5-icon>
                          <div>
                            <ui5-label>Employee of the Month</ui5-label>
                            <p>Recognized for outstanding performance in Q2 2024</p>
                          </div>
                        </div>
                      )}
                      
                      {Math.random() > 0.7 && (
                        <div className="flex items-center">
                          <ui5-icon name="badge" className="mr-2"></ui5-icon>
                          <div>
                            <ui5-label>Innovation Award</ui5-label>
                            <p>Contributed to key company initiative in 2023</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ui5-card>
                </div>
              )}
              
              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <ui5-card>
                    <ui5-card-header title="Skills Assessment" subtitle="Technical and soft skills"></ui5-card-header>
                    <div className="p-4 space-y-6">
                      {getEmployeeSkills(selectedEmployee).map((skill, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between mb-1">
                            <ui5-label>{skill.name}</ui5-label>
                            <span>{skill.level}%</span>
                          </div>
                          <ui5-progress-indicator 
                            value={skill.level} 
                            value-state={
                              skill.level > 85 ? "Success" :
                              skill.level > 70 ? "Information" :
                              skill.level > 50 ? "None" : "Warning"
                            }
                          ></ui5-progress-indicator>
                        </div>
                      ))}
                    </div>
                  </ui5-card>
                  
                  <ui5-card>
                    <ui5-card-header title="Areas of Expertise" subtitle="Based on role and skills"></ui5-card-header>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {[...Array(5)].map((_, i) => {
                          // Generate some random expertise areas based on job title/department
                          const expertiseAreas = [];
                          
                          if (selectedEmployee.jobTitle?.toLowerCase().includes('engineer') || 
                              selectedEmployee.jobTitle?.toLowerCase().includes('developer')) {
                            expertiseAreas.push("Web Development", "API Integration", "Database Design", 
                                              "Cloud Architecture", "Microservices", "DevOps",
                                              "Unit Testing", "Continuous Integration");
                          } else if (selectedEmployee.jobTitle?.toLowerCase().includes('design')) {
                            expertiseAreas.push("UI Design", "UX Research", "Wireframing", 
                                              "Prototyping", "User Testing", "Visual Design",
                                              "Accessibility", "Design Systems");
                          } else if (selectedEmployee.jobTitle?.toLowerCase().includes('product')) {
                            expertiseAreas.push("Product Strategy", "Market Research", "Roadmapping", 
                                              "User Stories", "Feature Prioritization", "Agile Methodologies",
                                              "Stakeholder Management", "Go-to-Market Planning");
                          } else if (selectedEmployee.department?.toLowerCase().includes('hr')) {
                            expertiseAreas.push("Talent Acquisition", "Employee Relations", "Compensation", 
                                              "Benefits Administration", "Policy Development", "Compliance",
                                              "Performance Management", "Training & Development");
                          } else {
                            expertiseAreas.push("Project Management", "Team Leadership", "Strategic Planning", 
                                              "Cross-functional Collaboration", "Process Improvement", "Business Analysis",
                                              "Communication", "Problem Solving");
                          }
                          
                          // Select a random area or use index if possible
                          const area = expertiseAreas[i] || expertiseAreas[Math.floor(Math.random() * expertiseAreas.length)];
                          
                          return (
                            <ui5-badge
                              key={i}
                              color-scheme={i % 4 === 0 ? "1" : i % 4 === 1 ? "2" : i % 4 === 2 ? "6" : "8"}
                            >{area}</ui5-badge>
                          );
                        })}
                      </div>
                    </div>
                  </ui5-card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeSearch;