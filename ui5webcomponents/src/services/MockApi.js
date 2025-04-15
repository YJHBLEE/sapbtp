// This is a mock data set for development and testing
// It simulates the SuccessFactors User API response

const mockEmployeeData = {
    "d": {
      "results": [
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('john.doe')",
            "type": "SFOData.User"
          },
          "userId": "1001",
          "username": "john.doe",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "jobTitle": "Senior Software Engineer",
          "department": "Engineering",
          "division": "Technology",
          "location": "San Francisco",
          "hireDate": "2018-06-15",
          "manager": "Jane Smith",
          "phoneNumber": "+1 (555) 123-4567",
          "custom01": "Team Lead",
          "custom02": "Web Development",
          "custom03": "Full Stack"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('jane.smith')",
            "type": "SFOData.User"
          },
          "userId": "1002",
          "username": "jane.smith",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane.smith@example.com",
          "jobTitle": "Engineering Manager",
          "department": "Engineering",
          "division": "Technology",
          "location": "San Francisco",
          "hireDate": "2016-03-22",
          "manager": "Robert Johnson",
          "phoneNumber": "+1 (555) 987-6543",
          "custom01": "Department Head",
          "custom02": "Engineering Leadership",
          "custom03": "Product Development"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('sarah.lee')",
            "type": "SFOData.User"
          },
          "userId": "1003",
          "username": "sarah.lee",
          "firstName": "Sarah",
          "lastName": "Lee",
          "email": "sarah.lee@example.com",
          "jobTitle": "UX Designer",
          "department": "Design",
          "division": "Product",
          "location": "New York",
          "hireDate": "2019-11-05",
          "manager": "Michael Chen",
          "phoneNumber": "+1 (555) 456-7890",
          "custom01": "Senior Designer",
          "custom02": "UI/UX",
          "custom03": "Product Design"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('michael.chen')",
            "type": "SFOData.User"
          },
          "userId": "1004",
          "username": "michael.chen",
          "firstName": "Michael",
          "lastName": "Chen",
          "email": "michael.chen@example.com",
          "jobTitle": "Design Director",
          "department": "Design",
          "division": "Product",
          "location": "New York",
          "hireDate": "2017-08-14",
          "manager": "Robert Johnson",
          "phoneNumber": "+1 (555) 234-5678",
          "custom01": "Department Head",
          "custom02": "Design Leadership",
          "custom03": "Brand Strategy"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('emily.wong')",
            "type": "SFOData.User"
          },
          "userId": "1005",
          "username": "emily.wong",
          "firstName": "Emily",
          "lastName": "Wong",
          "email": "emily.wong@example.com",
          "jobTitle": "Product Manager",
          "department": "Product",
          "division": "Business",
          "location": "Chicago",
          "hireDate": "2020-02-18",
          "manager": "David Thompson",
          "phoneNumber": "+1 (555) 345-6789",
          "custom01": "Associate PM",
          "custom02": "Mobile Products",
          "custom03": "Customer Experience"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('david.thompson')",
            "type": "SFOData.User"
          },
          "userId": "1006",
          "username": "david.thompson",
          "firstName": "David",
          "lastName": "Thompson",
          "email": "david.thompson@example.com",
          "jobTitle": "Director of Product",
          "department": "Product",
          "division": "Business",
          "location": "Chicago",
          "hireDate": "2015-07-07",
          "manager": "Robert Johnson",
          "phoneNumber": "+1 (555) 567-8901",
          "custom01": "Executive Leadership",
          "custom02": "Product Strategy",
          "custom03": "Business Development"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('alex.martinez')",
            "type": "SFOData.User"
          },
          "userId": "1007",
          "username": "alex.martinez",
          "firstName": "Alex",
          "lastName": "Martinez",
          "email": "alex.martinez@example.com",
          "jobTitle": "Frontend Developer",
          "department": "Engineering",
          "division": "Technology",
          "location": "Austin",
          "hireDate": "2021-01-11",
          "manager": "John Doe",
          "phoneNumber": "+1 (555) 678-9012",
          "custom01": "Junior Engineer",
          "custom02": "Web Development",
          "custom03": "Frontend Specialist"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('rachel.kim')",
            "type": "SFOData.User"
          },
          "userId": "1008",
          "username": "rachel.kim",
          "firstName": "Rachel",
          "lastName": "Kim",
          "email": "rachel.kim@example.com",
          "jobTitle": "Backend Developer",
          "department": "Engineering",
          "division": "Technology",
          "location": "Seattle",
          "hireDate": "2019-05-20",
          "manager": "John Doe",
          "phoneNumber": "+1 (555) 789-0123",
          "custom01": "Senior Engineer",
          "custom02": "API Development",
          "custom03": "Database Specialist"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('carlos.garcia')",
            "type": "SFOData.User"
          },
          "userId": "1009",
          "username": "carlos.garcia",
          "firstName": "Carlos",
          "lastName": "Garcia",
          "email": "carlos.garcia@example.com",
          "jobTitle": "DevOps Engineer",
          "department": "Operations",
          "division": "Technology",
          "location": "Austin",
          "hireDate": "2018-09-10",
          "manager": "Jane Smith",
          "phoneNumber": "+1 (555) 890-1234",
          "custom01": "Cloud Infrastructure",
          "custom02": "CI/CD Pipeline",
          "custom03": "Kubernetes Specialist"
        },
        {
          "__metadata": {
            "uri": "https://apisalesdemo8.successfactors.com/odata/v2/User('olivia.davis')",
            "type": "SFOData.User"
          },
          "userId": "1010",
          "username": "olivia.davis",
          "firstName": "Olivia",
          "lastName": "Davis",
          "email": "olivia.davis@example.com",
          "jobTitle": "HR Business Partner",
          "department": "Human Resources",
          "division": "Corporate",
          "location": "Chicago",
          "hireDate": "2017-03-28",
          "manager": "Robert Johnson",
          "phoneNumber": "+1 (555) 901-2345",
          "custom01": "Employee Relations",
          "custom02": "Talent Development",
          "custom03": "Performance Management"
        }
      ]
    }
  };
  
  // Function to simulate API response
  function mockSuccessFactorsAPI(searchTerm) {
    // If no search term is provided, return all results
    if (!searchTerm) {
      return mockEmployeeData;
    }
    
    // Search through the mock data
    const searchResults = mockEmployeeData.d.results.filter(employee => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return (
        employee.username.toLowerCase().includes(lowerCaseSearch) ||
        employee.firstName.toLowerCase().includes(lowerCaseSearch) ||
        employee.lastName.toLowerCase().includes(lowerCaseSearch) ||
        employee.email.toLowerCase().includes(lowerCaseSearch) ||
        (employee.jobTitle && employee.jobTitle.toLowerCase().includes(lowerCaseSearch))
      );
    });
    
    // Return the filtered results in the same format
    return {
      d: {
        results: searchResults
      }
    };
  }
  
  // Example usage:
  // const results = mockSuccessFactorsAPI("john");
  // console.log(results);
  
  export default mockEmployeeData;