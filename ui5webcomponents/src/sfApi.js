// SuccessFactors API Utilities

// Base URL for SAP SuccessFactors API
const SF_API_BASE_URL = '/sf-api'; // This should point to your API proxy endpoint

// Headers for API requests
const getRequestHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

/**
 * Search users by query term
 * @param {string} searchTerm - Term to search for (name, ID, department, etc.)
 * @returns {Promise} - Promise resolving to array of user objects
 */
export const searchUsers = async (searchTerm) => {
  try {
    // Build the query with filters
    const query = encodeURIComponent(
      `$filter=substringof('${searchTerm}', userId) or ` +
      `substringof('${searchTerm}', firstName) or ` +
      `substringof('${searchTerm}', lastName) or ` +
      `substringof('${searchTerm}', department) or ` +
      `substringof('${searchTerm}', division) or ` +
      `substringof('${searchTerm}', jobTitle)` +
      `&$top=20` // Limit results
    );
    
    const response = await fetch(`${SF_API_BASE_URL}/User?${query}`, {
      method: 'GET',
      headers: getRequestHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.d.results || [];
  } catch (error) {
    console.error('Error searching users:', error);
    // In case of error, use mock data or throw the error
    if (process.env.NODE_ENV === 'development') {
      return getMockUsers().filter(user => 
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.division?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    throw error;
  }
};

/**
 * Get user details by ID
 * @param {string} userId - User ID
 * @returns {Promise} - Promise resolving to user object with details
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await fetch(`${SF_API_BASE_URL}/User('${encodeURIComponent(userId)}')`, {
      method: 'GET',
      headers: getRequestHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.d || null;
  } catch (error) {
    console.error(`Error fetching user details for ${userId}:`, error);
    // In case of error, use mock data or throw the error
    if (process.env.NODE_ENV === 'development') {
      return getMockUsers().find(user => user.userId === userId) || null;
    }
    throw error;
  }
};

/**
 * Get employee performance metrics 
 * @param {string} userId - User ID
 * @returns {Promise} - Promise resolving to performance metrics object
 */
export const getEmployeePerformance = async (userId) => {
  try {
    // This would need to be adjusted based on the actual SuccessFactors API structure
    const response = await fetch(`${SF_API_BASE_URL}/PerformanceMetrics?$filter=userId eq '${encodeURIComponent(userId)}'`, {
      method: 'GET',
      headers: getRequestHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.d?.results?.[0] || getMockPerformanceMetrics(userId);
  } catch (error) {
    console.error(`Error fetching performance metrics for ${userId}:`, error);
    // Return mock performance data in case of error
    return getMockPerformanceMetrics(userId);
  }
};

// Mock data for development/testing purposes
const getMockUsers = () => [
  {
    userId: "EMP001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phoneNumber: "+1 (555) 123-4567",
    department: "Engineering",
    division: "R&D",
    jobTitle: "Senior Developer",
    dateOfBirth: "1985-06-15",
    hireDate: "2018-03-01",
    location: "San Francisco",
    manager: "EMP008",
    managerName: "Jennifer Wilson"
  },
  {
    userId: "EMP002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phoneNumber: "+1 (555) 234-5678",
    department: "Marketing",
    division: "Digital Marketing",
    jobTitle: "Marketing Manager",
    dateOfBirth: "1990-09-23",
    hireDate: "2019-05-15",
    location: "New York",
    manager: "EMP007",
    managerName: "Robert Taylor"
  },
  {
    userId: "EMP003",
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.williams@company.com",
    phoneNumber: "+1 (555) 345-6789",
    department: "Finance",
    division: "Accounting",
    jobTitle: "Financial Analyst",
    dateOfBirth: "1988-11-05",
    hireDate: "2017-08-10",
    location: "Chicago",
    manager: "EMP006",
    managerName: "Patricia Miller"
  },
  {
    userId: "EMP004",
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@company.com",
    phoneNumber: "+1 (555) 456-7890",
    department: "Human Resources",
    division: "Talent Acquisition",
    jobTitle: "HR Specialist",
    dateOfBirth: "1992-02-28",
    hireDate: "2020-01-15",
    location: "Boston",
    manager: "EMP009",
    managerName: "Thomas Anderson"
  },
  {
    userId: "EMP005",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    phoneNumber: "+1 (555) 567-8901",
    department: "Sales",
    division: "Enterprise Sales",
    jobTitle: "Sales Representative",
    dateOfBirth: "1984-07-14",
    hireDate: "2016-11-01",
    location: "Los Angeles",
    manager: "EMP010",
    managerName: "Elizabeth Walker"
  }
];

const getMockPerformanceMetrics = (userId) => {
  // Random performance metrics based on userId
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    userId: userId,
    performanceRating: (hash % 25) / 5 + 3, // Value between 3-8 (of 5)
    projectCompletion: (hash % 20) + 80, // Value between 80-100
    teamCollaboration: (hash % 15) / 3 + 3.5, // Value between 3.5-5
    lastReviewDate: new Date(Date.now() - (hash % 180) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in last 6 months
    goalsAchieved: (hash % 3) + 3 // Value between 3-5
  };
};

export default {
  searchUsers,
  getUserDetails,
  getEmployeePerformance
};