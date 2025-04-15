/**
 * Get employee performance metrics (mock data only as there's no API)
 * @param {string} userId - User ID
 * @returns {Promise} - Promise resolving to performance metrics object
 */
export const getEmployeePerformance = async (userId) => {
    // Simply return mock performance data
    return getMockPerformanceMetrics(userId);
  };// SuccessFactors API Utilities
  
  // Base URL for SAP SuccessFactors API
  const SF_API_BASE_URL = '/sf-api/odata/v2'; // Updated path with odata/v2
  
  // Headers for API requests
  const getRequestHeaders = () => {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'DataServiceVersion': '2.0',
      'X-Requested-With': 'XMLHttpRequest',
      'format': 'json' // Explicitly request JSON format for OData
    };
  };
  
  /**
   * Search users by query term
   * @param {string} searchTerm - Term to search for (name, ID, department, etc.)
   * @returns {Promise} - Promise resolving to array of user objects
   */
  export const searchUsers = async (searchTerm) => {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    try {
      // Build the query with filters - restricted to lastName, firstName, email
      // Also include $select to retrieve only needed fields
      const query = 
        `$format=json&$top=20&$select=userId,firstName,lastName,email,department,jobTitle` +
        `&$filter=substringof('${encodedSearchTerm}', lastName) or ` +
        `substringof('${encodedSearchTerm}', firstName) or ` +
        `substringof('${encodedSearchTerm}', email)`;
      
      const response = await fetch(`${SF_API_BASE_URL}/User?${query}`, {
        method: 'GET',
        headers: getRequestHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      // OData v2 response could have d.results or directly d if it's a single entity
      return (data.d && data.d.results) ? data.d.results : 
             (data.d) ? [data.d] : 
             (data.value) ? data.value : []; // Also handle OData v4 response format
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
      const response = await fetch(`${SF_API_BASE_URL}/User('${encodeURIComponent(userId)}')?$select=userId,firstName,lastName,email,department,businessPhone,jobTitle,dateOfBirth,hireDate&$format=json`, {
        method: 'GET',
        headers: getRequestHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      // OData response could be wrapped in d property or directly in the response
      return data.d || data || null;
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
   * Get user photo by ID
   * @param {string} userId - User ID
   * @returns {Promise} - Promise resolving to user photo as base64 encoded string
   */
  export const getUserPhoto = async (userId) => {
    try {
      const response = await fetch(`${SF_API_BASE_URL}/Photo?$format=json&$filter=photoType eq 3 and userId eq '${encodeURIComponent(userId)}'`, {
        method: 'GET',
        headers: getRequestHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract photo data from response
      let photoData = null;
      if (data.d && data.d.results && data.d.results.length > 0) {
        photoData = data.d.results[0].photo;
      } else if (data.value && data.value.length > 0) {
        photoData = data.value[0].photo;
      }
      
      // If we have photo data, return it, otherwise return null
      return photoData ? photoData : null;
    } catch (error) {
      console.error(`Error fetching photo for ${userId}:`, error);
      return null;
    }
  };
  
  // Mock data for development/testing purposes
  const getMockUsers = () => [
    {
      userId: "EMP001",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@company.com",
      businessPhone: "+1 (555) 123-4567",
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
      businessPhone: "+1 (555) 234-5678",
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
      businessPhone: "+1 (555) 345-6789",
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
      businessPhone: "+1 (555) 456-7890",
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
      businessPhone: "+1 (555) 567-8901",
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
    getUserPhoto,
    getEmployeePerformance
  };