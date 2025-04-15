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
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/RatingIndicator.js";
import "@ui5/webcomponents/dist/ProgressIndicator.js";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import "@ui5/webcomponents-fiori/dist/ShellBarItem.js";
import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents-fiori/dist/NotificationListItem.js";
import "@ui5/webcomponents-fiori/dist/NotificationListGroupItem.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import { getTheme, setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import "@ui5/webcomponents/dist/Assets";

// Mock Employee Data
const mockEmployees = [
  {
    id: "EMP001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Developer",
    birthDate: "1985-06-15",
    hireDate: "2018-03-01",
    performanceRating: 4,
    projectCompletion: 92,
    teamCollaboration: 4.5
  },
  {
    id: "EMP002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    position: "Marketing Manager",
    birthDate: "1990-09-23",
    hireDate: "2019-05-15",
    performanceRating: 5,
    projectCompletion: 100,
    teamCollaboration: 5
  },
  {
    id: "EMP003",
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.williams@company.com",
    phone: "+1 (555) 345-6789",
    department: "Finance",
    position: "Financial Analyst",
    birthDate: "1988-11-05",
    hireDate: "2017-08-10",
    performanceRating: 3.5,
    projectCompletion: 85,
    teamCollaboration: 4
  },
  {
    id: "EMP004",
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@company.com",
    phone: "+1 (555) 456-7890",
    department: "Human Resources",
    position: "HR Specialist",
    birthDate: "1992-02-28",
    hireDate: "2020-01-15",
    performanceRating: 4.5,
    projectCompletion: 95,
    teamCollaboration: 4.5
  },
  {
    id: "EMP005",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    phone: "+1 (555) 567-8901",
    department: "Sales",
    position: "Sales Representative",
    birthDate: "1984-07-14",
    hireDate: "2016-11-01",
    performanceRating: 4,
    projectCompletion: 89,
    teamCollaboration: 3.5
  }
];

// DOM Elements
const searchInput = document.getElementById("employeeSearch");
const searchButton = document.getElementById("searchButton");
const employeeTable = document.getElementById("employeeTable");
const employeeListPanel = document.getElementById("employeeListPanel");

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

// Initialize Employee Table
function initializeEmployeeTable() {
  // Clear existing rows
  const existingRows = employeeTable.querySelectorAll("ui5-table-row");
  existingRows.forEach(row => row.remove());
  
  // Add rows for each employee
  mockEmployees.forEach(employee => {
    const row = document.createElement("ui5-table-row");
    
    // ID Cell
    const idCell = document.createElement("ui5-table-cell");
    idCell.textContent = employee.id;
    row.appendChild(idCell);
    
    // Name Cell
    const nameCell = document.createElement("ui5-table-cell");
    nameCell.textContent = `${employee.firstName} ${employee.lastName}`;
    row.appendChild(nameCell);
    
    // Position Cell
    const positionCell = document.createElement("ui5-table-cell");
    positionCell.textContent = employee.position;
    row.appendChild(positionCell);
    
    // Department Cell
    const deptCell = document.createElement("ui5-table-cell");
    deptCell.textContent = employee.department;
    row.appendChild(deptCell);
    
    // Actions Cell
    const actionsCell = document.createElement("ui5-table-cell");
    const viewButton = document.createElement("ui5-button");
    viewButton.textContent = "View Profile";
    viewButton.design = "Transparent";
    viewButton.icon = "employee";
    viewButton.classList.add("action-button");
    viewButton.addEventListener("click", () => displayEmployeeProfile(employee));
    actionsCell.appendChild(viewButton);
    row.appendChild(actionsCell);
    
    // Store employee data with the row for reference
    row.addEventListener("click", () => displayEmployeeProfile(employee));
    
    // Add row to table
    employeeTable.appendChild(row);
  });
}

