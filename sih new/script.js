// Application Data (Modified to include attendedStudents in mock data)
const APP_DATA = {
  systemSettings: {
    attendanceRadius: 100,
    timeLimit: 15,
    locationAccuracy: "high",
    sessionCheckInterval: 5000,
    lowAttendanceThreshold: 45
  },
  students: [
    {
      id: "STU2025001",
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      major: "Computer Science",
      year: "3rd Year",
      semester: "Fall 2025",
      phone: "+1-555-0123",
      attendanceStats: {
        totalClasses: 48,
        attended: 44,
        missed: 4,
        percentage: 91.7,
        currentStreak: 12,
        longestStreak: 28
      },
      subjectWiseAttendance: {
        CS301: {
          totalClasses: 20,
          attended: 18,
          percentage: 90.0,
          isLowAttendance: false
        },
        MATH205: {
          totalClasses: 16,
          attended: 14,
          percentage: 87.5,
          isLowAttendance: false
        },
        CS302: {
          totalClasses: 12,
          attended: 12,
          percentage: 100.0,
          isLowAttendance: false
        }
      }
    },
    {
      id: "STU2025002",
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      major: "Computer Science",
      year: "3rd Year",
      semester: "Fall 2025",
      phone: "+1-555-0124",
      attendanceStats: {
        totalClasses: 48,
        attended: 47,
        missed: 1,
        percentage: 98.5,
        currentStreak: 35,
        longestStreak: 35
      },
      subjectWiseAttendance: {
        CS301: {
          totalClasses: 20,
          attended: 20,
          percentage: 100.0,
          isLowAttendance: false
        },
        MATH205: {
          totalClasses: 16,
          attended: 16,
          percentage: 100.0,
          isLowAttendance: false
        },
        CS302: {
          totalClasses: 12,
          attended: 11,
          percentage: 91.7,
          isLowAttendance: false
        }
      }
    },
    {
      id: "STU2025003",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@university.edu",
      major: "Computer Science",
      year: "3rd Year",
      semester: "Fall 2025",
      phone: "+1-555-0125",
      attendanceStats: {
        totalClasses: 48,
        attended: 46,
        missed: 2,
        percentage: 96.8,
        currentStreak: 28,
        longestStreak: 30
      },
      subjectWiseAttendance: {
        CS301: {
          totalClasses: 20,
          attended: 19,
          percentage: 95.0,
          isLowAttendance: false
        },
        MATH205: {
          totalClasses: 16,
          attended: 15,
          percentage: 93.8,
          isLowAttendance: false
        },
        CS302: {
          totalClasses: 12,
          attended: 12,
          percentage: 100.0,
          isLowAttendance: false
        }
      }
    },
    {
      id: "STU2025004",
      name: "Emma Davis",
      email: "emma.davis@university.edu",
      major: "Computer Science",
      year: "3rd Year",
      semester: "Fall 2025",
      phone: "+1-555-0126",
      attendanceStats: {
        totalClasses: 48,
        attended: 43,
        missed: 5,
        percentage: 89.2,
        currentStreak: 8,
        longestStreak: 22
      },
      subjectWiseAttendance: {
        CS301: {
          totalClasses: 20,
          attended: 8,
          percentage: 40.0,
          isLowAttendance: true
        },
        MATH205: {
          totalClasses: 16,
          attended: 15,
          percentage: 93.8,
          isLowAttendance: false
        },
        CS302: {
          totalClasses: 12,
          attended: 12,
          percentage: 100.0,
          isLowAttendance: false
        }
      }
    },
    {
      id: "STU2025005",
      name: "John Wilson",
      email: "john.wilson@university.edu",
      major: "Computer Science",
      year: "3rd Year",
      semester: "Fall 2025",
      phone: "+1-555-0127",
      attendanceStats: {
        totalClasses: 48,
        attended: 20,
        missed: 28,
        percentage: 41.7,
        currentStreak: 2,
        longestStreak: 5
      },
      subjectWiseAttendance: {
        CS301: {
          totalClasses: 20,
          attended: 7,
          percentage: 35.0,
          isLowAttendance: true
        },
        MATH205: {
          totalClasses: 16,
          attended: 6,
          percentage: 37.5,
          isLowAttendance: true
        },
        CS302: {
          totalClasses: 12,
          attended: 7,
          percentage: 58.3,
          isLowAttendance: false
        }
      }
    }
  ],
  faculty: [
    {
      id: "FAC2025001",
      name: "Dr. Sarah Smith",
      email: "sarah.smith@university.edu",
      department: "Computer Science",
      title: "Professor",
      phone: "+1-555-0200"
    }
  ]
};

