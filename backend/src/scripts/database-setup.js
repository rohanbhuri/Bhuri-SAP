const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// Database setup script for Bhuri SAP
class DatabaseSetup {
  constructor(connectionString) {
    this.connectionString = connectionString || 'mongodb://localhost:27017/bhuri_sap';
    this.client = null;
    this.db = null;
  }

  async connect() {
    this.client = new MongoClient(this.connectionString);
    await this.client.connect();
    // Extract database name from connection string or use default
    const dbName = this.connectionString.includes('localhost') ? 'bhuri_sap' : 'beaxrm';
    this.db = this.client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    }
  }

  async setupRoles() {
    console.log('Setting up default roles...');
    
    const roles = [
      {
        name: "Super Admin",
        type: "super_admin",
        description: "Full system access with all permissions",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "Admin",
        type: "admin",
        description: "Organization administrator with management permissions",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "Staff",
        type: "staff", 
        description: "Basic user with limited permissions",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "HR Manager",
        type: "custom",
        description: "Human resources management role",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "CRM Manager",
        type: "custom",
        description: "Customer relationship management role",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "Project Manager",
        type: "custom",
        description: "Project and task management role",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "Sales Manager",
        type: "custom",
        description: "Sales and inventory management role",
        permissionIds: [],
        createdAt: new Date()
      },
      {
        name: "Viewer",
        type: "custom",
        description: "Read-only access to organization data",
        permissionIds: [],
        createdAt: new Date()
      }
    ];

    const result = await this.db.collection('roles').insertMany(roles);
    console.log(`Created ${result.insertedCount} roles`);
    return result.insertedIds;
  }

  async setupPermissions() {
    console.log('Setting up comprehensive permissions...');
    
    const permissions = [
      // User Management Permissions
      { module: 'users', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'users', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'users', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'users', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'users', action: 'read', resource: 'own', createdAt: new Date() },
      { module: 'users', action: 'edit', resource: 'own', createdAt: new Date() },
      { module: 'users', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'users', action: 'write', resource: 'organization', createdAt: new Date() },
      
      // Role Management Permissions
      { module: 'roles', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'roles', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'roles', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'roles', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'roles', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Permission Management
      { module: 'permissions', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'permissions', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'permissions', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'permissions', action: 'delete', resource: 'all', createdAt: new Date() },
      
      // Organization Management Permissions
      { module: 'organizations', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'organizations', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'organizations', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'organizations', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'organizations', action: 'read', resource: 'own', createdAt: new Date() },
      { module: 'organizations', action: 'edit', resource: 'own', createdAt: new Date() },
      
      // Module Management Permissions
      { module: 'modules', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'modules', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'modules', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'modules', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'modules', action: 'read', resource: 'own', createdAt: new Date() },
      
      // HR Management Permissions
      { module: 'hr-management', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'hr-management', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'hr-management', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'hr-management', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'hr-management', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'hr-management', action: 'write', resource: 'organization', createdAt: new Date() },
      { module: 'hr-management', action: 'edit', resource: 'organization', createdAt: new Date() },
      
      // Employee Management
      { module: 'employees', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'employees', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'employees', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'employees', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'employees', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'employees', action: 'write', resource: 'organization', createdAt: new Date() },
      
      // Payroll Management
      { module: 'payroll', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'payroll', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'payroll', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'payroll', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'payroll', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // CRM Permissions
      { module: 'crm', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'crm', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'crm', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'crm', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'crm', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'crm', action: 'write', resource: 'organization', createdAt: new Date() },
      
      // Contacts Management
      { module: 'contacts', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'contacts', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'contacts', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'contacts', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'contacts', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Leads Management
      { module: 'leads', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'leads', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'leads', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'leads', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'leads', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Deals Management
      { module: 'deals', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'deals', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'deals', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'deals', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'deals', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Project Management Permissions
      { module: 'projects-management', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'projects-management', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'projects-management', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'projects-management', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'projects-management', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'projects-management', action: 'write', resource: 'organization', createdAt: new Date() },
      
      // Task Management Permissions
      { module: 'tasks-management', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'tasks-management', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'tasks-management', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'tasks-management', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'tasks-management', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'tasks-management', action: 'write', resource: 'organization', createdAt: new Date() },
      
      // Reports Management
      { module: 'reports', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'reports', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'reports', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'reports', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'reports', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Sales Management
      { module: 'sales-management', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'sales-management', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'sales-management', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'sales-management', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'sales-management', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Inventory Management
      { module: 'inventory-management', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'inventory-management', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'inventory-management', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'inventory-management', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'inventory-management', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Form Builder
      { module: 'form-builder', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'form-builder', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'form-builder', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'form-builder', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'form-builder', action: 'read', resource: 'organization', createdAt: new Date() },
      
      // Messages Module
      { module: 'messages', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'messages', action: 'write', resource: 'all', createdAt: new Date() },
      { module: 'messages', action: 'edit', resource: 'all', createdAt: new Date() },
      { module: 'messages', action: 'delete', resource: 'all', createdAt: new Date() },
      { module: 'messages', action: 'read', resource: 'own', createdAt: new Date() },
      { module: 'messages', action: 'write', resource: 'own', createdAt: new Date() },
      
      // Preferences
      { module: 'preferences', action: 'read', resource: 'own', createdAt: new Date() },
      { module: 'preferences', action: 'write', resource: 'own', createdAt: new Date() },
      { module: 'preferences', action: 'edit', resource: 'own', createdAt: new Date() },
      { module: 'preferences', action: 'read', resource: 'all', createdAt: new Date() },
      
      // Dashboard
      { module: 'dashboard', action: 'read', resource: 'all', createdAt: new Date() },
      { module: 'dashboard', action: 'read', resource: 'organization', createdAt: new Date() },
      { module: 'dashboard', action: 'read', resource: 'own', createdAt: new Date() }
    ];

    const result = await this.db.collection('permissions').insertMany(permissions);
    console.log(`Created ${result.insertedCount} permissions`);
    return result.insertedIds;
  }

  async setupModules() {
    console.log('Setting up comprehensive modules...');
    
    const modules = [
      {
        name: "user-management",
        displayName: "User Management",
        description: "Manage users, roles, and permissions",
        icon: "people",
        category: "management",
        version: "1.0.0",
        isActive: true,
        isPremium: false,
        dependencies: [],
        permissions: ["users:read", "users:write", "roles:read"],
        routes: ["/user-management"],
        createdAt: new Date()
      },
      {
        name: "organization-management",
        displayName: "Organization Management", 
        description: "Manage organizations and requests",
        icon: "business",
        category: "management",
        version: "1.0.0",
        isActive: true,
        isPremium: false,
        dependencies: [],
        permissions: ["organizations:read", "organizations:write"],
        routes: ["/organization-management"],
        createdAt: new Date()
      },
      {
        name: "hr-management",
        displayName: "HR Management",
        description: "Human resources management system",
        icon: "badge",
        category: "management",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: [],
        permissions: ["hr-management:read", "hr-management:write"],
        routes: ["/hr-management"],
        createdAt: new Date()
      },
      {
        name: "crm",
        displayName: "CRM",
        description: "Customer relationship management",
        icon: "contacts",
        category: "sales",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: [],
        permissions: ["crm:read", "crm:write"],
        routes: ["/crm"],
        createdAt: new Date()
      },
      {
        name: "projects-management",
        displayName: "Project Management",
        description: "Manage projects and track progress",
        icon: "folder",
        category: "management",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: [],
        permissions: ["projects-management:read", "projects-management:write"],
        routes: ["/projects-management"],
        createdAt: new Date()
      },
      {
        name: "tasks-management",
        displayName: "Task Management",
        description: "Task tracking and management",
        icon: "assignment",
        category: "productivity",
        version: "1.0.0",
        isActive: true,
        isPremium: false,
        dependencies: [],
        permissions: ["tasks-management:read", "tasks-management:write"],
        routes: ["/tasks-management"],
        createdAt: new Date()
      },
      {
        name: "reports-management",
        displayName: "Reports & Analytics",
        description: "Generate reports and analytics",
        icon: "analytics",
        category: "analytics",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: [],
        permissions: ["reports:read", "reports:write"],
        routes: ["/reports-management"],
        createdAt: new Date()
      },
      {
        name: "sales-management",
        displayName: "Sales Management",
        description: "Manage sales processes and pipeline",
        icon: "trending_up",
        category: "sales",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: [],
        permissions: ["sales-management:read", "sales-management:write"],
        routes: ["/sales-management"],
        createdAt: new Date()
      },
      {
        name: "inventory-management",
        displayName: "Inventory Management",
        description: "Track and manage inventory",
        icon: "inventory",
        category: "operations",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: [],
        permissions: ["inventory-management:read", "inventory-management:write"],
        routes: ["/inventory-management"],
        createdAt: new Date()
      },
      {
        name: "payroll-management",
        displayName: "Payroll Management",
        description: "Manage employee payroll and benefits",
        icon: "payments",
        category: "finance",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: ["hr-management"],
        permissions: ["payroll:read", "payroll:write"],
        routes: ["/payroll-management"],
        createdAt: new Date()
      },
      {
        name: "form-builder",
        displayName: "Form Builder",
        description: "Create and manage dynamic forms",
        icon: "dynamic_form",
        category: "tools",
        version: "1.0.0",
        isActive: true,
        isPremium: false,
        dependencies: [],
        permissions: ["form-builder:read", "form-builder:write"],
        routes: ["/form-builder"],
        createdAt: new Date()
      },
      {
        name: "messages-module",
        displayName: "Messages & Communication",
        description: "Internal messaging and communication",
        icon: "message",
        category: "communication",
        version: "1.0.0",
        isActive: true,
        isPremium: false,
        dependencies: [],
        permissions: ["messages:read", "messages:write"],
        routes: ["/messages"],
        createdAt: new Date()
      },
      {
        name: "my-organizations",
        displayName: "My Organizations",
        description: "Manage your organization memberships",
        icon: "corporate_fare",
        category: "management",
        version: "1.0.0",
        isActive: true,
        isPremium: false,
        dependencies: [],
        permissions: ["organizations:read", "organizations:write"],
        routes: ["/my-organizations"],
        createdAt: new Date()
      },
      {
        name: "project-timesheet",
        displayName: "Project Timesheet",
        description: "Track time spent on projects",
        icon: "schedule",
        category: "productivity",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: ["projects-management"],
        permissions: ["projects-management:read", "projects-management:write"],
        routes: ["/project-timesheet"],
        createdAt: new Date()
      },
      {
        name: "project-tracking",
        displayName: "Project Tracking",
        description: "Monitor project progress and milestones",
        icon: "track_changes",
        category: "management",
        version: "1.0.0",
        isActive: true,
        isPremium: true,
        dependencies: ["projects-management"],
        permissions: ["projects-management:read", "projects-management:write"],
        routes: ["/project-tracking"],
        createdAt: new Date()
      }
    ];

    const result = await this.db.collection('modules').insertMany(modules);
    console.log(`Created ${result.insertedCount} modules`);
    return result.insertedIds;
  }

  async setupSuperAdmin(email = 'rohanbhuri@gmail.com', password = 'Purpul#1') {
    console.log('Setting up super admin user...');
    
    // Get super admin role
    const superAdminRole = await this.db.collection('roles').findOne({ type: 'super_admin' });
    if (!superAdminRole) {
      throw new Error('Super admin role not found');
    }

    // Get all modules to activate for super admin
    const allModules = await this.db.collection('modules').find({}).toArray();
    const allModuleIds = allModules.map(module => module._id);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin user
    const superAdmin = {
      email,
      password: hashedPassword,
      firstName: 'Rohan',
      lastName: 'Bhuri',
      isActive: true,
      organizationIds: [],
      currentOrganizationId: null,
      roleIds: [superAdminRole._id],
      permissionIds: [],
      activeModuleIds: allModuleIds,
      createdAt: new Date()
    };

    const result = await this.db.collection('users').insertOne(superAdmin);
    console.log(`Created super admin user with ID: ${result.insertedId}`);
    console.log(`Activated ${allModuleIds.length} modules for super admin`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    return result.insertedId;
  }

  async setupDefaultOrganization() {
    console.log('Setting up default organization...');
    
    const organization = {
      name: "Bhuri SAP Demo",
      description: "Default demonstration organization",
      logo: "",
      website: "https://bhuri-sap.com",
      email: "demo@bhuri-sap.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Demo Street",
        city: "Demo City",
        state: "Demo State",
        country: "Demo Country",
        zipCode: "12345"
      },
      isActive: true,
      isPublic: true,
      activeModuleIds: [],
      settings: {
        theme: "light",
        primaryColor: "#1976d2",
        accentColor: "#ff4081"
      },
      createdAt: new Date()
    };

    const result = await this.db.collection('organizations').insertOne(organization);
    console.log(`Created default organization with ID: ${result.insertedId}`);
    
    return result.insertedId;
  }

  async createIndexes() {
    console.log('Creating database indexes...');
    
    const indexes = [
      // Users indexes
      { collection: 'users', index: { email: 1 }, options: { unique: true } },
      { collection: 'users', index: { organizationIds: 1 } },
      { collection: 'users', index: { roleIds: 1 } },
      { collection: 'users', index: { isActive: 1 } },
      
      // Organizations indexes
      { collection: 'organizations', index: { name: 1 } },
      { collection: 'organizations', index: { isActive: 1 } },
      { collection: 'organizations', index: { isPublic: 1 } },
      
      // Roles indexes
      { collection: 'roles', index: { type: 1 } },
      { collection: 'roles', index: { name: 1 } },
      
      // Permissions indexes
      { collection: 'permissions', index: { module: 1, action: 1, resource: 1 } },
      { collection: 'permissions', index: { module: 1 } },
      
      // Modules indexes
      { collection: 'modules', index: { name: 1 }, options: { unique: true } },
      { collection: 'modules', index: { category: 1 } },
      { collection: 'modules', index: { isActive: 1 } }
    ];

    for (const { collection, index, options = {} } of indexes) {
      try {
        await this.db.collection(collection).createIndex(index, options);
        console.log(`Created index on ${collection}:`, Object.keys(index).join(', '));
      } catch (error) {
        console.log(`Index already exists on ${collection}:`, Object.keys(index).join(', '));
      }
    }
  }

  async clearExistingData() {
    console.log('Clearing existing data...');
    const collections = ['users', 'roles', 'permissions', 'modules', 'organizations'];
    
    for (const collection of collections) {
      try {
        await this.db.collection(collection).deleteMany({});
        console.log(`Cleared ${collection} collection`);
      } catch (error) {
        console.log(`Collection ${collection} doesn't exist or already empty`);
      }
    }
  }

  async setupComplete() {
    try {
      await this.connect();
      
      console.log('🚀 Starting Bhuri SAP Database Setup...\n');
      
      // Clear existing data
      await this.clearExistingData();
      
      // Setup core data
      await this.setupRoles();
      await this.setupPermissions();
      await this.setupModules();
      await this.setupDefaultOrganization();
      await this.setupSuperAdmin();
      
      // Create indexes
      await this.createIndexes();
      
      console.log('\n✅ Database setup completed successfully!');
      console.log('\n📋 Setup Summary:');
      console.log('- Default roles created (Super Admin, Admin, Staff, HR Manager, CRM Manager)');
      console.log('- Comprehensive permissions system established');
      console.log('- Core modules configured');
      console.log('- Default organization created');
      console.log('- Super admin user created');
      console.log('- Database indexes optimized');
      console.log('\n🔐 Super Admin Credentials:');
      console.log('Email: admin@bhuri-sap.com');
      console.log('Password: SuperAdmin123!');
      console.log('\n⚠️  Please change the default password after first login!');
      
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      if (error.code) {
        console.error('Error code:', error.code);
      }
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  // Load config to get database credentials
  require('../load-config');
  const connectionString = process.env.MONGODB_URI;
  
  if (!connectionString) {
    console.error('MONGODB_URI not found. Make sure config.js is properly loaded.');
    process.exit(1);
  }
  
  const setup = new DatabaseSetup(connectionString);
  setup.setupComplete().catch(console.error);
}

module.exports = DatabaseSetup;