// Display Employee Profile
function displayEmployeeProfile(employee) {
  // Update card header
  const cardHeader = document.getElementById("employeeCardHeader");
  cardHeader.title = `${employee.firstName} ${employee.lastName}`;
  cardHeader.subtitle = `${employee.position}`;
  
  // Update avatar
  const avatar = document.getElementById("employeeAvatar");
  avatar.initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  
  // Update personal information
  document.getElementById("employeeName").value = `${employee.firstName} ${employee.lastName}`;
  document.getElementById("employeeEmail").value = employee.email;
  document.getElementById("employeePhone").value = employee.phone;
  document.getElementById("employeeBirthday").value = employee.birthDate;
  
  // Update employment details
  document.getElementById("employeeId").value = employee.id;
  document.getElementById("employeeDepartment").value = employee.department;
  document.getElementById("employeePosition").value = employee.position;
  document.getElementById("employeeHireDate").value = employee.hireDate;
  
  // Update performance metrics
  document.getElementById("performanceRating").value = employee.performanceRating;
  document.getElementById("projectCompletion").value = employee.projectCompletion;
  document.getElementById("teamCollaboration").value = employee.teamCollaboration;
  
  // Scroll to profile section
  document.getElementById("employeeProfileSection").scrollIntoView({ behavior: 'smooth' });
}

// Setup search functionality
searchButton.addEventListener("click", () => {
  searchEmployee();
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchEmployee();
  }
});

function searchEmployee() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  if (searchTerm) {
    // Filter employees based on search term
    const filteredEmployees = mockEmployees.filter(employee => 
      employee.id.toLowerCase().includes(searchTerm) ||
      employee.firstName.toLowerCase().includes(searchTerm) ||
      employee.lastName.toLowerCase().includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm) ||
      employee.position.toLowerCase().includes(searchTerm)
    );
    
    if (filteredEmployees.length > 0) {
      // Show list panel if it was collapsed
      employeeListPanel.collapsed = false;
      
      // Update table with filtered results
      updateEmployeeTable(filteredEmployees);
      
      // Display first match
      displayEmployeeProfile(filteredEmployees[0]);
    } else {
      showMessage("No employees found matching your search criteria.");
    }
  } else {
    showMessage("Please enter a search term");
  }
}

function updateEmployeeTable(employees) {
  // Clear existing rows
  const existingRows = employeeTable.querySelectorAll("ui5-table-row");
  existingRows.forEach(row => row.remove());
  
  // Add rows for each employee
  employees.forEach(employee => {
    const row = document.createElement("ui5-table-row");
    
    // ID Cell
    const idCell = document.createElement("ui5-table-cell");
    idCell.textContent = employee.id;
    row.appendChild(idCell);
    
    // Name Cell
    const nameCell = document.createElement("ui5-table-cell");
    nameCell.textContent = `${employee.firstName} ${employee.lastName}`;
    row.appendChild(nameCell);
    
    // Position Cell
    const positionCell = document.createElement("ui5-table-cell");
    positionCell.textContent = employee.position;
    row.appendChild(positionCell);
    
    // Department Cell
    const deptCell = document.createElement("ui5-table-cell");
    deptCell.textContent = employee.department;
    row.appendChild(deptCell);
    
    // Actions Cell
    const actionsCell = document.createElement("ui5-table-cell");
    const viewButton = document.createElement("ui5-button");
    viewButton.textContent = "View Profile";
    viewButton.design = "Transparent";
    viewButton.icon = "employee";
    viewButton.classList.add("action-button");
    viewButton.addEventListener("click", () => displayEmployeeProfile(employee));
    actionsCell.appendChild(viewButton);
    row.appendChild(actionsCell);
    
    // Store employee data with the row for reference
    row.addEventListener("click", () => displayEmployeeProfile(employee));
    
    // Add row to table
    employeeTable.appendChild(row);
  });
}

function showMessage(message) {
  // For now, we'll just use an alert, but this could be replaced with a UI5 MessageToast or Dialog
  alert(message);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
  // Set theme
  setTheme("sap_horizon");
  
  // Initialize employee table with all employees
  initializeEmployeeTable();
  
  // Display the first employee profile as default
  if (mockEmployees.length > 0) {
    displayEmployeeProfile(mockEmployees[0]);
  }
});