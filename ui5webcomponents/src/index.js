// Import UI5 Web Components
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/DatePicker.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/Switch.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/CustomListItem.js";
import "@ui5/webcomponents/dist/RatingIndicator.js";
import "@ui5/webcomponents/dist/ProgressIndicator.js";
import "@ui5/webcomponents/dist/BusyIndicator.js";
import "@ui5/webcomponents/dist/Toast.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import "@ui5/webcomponents-fiori/dist/ShellBarItem.js";
import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents-fiori/dist/NotificationListItem.js";
import "@ui5/webcomponents-fiori/dist/NotificationListGroupItem.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import { getTheme, setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import "@ui5/webcomponents/dist/Assets";

// Import SF API utilities
import { searchUsers, getUserDetails, getUserPhoto, getEmployeePerformance } from './sfApi.js';

// DOM Elements
const searchInput = document.getElementById("employeeSearch");
const searchButton = document.getElementById("searchButton");
const employeeList = document.getElementById("employeeList");
const employeeResultsContainer = document.getElementById("employeeResultsContainer");
const emptyStateMessage = document.getElementById("emptyStateMessage");
const employeeProfileSection = document.getElementById("employeeProfileSection");

// State management 
let isLoading = false;
let currentEmployees = [];
let selectedEmployeeId = null;
let searchTimeout = null;

// Get current user info
fetch("/user-api/currentUser").then((res) => {
  return res.json();
}).then((user) => {
  // Set avatar initials based on user's name
  const avatarElement = document.querySelector("ui5-shellbar ui5-avatar");
  if (avatarElement) {
    avatarElement.initials = `${user.firstname.charAt(0)}${user.lastname?.charAt(0) || ''}`;
  }
}).catch(error => {
  console.error("Failed to fetch user info:", error);
  // Fallback for development without authentication
  const avatarElement = document.querySelector("ui5-shellbar ui5-avatar");
  if (avatarElement) {
    avatarElement.initials = "UI";
  }
});

// Setup search functionality
searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm.length >= 2) {
    searchEmployee(searchTerm);
  } else {
    showToast("Please enter at least 2 characters to search");
  }
});

// Setup auto-complete search with debounce
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim();
  
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Show empty state and hide results when search is cleared
  if (searchTerm.length === 0) {
    employeeResultsContainer.style.display = "none";
    emptyStateMessage.style.display = "block";
    employeeProfileSection.style.display = "none";
    return;
  }
  
  // Only search if at least 2 characters are entered
  if (searchTerm.length >= 2) {
    // Set timeout for 500ms debounce
    searchTimeout = setTimeout(() => {
      searchEmployee(searchTerm);
    }, 500);
  }
});

// Show/hide loading indicator
function setLoading(loading) {
  isLoading = loading;
  
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (!loadingIndicator && loading) {
    // Create loading indicator if it doesn't exist
    const busyIndicator = document.createElement("ui5-busy-indicator");
    busyIndicator.id = "loadingIndicator";
    busyIndicator.size = "Medium";
    busyIndicator.active = true;
    busyIndicator.style.display = "block";
    busyIndicator.style.margin = "2rem auto";
    
    // Insert before the employee results container
    employeeResultsContainer.parentNode.insertBefore(busyIndicator, employeeResultsContainer);
  } else if (loadingIndicator) {
    // Remove loading indicator if it exists
    if (loading)     if (loading) {
      loadingIndicator.style.display = "block";
    } else {
      loadingIndicator.style.display = "none";
    }
  }
}

// Search employee using SuccessFactors API
async function searchEmployee(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    showToast("Please enter at least 2 characters to search");
    return;
  }
  
  try {
    setLoading(true);
    
    // Call the SuccessFactors API to search users
    const employees = await searchUsers(searchTerm);
    currentEmployees = employees; // Store for reference
    
    if (employees.length > 0) {
      // Update results list
      await updateEmployeeList(employees);
      
      // Display first match
      await displayEmployeeProfile(employees[0]);
      
      // Show results and hide empty state
      employeeResultsContainer.style.display = "block";
      emptyStateMessage.style.display = "none";
      employeeProfileSection.style.display = "block";
    } else {
      showToast("No employees found matching your search criteria.");
      employeeResultsContainer.style.display = "none";
      emptyStateMessage.style.display = "block";
      employeeProfileSection.style.display = "none";
    }
  } catch (error) {
    console.error("Error searching employees:", error);
    showToast("An error occurred while searching. Please try again.");
    employeeResultsContainer.style.display = "none";
    emptyStateMessage.style.display = "block";
  } finally {
    setLoading(false);
  }
}

