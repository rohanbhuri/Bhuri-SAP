const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');

// Load config from root directory
const { getConfig } = require(path.join(__dirname, '../../../config.js'));

class DemoSeeder {
  constructor(projectName) {
    this.projectName = projectName || 'beax-rm';
    this.config = getConfig(this.projectName);
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      this.client = new MongoClient(this.config.database.MONGODB_URI);
      await this.client.connect();
      
      // Extract database name from URI
      const dbName = this.config.database.MONGODB_URI.split('/')[3].split('?')[0];
      this.db = this.client.db(dbName);
      
      console.log(`✅ Connected to ${this.projectName} database: ${dbName}`);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Database connection closed');
    }
  }

  async clearCollections() {
    const collections = ['users', 'organizations', 'roles', 'permissions', 'modules', 'departments', 'projects', 'contacts', 'leads', 'deals', 'tasks', 'employees', 'conversations', 'messages', 'attendancerecords', 'leaverequests', 'goals', 'payrollruns', 'complianceitems', 'complianceevents', 'documentrecords', 'assets'];
    
    for (const collectionName of collections) {
      try {
        await this.db.collection(collectionName).deleteMany({});
        console.log(`🗑️ Cleared ${collectionName} collection`);
      } catch (error) {
        console.log(`⚠️ Collection ${collectionName} doesn't exist or couldn't be cleared`);
      }
    }
  }

  async seedPermissions() {
    const permissions = this.getPermissionsForProject();
    
    if (permissions.length > 0) {
      await this.db.collection('permissions').insertMany(permissions);
      console.log(`📋 Seeded ${permissions.length} permissions`);
    }
  }

  async seedRoles() {
    const roles = this.getRolesForProject();
    
    if (roles.length > 0) {
      await this.db.collection('roles').insertMany(roles);
      console.log(`👥 Seeded ${roles.length} roles`);
    }
  }

  async seedModules() {
    const modules = this.getModulesForProject();
    
    if (modules.length > 0) {
      await this.db.collection('modules').insertMany(modules);
      console.log(`🧩 Seeded ${modules.length} modules`);
    }
  }

  async seedOrganizations() {
    const organizations = this.getOrganizationsForProject();
    
    if (organizations.length > 0) {
      await this.db.collection('organizations').insertMany(organizations);
      console.log(`🏢 Seeded ${organizations.length} organizations`);
    }
  }

  async seedUsers() {
    const users = await this.getUsersForProject();
    
    if (users.length > 0) {
      await this.db.collection('users').insertMany(users);
      console.log(`👤 Seeded ${users.length} users`);
    }
  }

  async seedDepartments() {
    const departments = this.getDepartmentsForProject();
    
    if (departments.length > 0) {
      await this.db.collection('departments').insertMany(departments);
      console.log(`🏛️ Seeded ${departments.length} departments`);
    }
  }

  async seedFakeData() {
    await this.seedContacts();
    await this.seedProjects();
    await this.seedLeads();
    await this.seedDeals();
    await this.seedTasks();
    await this.seedMessages();
    await this.seedHRData();
  }

  async activateModulesForSuperAdmins() {
    const modules = await this.db.collection('modules').find({}).toArray();
    const moduleIds = modules.map(m => m._id);
    
    const superAdminRoles = await this.db.collection('roles').find({ 
      type: 'super_admin' 
    }).toArray();
    
    const superAdminRoleIds = superAdminRoles.map(r => r._id);
    
    // Activate modules for super admin users
    await this.db.collection('users').updateMany(
      { roleIds: { $in: superAdminRoleIds } },
      { $set: { activeModuleIds: moduleIds } }
    );
    
    // Activate modules for all organizations
    await this.db.collection('organizations').updateMany(
      {},
      { $set: { activeModuleIds: moduleIds } }
    );
    
    console.log(`🔓 Activated all modules for super admins and organizations`);
  }

  async seedContacts() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const contacts = [];
    
    const fakeContacts = [
      { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '+1-555-1001', company: 'Tech Solutions Inc', position: 'CEO' },
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', phone: '+1-555-1002', company: 'Digital Innovations', position: 'CTO' },
      { firstName: 'Mike', lastName: 'Brown', email: 'mike.brown@example.com', phone: '+1-555-1003', company: 'StartUp Ventures', position: 'Founder' },
      { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com', phone: '+1-555-1004', company: 'Enterprise Corp', position: 'VP Sales' },
      { firstName: 'David', lastName: 'Wilson', email: 'david.wilson@example.com', phone: '+1-555-1005', company: 'Global Systems', position: 'Director' }
    ];
    
    for (const org of organizations) {
      for (let i = 0; i < fakeContacts.length; i++) {
        const contact = fakeContacts[i];
        contacts.push({
          ...contact,
          _id: new ObjectId(),
          email: contact.email.replace('@example.com', `+${org.code.toLowerCase()}@example.com`),
          organizationId: org._id,
          status: 'active',
          notes: `Contact from ${contact.company}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (contacts.length > 0) {
      await this.db.collection('contacts').insertMany(contacts);
      console.log(`📞 Seeded ${contacts.length} contacts`);
    }
  }

  async seedProjects() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const users = await this.db.collection('users').find({}).toArray();
    const contacts = await this.db.collection('contacts').find({}).toArray();
    const projects = [];
    
    const projectTemplates = [
      { name: 'Website Redesign', description: 'Complete website overhaul with modern design', budget: 50000, status: 'active' },
      { name: 'Mobile App Development', description: 'Native mobile application for iOS and Android', budget: 75000, status: 'planning' },
      { name: 'CRM Integration', description: 'Integrate existing CRM with new systems', budget: 30000, status: 'completed' },
      { name: 'Data Migration', description: 'Migrate legacy data to new platform', budget: 25000, status: 'on-hold' },
      { name: 'Security Audit', description: 'Comprehensive security assessment', budget: 15000, status: 'active' }
    ];
    
    for (const org of organizations) {
      for (let i = 0; i < projectTemplates.length; i++) {
        const template = projectTemplates[i];
        const manager = users.find(u => u.organizationIds.includes(org._id));
        const client = contacts.find(c => c.organizationId.equals(org._id));
        
        projects.push({
          _id: new ObjectId(),
          organizationId: org._id,
          createdBy: manager?._id || users[0]._id,
          name: template.name,
          description: template.description,
          code: `PRJ-${org.code}-${String(i + 1).padStart(3, '0')}`,
          status: template.status,
          stage: 'execution',
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000),
          budget: template.budget,
          currency: 'USD',
          spent: Math.floor(template.budget * Math.random() * 0.7),
          billingType: 'fixed',
          managerId: manager?._id,
          clientId: client?._id,
          teamMemberIds: users.filter(u => u.organizationIds.includes(org._id)).map(u => u._id).slice(0, 3),
          progress: Math.floor(Math.random() * 100),
          health: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
          tags: ['web', 'mobile', 'backend'][Math.floor(Math.random() * 3)],
          customFields: {},
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (projects.length > 0) {
      await this.db.collection('projects').insertMany(projects);
      console.log(`📁 Seeded ${projects.length} projects`);
    }
  }

  async seedLeads() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const contacts = await this.db.collection('contacts').find({}).toArray();
    const users = await this.db.collection('users').find({}).toArray();
    const leads = [];
    
    const leadTemplates = [
      { title: 'Enterprise Software Solution', estimatedValue: 100000, source: 'Website' },
      { title: 'Digital Transformation Project', estimatedValue: 150000, source: 'Referral' },
      { title: 'Cloud Migration Services', estimatedValue: 80000, source: 'Cold Call' },
      { title: 'Custom Application Development', estimatedValue: 120000, source: 'Trade Show' },
      { title: 'IT Consulting Services', estimatedValue: 60000, source: 'LinkedIn' }
    ];
    
    for (const org of organizations) {
      for (const template of leadTemplates) {
        const contact = contacts.find(c => c.organizationId.equals(org._id));
        const assignedUser = users.find(u => u.organizationIds.includes(org._id));
        
        leads.push({
          _id: new ObjectId(),
          title: template.title,
          description: `Potential ${template.title.toLowerCase()} opportunity`,
          status: ['new', 'qualified', 'contacted'][Math.floor(Math.random() * 3)],
          estimatedValue: template.estimatedValue,
          source: template.source,
          expectedCloseDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
          contactId: contact?._id,
          organizationId: org._id,
          assignedToId: assignedUser?._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (leads.length > 0) {
      await this.db.collection('leads').insertMany(leads);
      console.log(`🎯 Seeded ${leads.length} leads`);
    }
  }

  async seedDeals() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const contacts = await this.db.collection('contacts').find({}).toArray();
    const leads = await this.db.collection('leads').find({}).toArray();
    const users = await this.db.collection('users').find({}).toArray();
    const deals = [];
    
    const dealTemplates = [
      { title: 'Enterprise Software License', value: 250000, stage: 'proposal', probability: 75 },
      { title: 'Cloud Infrastructure Setup', value: 180000, stage: 'negotiation', probability: 60 },
      { title: 'Digital Transformation Consulting', value: 320000, stage: 'qualification', probability: 40 },
      { title: 'Custom Application Development', value: 150000, stage: 'prospecting', probability: 25 },
      { title: 'IT Support Services Contract', value: 90000, stage: 'closed-won', probability: 100 },
      { title: 'Data Analytics Platform', value: 200000, stage: 'closed-lost', probability: 0 },
      { title: 'Mobile App Development', value: 120000, stage: 'proposal', probability: 70 },
      { title: 'Security Audit Services', value: 75000, stage: 'negotiation', probability: 80 }
    ];
    
    for (const org of organizations) {
      for (const template of dealTemplates) {
        const contact = contacts.find(c => c.organizationId.equals(org._id));
        const lead = leads.find(l => l.organizationId.equals(org._id));
        const assignedUser = users.find(u => u.organizationIds.includes(org._id));
        
        deals.push({
          _id: new ObjectId(),
          title: template.title,
          description: `${template.title} opportunity for ${org.name}`,
          value: template.value,
          stage: template.stage,
          probability: template.probability,
          expectedCloseDate: new Date(Date.now() + Math.random() * 120 * 24 * 60 * 60 * 1000),
          actualCloseDate: template.stage.includes('closed') ? new Date() : null,
          contactId: contact?._id,
          leadId: lead?._id,
          organizationId: org._id,
          assignedToId: assignedUser?._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (deals.length > 0) {
      await this.db.collection('deals').insertMany(deals);
      console.log(`🤝 Seeded ${deals.length} deals`);
    }
  }

  async seedTasks() {
    const projects = await this.db.collection('projects').find({}).toArray();
    const users = await this.db.collection('users').find({}).toArray();
    const deals = await this.db.collection('deals').find({}).toArray();
    const tasks = [];
    
    const taskTemplates = [
      { title: 'Requirements Analysis', description: 'Analyze and document requirements', type: 'crm' },
      { title: 'Design Mockups', description: 'Create design mockups and wireframes', type: 'crm' },
      { title: 'Backend Development', description: 'Develop backend APIs and services', type: 'crm' },
      { title: 'Frontend Implementation', description: 'Implement user interface', type: 'crm' },
      { title: 'Testing & QA', description: 'Perform testing and quality assurance', type: 'crm' },
      { title: 'Deployment', description: 'Deploy to production environment', type: 'crm' },
      { title: 'Follow up with client', description: 'Schedule follow-up call with potential client', type: 'crm' },
      { title: 'Prepare proposal', description: 'Create detailed project proposal', type: 'crm' },
      { title: 'Contract negotiation', description: 'Negotiate contract terms and conditions', type: 'crm' }
    ];
    
    // Project tasks
    for (const project of projects) {
      for (let i = 0; i < Math.min(6, taskTemplates.length); i++) {
        const template = taskTemplates[i];
        const assignee = users.find(u => project.teamMemberIds.includes(u._id));
        
        tasks.push({
          _id: new ObjectId(),
          title: template.title,
          description: template.description,
          status: ['todo', 'in-progress', 'completed'][Math.floor(Math.random() * 3)],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          type: 'project',
          projectId: project._id,
          assigneeId: assignee?._id,
          organizationId: project.organizationId,
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          estimatedHours: Math.floor(Math.random() * 40) + 8,
          actualHours: Math.floor(Math.random() * 30),
          tags: ['development', 'design', 'testing'][Math.floor(Math.random() * 3)],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // CRM tasks
    for (const deal of deals) {
      const crmTasks = taskTemplates.filter(t => t.type === 'crm').slice(0, 3);
      for (const template of crmTasks) {
        const assignee = users.find(u => u.organizationIds.some(id => id.equals(deal.organizationId)));
        
        tasks.push({
          _id: new ObjectId(),
          title: template.title,
          description: template.description,
          status: ['pending', 'in-progress', 'completed'][Math.floor(Math.random() * 3)],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          type: 'crm',
          dealId: deal._id,
          leadId: deal.leadId,
          contactId: deal.contactId,
          organizationId: deal.organizationId,
          assignedToId: assignee?._id,
          dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
          reminderDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (tasks.length > 0) {
      await this.db.collection('tasks').insertMany(tasks);
      console.log(`✅ Seeded ${tasks.length} tasks`);
    }
  }

  async seedMessages() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const users = await this.db.collection('users').find({}).toArray();
    
    if (organizations.length === 0 || users.length < 2) {
      console.log('⚠️ Not enough organizations or users for messages seeding');
      return;
    }

    const conversations = [];
    const messages = [];

    for (const org of organizations) {
      const orgUsers = users.filter(u => u.organizationIds.some(id => id.equals(org._id)));
      
      if (orgUsers.length < 2) continue;

      // Create DM conversations between users
      for (let i = 0; i < orgUsers.length - 1; i++) {
        for (let j = i + 1; j < Math.min(i + 3, orgUsers.length); j++) {
          const user1 = orgUsers[i];
          const user2 = orgUsers[j];
          
          const conversationId = new ObjectId();
          conversations.push({
            _id: conversationId,
            organizationId: org._id,
            type: 'dm',
            memberIds: [user1._id, user2._id],
            lastMessagePreview: [],
            createdAt: new Date()
          });

          // Add sample messages
          const sampleMessages = [
            { sender: user1, content: `Hey ${user2.firstName}! How are you doing?` },
            { sender: user2, content: `Hi ${user1.firstName}! I'm doing great, thanks for asking. How about you?` },
            { sender: user1, content: 'I\'m good too! Just working on some new features for our system.' },
            { sender: user2, content: 'That sounds exciting! Can\'t wait to see what you\'ve built.' }
          ];

          for (let k = 0; k < sampleMessages.length; k++) {
            const msgData = sampleMessages[k];
            const messageId = new ObjectId();
            
            messages.push({
              _id: messageId,
              conversationId: conversationId,
              organizationId: org._id,
              senderId: msgData.sender._id,
              content: msgData.content,
              readBy: [msgData.sender._id],
              reactions: [],
              createdAt: new Date(Date.now() - (sampleMessages.length - k) * 60000) // 1 minute apart
            });
          }

          // Update conversation with last message preview
          const lastMessage = sampleMessages[sampleMessages.length - 1];
          conversations[conversations.length - 1].lastMessagePreview = [{
            senderId: lastMessage.sender._id,
            content: lastMessage.content.slice(0, 120),
            at: new Date()
          }];
        }
      }

      // Create a group conversation if there are enough users
      if (orgUsers.length >= 3) {
        const groupConversationId = new ObjectId();
        const groupMembers = orgUsers.slice(0, Math.min(5, orgUsers.length));
        
        conversations.push({
          _id: groupConversationId,
          organizationId: org._id,
          type: 'group',
          name: `${org.name} Team Chat`,
          memberIds: groupMembers.map(u => u._id),
          lastMessagePreview: [],
          createdAt: new Date()
        });

        // Add group messages
        const groupMessages = [
          { sender: groupMembers[0], content: `Welcome to our ${org.name} team chat!` },
          { sender: groupMembers[1], content: 'Thanks for setting this up!' },
          { sender: groupMembers[2], content: 'Great to be part of the team! 🎉' }
        ];

        for (let k = 0; k < groupMessages.length; k++) {
          const msgData = groupMessages[k];
          const messageId = new ObjectId();
          
          messages.push({
            _id: messageId,
            conversationId: groupConversationId,
            organizationId: org._id,
            senderId: msgData.sender._id,
            content: msgData.content,
            readBy: [msgData.sender._id],
            reactions: [],
            createdAt: new Date(Date.now() - (groupMessages.length - k) * 120000) // 2 minutes apart
          });
        }

        // Update group conversation with last message preview
        const lastGroupMessage = groupMessages[groupMessages.length - 1];
        conversations[conversations.length - 1].lastMessagePreview = [{
          senderId: lastGroupMessage.sender._id,
          content: lastGroupMessage.content.slice(0, 120),
          at: new Date()
        }];
      }
    }

    if (conversations.length > 0) {
      await this.db.collection('conversations').insertMany(conversations);
      console.log(`💬 Seeded ${conversations.length} conversations`);
    }

    if (messages.length > 0) {
      await this.db.collection('messages').insertMany(messages);
      console.log(`📨 Seeded ${messages.length} messages`);
    }
  }

  async seedHRData() {
    await this.seedEmployees();
    await this.seedAttendanceRecords();
    await this.seedLeaveRequests();
    await this.seedGoals();
    await this.seedPayrollRuns();
    await this.seedComplianceItems();
    await this.seedDocumentRecords();
    await this.seedAssets();
  }

  async seedEmployees() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const departments = await this.db.collection('departments').find({}).toArray();
    const employees = [];
    
    const employeeTemplates = [
      { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@company.com', position: 'Software Engineer', salary: 85000, status: 'active' },
      { firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@company.com', position: 'Product Manager', salary: 95000, status: 'active' },
      { firstName: 'Carol', lastName: 'Davis', email: 'carol.davis@company.com', position: 'UX Designer', salary: 75000, status: 'active' },
      { firstName: 'David', lastName: 'Wilson', email: 'david.wilson@company.com', position: 'DevOps Engineer', salary: 90000, status: 'active' },
      { firstName: 'Emma', lastName: 'Brown', email: 'emma.brown@company.com', position: 'QA Engineer', salary: 70000, status: 'active' },
      { firstName: 'Frank', lastName: 'Miller', email: 'frank.miller@company.com', position: 'Sales Manager', salary: 80000, status: 'inactive' },
      { firstName: 'Grace', lastName: 'Taylor', email: 'grace.taylor@company.com', position: 'HR Specialist', salary: 65000, status: 'active' },
      { firstName: 'Henry', lastName: 'Anderson', email: 'henry.anderson@company.com', position: 'Marketing Manager', salary: 78000, status: 'active' }
    ];
    
    for (const org of organizations) {
      const orgDepartments = departments.filter(d => d.organizationId?.equals(org._id) || !d.organizationId);
      
      for (let i = 0; i < employeeTemplates.length; i++) {
        const template = employeeTemplates[i];
        const department = orgDepartments[i % orgDepartments.length];
        
        employees.push({
          _id: new ObjectId(),
          employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
          firstName: template.firstName,
          lastName: template.lastName,
          email: template.email.replace('@company.com', `@${org.code.toLowerCase()}.com`),
          position: template.position,
          department: department?.name || 'General',
          salary: template.salary,
          status: template.status,
          hireDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          organizationId: org._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (employees.length > 0) {
      await this.db.collection('employees').insertMany(employees);
      console.log(`👥 Seeded ${employees.length} employees`);
    }
  }

  async seedAttendanceRecords() {
    const employees = await this.db.collection('employees').find({ status: 'active' }).toArray();
    const attendanceRecords = [];
    
    for (const employee of employees) {
      // Generate attendance for last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const checkInTime = new Date(date);
        checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const checkOutTime = new Date(checkInTime);
        checkOutTime.setHours(checkInTime.getHours() + 8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        
        attendanceRecords.push({
          _id: new ObjectId(),
          employeeId: employee.employeeId,
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          checkIn: checkInTime,
          checkOut: checkOutTime,
          totalHours: Math.round(totalHours * 100) / 100,
          organizationId: employee.organizationId,
          createdAt: new Date()
        });
      }
    }
    
    if (attendanceRecords.length > 0) {
      await this.db.collection('attendancerecords').insertMany(attendanceRecords);
      console.log(`⏰ Seeded ${attendanceRecords.length} attendance records`);
    }
  }

  async seedLeaveRequests() {
    const employees = await this.db.collection('employees').find({ status: 'active' }).toArray();
    const leaveRequests = [];
    
    const leaveTypes = ['casual', 'sick', 'earned'];
    const statuses = ['pending', 'approved', 'rejected'];
    
    for (const employee of employees) {
      // Generate 2-4 leave requests per employee
      const numRequests = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numRequests; i++) {
        const startDate = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + (1 + Math.floor(Math.random() * 4)) * 24 * 60 * 60 * 1000);
        
        leaveRequests.push({
          _id: new ObjectId(),
          employeeId: employee.employeeId,
          startDate: startDate,
          endDate: endDate,
          leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
          reason: `${leaveTypes[Math.floor(Math.random() * leaveTypes.length)]} leave request`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          organizationId: employee.organizationId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (leaveRequests.length > 0) {
      await this.db.collection('leaverequests').insertMany(leaveRequests);
      console.log(`🏖️ Seeded ${leaveRequests.length} leave requests`);
    }
  }

  async seedGoals() {
    const employees = await this.db.collection('employees').find({ status: 'active' }).toArray();
    const goals = [];
    
    const goalTemplates = [
      'Complete React certification',
      'Improve code review turnaround time',
      'Lead a cross-functional project',
      'Mentor junior developers',
      'Implement automated testing',
      'Optimize application performance',
      'Learn new technology stack',
      'Improve customer satisfaction scores'
    ];
    
    for (const employee of employees) {
      // Generate 2-3 goals per employee
      const numGoals = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numGoals; i++) {
        goals.push({
          _id: new ObjectId(),
          employeeId: employee.employeeId,
          title: goalTemplates[Math.floor(Math.random() * goalTemplates.length)],
          progress: Math.floor(Math.random() * 101),
          organizationId: employee.organizationId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (goals.length > 0) {
      await this.db.collection('goals').insertMany(goals);
      console.log(`🎯 Seeded ${goals.length} performance goals`);
    }
  }

  async seedPayrollRuns() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const employees = await this.db.collection('employees').find({ status: 'active' }).toArray();
    const payrollRuns = [];
    
    for (const org of organizations) {
      const orgEmployees = employees.filter(e => e.organizationId.equals(org._id));
      
      // Generate payroll runs for last 6 months
      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const items = orgEmployees.map(emp => ({
          employeeId: emp.employeeId,
          grossPay: emp.salary / 12,
          deductions: emp.salary / 12 * 0.2,
          netPay: emp.salary / 12 * 0.8
        }));
        
        payrollRuns.push({
          _id: new ObjectId(),
          organizationId: org._id,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          status: i === 0 ? 'processing' : 'completed',
          items: items,
          createdAt: new Date()
        });
      }
    }
    
    if (payrollRuns.length > 0) {
      await this.db.collection('payrollruns').insertMany(payrollRuns);
      console.log(`💰 Seeded ${payrollRuns.length} payroll runs`);
    }
  }

  async seedComplianceItems() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const complianceItems = [];
    const complianceEvents = [];
    
    const itemTemplates = [
      'Annual Safety Training',
      'Data Privacy Compliance Review',
      'Financial Audit',
      'ISO Certification Renewal',
      'Employee Background Checks',
      'Security Assessment',
      'Tax Filing Requirements',
      'Insurance Policy Review'
    ];
    
    for (const org of organizations) {
      for (const itemName of itemTemplates) {
        const itemId = new ObjectId();
        
        complianceItems.push({
          _id: itemId,
          name: itemName,
          organizationId: org._id,
          createdAt: new Date()
        });
        
        // Create compliance events for each item
        const dueDate = new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000);
        
        complianceEvents.push({
          _id: new ObjectId(),
          itemId: itemId,
          dueDate: dueDate,
          status: Math.random() > 0.7 ? 'completed' : 'pending',
          organizationId: org._id,
          createdAt: new Date()
        });
      }
    }
    
    if (complianceItems.length > 0) {
      await this.db.collection('complianceitems').insertMany(complianceItems);
      console.log(`📋 Seeded ${complianceItems.length} compliance items`);
    }
    
    if (complianceEvents.length > 0) {
      await this.db.collection('complianceevents').insertMany(complianceEvents);
      console.log(`📅 Seeded ${complianceEvents.length} compliance events`);
    }
  }

  async seedDocumentRecords() {
    const employees = await this.db.collection('employees').find({}).toArray();
    const documentRecords = [];
    
    const documentTypes = ['Contract', 'ID Copy', 'Resume', 'Certificate', 'Performance Review', 'Training Record'];
    
    for (const employee of employees) {
      // Generate 2-4 documents per employee
      const numDocs = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numDocs; i++) {
        const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        
        documentRecords.push({
          _id: new ObjectId(),
          name: `${employee.firstName} ${employee.lastName} - ${docType}`,
          fileId: `file_${new ObjectId().toString()}`,
          type: docType,
          employeeId: employee.employeeId,
          organizationId: employee.organizationId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (documentRecords.length > 0) {
      await this.db.collection('documentrecords').insertMany(documentRecords);
      console.log(`📄 Seeded ${documentRecords.length} document records`);
    }
  }

  async seedAssets() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const assets = [];
    
    const assetTemplates = [
      { name: 'MacBook Pro 16"', category: 'IT Equipment', serialNumber: 'MBP2023001' },
      { name: 'Dell Monitor 27"', category: 'IT Equipment', serialNumber: 'DM27001' },
      { name: 'Office Desk', category: 'Furniture', serialNumber: 'DESK001' },
      { name: 'Ergonomic Chair', category: 'Furniture', serialNumber: 'CHAIR001' },
      { name: 'iPhone 14 Pro', category: 'Mobile Device', serialNumber: 'IP14001' },
      { name: 'Wireless Keyboard', category: 'IT Equipment', serialNumber: 'KB001' },
      { name: 'Conference Table', category: 'Furniture', serialNumber: 'CT001' },
      { name: 'Projector', category: 'IT Equipment', serialNumber: 'PROJ001' }
    ];
    
    for (const org of organizations) {
      for (let i = 0; i < assetTemplates.length; i++) {
        const template = assetTemplates[i];
        
        assets.push({
          _id: new ObjectId(),
          name: template.name,
          serialNumber: `${org.code}-${template.serialNumber}`,
          category: template.category,
          organizationId: org._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    if (assets.length > 0) {
      await this.db.collection('assets').insertMany(assets);
      console.log(`🏢 Seeded ${assets.length} assets`);
    }
  }

  getPermissionsForProject() {
    const commonPermissions = [
      { name: 'user:read', description: 'View users' },
      { name: 'user:create', description: 'Create users' },
      { name: 'user:update', description: 'Update users' },
      { name: 'user:delete', description: 'Delete users' },
      { name: 'organization:read', description: 'View organizations' },
      { name: 'organization:create', description: 'Create organizations' },
      { name: 'organization:update', description: 'Update organizations' },
      { name: 'organization:delete', description: 'Delete organizations' }
    ];

    if (this.projectName === 'beax-rm') {
      return [
        ...commonPermissions,
        { name: 'project:create', description: 'Create projects' },
        { name: 'project:read', description: 'View projects' },
        { name: 'project:update', description: 'Update projects' },
        { name: 'project:delete', description: 'Delete projects' },
        { name: 'resource:manage', description: 'Manage resources' },
        { name: 'timesheet:create', description: 'Create timesheets' },
        { name: 'timesheet:read', description: 'View timesheets' },
        { name: 'timesheet:update', description: 'Update timesheets' },
        { name: 'crm:manage', description: 'Manage CRM' }
      ];
    } else if (this.projectName === 'true-process') {
      return [
        ...commonPermissions,
        { name: 'process:create', description: 'Create processes' },
        { name: 'process:read', description: 'View processes' },
        { name: 'process:update', description: 'Update processes' },
        { name: 'process:delete', description: 'Delete processes' },
        { name: 'workflow:create', description: 'Create workflows' },
        { name: 'workflow:read', description: 'View workflows' },
        { name: 'workflow:update', description: 'Update workflows' },
        { name: 'task:create', description: 'Create tasks' },
        { name: 'task:read', description: 'View tasks' },
        { name: 'task:update', description: 'Update tasks' },
        { name: 'analytics:read', description: 'View analytics' }
      ];
    }

    return commonPermissions;
  }

  getRolesForProject() {
    if (this.projectName === 'beax-rm') {
      return [
        { name: 'Super Admin', description: 'Full system access', type: 'super_admin' },
        { name: 'Project Manager', description: 'Manage projects and resources', type: 'admin' },
        { name: 'Resource Manager', description: 'Manage resources and assignments', type: 'staff' },
        { name: 'Team Lead', description: 'Lead project teams', type: 'staff' },
        { name: 'Developer', description: 'Work on assigned projects', type: 'staff' },
        { name: 'Client', description: 'View project progress', type: 'custom' }
      ];
    } else if (this.projectName === 'true-process') {
      return [
        { name: 'Process Admin', description: 'Full process management access', type: 'super_admin' },
        { name: 'Process Manager', description: 'Manage processes and workflows', type: 'admin' },
        { name: 'Process Analyst', description: 'Analyze and optimize processes', type: 'staff' },
        { name: 'Team Lead', description: 'Lead process execution teams', type: 'staff' },
        { name: 'Process Executor', description: 'Execute assigned processes', type: 'staff' }
      ];
    }

    return [
      { name: 'Admin', description: 'Administrator access', type: 'admin' },
      { name: 'User', description: 'Standard user access', type: 'staff' }
    ];
  }

  getModulesForProject() {
    if (this.projectName === 'beax-rm') {
      return [
        // Core Modules
        { name: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, icon: 'people', route: '/modules/user-management', category: 'Core', permissionType: 'super_admin' },
        { name: 'Organization Management', description: 'Manage organizations and membership requests', isActive: true, icon: 'business', route: '/modules/organization-management', category: 'Core', permissionType: 'super_admin' },
        { name: 'My Organizations', description: 'View and join public organizations', isActive: true, icon: 'groups', route: '/modules/my-organizations', category: 'Core', permissionType: 'public' },
        { name: 'CRM', description: 'Customer relationship management', isActive: true, icon: 'business_center', route: '/modules/crm', category: 'Sales', permissionType: 'admin' },
        
        // HR Modules
        { name: 'HR Management', description: 'Human resources management', isActive: true, icon: 'people', route: '/modules/hr-management', category: 'HR', permissionType: 'admin' },
        { name: 'Staff Management', description: 'Manage staff records and information', isActive: false, icon: 'badge', route: '/modules/staff-management', category: 'HR', permissionType: 'admin' },
        { name: 'Payroll Management', description: 'Manage employee payroll and compensation', isActive: false, icon: 'payments', route: '/modules/payroll-management', category: 'HR', permissionType: 'admin' },
        { name: 'Role Assignment', description: 'Assign roles and responsibilities', isActive: false, icon: 'assignment_ind', route: '/modules/assigning-roles', category: 'HR', permissionType: 'admin' },
        
        // Project Management
        { name: 'Tasks Management', description: 'Manage tasks and assignments', isActive: false, icon: 'task', route: '/modules/tasks-management', category: 'Project', permissionType: 'admin' },
        { name: 'Projects Management', description: 'Manage projects and deliverables', isActive: true, icon: 'work', route: '/modules/projects-management', category: 'Project', permissionType: 'admin' },
        { name: 'Project Tracking', description: 'Track project progress and milestones', isActive: true, icon: 'track_changes', route: '/modules/project-tracking', category: 'Project', permissionType: 'admin' },
        { name: 'Project Timesheet', description: 'Track time spent on projects', isActive: true, icon: 'schedule', route: '/modules/project-timesheet', category: 'Project', permissionType: 'admin' },
        
        // Sales & CRM
        { name: 'Leads Management', description: 'Manage sales leads and prospects', isActive: false, icon: 'person_add', route: '/modules/leads-management', category: 'Sales', permissionType: 'admin' },
        { name: 'Sales Management', description: 'Manage sales processes and pipeline', isActive: false, icon: 'trending_up', route: '/modules/sales-management', category: 'Sales', permissionType: 'admin' },
        { name: 'Deal Management', description: 'Manage deals and opportunities', isActive: false, icon: 'handshake', route: '/modules/deal-management', category: 'Sales', permissionType: 'admin' },
        
        // Operations
        { name: 'Inventory Management', description: 'Manage inventory and stock levels', isActive: false, icon: 'inventory', route: '/modules/inventory-management', category: 'Operations', permissionType: 'admin' },
        { name: 'Item Management', description: 'Manage items and products', isActive: false, icon: 'category', route: '/modules/item-management', category: 'Operations', permissionType: 'admin' },
        
        // Finance
        { name: 'Budget Planner', description: 'Plan and manage budgets', isActive: false, icon: 'account_balance', route: '/modules/budget-planner', category: 'Finance', permissionType: 'admin' },
        { name: 'Estimates Management', description: 'Create and manage estimates', isActive: false, icon: 'receipt', route: '/modules/estimates-management', category: 'Finance', permissionType: 'admin' },
        { name: 'Contract Management', description: 'Manage contracts and agreements', isActive: false, icon: 'description', route: '/modules/contract-module', category: 'Finance', permissionType: 'admin' },
        { name: 'Order Management', description: 'Manage orders, track status, and monitor fulfillment', isActive: true, icon: 'shopping_cart', route: '/modules/order-management', category: 'Operations', permissionType: 'admin' },
        { name: 'Finance Management', description: 'Manage invoices, receipts, and payments', isActive: true, icon: 'account_balance_wallet', route: '/modules/finance', category: 'Finance', permissionType: 'admin' }
      ];
    } else if (this.projectName === 'true-process') {
      return [
        // Core Modules (matching module-registry.ts and existing folders)
        { name: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, icon: 'people', route: '/modules/user-management', category: 'Core', permissionType: 'super_admin' },
        { name: 'Organization Management', description: 'Manage organizations and membership requests', isActive: true, icon: 'business', route: '/modules/organization-management', category: 'Core', permissionType: 'super_admin' },
        { name: 'My Organizations', description: 'View and join public organizations', isActive: true, icon: 'groups', route: '/modules/my-organizations', category: 'Core', permissionType: 'public' },
        { name: 'CRM', description: 'Customer relationship management', isActive: true, icon: 'business_center', route: '/modules/crm', category: 'Sales', permissionType: 'admin' },
        
        // HR Modules
        { name: 'HR Management', description: 'Human resources management', isActive: true, icon: 'people', route: '/modules/hr-management', category: 'HR', permissionType: 'admin' },
        { name: 'Payroll Management', description: 'Manage employee payroll and compensation', isActive: false, icon: 'payments', route: '/modules/payroll-management', category: 'HR', permissionType: 'admin' },
        
        // Project Management
        { name: 'Tasks Management', description: 'Manage tasks and assignments', isActive: false, icon: 'task', route: '/modules/tasks-management', category: 'Project', permissionType: 'admin' },
        { name: 'Projects Management', description: 'Manage projects and deliverables', isActive: true, icon: 'work', route: '/modules/projects-management', category: 'Project', permissionType: 'admin' },
        { name: 'Project Tracking', description: 'Track project progress and milestones', isActive: true, icon: 'track_changes', route: '/modules/project-tracking', category: 'Project', permissionType: 'admin' },
        { name: 'Project Timesheet', description: 'Track time spent on projects', isActive: true, icon: 'schedule', route: '/modules/project-timesheet', category: 'Project', permissionType: 'admin' },
        
        // Sales & Operations
        { name: 'Sales Management', description: 'Manage sales processes and pipeline', isActive: false, icon: 'trending_up', route: '/modules/sales-management', category: 'Sales', permissionType: 'admin' },
        { name: 'Inventory Management', description: 'Manage inventory and stock levels', isActive: false, icon: 'inventory', route: '/modules/inventory-management', category: 'Operations', permissionType: 'admin' },
        { name: 'Order Management', description: 'Manage orders, track status, and monitor fulfillment', isActive: true, icon: 'shopping_cart', route: '/modules/order-management', category: 'Operations', permissionType: 'admin' },
        { name: 'Finance Management', description: 'Manage invoices, receipts, and payments', isActive: true, icon: 'account_balance_wallet', route: '/modules/finance', category: 'Finance', permissionType: 'admin' }
      ];
    }

    return [
      { name: 'User Management', description: 'Manage users, roles, and permissions', isActive: true, icon: 'people', route: '/modules/user-management', category: 'Core', permissionType: 'super_admin' },
      { name: 'Organization Management', description: 'Manage organizations', isActive: true, icon: 'business', route: '/modules/organization-management', category: 'Core', permissionType: 'super_admin' }
    ];
  }

  getOrganizationsForProject() {
    if (this.projectName === 'beax-rm') {
      return [
        {
          name: 'Beax Technologies',
          code: 'BEAX',
          description: 'Leading resource management solutions',
          isPublic: false,
          memberCount: 25,
          createdAt: new Date()
        },
        {
          name: 'TechCorp Solutions',
          code: 'TECH',
          description: 'Enterprise software solutions',
          isPublic: true,
          memberCount: 50,
          createdAt: new Date()
        },
        {
          name: 'StartupHub Inc',
          code: 'STARTUP',
          description: 'Innovative startup solutions',
          isPublic: true,
          memberCount: 15,
          createdAt: new Date()
        }
      ];
    } else if (this.projectName === 'true-process') {
      return [
        {
          name: 'True Process Solutions',
          code: 'TPS',
          description: 'Process optimization experts',
          isPublic: false,
          memberCount: 30,
          createdAt: new Date()
        },
        {
          name: 'Workflow Innovations',
          code: 'WFI',
          description: 'Workflow automation specialists',
          isPublic: true,
          memberCount: 40,
          createdAt: new Date()
        }
      ];
    }

    return [
      {
        name: 'Demo Organization',
        code: 'DEMO',
        description: 'Demo organization for testing',
        isPublic: true,
        memberCount: 10,
        createdAt: new Date()
      }
    ];
  }

  async getUsersForProject() {
    const organizations = await this.db.collection('organizations').find({}).toArray();
    const roles = await this.db.collection('roles').find({}).toArray();
    const users = [];
    
    const hashedPassword = await bcrypt.hash('admin123', 10);

    if (this.projectName === 'beax-rm') {
      const userTemplates = [
        { email: 'admin@beax.com', firstName: 'Beax', lastName: 'Admin', roleName: 'Super Admin' },
        { email: 'manager@beax.com', firstName: 'Project', lastName: 'Manager', roleName: 'Project Manager' },
        { email: 'resource@beax.com', firstName: 'Resource', lastName: 'Manager', roleName: 'Resource Manager' },
        { email: 'lead@beax.com', firstName: 'Team', lastName: 'Lead', roleName: 'Team Lead' },
        { email: 'dev1@beax.com', firstName: 'John', lastName: 'Developer', roleName: 'Developer' },
        { email: 'dev2@beax.com', firstName: 'Jane', lastName: 'Developer', roleName: 'Developer' },
        { email: 'client@beax.com', firstName: 'Client', lastName: 'User', roleName: 'Client' }
      ];
      
      for (const org of organizations) {
        for (const template of userTemplates) {
          const role = roles.find(r => r.name === template.roleName);
          users.push({
            _id: new ObjectId(),
            email: template.email.replace('@beax.com', `@${org.code.toLowerCase()}.com`),
            password: hashedPassword,
            firstName: template.firstName,
            lastName: template.lastName,
            isActive: true,
            organizationIds: [org._id],
            organizationId: org._id,
            roleIds: role ? [role._id] : [],
            permissionIds: [],
            activeModuleIds: [],
            createdAt: new Date()
          });
        }
      }
    } else if (this.projectName === 'true-process') {
      const userTemplates = [
        { email: 'admin@trueprocess.com', firstName: 'Process', lastName: 'Admin', roleName: 'Process Admin' },
        { email: 'manager@trueprocess.com', firstName: 'Process', lastName: 'Manager', roleName: 'Process Manager' },
        { email: 'analyst@trueprocess.com', firstName: 'Process', lastName: 'Analyst', roleName: 'Process Analyst' },
        { email: 'lead@trueprocess.com', firstName: 'Team', lastName: 'Lead', roleName: 'Team Lead' },
        { email: 'executor@trueprocess.com', firstName: 'Process', lastName: 'Executor', roleName: 'Process Executor' }
      ];
      
      for (const org of organizations) {
        for (const template of userTemplates) {
          const role = roles.find(r => r.name === template.roleName);
          users.push({
            _id: new ObjectId(),
            email: template.email.replace('@trueprocess.com', `@${org.code.toLowerCase()}.com`),
            password: hashedPassword,
            firstName: template.firstName,
            lastName: template.lastName,
            isActive: true,
            organizationIds: [org._id],
            organizationId: org._id,
            roleIds: role ? [role._id] : [],
            permissionIds: [],
            activeModuleIds: [],
            createdAt: new Date()
          });
        }
      }
    }

    return users;
  }

  getDepartmentsForProject() {
    if (this.projectName === 'beax-rm') {
      return [
        { name: 'Engineering', description: 'Software development team', code: 'ENG', isActive: true },
        { name: 'Product Management', description: 'Product strategy and management', code: 'PM', isActive: true },
        { name: 'Sales', description: 'Sales and business development', code: 'SALES', isActive: true },
        { name: 'Marketing', description: 'Marketing and communications', code: 'MKT', isActive: true },
        { name: 'Human Resources', description: 'HR and people operations', code: 'HR', isActive: true }
      ];
    } else if (this.projectName === 'true-process') {
      return [
        { name: 'Process Engineering', description: 'Design and optimize processes', code: 'PE', isActive: true },
        { name: 'Workflow Management', description: 'Manage workflows', code: 'WM', isActive: true },
        { name: 'Quality Assurance', description: 'Ensure process quality', code: 'QA', isActive: true },
        { name: 'Analytics', description: 'Process analytics', code: 'AN', isActive: true },
        { name: 'Customer Success', description: 'Customer support and success', code: 'CS', isActive: true }
      ];
    }

    return [
      { name: 'General', description: 'General department', code: 'GEN', isActive: true }
    ];
  }

  async run() {
    try {
      console.log(`🌱 Starting demo seed for ${this.projectName}...`);
      console.log(`📊 Using config: ${this.config.app.name}`);
      
      await this.connect();
      await this.clearCollections();
      
      await this.seedPermissions();
      await this.seedRoles();
      await this.seedModules();
      await this.seedOrganizations();
      await this.seedUsers();
      await this.seedDepartments();
      await this.seedFakeData();
      await this.activateModulesForSuperAdmins();
      
      console.log(`✅ Demo seed completed successfully for ${this.projectName}!`);
    } catch (error) {
      console.error('❌ Seed failed:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Run the seeder
async function main() {
  const projectName = process.argv[2] || 'beax-rm';
  
  console.log(`🚀 Running demo seed for project: ${projectName}`);
  
  const seeder = new DemoSeeder(projectName);
  await seeder.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DemoSeeder };