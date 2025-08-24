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
    const collections = ['users', 'organizations', 'roles', 'permissions', 'modules', 'departments', 'projects', 'contacts', 'leads', 'deals', 'tasks', 'employees'];
    
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
    await this.seedTasks();
  }

  async activateModulesForSuperAdmins() {
    const modules = await this.db.collection('modules').find({}).toArray();
    const moduleIds = modules.map(m => m._id);
    
    const superAdminRoles = await this.db.collection('roles').find({ 
      type: 'super_admin' 
    }).toArray();
    
    const superAdminRoleIds = superAdminRoles.map(r => r._id);
    
    await this.db.collection('users').updateMany(
      { roleIds: { $in: superAdminRoleIds } },
      { $set: { activeModuleIds: moduleIds } }
    );
    
    console.log(`🔓 Activated all modules for super admins`);
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

  async seedTasks() {
    const projects = await this.db.collection('projects').find({}).toArray();
    const users = await this.db.collection('users').find({}).toArray();
    const tasks = [];
    
    const taskTemplates = [
      { title: 'Requirements Analysis', description: 'Analyze and document requirements' },
      { title: 'Design Mockups', description: 'Create design mockups and wireframes' },
      { title: 'Backend Development', description: 'Develop backend APIs and services' },
      { title: 'Frontend Implementation', description: 'Implement user interface' },
      { title: 'Testing & QA', description: 'Perform testing and quality assurance' },
      { title: 'Deployment', description: 'Deploy to production environment' }
    ];
    
    for (const project of projects) {
      for (let i = 0; i < taskTemplates.length; i++) {
        const template = taskTemplates[i];
        const assignee = users.find(u => project.teamMemberIds.includes(u._id));
        
        tasks.push({
          _id: new ObjectId(),
          title: template.title,
          description: template.description,
          status: ['todo', 'in-progress', 'completed'][Math.floor(Math.random() * 3)],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
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
    
    if (tasks.length > 0) {
      await this.db.collection('tasks').insertMany(tasks);
      console.log(`✅ Seeded ${tasks.length} tasks`);
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
        { name: 'Dashboard', description: 'Main dashboard with widgets', isActive: true, icon: 'dashboard', route: '/dashboard', category: 'Core', permissionType: 'public' },
        { name: 'Projects Management', description: 'Manage projects and deliverables', isActive: true, icon: 'work', route: '/modules/projects-management', category: 'Project Management', permissionType: 'admin' },
        { name: 'Project Tracking', description: 'Track project progress and milestones', isActive: true, icon: 'track_changes', route: '/modules/project-tracking', category: 'Project Management', permissionType: 'admin' },
        { name: 'Project Timesheet', description: 'Track time spent on projects', isActive: true, icon: 'schedule', route: '/modules/project-timesheet', category: 'Project Management', permissionType: 'admin' },
        { name: 'Tasks Management', description: 'Task creation and assignment', isActive: true, icon: 'task', route: '/modules/tasks-management', category: 'Project Management', permissionType: 'admin' },
        
        // CRM & Sales
        { name: 'CRM', description: 'Customer relationship management', isActive: true, icon: 'contacts', route: '/modules/crm', category: 'Sales & CRM', permissionType: 'admin' },
        { name: 'Leads Management', description: 'Manage sales leads', isActive: true, icon: 'trending_up', route: '/modules/leads', category: 'Sales & CRM', permissionType: 'admin' },
        { name: 'Deals Management', description: 'Manage sales deals', isActive: true, icon: 'handshake', route: '/modules/deals', category: 'Sales & CRM', permissionType: 'admin' },
        { name: 'Contacts Management', description: 'Manage customer contacts', isActive: true, icon: 'contact_phone', route: '/modules/contacts', category: 'Sales & CRM', permissionType: 'admin' },
        
        // HR Management
        { name: 'HR Management', description: 'Human resource management', isActive: true, icon: 'badge', route: '/modules/hr-management', category: 'Human Resources', permissionType: 'admin' },
        { name: 'Employee Management', description: 'Manage employee records', isActive: true, icon: 'people', route: '/modules/employees', category: 'Human Resources', permissionType: 'admin' },
        { name: 'Attendance Management', description: 'Track employee attendance', isActive: true, icon: 'access_time', route: '/modules/attendance', category: 'Human Resources', permissionType: 'admin' },
        { name: 'Leave Management', description: 'Manage employee leaves', isActive: true, icon: 'event_busy', route: '/modules/leaves', category: 'Human Resources', permissionType: 'admin' },
        { name: 'Payroll Management', description: 'Manage employee payroll', isActive: true, icon: 'payment', route: '/modules/payroll', category: 'Human Resources', permissionType: 'admin' },
        { name: 'Performance Management', description: 'Track employee performance', isActive: true, icon: 'trending_up', route: '/modules/performance', category: 'Human Resources', permissionType: 'admin' },
        
        // Administration
        { name: 'User Management', description: 'Manage system users', isActive: true, icon: 'manage_accounts', route: '/modules/user-management', category: 'Administration', permissionType: 'super_admin' },
        { name: 'Organization Management', description: 'Manage organizations', isActive: true, icon: 'business', route: '/modules/organization-management', category: 'Administration', permissionType: 'super_admin' },
        { name: 'Roles & Permissions', description: 'Manage user roles', isActive: true, icon: 'security', route: '/modules/roles', category: 'Administration', permissionType: 'super_admin' },
        { name: 'Module Management', description: 'Manage system modules', isActive: true, icon: 'extension', route: '/modules', category: 'Administration', permissionType: 'super_admin' },
        
        // Communication
        { name: 'Messages', description: 'Internal messaging system', isActive: true, icon: 'message', route: '/modules/messages', category: 'Communication', permissionType: 'public' },
        { name: 'Conversations', description: 'Manage conversations', isActive: true, icon: 'chat', route: '/modules/conversations', category: 'Communication', permissionType: 'public' },
        
        // Analytics & Reporting
        { name: 'Analytics Dashboard', description: 'Business analytics', isActive: true, icon: 'analytics', route: '/modules/analytics', category: 'Analytics', permissionType: 'admin' },
        { name: 'Reports', description: 'Generate business reports', isActive: true, icon: 'assessment', route: '/modules/reports', category: 'Analytics', permissionType: 'admin' },
        
        // Asset & Inventory
        { name: 'Asset Management', description: 'Manage company assets', isActive: true, icon: 'inventory', route: '/modules/assets', category: 'Operations', permissionType: 'admin' },
        { name: 'Inventory Management', description: 'Manage inventory items', isActive: true, icon: 'warehouse', route: '/modules/inventory', category: 'Operations', permissionType: 'admin' },
        
        // Compliance & Documents
        { name: 'Compliance Management', description: 'Manage compliance requirements', isActive: true, icon: 'verified', route: '/modules/compliance', category: 'Compliance', permissionType: 'admin' },
        { name: 'Document Management', description: 'Manage documents', isActive: true, icon: 'description', route: '/modules/documents', category: 'Operations', permissionType: 'admin' },
        
        // Settings
        { name: 'User Preferences', description: 'User preference settings', isActive: true, icon: 'tune', route: '/modules/preferences', category: 'Settings', permissionType: 'public' },
        { name: 'System Settings', description: 'System configuration', isActive: true, icon: 'settings', route: '/settings', category: 'Settings', permissionType: 'super_admin' }
      ];
    } else if (this.projectName === 'true-process') {
      return [
        // Core Process Modules
        { name: 'Dashboard', description: 'Process management dashboard', isActive: true, icon: 'dashboard', route: '/dashboard', category: 'Core', permissionType: 'public' },
        { name: 'Process Management', description: 'Core process management', isActive: true, icon: 'account_tree', route: '/modules/processes', category: 'Process Management', permissionType: 'admin' },
        { name: 'Workflow Designer', description: 'Visual workflow design', isActive: true, icon: 'schema', route: '/modules/workflows', category: 'Process Management', permissionType: 'admin' },
        { name: 'Task Management', description: 'Process task management', isActive: true, icon: 'task', route: '/modules/tasks-management', category: 'Process Management', permissionType: 'admin' },
        { name: 'Process Templates', description: 'Pre-built process templates', isActive: true, icon: 'library_books', route: '/modules/templates', category: 'Process Management', permissionType: 'admin' },
        
        // Automation & Rules
        { name: 'Automation Rules', description: 'Automated process triggers', isActive: true, icon: 'smart_toy', route: '/modules/automation', category: 'Automation', permissionType: 'admin' },
        { name: 'Process Triggers', description: 'Event-based process triggers', isActive: true, icon: 'play_arrow', route: '/modules/triggers', category: 'Automation', permissionType: 'admin' },
        { name: 'Rule Engine', description: 'Business rule management', isActive: true, icon: 'rule', route: '/modules/rules', category: 'Automation', permissionType: 'admin' },
        
        // Analytics & Monitoring
        { name: 'Process Analytics', description: 'Process performance analytics', isActive: true, icon: 'analytics', route: '/modules/analytics', category: 'Analytics', permissionType: 'admin' },
        { name: 'Performance Monitoring', description: 'Real-time process monitoring', isActive: true, icon: 'monitor', route: '/modules/monitoring', category: 'Analytics', permissionType: 'admin' },
        { name: 'Process Reports', description: 'Generate process reports', isActive: true, icon: 'assessment', route: '/modules/reports', category: 'Analytics', permissionType: 'admin' },
        { name: 'KPI Dashboard', description: 'Key performance indicators', isActive: true, icon: 'speed', route: '/modules/kpi', category: 'Analytics', permissionType: 'admin' },
        
        // Quality & Compliance
        { name: 'Quality Management', description: 'Process quality assurance', isActive: true, icon: 'verified', route: '/modules/quality', category: 'Quality & Compliance', permissionType: 'admin' },
        { name: 'Compliance Tracking', description: 'Track compliance requirements', isActive: true, icon: 'policy', route: '/modules/compliance', category: 'Quality & Compliance', permissionType: 'admin' },
        { name: 'Audit Management', description: 'Process audit management', isActive: true, icon: 'fact_check', route: '/modules/audits', category: 'Quality & Compliance', permissionType: 'admin' },
        
        // Resource Management
        { name: 'Resource Allocation', description: 'Allocate resources to processes', isActive: true, icon: 'assignment_ind', route: '/modules/resources', category: 'Resource Management', permissionType: 'admin' },
        { name: 'Capacity Planning', description: 'Plan process capacity', isActive: true, icon: 'timeline', route: '/modules/capacity', category: 'Resource Management', permissionType: 'admin' },
        { name: 'Workload Management', description: 'Manage team workloads', isActive: true, icon: 'work', route: '/modules/workload', category: 'Resource Management', permissionType: 'admin' },
        
        // Communication & Collaboration
        { name: 'Process Communication', description: 'Process-based messaging', isActive: true, icon: 'message', route: '/modules/messages', category: 'Communication', permissionType: 'public' },
        { name: 'Team Collaboration', description: 'Collaborative process management', isActive: true, icon: 'groups', route: '/modules/collaboration', category: 'Communication', permissionType: 'public' },
        { name: 'Notifications', description: 'Process notification system', isActive: true, icon: 'notifications', route: '/modules/notifications', category: 'Communication', permissionType: 'public' },
        
        // Administration
        { name: 'User Management', description: 'Manage process users', isActive: true, icon: 'manage_accounts', route: '/modules/user-management', category: 'Administration', permissionType: 'super_admin' },
        { name: 'Organization Management', description: 'Manage process organizations', isActive: true, icon: 'business', route: '/modules/organization-management', category: 'Administration', permissionType: 'super_admin' },
        { name: 'Roles & Permissions', description: 'Process role management', isActive: true, icon: 'security', route: '/modules/roles', category: 'Administration', permissionType: 'super_admin' },
        { name: 'Module Management', description: 'Manage process modules', isActive: true, icon: 'extension', route: '/modules', category: 'Administration', permissionType: 'super_admin' },
        
        // Configuration
        { name: 'Process Configuration', description: 'Configure process settings', isActive: true, icon: 'tune', route: '/modules/preferences', category: 'Configuration', permissionType: 'admin' },
        { name: 'System Settings', description: 'System configuration', isActive: true, icon: 'settings', route: '/settings', category: 'Configuration', permissionType: 'super_admin' }
      ];
    }

    return [
      { name: 'Dashboard', description: 'Main dashboard', isActive: true, icon: 'dashboard', route: '/dashboard', category: 'Core', permissionType: 'public' },
      { name: 'Settings', description: 'System settings', isActive: true, icon: 'settings', route: '/settings', category: 'Administration', permissionType: 'admin' }
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