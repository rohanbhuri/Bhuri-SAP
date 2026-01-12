import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { Permission, ActionType } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { Employee } from '../entities/employee.entity';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Contact } from '../entities/contact.entity';
import { Lead } from '../entities/lead.entity';
import { Deal } from '../entities/deal.entity';
import { Department } from '../entities/department.entity';
import { Module } from '../entities/module.entity';
import { Client } from '../entities/client.entity';
import { ClientRequest } from '../entities/client-request.entity';
import { Product } from '../entities/product.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Page } from '../entities/page.entity';
import { Quotation } from '../entities/quotation.entity';
import { Order } from '../entities/order.entity';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  module: string;
  relevance: number;
  metadata?: any;
}

export interface SearchFilters {
  modules?: string[];
  types?: string[];
  dateRange?: { from: Date; to: Date };
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
    @InjectRepository(Permission) private permissionRepository: MongoRepository<Permission>,
    @InjectRepository(Role) private roleRepository: MongoRepository<Role>,
    @InjectRepository(Organization) private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(Employee) private employeeRepository: MongoRepository<Employee>,
    @InjectRepository(Project) private projectRepository: MongoRepository<Project>,
    @InjectRepository(Task) private taskRepository: MongoRepository<Task>,
    @InjectRepository(Contact) private contactRepository: MongoRepository<Contact>,
    @InjectRepository(Lead) private leadRepository: MongoRepository<Lead>,
    @InjectRepository(Deal) private dealRepository: MongoRepository<Deal>,
    @InjectRepository(Department) private departmentRepository: MongoRepository<Department>,
    @InjectRepository(Module) private moduleRepository: MongoRepository<Module>,
    @InjectRepository(Client) private clientRepository: MongoRepository<Client>,
    @InjectRepository(ClientRequest) private clientRequestRepository: MongoRepository<ClientRequest>,
    @InjectRepository(Product) private productRepository: MongoRepository<Product>,
    @InjectRepository(BlogPost) private blogPostRepository: MongoRepository<BlogPost>,
    @InjectRepository(Page) private pageRepository: MongoRepository<Page>,
    @InjectRepository(Quotation) private quotationRepository: MongoRepository<Quotation>,
    @InjectRepository(Order) private orderRepository: MongoRepository<Order>,
  ) { }

  async globalSearch(
    query: string,
    userId: string,
    organizationId?: string,
    filters?: SearchFilters,
    limit: number = 50
  ): Promise<SearchResult[]> {
    console.log('Search request:', { query, userId, organizationId, filters, limit });

    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      console.log('User not found:', userId);
      return [];
    }

    const userPermissions = await this.getUserPermissions(user);
    console.log('User permissions:', Array.from(userPermissions));

    const results: SearchResult[] = [];
    const searchPromises: Promise<SearchResult[]>[] = [];

    // ENFORCE ACTIVE MODULES ONLY
    // Get user's active module keys (strings)
    const userActiveModuleIds = user.activeModuleIds || [];
    const activeModules = await this.moduleRepository.find({
      where: { _id: { $in: userActiveModuleIds.map(id => new ObjectId(id)) } }
    });
    const activeModuleKeys = activeModules.map(m => m.name); // e.g., ['user-management', 'crm', ...]

    console.log('User active module keys:', activeModuleKeys);

    // Determine which modules to actually search
    let modulesToSearch = filters?.modules || activeModuleKeys;

    // Only search modules that are both requested AND active for the user
    // If no filters are provided, we've already defaulted to activeModuleKeys
    modulesToSearch = modulesToSearch.filter(m => activeModuleKeys.includes(m));

    console.log('Modules to be searched:', modulesToSearch);

    // Core & User Management
    if (modulesToSearch.includes('user-management')) {
      searchPromises.push(this.searchUsers(query, userPermissions, organizationId));
    }

    // HR Management
    if (modulesToSearch.includes('hr-management')) {
      searchPromises.push(this.searchEmployees(query, userPermissions, organizationId));
    }

    // Project Management
    if (modulesToSearch.includes('projects-management')) {
      searchPromises.push(this.searchProjects(query, userPermissions, organizationId));
    }
    if (modulesToSearch.includes('tasks-management')) {
      searchPromises.push(this.searchTasks(query, userPermissions, organizationId));
    }

    // CRM
    if (modulesToSearch.includes('crm')) {
      searchPromises.push(this.searchContacts(query, userPermissions, organizationId));
      searchPromises.push(this.searchLeads(query, userPermissions, organizationId));
      searchPromises.push(this.searchDeals(query, userPermissions, organizationId));
    }

    // Organization Management
    if (modulesToSearch.includes('organization-management')) {
      searchPromises.push(this.searchDepartments(query, userPermissions, organizationId));
      searchPromises.push(this.searchOrganizations(query, userPermissions, user));
    }

    // Client Management
    if (modulesToSearch.includes('client-management')) {
      searchPromises.push(this.searchClients(query, userPermissions, organizationId));
      searchPromises.push(this.searchClientRequests(query, userPermissions));
    }

    // Catalogue Management
    if (modulesToSearch.includes('catalogue')) {
      searchPromises.push(this.searchProducts(query, userPermissions, organizationId));
    }

    // CMS Management
    if (modulesToSearch.includes('cms')) {
      searchPromises.push(this.searchCMS(query, userPermissions, organizationId));
    }

    // Quotations
    if (modulesToSearch.includes('quotations')) {
      searchPromises.push(this.searchQuotations(query, userPermissions, organizationId));
    }

    // Order Management
    if (modulesToSearch.includes('order-management')) {
      searchPromises.push(this.searchOrders(query, userPermissions, organizationId));
    }

    const searchResults = await Promise.all(searchPromises);
    searchResults.forEach((moduleResults) => {
      results.push(...moduleResults);
    });

    let filteredResults = this.applyFilters(results, filters);
    filteredResults = filteredResults
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);

    console.log('Final search results:', filteredResults.length);
    return filteredResults;
  }

  private async getUserPermissions(user: User): Promise<Set<string>> {
    const permissions = new Set<string>();

    if (user.roleIds?.length) {
      const roles = await this.roleRepository.find({
        where: { _id: { $in: user.roleIds } }
      });

      const permissionIds = roles.flatMap(role => role.permissionIds);
      const rolePermissions = await this.permissionRepository.find({
        where: { _id: { $in: permissionIds } }
      });

      rolePermissions.forEach(perm => {
        permissions.add(`${perm.module}:${perm.action}:${perm.resource}`);
      });

      // Special handling for Super Admin role type
      if (roles.some(role => role.type === 'super_admin')) {
        permissions.add('*:*:*');
      }
    }

    return permissions;
  }

  private hasPermission(permissions: Set<string>, module: string, action: ActionType, resource: string): boolean {
    // Relaxed permission check to allow searching if user has generic read access to module
    return permissions.has(`${module}:${action}:${resource}`) ||
      permissions.has(`${module}:${action}:organization`) ||
      permissions.has(`${module}:${action}:*`) ||
      permissions.has(`*:${action}:${resource}`) ||
      permissions.has(`*:*:*`) ||
      permissions.has(`admin:*:*`) ||
      permissions.size === 0; // Fallback for users without explicit permissions
  }

  private async searchUsers(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'user-management', ActionType.READ, 'users')) return [];

    const searchQuery: any = {
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationIds: { $in: [new ObjectId(organizationId)] } },
          { organizationId: new ObjectId(organizationId) }
        ]
      });
    }

    const users = await this.userRepository.find({
      where: filter
    });

    return users.map(user => ({
      id: user._id.toString(),
      title: `${user.firstName} ${user.lastName}`,
      subtitle: user.email,
      type: 'user',
      module: 'user-management',
      relevance: this.calculateRelevance(query, `${user.firstName} ${user.lastName} ${user.email}`),
      metadata: { isActive: user.isActive }
    }));
  }

  private async searchEmployees(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'hr-management', ActionType.READ, 'employees')) return [];

    const searchQuery: any = {
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { employeeId: { $regex: query, $options: 'i' } },
        { position: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { employeeId: { $regex: query, $options: 'i' } },
            { position: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const employees = await this.employeeRepository.find({ where: filter });

    return employees.map(emp => ({
      id: emp._id.toString(),
      title: `${emp.firstName} ${emp.lastName}`,
      subtitle: `${emp.position} - ${emp.employeeId}`,
      type: 'employee',
      module: 'hr-management',
      relevance: this.calculateRelevance(query, `${emp.firstName} ${emp.lastName} ${emp.position} ${emp.employeeId}`),
      metadata: { status: emp.status, department: emp.department }
    }));
  }

  private async searchProjects(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'projects-management', ActionType.READ, 'projects')) return [];

    const searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    try {
      const projects = await this.projectRepository.find({ where: filter });

      return projects.map(project => ({
        id: project._id.toString(),
        title: project.name,
        subtitle: project.description || 'No description',
        type: 'project',
        module: 'projects-management',
        relevance: this.calculateRelevance(query, `${project.name} ${project.description || ''}`),
        metadata: { status: project.status, priority: project.priority }
      }));
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  }

  private async searchTasks(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'tasks-management', ActionType.READ, 'tasks')) return [];

    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    try {
      const tasks = await this.taskRepository.find({ where: filter });

      return tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        subtitle: task.description ? task.description.substring(0, 100) : 'No description',
        type: 'task',
        module: 'tasks-management',
        relevance: this.calculateRelevance(query, `${task.title} ${task.description || ''}`),
        metadata: { status: task.status, priority: task.priority }
      }));
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  }

  private async searchContacts(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'crm', ActionType.READ, 'contacts')) return [];

    const searchQuery: any = {
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { phone: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const contacts = await this.contactRepository.find({ where: filter });

    return contacts.map(contact => ({
      id: contact._id.toString(),
      title: `${contact.firstName} ${contact.lastName}`,
      subtitle: `${contact.company} - ${contact.email}`,
      type: 'contact',
      module: 'crm',
      relevance: this.calculateRelevance(query, `${contact.firstName} ${contact.lastName} ${contact.company} ${contact.email}`),
      metadata: { status: contact.status }
    }));
  }

  private async searchLeads(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'crm', ActionType.READ, 'leads')) return [];

    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { source: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { source: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const leads = await this.leadRepository.find({ where: filter });

    return leads.map(lead => ({
      id: lead._id.toString(),
      title: lead.title,
      subtitle: lead.description || `${lead.source} - ${lead.status}`,
      type: 'lead',
      module: 'crm',
      relevance: this.calculateRelevance(query, `${lead.title} ${lead.description} ${lead.source}`),
      metadata: { status: lead.status }
    }));
  }

  private async searchDeals(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'crm', ActionType.READ, 'deals')) return [];

    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const deals = await this.dealRepository.find({ where: filter });

    return deals.map(deal => ({
      id: deal._id.toString(),
      title: deal.title,
      subtitle: `$${deal.value} - ${deal.stage}`,
      type: 'deal',
      module: 'crm',
      relevance: this.calculateRelevance(query, `${deal.title} ${deal.description}`),
      metadata: { stage: deal.stage, value: deal.value }
    }));
  }

  private async searchDepartments(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'organization-management', ActionType.READ, 'departments')) return [];

    const searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const departments = await this.departmentRepository.find({ where: filter });

    return departments.map(dept => ({
      id: dept._id.toString(),
      title: dept.name,
      subtitle: dept.description,
      type: 'department',
      module: 'organization-management',
      relevance: this.calculateRelevance(query, `${dept.name} ${dept.description}`),
      metadata: { status: 'active' }
    }));
  }

  private async searchOrganizations(query: string, permissions: Set<string>, user: User): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'organization-management', ActionType.READ, 'organizations')) return [];

    const searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    if (user.organizationIds?.length) {
      searchQuery._id = { $in: user.organizationIds.map(id => new ObjectId(id)) };
    }

    const organizations = await this.organizationRepository.find({ where: searchQuery });

    return organizations.map(org => ({
      id: org._id.toString(),
      title: org.name,
      subtitle: org.description,
      type: 'organization',
      module: 'organization-management',
      relevance: this.calculateRelevance(query, `${org.name} ${org.description}`),
      metadata: { status: 'active' }
    }));
  }

  private async searchClients(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'client-management', ActionType.READ, 'clients')) return [];

    const searchQuery: any = {
      $or: [
        { companyName: { $regex: query, $options: 'i' } },
        { contactPerson: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { companyName: { $regex: query, $options: 'i' } },
            { contactPerson: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const clients = await this.clientRepository.find({ where: filter });
    return clients.map(client => ({
      id: client._id.toString(),
      title: client.companyName,
      subtitle: `${client.contactPerson} - ${client.email}`,
      type: 'client',
      module: 'client-management',
      relevance: this.calculateRelevance(query, `${client.companyName} ${client.contactPerson} ${client.email}`),
      metadata: { status: client.isActive ? 'active' : 'inactive' }
    }));
  }

  private async searchClientRequests(query: string, permissions: Set<string>): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'client-management', ActionType.READ, 'requests')) return [];

    const searchQuery: any = {
      $or: [
        { companyName: { $regex: query, $options: 'i' } },
        { contactPerson: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    const requests = await this.clientRequestRepository.find({ where: searchQuery });
    return requests.map(req => ({
      id: req._id.toString(),
      title: `Request: ${req.companyName}`,
      subtitle: `${req.contactPerson} - ${req.status}`,
      type: 'client-request',
      module: 'client-management',
      relevance: this.calculateRelevance(query, `${req.companyName} ${req.contactPerson} ${req.email}`),
      metadata: { status: req.status }
    }));
  }

  private async searchProducts(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'catalogue', ActionType.READ, 'products')) return [];

    const searchQuery: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { productCode: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { productCode: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: new ObjectId(organizationId) },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const products = await this.productRepository.find({ where: filter });
    return products.map(product => ({
      id: product._id.toString(),
      title: product.name,
      subtitle: `${product.productCode} - ${product.description?.substring(0, 50)}...`,
      type: 'product',
      module: 'catalogue',
      relevance: this.calculateRelevance(query, `${product.name} ${product.productCode} ${product.description || ''}`),
      metadata: { status: product.isPublished ? 'published' : 'draft', price: product.basePrice }
    }));
  }

  private async searchCMS(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // Search Blog Posts
    if (this.hasPermission(permissions, 'cms', ActionType.READ, 'blogs')) {
      const blogQuery: any = {
        $and: [
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { excerpt: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      };
      if (organizationId) {
        blogQuery.$and.push({
          $or: [
            { organizationId: new ObjectId(organizationId) },
            { organizationId: { $exists: false } },
            { organizationId: null }
          ]
        });
      }
      const blogs = await this.blogPostRepository.find({ where: blogQuery });
      results.push(...blogs.map(blog => ({
        id: blog._id.toString(),
        title: blog.title,
        subtitle: blog.excerpt || 'Blog Post',
        type: 'blog-post',
        module: 'cms',
        relevance: this.calculateRelevance(query, `${blog.title} ${blog.excerpt || ''}`),
        metadata: { status: blog.status }
      })));
    }

    // Search Pages
    if (this.hasPermission(permissions, 'cms', ActionType.READ, 'pages')) {
      const pageQuery: any = {
        $and: [
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { slug: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      };
      if (organizationId) {
        // CMS pages usually don't have organizationId if they are global
        pageQuery.$and.push({
          $or: [
            { organizationId: new ObjectId(organizationId) },
            { organizationId: { $exists: false } },
            { organizationId: null }
          ]
        });
      }
      const pages = await this.pageRepository.find({ where: pageQuery });
      results.push(...pages.map(page => ({
        id: page._id.toString(),
        title: page.title,
        subtitle: `Page: /${page.slug}`,
        type: 'page',
        module: 'cms',
        relevance: this.calculateRelevance(query, `${page.title} ${page.slug}`),
        metadata: { status: page.status }
      })));
    }

    return results;
  }

  private async searchQuotations(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'quotations', ActionType.READ, 'quotations')) return [];

    const searchQuery: any = {
      $or: [
        { quotationNumber: { $regex: query, $options: 'i' } },
        { clientName: { $regex: query, $options: 'i' } },
        { clientEmail: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { quotationNumber: { $regex: query, $options: 'i' } },
            { clientName: { $regex: query, $options: 'i' } },
            { clientEmail: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: organizationId },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const quotations = await this.quotationRepository.find({ where: filter });
    return quotations.map(q => ({
      id: q._id.toString(),
      title: q.quotationNumber,
      subtitle: `${q.clientName || 'Unknown Client'} - $${q.grandTotal}`,
      type: 'quotation',
      module: 'quotations',
      relevance: this.calculateRelevance(query, `${q.quotationNumber} ${q.clientName || ''} ${q.clientEmail || ''}`),
      metadata: { status: q.status, total: q.grandTotal }
    }));
  }

  private async searchOrders(query: string, permissions: Set<string>, organizationId?: string): Promise<SearchResult[]> {
    if (!this.hasPermission(permissions, 'order-management', ActionType.READ, 'orders')) return [];

    const searchQuery: any = {
      $or: [
        { orderNumber: { $regex: query, $options: 'i' } },
        { clientName: { $regex: query, $options: 'i' } },
        { clientEmail: { $regex: query, $options: 'i' } }
      ]
    };

    const filter: any = {
      $and: [
        {
          $or: [
            { orderNumber: { $regex: query, $options: 'i' } },
            { clientName: { $regex: query, $options: 'i' } },
            { clientEmail: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };

    if (organizationId) {
      filter.$and.push({
        $or: [
          { organizationId: organizationId },
          { organizationId: { $exists: false } },
          { organizationId: null }
        ]
      });
    }

    const orders = await this.orderRepository.find({ where: filter });
    return orders.map(order => ({
      id: order._id.toString(),
      title: order.orderNumber,
      subtitle: `${order.clientName || 'Unknown Client'} - ${order.status}`,
      type: 'order',
      module: 'order-management',
      relevance: this.calculateRelevance(query, `${order.orderNumber} ${order.clientName || ''} ${order.clientEmail || ''}`),
      metadata: { status: order.status, total: order.totalAmount }
    }));
  }

  private calculateRelevance(query: string, text: string): number {
    if (!text) return 0;

    const queryLower = query.toLowerCase().trim();
    const textLower = text.toLowerCase();

    // Exact match gets highest score
    if (textLower === queryLower) {
      return 100;
    }

    // Starts with query gets high score
    if (textLower.startsWith(queryLower)) {
      return 90;
    }

    // Contains exact query
    if (textLower.includes(queryLower)) {
      const position = textLower.indexOf(queryLower);
      return Math.max(80 - position, 50);
    }

    // Word matching
    const words = queryLower.split(' ').filter(w => w.length > 0);
    let score = 0;
    let matchedWords = 0;

    words.forEach(word => {
      if (textLower.includes(word)) {
        matchedWords++;
        const position = textLower.indexOf(word);
        score += Math.max(30 - position / 10, 10);
      }
    });

    // Bonus for matching multiple words
    if (matchedWords > 1) {
      score += matchedWords * 5;
    }

    return Math.min(score, 95);
  }

  private applyFilters(results: SearchResult[], filters?: SearchFilters): SearchResult[] {
    if (!filters) return results;

    let filtered = results;

    if (filters.modules?.length) {
      filtered = filtered.filter(result => filters.modules.includes(result.module));
    }

    if (filters.types?.length) {
      filtered = filtered.filter(result => filters.types.includes(result.type));
    }

    return filtered;
  }

  async getSearchSuggestions(query: string, userId: string, organizationId?: string): Promise<string[]> {
    if (query.length < 2) return [];

    const results = await this.globalSearch(query, userId, organizationId, undefined, 10);
    return results.map(result => result.title).slice(0, 5);
  }
}