// Global state variables
let currentUser = null;
let currentUserType = null;
let activeSession = null;
let sessionCheckInterval = null;

// Session Management
function saveSession(user, userType) {
  const sessionData = {
    user: user,
    userType: userType,
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  try {
    localStorage.setItem('smartattend_session', JSON.stringify(sessionData));
    console.log('Session saved successfully');
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

function restoreSession() {
  try {
    const sessionData = localStorage.getItem('smartattend_session');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expires) {
      localStorage.removeItem('smartattend_session');
      return null;
    }
    
    console.log('Session restored:', session);
    return session;
  } catch (error) {
    console.error('Failed to restore session:', error);
    localStorage.removeItem('smartattend_session');
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem('smartattend_session');
    localStorage.removeItem('smartattend_active_session');
    console.log('Session cleared successfully');
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

function logout() {
  clearSession();
  stopSessionChecking();
  currentUser = null;
  currentUserType = null;
  activeSession = null;
  
  showNotification('Logged out successfully', 'success');
  setTimeout(() => {
    navigateToPage('home-page');
  }, 500);
}

// Attendance Session Management
function saveActiveSession(session) {
  try {
    localStorage.setItem('smartattend_active_session', JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save active session:', error);
  }
}

function getActiveSession() {
  try {
    const sessionData = localStorage.getItem('smartattend_active_session');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session is expired (15 minutes)
    if (Date.now() > session.expires) {
      localStorage.removeItem('smartattend_active_session');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to get active session:', error);
    return null;
  }
}

function clearActiveSession() {
  try {
    localStorage.removeItem('smartattend_active_session');
  } catch (error) {
    console.error('Failed to clear active session:', error);
  }
}

function startAttendanceSession() {
  const subjectSelect = document.getElementById('subject-select');
  if (!subjectSelect) return;
  
  const selectedSubject = subjectSelect.value;
  const subjectName = subjectSelect.options[subjectSelect.selectedIndex].text;
  
  const session = {
    subject: selectedSubject,
    subjectName: subjectName,
    startTime: Date.now(),
    expires: Date.now() + (15 * 60 * 1000), // 15 minutes
    faculty: currentUser ? currentUser.name : 'Faculty',
    location: {
      latitude: 0,
      longitude: 0,
      accuracy: 100
    },
    // NEW: Add an array to track students who have marked attendance
    attendedStudents: []
  };
  
  activeSession = session;
  saveActiveSession(session);
  
  // Update UI
  const sessionInactive = document.getElementById('session-inactive');
  const sessionActive = document.getElementById('session-active');
  const activeSubject = document.getElementById('active-subject');
  const sessionStartTime = document.getElementById('session-start-time');
  
  if (sessionInactive) sessionInactive.style.display = 'none';
  if (sessionActive) {
    sessionActive.classList.remove('hidden');
    sessionActive.style.display = 'block';
  }
  if (activeSubject) activeSubject.textContent = subjectName;
  if (sessionStartTime) {
    sessionStartTime.textContent = new Date(session.startTime).toLocaleTimeString();
  }
  
  // Start timer
  updateSessionTimer();
  
  showNotification(`Attendance session started for ${subjectName}`, 'success');
  console.log('Attendance session started:', session);
}

function endAttendanceSession() {
  if (!activeSession) return;
  
  const subjectName = activeSession.subjectName;
  
  activeSession = null;
  clearActiveSession();
  
  // Update UI
  const sessionInactive = document.getElementById('session-inactive');
  const sessionActive = document.getElementById('session-active');
  
  if (sessionInactive) sessionInactive.style.display = 'block';
  if (sessionActive) {
    sessionActive.classList.add('hidden');
    sessionActive.style.display = 'none';
  }
  
  showNotification(`Attendance session ended for ${subjectName}`, 'info');
  console.log('Attendance session ended');
}

function updateSessionTimer() {
  const sessionDuration = document.getElementById('session-duration');
  if (!sessionDuration || !activeSession) return;
  
  const timeLeft = activeSession.expires - Date.now();
  
  if (timeLeft <= 0) {
    endAttendanceSession();
    return;
  }
  
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  sessionDuration.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  setTimeout(updateSessionTimer, 1000);
}

// Real-time Session Checking for Students
function startSessionChecking() {
  if (sessionCheckInterval) return;
  
  sessionCheckInterval = setInterval(() => {
    if (currentUserType === 'student') {
      checkForActiveSession();
    }
  }, APP_DATA.systemSettings.sessionCheckInterval);
  
  console.log('Session checking started');
}

function stopSessionChecking() {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
    console.log('Session checking stopped');
  }
}

function checkForActiveSession() {
  const session = getActiveSession();
  const alertElement = document.getElementById('active-session-alert');
  if (!alertElement) return;
 
  if (session) {
    // Check if the current student has already marked attendance
    const hasAttended = session.attendedStudents.includes(currentUser.id);
    const markButton = alertElement.querySelector('button');
 
    if (hasAttended) {
      // If already marked, hide the button
      markButton.style.display = 'none';
      document.getElementById('session-details').textContent = 'Your attendance has been marked.';
    } else {
      // Show the button if not yet marked
      markButton.style.display = 'flex';
      const timeLeft = Math.ceil((session.expires - Date.now()) / 60000);
      document.getElementById('session-details').textContent = `Time remaining: ${timeLeft} minutes`;
    }
 
    // Show active session alert
    const sessionSubject = document.getElementById('session-subject');
    if (sessionSubject) {
      sessionSubject.textContent = `${session.subjectName} - Attendance Open`;
    }
 
    alertElement.classList.remove('hidden');
    alertElement.style.display = 'block';
  } else {
    alertElement.classList.add('hidden');
    alertElement.style.display = 'none';
  }
}

function markAttendance() {
  if (!activeSession) {
    showNotification('No active session found', 'error');
    return;
  }
  
  // Check if student has already marked attendance for this session
  if (activeSession.attendedStudents.includes(currentUser.id)) {
    showNotification('You have already marked attendance for this class.', 'info');
    return;
  }
  
  // Simulate location check and attendance marking
  const success = Math.random() > 0.2; // 80% success rate
  
  if (success) {
    // Add the student's ID to the list of attended students
    activeSession.attendedStudents.push(currentUser.id);
    saveActiveSession(activeSession); // Save the updated session state
  
    showNotification('Attendance marked successfully!', 'success');
  
    // Hide the session alert for the current student
    const alertElement = document.getElementById('active-session-alert');
    if (alertElement) {
      alertElement.classList.add('hidden');
      alertElement.style.display = 'none';
    }
  
    // Update attendance stats (simulate)
    updateStudentAttendanceStats();
  
  } else {
    showNotification('Failed to mark attendance. Please ensure you are within the classroom range.', 'error');
  }
}

// Low Attendance Management
function checkLowAttendance(student) {
  const lowSubjects = [];
  
  for (const [subject, data] of Object.entries(student.subjectWiseAttendance)) {
    if (data.percentage < APP_DATA.systemSettings.lowAttendanceThreshold) {
      lowSubjects.push({
        subject: subject,
        percentage: data.percentage
      });
    }
  }
  
  return lowSubjects;
}

function showLowAttendanceAlert(student) {
  const alertElement = document.getElementById('low-attendance-alert');
  const messageElement = document.getElementById('low-attendance-message');
  
  if (!alertElement || !messageElement) return;
  
  const lowSubjects = checkLowAttendance(student);
  
  if (lowSubjects.length > 0) {
    const subjectList = lowSubjects.map(s => `${s.subject} (${s.percentage}%)`).join(', ');
    messageElement.textContent = `Low attendance in: ${subjectList}. Please attend more classes to avoid academic issues.`;
    
    alertElement.classList.remove('hidden');
    alertElement.style.display = 'flex';
  } else {
    alertElement.classList.add('hidden');
    alertElement.style.display = 'none';
  }
}

// Page Navigation
function navigateToPage(pageId) {
  console.log('Navigating to:', pageId);
  
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // Scroll to top when navigating
    window.scrollTo(0, 0);
    
    // Add entrance animation
    targetPage.style.opacity = '0';
    targetPage.style.transform = 'translateY(20px)';
    
    // Trigger animation
    requestAnimationFrame(() => {
      targetPage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      targetPage.style.opacity = '1';
      targetPage.style.transform = 'translateY(0)';
    });
    
    // Clear transition after animation
    setTimeout(() => {
      targetPage.style.transition = '';
      targetPage.style.transform = '';
    }, 300);
    
    // Initialize page-specific functionality
    if (pageId === 'student-dashboard' && currentUserType === 'student') {
      populateStudentDashboard();
    } else if (pageId === 'faculty-dashboard' && currentUserType === 'faculty') {
      populateFacultyDashboard();
    }
  } else {
    console.error('Page not found:', pageId);
  }
}

// Password Toggle Functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.parentElement.querySelector('.password-toggle i');
  
  if (input && toggle) {
    if (input.type === 'password') {
      input.type = 'text';
      toggle.classList.remove('fa-eye');
      toggle.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      toggle.classList.remove('fa-eye-slash');
      toggle.classList.add('fa-eye');
    }
  }
}

// Handle Login Form Submissions
function handleLogin(event, userType) {
  event.preventDefault();
  console.log('Handling login for:', userType);
  
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton.innerHTML;
  
  // Show loading state
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="loading"></span> Logging in...';
  
  // Get form data
  const textInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const id = textInput ? textInput.value : '';
  const password = passwordInput ? passwordInput.value : '';
  
  console.log('Form data:', { id, password });
  
  // Simulate login process
  setTimeout(() => {
    // Reset button state
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonContent;
    
    // Simple validation
    if (id && password) {
      let user = null;
      
      // Find user in appropriate data array
      if (userType === 'student') {
        user = APP_DATA.students.find(s => s.id === id);
      } else if (userType === 'faculty') {
        user = APP_DATA.faculty.find(f => f.id === id);
      } else {
        // Admin login - use default admin
        user = { id: 'admin', name: 'Administrator' };
      }
      
      if (user) {
        currentUser = user;
        currentUserType = userType;
        saveSession(user, userType);
        
        showNotification('Login successful!', 'success');
        
        // Redirect based on user type
        setTimeout(() => {
          if (userType === 'student') {
            navigateToPage('student-dashboard');
            startSessionChecking();
          } else if (userType === 'faculty') {
            navigateToPage('faculty-dashboard');
          } else if (userType === 'admin') {
            navigateToPage('admin-dashboard');
          }
        }, 500);
      } else {
        showNotification('Invalid credentials', 'error');
      }
    } else {
      showNotification('Please fill in all fields', 'error');
    }
  }, 1500);
}

// Populate Student Dashboard
function populateStudentDashboard() {
  if (!currentUser || currentUserType !== 'student') return;
  
  // Update welcome message
  const welcomeElement = document.getElementById('student-welcome');
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome back, ${currentUser.name}!`;
  }
  
  // Update attendance stats
  const attendedElement = document.getElementById('attended-classes');
  const totalElement = document.getElementById('total-classes');
  const rateElement = document.getElementById('attendance-rate');
  
  if (attendedElement) attendedElement.textContent = currentUser.attendanceStats.attended;
  if (totalElement) totalElement.textContent = currentUser.attendanceStats.totalClasses;
  if (rateElement) {
    rateElement.textContent = `${currentUser.attendanceStats.percentage}%`;
    // Change color based on attendance rate
    rateElement.className = currentUser.attendanceStats.percentage >= 75 ? 
      'stat-number status--success' : 'stat-number status--warning';
  }
  
  // Populate subject-wise attendance
  const subjectContainer = document.getElementById('subject-attendance');
  if (subjectContainer) {
    let html = '';
    for (const [subject, data] of Object.entries(currentUser.subjectWiseAttendance)) {
      const isLow = data.percentage < APP_DATA.systemSettings.lowAttendanceThreshold;
      html += `
        <div class="subject-item ${isLow ? 'low-attendance' : ''}">
          <div class="subject-info ${isLow ? 'low-attendance' : ''}">
            <h4>${subject}</h4>
            <p>${data.attended}/${data.totalClasses} classes attended</p>
          </div>
          <div class="subject-percentage ${isLow ? 'low' : ''}">${data.percentage}%</div>
        </div>
      `;
    }
    subjectContainer.innerHTML = html;
  }
  
  // Show low attendance alert if needed
  showLowAttendanceAlert(currentUser);
  
  // Check for active sessions
  checkForActiveSession();
}

// Populate Faculty Dashboard
function populateFacultyDashboard() {
  if (!currentUser || currentUserType !== 'faculty') return;
  
  // Update welcome message
  const welcomeElement = document.getElementById('faculty-welcome');
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome back, ${currentUser.name}!`;
  }
  
  // Populate students list
  refreshStudentsList();
  
  // Check if there's an active session to restore
  const session = getActiveSession();
  if (session) {
    activeSession = session;
    const sessionInactive = document.getElementById('session-inactive');
    const sessionActive = document.getElementById('session-active');
    const activeSubject = document.getElementById('active-subject');
    const sessionStartTime = document.getElementById('session-start-time');
    
    if (sessionInactive) sessionInactive.style.display = 'none';
    if (sessionActive) {
      sessionActive.classList.remove('hidden');
      sessionActive.style.display = 'block';
    }
    if (activeSubject) activeSubject.textContent = session.subjectName;
    if (sessionStartTime) {
      sessionStartTime.textContent = new Date(session.startTime).toLocaleTimeString();
    }
    
    updateSessionTimer();
  }
}

function refreshStudentsList() {
  const studentsContainer = document.getElementById('students-list');
  const lowAttendanceContainer = document.getElementById('low-attendance-students');
  if (!studentsContainer) return;
  
  // Get the current active session to check who has marked attendance
  const currentSession = getActiveSession();
  const attendedStudents = currentSession ? currentSession.attendedStudents : [];
 
  let studentsHtml = '';
  let lowAttendanceHtml = '';
  let atRiskCount = 0;
  let presentCount = 0;
  const totalStudents = APP_DATA.students.length;
 
  APP_DATA.students.forEach(student => {
    const hasAttended = attendedStudents.includes(student.id);
    const hasLowAttendance = checkLowAttendance(student).length > 0;
    const isAtRisk = hasLowAttendance || student.attendanceStats.percentage < APP_DATA.systemSettings.lowAttendanceThreshold;
 
    if (isAtRisk) {
      atRiskCount++;
    }
    if (hasAttended) {
      presentCount++;
    }
    studentsHtml += `
      <div class="student-item ${hasAttended ? 'attended' : (isAtRisk ? 'low-attendance' : '')}">
        <div class="student-info">
          <h4>${student.name}</h4>
          <p>ID: ${student.id} • Overall: ${student.attendanceStats.percentage}%</p>
        </div>
        <div class="student-status">
          <div class="status-indicator ${hasAttended ? 'present' : (isAtRisk ? 'at-risk' : 'good')}"></div>
          ${hasAttended ? 'Present' : (isAtRisk ? 'At Risk' : 'Good Standing')}
        </div>
      </div>
    `;
 
    if (isAtRisk) {
      const lowSubjects = checkLowAttendance(student);
      const subjectList = lowSubjects.map(s => `${s.subject}: ${s.percentage}%`).join(', ');
 
      lowAttendanceHtml += `
        <div class="student-item low-attendance">
          <div class="student-info">
            <h4>${student.name}</h4>
            <p>Low attendance subjects: ${subjectList || 'Overall attendance low'}</p>
          </div>
          <div class="student-status">
            <div class="status-indicator at-risk"></div>
            Needs Attention
          </div>
        </div>
      `;
    }
  });
  
  studentsContainer.innerHTML = studentsHtml;
  
  if (lowAttendanceContainer) {
    if (lowAttendanceHtml) {
      lowAttendanceContainer.innerHTML = lowAttendanceHtml;
    } else {
      lowAttendanceContainer.innerHTML = `
        <div style="text-align: center; color: var(--color-text-secondary); padding: var(--space-20);">
          <i class="fas fa-check-circle" style="color: var(--color-success); font-size: var(--font-size-3xl); margin-bottom: var(--space-12);"></i>
          <p>All students have good attendance!</p>
        </div>
      `;
    }
  }
  
  // Update at-risk count
  const atRiskCountElement = document.getElementById('at-risk-count');
  if (atRiskCountElement) {
    atRiskCountElement.textContent = atRiskCount;
    atRiskCountElement.className = atRiskCount > 0 ? 'stat-number status--warning' : 'stat-number status--success';
  }
 
  // Update attendance overview stats for faculty dashboard (optional, but good practice)
  const totalStudentsElement = document.querySelector('.class-overview-card .stat-number');
  const avgAttendanceElement = document.querySelector('.class-overview-card .stat-number.status--success');
  if (totalStudentsElement) {
    totalStudentsElement.textContent = totalStudents;
  }
  if (avgAttendanceElement) {
    const avgPercentage = totalStudents > 0 ? (presentCount / totalStudents * 100).toFixed(1) : 0;
    avgAttendanceElement.textContent = `${avgPercentage}%`;
  }
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="closeNotification(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add notification styles if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 24px;
        right: 24px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-20);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-16);
        min-width: 320px;
        max-width: 420px;
        animation: slideIn 0.3s ease;
        font-size: var(--font-size-base);
      }
      
      .notification--success {
        border-left: 4px solid var(--color-success);
      }
      
      .notification--error {
        border-left: 4px solid var(--color-error);
      }
      
      .notification--info {
        border-left: 4px solid var(--color-info);
      }
      
      .notification--warning {
        border-left: 4px solid var(--color-warning);
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-12);
        flex: 1;
      }
      
      .notification-content i {
        font-size: var(--font-size-lg);
        flex-shrink: 0;
      }
      
      .notification--success .notification-content i {
        color: var(--color-success);
      }
      
      .notification--error .notification-content i {
        color: var(--color-error);
      }
      
      .notification--info .notification-content i {
        color: var(--color-info);
      }
      
      .notification--warning .notification-content i {
        color: var(--color-warning);
      }
      
      .notification-close {
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--space-8);
        border-radius: var(--radius-sm);
        transition: all var(--duration-fast) var(--ease-standard);
        font-size: var(--font-size-base);
        flex-shrink: 0;
      }
      
      .notification-close:hover {
        background: var(--color-secondary);
        color: var(--color-text);
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      @media (max-width: 480px) {
        .notification {
          right: 12px;
          left: 12px;
          min-width: auto;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add notification to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      closeNotification(notification.querySelector('.notification-close'));
    }
  }, 5000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success':
      return 'fa-check-circle';
    case 'error':
      return 'fa-exclamation-circle';
    case 'warning':
      return 'fa-exclamation-triangle';
    case 'info':
    default:
      return 'fa-info-circle';
  }
}

