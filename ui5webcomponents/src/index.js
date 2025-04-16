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
    busyIndicator.style.position = "absolute";
    busyIndicator.style.top = "50%";
    busyIndicator.style.left = "50%";
    busyIndicator.style.transform = "translate(-50%, -50%)";
    busyIndicator.style.zIndex = "200";
    
    // 로딩 인디케이터를 검색 결과 컨테이너에 직접 추가
    employeeResultsContainer.appendChild(busyIndicator);
  } else if (loadingIndicator) {
    // Show or hide loading indicator based on loading state
    loadingIndicator.style.display = loading ? "block" : "none";
  }
}

// Search employee using SuccessFactors API
async function searchEmployee(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    showToast("Please enter at least 2 characters to search");
    return;
  }
  
  try {
    // 검색 결과 컨테이너 먼저 표시 (로딩 상태 표시를 위해)
    employeeResultsContainer.style.display = "block";
    
    // 로딩 상태 설정
    setLoading(true);
    
    // Call the SuccessFactors API to search users
    const employees = await searchUsers(searchTerm);
    currentEmployees = employees; // Store for reference
    
    if (employees.length > 0) {
      // Update results list
      await updateEmployeeList(employees);
      
      // 결과가 있으면 계속 표시
      employeeResultsContainer.style.display = "block";
      emptyStateMessage.style.display = "none";
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
    employeeProfileSection.style.display = "none";
  } finally {
    setLoading(false); // 항상 로딩 상태 종료
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
      if (photoData && photoData.length > 100) { // 최소 길이 체크
        console.log('photoData:', photoData);
        avatar.setAttribute("image", `data:image/png;base64,${photoData}`);
      } else {
        avatar.initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
      }
    } catch (photoError) {
      console.error(`Error loading photo for ${employee.userId}:`, photoError);
      avatar.initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
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
      // 직원 프로필 표시
      displayEmployeeProfile(employee);
      
      // 검색 결과 오버레이 닫기
      employeeResultsContainer.style.display = "none";
      
      // 검색창 초기화
      searchInput.value = "";
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
    
    // Show profile section
    employeeProfileSection.style.display = "block";
    
    // Scroll to profile section
    employeeProfileSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error("Error displaying employee profile:", error);
    showToast("An error occurred while loading the employee profile.");
  } finally {
    setLoading(false); // 항상 로딩 상태 종료 보장
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
  
  // 클릭 이벤트 리스너 추가 - 검색 결과 외부 클릭 시 결과 컨테이너 닫기
  document.addEventListener("click", function(event) {
    // 검색 컨테이너 또는 그 자식 요소가 아닌 경우에만 검색 결과 닫기
    const searchContainer = document.querySelector(".search-container");
    if (searchContainer && !searchContainer.contains(event.target)) {
      employeeResultsContainer.style.display = "none";
    }
  });
  
  // Set up event listeners for list items
  employeeList.addEventListener("item-click", (event) => {
    const employeeId = event.detail.item.getAttribute("data-employee-id");
    const employee = currentEmployees.find(emp => emp.userId === employeeId);
    if (employee) {
      // 직원 프로필 표시
      displayEmployeeProfile(employee);
      
      // 검색 결과 오버레이 닫기
      employeeResultsContainer.style.display = "none";
      
      // 검색창 초기화
      searchInput.value = "";
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
  
  // 검색 입력란 클릭 시 이전 검색 결과 표시
  searchInput.addEventListener("click", () => {
    if (searchInput.value.trim().length >= 2 && currentEmployees.length > 0) {
      employeeResultsContainer.style.display = "block";
    }
  });
  
  // 포커스 이벤트에서도 처리
  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim().length >= 2 && currentEmployees.length > 0) {
      employeeResultsContainer.style.display = "block";
    }
  });
  
  // Initially hide the profile section
  employeeProfileSection.style.display = "none";
});