// Update employee list with search results
async function updateEmployeeList(employees) {
  // Clear existing items
  while (employeeList.firstChild) {
    employeeList.removeChild(employeeList.firstChild);
  }
  
  // Add items for each employee
  for (const employee of employees) {
    const listItem = document.createElement("ui5-li-custom");
    listItem.setAttribute("data-employee-id", employee.userId);
    
    // Create the custom list item content
    const itemContent = document.createElement("div");
    itemContent.className = "employee-list-item";
    
    // Create avatar
    const avatar = document.createElement("ui5-avatar");
    avatar.size = "S";
    avatar.initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
    
    // Try to get employee photo
    try {
      const photoData = await getUserPhoto(employee.userId);
      if (photoData) {
        avatar.image = `data:image/png;base64,${photoData}`;
      }
    } catch (photoError) {
      console.error(`Error loading photo for ${employee.userId}:`, photoError);
      // Keep initials as fallback
    }
    
    // Create details container
    const detailsContainer = document.createElement("div");
    detailsContainer.className = "employee-list-item-details";
    
    // Add name
    const nameElement = document.createElement("div");
    nameElement.className = "employee-list-item-name";
    nameElement.textContent = `${employee.firstName} ${employee.lastName}`;
    detailsContainer.appendChild(nameElement);
    
    // Add position & department
    const subtitleElement = document.createElement("div");
    subtitleElement.className = "employee-list-item-subtitle";
    const position = employee.jobTitle || "Not specified";
    const department = employee.department || "Not specified";
    subtitleElement.textContent = `${position}, ${department}`;
    detailsContainer.appendChild(subtitleElement);
    
    // Add email
    const emailElement = document.createElement("div");
    emailElement.className = "employee-list-item-subtitle";
    emailElement.textContent = employee.email || "No email";
    detailsContainer.appendChild(emailElement);
    
    // Assemble list item
    itemContent.appendChild(avatar);
    itemContent.appendChild(detailsContainer);
    listItem.appendChild(itemContent);
    
    // Add click handler
    listItem.addEventListener("click", () => {
      displayEmployeeProfile(employee);
      
      // Update selection in list
      const items = employeeList.querySelectorAll("ui5-li-custom");
      items.forEach(item => {
        if (item.getAttribute("data-employee-id") === employee.userId) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
    });
    
    // Add list item to the list
    employeeList.appendChild(listItem);
  }
}

// Display employee profile with data from SuccessFactors API
async function displayEmployeeProfile(employeeData) {
  try {
    setLoading(true);
    selectedEmployeeId = employeeData.userId;
    
    // Update list selection
    const listItems = employeeList.querySelectorAll("ui5-li-custom");
    listItems.forEach(item => {
      if (item.getAttribute("data-employee-id") === employeeData.userId) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    
    // Get detailed employee information
    const employeeDetails = await getUserDetails(employeeData.userId);
    
    if (!employeeDetails) {
      showToast("Could not retrieve employee details.");
      setLoading(false);
      return;
    }
    
    // Update card header
    const cardHeader = document.getElementById("employeeCardHeader");
    cardHeader.title = `${employeeDetails.firstName} ${employeeDetails.lastName}`;
    cardHeader.subtitle = employeeDetails.jobTitle || "Not specified";
    
    // Update avatar
    const avatar = document.getElementById("employeeAvatar");
    avatar.initials = `${employeeDetails.firstName.charAt(0)}${employeeDetails.lastName.charAt(0)}`;
    
    // Try to get employee photo
    try {
      const photoData = await getUserPhoto(employeeData.userId);
      if (photoData) {
        // If we have photo data, set it to the avatar
        avatar.image = `data:image/png;base64,${photoData}`;
      }
    } catch (photoError) {
      console.error("Error loading employee photo:", photoError);
      // Keep the initials as fallback
    }
    
    // Update personal information
    document.getElementById("employeeName").value = `${employeeDetails.firstName} ${employeeDetails.lastName}`;
    document.getElementById("employeeEmail").value = employeeDetails.email || "Not specified";
    document.getElementById("employeePhone").value = employeeDetails.phoneNumber || "Not specified";
    document.getElementById("employeeBirthday").value = employeeDetails.dateOfBirth || "";
    
    // Update employment details
    document.getElementById("employeeId").value = employeeDetails.userId;
    document.getElementById("employeeDepartment").value = employeeDetails.department || "Not specified";
    document.getElementById("employeePosition").value = employeeDetails.jobTitle || "Not specified";
    document.getElementById("employeeHireDate").value = employeeDetails.hireDate || "";
    
    // Get and update performance metrics (mock data)
    const performanceData = await getEmployeePerformance(employeeData.userId);
    if (performanceData) {
      document.getElementById("performanceRating").value = performanceData.performanceRating || 0;
      document.getElementById("projectCompletion").value = performanceData.projectCompletion || 0;
      document.getElementById("teamCollaboration").value = performanceData.teamCollaboration || 0;
    }
    
    // Show profile section right below the selected employee
    employeeProfileSection.style.display = "block";
    
    // Scroll to profile section
    employeeProfileSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error("Error displaying employee profile:", error);
    showToast("An error occurred while loading the employee profile.");
  } finally {
    setLoading(false);
  }
}

// Show toast message
function showToast(message) {
  // Create or reuse toast element
  let toast = document.getElementById("messageToast");
  
  if (!toast) {
    toast = document.createElement("ui5-toast");
    toast.id = "messageToast";
    toast.setAttribute("placement", "MiddleCenter");
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.show();
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
  // Set theme
  setTheme("sap_horizon");
  
  // Add loading indicator to page
  const busyIndicator = document.createElement("ui5-busy-indicator");
  busyIndicator.id = "loadingIndicator";
  busyIndicator.size = "Medium";
  busyIndicator.active = true;
  busyIndicator.style.display = "none";
  busyIndicator.style.margin = "2rem auto";
  document.querySelector(".content-container").insertBefore(busyIndicator, employeeResultsContainer);
  
  // Set up event listeners for list items
  employeeList.addEventListener("item-click", (event) => {
    const employeeId = event.detail.item.getAttribute("data-employee-id");
    const employee = currentEmployees.find(emp => emp.userId === employeeId);
    if (employee) {
      displayEmployeeProfile(employee);
    }
  });
  
  // Handle Enter key on search field
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length >= 2) {
        searchEmployee(searchTerm);
      } else {
        showToast("Please enter at least 2 characters to search");
      }
    }
  });
  
  // Initially hide the profile section
  employeeProfileSection.style.display = "none";
});