function closeNotification(button) {
  const notification = button.closest('.notification');
  if (notification) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }
}

// Enhanced Card Interactions
function setupCardInteractions() {
  const userCards = document.querySelectorAll('.user-card');
  
  userCards.forEach((card) => {
    // Remove existing onclick handlers to prevent conflicts
    card.removeAttribute('onclick');
    
    // Add keyboard support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    // Add click event listener based on the card type
    card.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const cardText = card.querySelector('h3').textContent;
      
      if (cardText.includes('Faculty')) {
        navigateToPage('faculty-login');
      } else if (cardText.includes('Student')) {
        navigateToPage('student-login');
      } else if (cardText.includes('Admin')) {
        navigateToPage('admin-login');
      }
    });
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    
    // Enhanced hover effects
    card.addEventListener('mouseenter', function() {
      const arrow = card.querySelector('.card-arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(6px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const arrow = card.querySelector('.card-arrow');
      if (arrow) {
        arrow.style.transform = '';
      }
    });
  });
}

// Setup form handlers
function setupFormHandlers() {
  const forms = document.querySelectorAll('.auth-form');
  
  forms.forEach(form => {
    // Remove existing onsubmit to prevent conflicts
    form.removeAttribute('onsubmit');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Determine user type based on form location
      let userType = 'student';
      if (form.closest('#faculty-login')) {
        userType = 'faculty';
      } else if (form.closest('#admin-login')) {
        userType = 'admin';
      }
      
      handleLogin(e, userType);
    });
  });
}

