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
  ) {}

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

    const searchPromises = [
      this.searchUsers(query, userPermissions, organizationId),
      this.searchEmployees(query, userPermissions, organizationId),
      this.searchProjects(query, userPermissions, organizationId),
      this.searchTasks(query, userPermissions, organizationId),
      this.searchContacts(query, userPermissions, organizationId),
      this.searchLeads(query, userPermissions, organizationId),
      this.searchDeals(query, userPermissions, organizationId),
      this.searchDepartments(query, userPermissions, organizationId),
      this.searchOrganizations(query, userPermissions, user),
    ];

    const searchResults = await Promise.all(searchPromises);
    searchResults.forEach((moduleResults, index) => {
      console.log(`Search module ${index} returned ${moduleResults.length} results`);
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
    }

    if (user.permissionIds?.length) {
      const directPermissions = await this.permissionRepository.find({
        where: { _id: { $in: user.permissionIds } }
      });
      
      directPermissions.forEach(perm => {
        permissions.add(`${perm.module}:${perm.action}:${perm.resource}`);
      });
    }

    return permissions;
  }

  private hasPermission(permissions: Set<string>, module: string, action: ActionType, resource: string): boolean {
    // Allow search if user has any read permission or is admin
    return permissions.has(`${module}:${action}:${resource}`) || 
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

    if (organizationId) {
      searchQuery.organizationIds = new ObjectId(organizationId);
    }

    const users = await this.userRepository.find({ where: searchQuery });
    
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    const employees = await this.employeeRepository.find({ where: searchQuery });
    
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    try {
      const projects = await this.projectRepository.find({ where: searchQuery });
      
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    try {
      const tasks = await this.taskRepository.find({ where: searchQuery });
      
      return tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        subtitle: task.description || 'No description',
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    const contacts = await this.contactRepository.find({ where: searchQuery });
    
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    const leads = await this.leadRepository.find({ where: searchQuery });
    
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    const deals = await this.dealRepository.find({ where: searchQuery });
    
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

    if (organizationId) {
      searchQuery.organizationId = new ObjectId(organizationId);
    }

    const departments = await this.departmentRepository.find({ where: searchQuery });
    
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
      ],
      _id: { $in: user.organizationIds }
    };

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