const fs = require('fs');
const path = require('path');

function generateTimesheetData() {
  const fakeData = [];
  const today = new Date();
  const tasks = [
    'Frontend Development',
    'Backend API Work',
    'Database Design',
    'Testing & QA',
    'Code Review',
    'Client Meeting',
    'Documentation',
    'Bug Fixes',
    'UI/UX Design',
    'Performance Optimization'
  ];
  const statuses = ['draft', 'submitted', 'approved', 'rejected'];

  for (let i = 0; i < 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    fakeData.push({
      _id: `timesheet_${i}`,
      employeeId: `emp_${Math.floor(Math.random() * 5) + 1}`,
      projectId: `proj_${Math.floor(Math.random() * 3) + 1}`,
      organizationId: 'org_1',
      date: date.toISOString(),
      totalHours: Math.floor(Math.random() * 8) + 1,
      description: tasks[Math.floor(Math.random() * tasks.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      billable: Math.random() > 0.3,
      startTime: '09:00',
      endTime: `${9 + Math.floor(Math.random() * 8)}:00`,
      createdAt: new Date().toISOString(),
    });
  }

  const filePath = path.join(__dirname, '../data/timesheet-data.json');
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(fakeData, null, 2));
  console.log(`Generated ${fakeData.length} timesheet entries in ${filePath}`);
}

generateTimesheetData();