// Setup back button handlers
function setupBackButtons() {
  const backButtons = document.querySelectorAll('.back-btn');
  
  backButtons.forEach(button => {
    // Remove existing onclick to prevent conflicts
    button.removeAttribute('onclick');
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (button.textContent.includes('Logout')) {
        logout();
      } else {
        navigateToPage('home-page');
      }
    });
  });
}

// Setup action button handlers
function setupActionButtons() {
  // Setup attendance session buttons
  setTimeout(() => {
    const startSessionBtn = document.querySelector('button[onclick="startAttendanceSession()"]');
    if (startSessionBtn) {
      startSessionBtn.removeAttribute('onclick');
      startSessionBtn.addEventListener('click', startAttendanceSession);
    }
    
    const endSessionBtn = document.querySelector('button[onclick="endAttendanceSession()"]');
    if (endSessionBtn) {
      endSessionBtn.removeAttribute('onclick');
      endSessionBtn.addEventListener('click', endAttendanceSession);
    }
    
    const markAttendanceBtn = document.querySelector('button[onclick="markAttendance()"]');
    if (markAttendanceBtn) {
      markAttendanceBtn.removeAttribute('onclick');
      markAttendanceBtn.addEventListener('click', markAttendance);
    }
    
    const refreshBtn = document.querySelector('button[onclick="refreshStudentsList()"]');
    if (refreshBtn) {
      refreshBtn.removeAttribute('onclick');
      refreshBtn.addEventListener('click', refreshStudentsList);
    }
  }, 100);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('SmartAttend application initializing...');
  
  // Setup all interaction handlers
  setupCardInteractions();
  setupFormHandlers();
  setupBackButtons();
  setupActionButtons();
  
  // Check for existing session
  const existingSession = restoreSession();
  if (existingSession) {
    currentUser = existingSession.user;
    currentUserType = existingSession.userType;
    
    console.log('Existing session found:', existingSession);
    
    // Auto-login based on session
    setTimeout(() => {
      if (existingSession.userType === 'student') {
        navigateToPage('student-dashboard');
        startSessionChecking();
      } else if (existingSession.userType === 'faculty') {
        navigateToPage('faculty-dashboard');
      } else if (existingSession.userType === 'admin') {
        navigateToPage('admin-dashboard');
      }
    }, 100);
  } else {
    // Ensure home page is visible initially
    const homePage = document.getElementById('home-page');
    if (homePage && !homePage.classList.contains('active')) {
      homePage.classList.add('active');
    }
  }
  
  // Show welcome message if not auto-logged in
  if (!existingSession) {
    setTimeout(() => {
      showNotification('Welcome to SmartAttend! 🎓', 'info');
    }, 1500);
  }
  
  console.log('SmartAttend application initialized successfully!');
});

// Enhanced error handling
window.addEventListener('error', function(e) {
  console.error('Application error:', e.error);
  showNotification('An unexpected error occurred. Please try again.', 'error');
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Handle page visibility changes to manage session checking
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    console.log('Page hidden');
  } else {
    console.log('Page visible');
    if (currentUserType === 'student') {
      checkForActiveSession();
    }
  }
});

// Handle beforeunload to save any pending data
window.addEventListener('beforeunload', function(e) {
  if (currentUser && currentUserType) {
    saveSession(currentUser, currentUserType);
  }
});

console.log('SmartAttend script loaded successfully!');