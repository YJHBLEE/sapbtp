import React, { useState, useEffect } from 'react';

// Import UI5 Web Components
import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/Tab.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Badge.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/ProgressIndicator.js";
import "@ui5/webcomponents/dist/BusyIndicator.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/DatePicker.js";
import "@ui5/webcomponents/dist/TimePicker.js";
import "@ui5/webcomponents/dist/TextArea.js";
import "@ui5/webcomponents/dist/Switch.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/RadioButton.js";
import "@ui5/webcomponents-fiori/dist/IllustratedMessage.js";
import "@ui5/webcomponents-fiori/dist/illustrations/BeforeSearch.js";
import "@ui5/webcomponents-fiori/dist/illustrations/EmptyCalendar.js";

// Import icons
import "@ui5/webcomponents-icons/dist/insurance-life.js";
import "@ui5/webcomponents-icons/dist/insurance-car.js";
import "@ui5/webcomponents-icons/dist/insurance-house.js";
import "@ui5/webcomponents-icons/dist/nutrition-activity.js";
import "@ui5/webcomponents-icons/dist/heart-2.js";
import "@ui5/webcomponents-icons/dist/pharmacy.js";
import "@ui5/webcomponents-icons/dist/stethoscope.js";
import "@ui5/webcomponents-icons/dist/travel-expense.js";
import "@ui5/webcomponents-icons/dist/education.js";
import "@ui5/webcomponents-icons/dist/calendar.js";
import "@ui5/webcomponents-icons/dist/family-care.js";
import "@ui5/webcomponents-icons/dist/money-bills.js";
import "@ui5/webcomponents-icons/dist/savings.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/information.js";

const BenefitsTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mybenefits");
  const [currentUser, setCurrentUser] = useState(null);
  const [benefits, setBenefits] = useState(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    type: "vacation",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load user and benefits data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real environment, fetch from API
        // For this demo, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading

        // Mock current user
        setCurrentUser({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          employeeId: "1001",
          department: "Engineering",
          hireDate: "2018-06-15"
        });

        // Mock benefits data
        setBenefits({
          healthInsurance: {
            plan: "Premium Health Plan",
            coverage: "Family",
            startDate: "2018-07-01",
            provider: "BlueCross HealthCare",
            status: "Active",
            monthlyPremium: "$240.00",
            employerContribution: "$180.00",
            employeeContribution: "$60.00"
          },
          retirement: {
            plan: "401(k) Retirement Plan",
            contributionPercentage: 8,
            employerMatch: "6%",
            currentBalance: "$68,500.00",
            yearToDateContribution: "$5,200.00",
            status: "Active"
          },
          timeOff: {
            vacationDays: {
              total: 20,
              used: 5,
              remaining: 15,
              accrualRate: "1.67 days/month"
            },
            sickDays: {
              total: 10,
              used: 2,
              remaining: 8,
              accrualRate: "0.83 days/month"
            },
            personalDays: {
              total: 3,
              used: 0,
              remaining: 3,
              accrualRate: "N/A"
            },
            upcomingTimeOff: [
              {
                type: "Vacation",
                startDate: "2025-06-10",
                endDate: "2025-06-17",
                status: "Approved",
                days: 6
              },
              {
                type: "Personal",
                startDate: "2025-05-02",
                endDate: "2025-05-02",
                status: "Pending",
                days: 1
              }
            ]
          },
          additionalBenefits: [
            {
              name: "Dental Insurance",
              provider: "DentalCare Plus",
              status: "Active",
              coverage: "Family",
              details: "Comprehensive dental coverage including orthodontics"
            },
            {
              name: "Vision Insurance",
              provider: "VisionPlus",
              status: "Active",
              coverage: "Family",
              details: "Eye exams, glasses, and contacts coverage"
            },
            {
              name: "Life Insurance",
              provider: "SecureLife",
              status: "Active",
              coverage: "2x Annual Salary",
              details: "Term life insurance with additional AD&D coverage"
            },
            {
              name: "Wellness Program",
              provider: "WellnessWorks",
              status: "Active",
              coverage: "Individual",
              details: "Gym reimbursement, wellness activities, health coaching"
            },
            {
              name: "Education Assistance",
              provider: "Internal",
              status: "Available",
              coverage: "Up to $5,000/year",
              details: "Tuition reimbursement for approved educational programs"
            }
          ]
        });
      } catch (error) {
        console.error("Error loading benefits data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabSelect = (e) => {
    setActiveTab(e.detail.tab.getAttribute("data-key"));
  };

  const openRequestDialog = () => {
    setShowRequestDialog(true);
  };

  const closeRequestDialog = () => {
    setShowRequestDialog(false);
    setShowConfirmation(false);
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitLeaveRequest = () => {
    // In a real app, we would send this to the backend
    console.log("Submitting leave request:", leaveRequest);
    setShowConfirmation(true);
    
    // Close dialog after showing confirmation for a moment
    setTimeout(() => {
      closeRequestDialog();
      
      // Add the new request to the list of upcoming time off
      if (benefits && benefits.timeOff) {
        const startDate = new Date(leaveRequest.startDate);
        const endDate = new Date(leaveRequest.endDate);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        const newRequest = {
          type: leaveRequest.type.charAt(0).toUpperCase() + leaveRequest.type.slice(1),
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          status: "Pending",
          days: diffDays
        };
        
        setBenefits(prev => ({
          ...prev,
          timeOff: {
            ...prev.timeOff,
            upcomingTimeOff: [newRequest, ...prev.timeOff.upcomingTimeOff]
          }
        }));
      }
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '8';
      case 'pending':
        return '1';
      case 'approved':
        return '8';
      case 'available':
        return '2';
      default:
        return '7';
    }
  };

  // Calculate time remaining in the year for PTO visualization
  const getCurrentYearProgress = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const totalDays = Math.round((endOfYear - startOfYear) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.round((now - startOfYear) / (1000 * 60 * 60 * 24));
    return Math.round((daysPassed / totalDays) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <ui5-busy-indicator size="Large" active></ui5-busy-indicator>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <ui5-tab-container 
        fixed
        className="w-full bg-white rounded-lg shadow-md"
        onTabSelect={handleTabSelect}
      >
        <ui5-tab icon="insurance-life" text="My Benefits" data-key="mybenefits" selected={activeTab === "mybenefits"}></ui5-tab>
        <ui5-tab icon="calendar" text="Time Off" data-key="timeoff" selected={activeTab === "timeoff"}></ui5-tab>
        <ui5-tab icon="money-bills" text="Compensation" data-key="compensation" selected={activeTab === "compensation"}></ui5-tab>
        <ui5-tab icon="family-care" text="Wellness" data-key="wellness" selected={activeTab === "wellness"}></ui5-tab>
      </ui5-tab-container>

      <div className="mt-4">
        {/* My Benefits Tab */}
        {activeTab === "mybenefits" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <ui5-title level="H3">Benefits Summary</ui5-title>
                <ui5-badge color-scheme="8" className="ml-2">Active Employee</ui5-badge>
              </div>
              
              <ui5-message-strip design="Information" className="mb-4">
                Open enrollment period: October 15 - November 15, 2025
              </ui5-message-strip>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Insurance Card */}
                <ui5-card>
                  <ui5-card-header
                    title-text="Health Insurance"
                    subtitle-text={benefits.healthInsurance.plan}
                    status={`Coverage: ${benefits.healthInsurance.coverage}`}
                    interactive
                  >
                    <ui5-icon name="stethoscope" slot="avatar"></ui5-icon>
                  </ui5-card-header>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <ui5-label>Provider</ui5-label>
                        <p>{benefits.healthInsurance.provider}</p>
                      </div>
                      <div>
                        <ui5-label>Status</ui5-label>
                        <div>
                          <ui5-badge color-scheme={getStatusColor(benefits.healthInsurance.status)}>
                            {benefits.healthInsurance.status}
                          </ui5-badge>
                        </div>
                      </div>
                      <div>
                        <ui5-label>Start Date</ui5-label>
                        <p>{benefits.healthInsurance.startDate}</p>
                      </div>
                      <div>
                        <ui5-label>Monthly Premium</ui5-label>
                        <p>{benefits.healthInsurance.monthlyPremium}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <ui5-button design="Transparent">View Details</ui5-button>
                    </div>
                  </div>
                </ui5-card>
                
                {/* Retirement Card */}
                <ui5-card>
                  <ui5-card-header
                    title-text="Retirement"
                    subtitle-text={benefits.retirement.plan}
                    status="Tax-advantaged"
                    interactive
                  >
                    <ui5-icon name="savings" slot="avatar"></ui5-icon>
                  </ui5-card-header>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <ui5-label>Current Balance</ui5-label>
                        <p className="text-lg font-semibold">{benefits.retirement.currentBalance}</p>
                      </div>
                      <div>
                        <ui5-label>YTD Contribution</ui5-label>
                        <p>{benefits.retirement.yearToDateContribution}</p>
                      </div>
                      <div>
                        <ui5-label>Your Contribution</ui5-label>
                        <p>{benefits.retirement.contributionPercentage}%</p>
                      </div>
                      <div>
                        <ui5-label>Employer Match</ui5-label>
                        <p>{benefits.retirement.employerMatch}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <ui5-button design="Transparent">Manage Plan</ui5-button>
                    </div>
                  </div>
                </ui5-card>
              </div>
            </div>
            
            {/* Additional Benefits */}
            <ui5-card>
              <ui5-card-header
                title-text="Additional Benefits"
                subtitle-text="Other available benefits"
              ></ui5-card-header>
              <div className="p-4">
                <ui5-list>
                  {benefits.additionalBenefits.map((benefit, index) => (
                    <ui5-standard-list-item
                      key={index}
                      description={benefit.provider}
                      additional-text={benefit.coverage}
                      additional-text-state={benefit.status === "Active" ? "Success" : "Information"}
                    >
                      {benefit.name}
                    </ui5-standard-list-item>
                  ))}
                </ui5-list>
              </div>
            </ui5-card>
          </div>
        )}
        
        {/* Time Off Tab */}
        {activeTab === "timeoff" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <ui5-title level="H3">Paid Time Off</ui5-title>
                <ui5-button icon="add" design="Emphasized" onClick={openRequestDialog}>
                  Request Time Off
                </ui5-button>
              </div>
              
              <div className="mb-4">
                <ui5-label>Time Remaining in {new Date().getFullYear()}</ui5-label>
                <ui5-progress-indicator 
                  value={getCurrentYearProgress()} 
                  value-state="None" 
                  show-value
                  className="mb-2"
                ></ui5-progress-indicator>
                <p className="text-sm text-gray-500">Plan your remaining time off for the year</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Vacation Days */}
                <ui5-card>
                  <ui5-card-header
                    title-text="Vacation Days"
                    subtitle-text={`${benefits.timeOff.vacationDays.remaining} days remaining`}
                  >
                    <ui5-icon name="travel-expense" slot="avatar"></ui5-icon>
                  </ui5-card-header>
                  <div className="p-4">
                    <ui5-progress-indicator 
                      value={benefits.timeOff.vacationDays.used / benefits.timeOff.vacationDays.total * 100} 
                      value-state={benefits.timeOff.vacationDays.remaining < 5 ? "Warning" : "Success"} 
                      className="mb-2"
                    ></ui5-progress-indicator>
                    <div className="flex justify-between text-sm">
                      <span>Used: {benefits.timeOff.vacationDays.used} days</span>
                      <span>Total: {benefits.timeOff.vacationDays.total} days</span>
                    </div>
                    <div className="mt-3">
                      <ui5-label>Accrual Rate</ui5-label>
                      <p className="text-sm">{benefits.timeOff.vacationDays.accrualRate}</p>
                    </div>
                  </div>
                </ui5-card>
                
                {/* Sick Days */}
                <ui5-card>
                  <ui5-card-header
                    title-text="Sick Days"
                    subtitle-text={`${benefits.timeOff.sickDays.remaining} days remaining`}
                  >
                    <ui5-icon name="pharmacy" slot="avatar"></ui5-icon>
                  </ui5-card-header>
                  <div className="p-4">
                    <ui5-progress-indicator 
                      value={benefits.timeOff.sickDays.used / benefits.timeOff.sickDays.total * 100} 
                      value-state="Success" 
                      className="mb-2"
                    ></ui5-progress-indicator>
                    <div className="flex justify-between text-sm">
                      <span>Used: {benefits.timeOff.sickDays.used} days</span>
                      <span>Total: {benefits.timeOff.sickDays.total} days</span>
                    </div>
                    <div className="mt-3">
                      <ui5-label>Accrual Rate</ui5-label>
                      <p className="text-sm">{benefits.timeOff.sickDays.accrualRate}</p>
                    </div>
                  </div>
                </ui5-card>
                
                {/* Personal Days */}
                <ui5-card>
                  <ui5-card-header
                    title-text="Personal Days"
                    subtitle-text={`${benefits.timeOff.personalDays.remaining} days remaining`}
                  >
                    <ui5-icon name="calendar" slot="avatar"></ui5-icon>
                  </ui5-card-header>
                  <div className="p-4">
                    <ui5-progress-indicator 
                      value={benefits.timeOff.personalDays.used / benefits.timeOff.personalDays.total * 100} 
                      value-state="Success" 
                      className="mb-2"
                    ></ui5-progress-indicator>
                    <div className="flex justify-between text-sm">
                      <span>Used: {benefits.timeOff.personalDays.used} days</span>
                      <span>Total: {benefits.timeOff.personalDays.total} days</span>
                    </div>
                    <div className="mt-3">
                      <ui5-label>Accrual Rate</ui5-label>
                      <p className="text-sm">{benefits.timeOff.personalDays.accrualRate}</p>
                    </div>
                  </div>
                </ui5-card>
              </div>
              
              {/* Upcoming Time Off */}
              <ui5-card>
                <ui5-card-header
                  title-text="Upcoming Time Off"
                  subtitle-text="Scheduled absences"
                ></ui5-card-header>
                <div className="p-4">
                  {benefits.timeOff.upcomingTimeOff.length > 0 ? (
                    <ui5-list>
                      {benefits.timeOff.upcomingTimeOff.map((timeOff, index) => (
                        <ui5-standard-list-item
                          key={index}
                          description={`${timeOff.startDate} - ${timeOff.endDate} (${timeOff.days} days)`}
                          additional-text={timeOff.status}
                          additional-text-state={
                            timeOff.status === "Approved" ? "Success" : 
                            timeOff.status === "Pending" ? "Warning" : "None"
                          }
                        >
                          {timeOff.type}
                        </ui5-standard-list-item>
                      ))}
                    </ui5-list>
                  ) : (
                    <ui5-illustrated-message
                      name="EmptyCalendar"
                      title-text="No upcoming time off"
                      subtitle-text="Schedule your next vacation!"
                    ></ui5-illustrated-message>
                  )}
                </div>
              </ui5-card>
            </div>
          </div>
        )}
        
        {/* Compensation Tab */}
        {activeTab === "compensation" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ui5-title level="H3" className="mb-4">Compensation</ui5-title>
            <ui5-message-strip design="Information" className="mb-4">
              For detailed payroll information, please visit the Payroll portal.
            </ui5-message-strip>
            
            <ui5-illustrated-message
              name="BeforeSearch"
              title-text="Under Development"
              subtitle-text="The compensation module is currently being developed."
            ></ui5-illustrated-message>
          </div>
        )}
        
        {/* Wellness Tab */}
        {activeTab === "wellness" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ui5-title level="H3" className="mb-4">Wellness Programs</ui5-title>
            <ui5-message-strip design="Information" className="mb-4">
              Explore wellness benefits and programs available to you.
            </ui5-message-strip>
            
            <ui5-illustrated-message
              name="BeforeSearch"
              title-text="Under Development"
              subtitle-text="The wellness module is currently being developed."
            ></ui5-illustrated-message>
          </div>
        )}
      </div>
      
      {/* Time Off Request Dialog */}
      <ui5-dialog
        header-text="Request Time Off"
        show={showRequestDialog}
        onAfterClose={closeRequestDialog}
      >
        {showConfirmation ? (
          <div className="p-4 text-center">
            <ui5-icon name="accept" className="text-green-600 w-12 h-12 mx-auto mb-4"></ui5-icon>
            <ui5-title level="H5">Request Submitted</ui5-title>
            <p className="my-4">Your time off request has been submitted successfully.</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4">
              <ui5-label for="type" required>Type of Leave</ui5-label>
              <div className="mt-2">
                <ui5-radio-button 
                  name="leaveType" 
                  text="Vacation" 
                  value="vacation"
                  checked={leaveRequest.type === "vacation"}
                  onClick={() => handleRequestChange({ target: { name: "type", value: "vacation" } })}
                ></ui5-radio-button>
                <ui5-radio-button 
                  name="leaveType" 
                  text="Sick Leave"
                  value="sick"
                  checked={leaveRequest.type === "sick"}
                  onClick={() => handleRequestChange({ target: { name: "type", value: "sick" } })}
                  className="ml-4"
                ></ui5-radio-button>
                <ui5-radio-button 
                  name="leaveType" 
                  text="Personal" 
                  value="personal"
                  checked={leaveRequest.type === "personal"}
                  onClick={() => handleRequestChange({ target: { name: "type", value: "personal" } })}
                  className="ml-4"
                ></ui5-radio-button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <ui5-label for="startDate" required>Start Date</ui5-label>
                <ui5-date-picker 
                  id="startDate"
                  name="startDate"
                  format-pattern="yyyy-MM-dd"
                  value={leaveRequest.startDate}
                  onChange={(e) => handleRequestChange({ 
                    target: { name: "startDate", value: e.target.value } 
                  })}
                  className="w-full"
                ></ui5-date-picker>
              </div>
              <div>
                <ui5-label for="endDate" required>End Date</ui5-label>
                <ui5-date-picker 
                  id="endDate"
                  name="endDate"
                  format-pattern="yyyy-MM-dd"
                  value={leaveRequest.endDate}
                  onChange={(e) => handleRequestChange({ 
                    target: { name: "endDate", value: e.target.value } 
                  })}
                  className="w-full"
                ></ui5-date-picker>
              </div>
            </div>
            
            <div className="mb-4">
              <ui5-label for="reason">Reason (Optional)</ui5-label>
              <ui5-text-area
                id="reason"
                name="reason"
                placeholder="Provide additional details about your time off request"
                value={leaveRequest.reason}
                onChange={(e) => handleRequestChange({
                  target: { name: "reason", value: e.target.value }
                })}
                className="w-full"
              ></ui5-text-area>
            </div>
          </div>
        )}
        
        <div slot="footer" className="flex justify-end">
          {!showConfirmation && (
            <>
              <ui5-button design="Transparent" onClick={closeRequestDialog}>Cancel</ui5-button>
              <ui5-button design="Emphasized" onClick={submitLeaveRequest}>Submit Request</ui5-button>
            </>
          )}
          {showConfirmation && (
            <ui5-button design="Emphasized" onClick={closeRequestDialog}>Close</ui5-button>
          )}
        </div>
      </ui5-dialog>
    </div>
  );
};

export default BenefitsTab;