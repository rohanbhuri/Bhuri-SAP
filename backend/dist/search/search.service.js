"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const user_entity_1 = require("../entities/user.entity");
const permission_entity_1 = require("../entities/permission.entity");
const role_entity_1 = require("../entities/role.entity");
const organization_entity_1 = require("../entities/organization.entity");
const employee_entity_1 = require("../entities/employee.entity");
const project_entity_1 = require("../entities/project.entity");
const task_entity_1 = require("../entities/task.entity");
const contact_entity_1 = require("../entities/contact.entity");
const lead_entity_1 = require("../entities/lead.entity");
const deal_entity_1 = require("../entities/deal.entity");
const department_entity_1 = require("../entities/department.entity");
const module_entity_1 = require("../entities/module.entity");
const client_entity_1 = require("../entities/client.entity");
const client_request_entity_1 = require("../entities/client-request.entity");
const product_entity_1 = require("../entities/product.entity");
const blog_post_entity_1 = require("../entities/blog-post.entity");
const page_entity_1 = require("../entities/page.entity");
const quotation_entity_1 = require("../entities/quotation.entity");
const order_entity_1 = require("../entities/order.entity");
let SearchService = class SearchService {
    constructor(userRepository, permissionRepository, roleRepository, organizationRepository, employeeRepository, projectRepository, taskRepository, contactRepository, leadRepository, dealRepository, departmentRepository, moduleRepository, clientRepository, clientRequestRepository, productRepository, blogPostRepository, pageRepository, quotationRepository, orderRepository) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.organizationRepository = organizationRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.contactRepository = contactRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.departmentRepository = departmentRepository;
        this.moduleRepository = moduleRepository;
        this.clientRepository = clientRepository;
        this.clientRequestRepository = clientRequestRepository;
        this.productRepository = productRepository;
        this.blogPostRepository = blogPostRepository;
        this.pageRepository = pageRepository;
        this.quotationRepository = quotationRepository;
        this.orderRepository = orderRepository;
    }
    async globalSearch(query, userId, organizationId, filters, limit = 50) {
        console.log('Search request:', { query, userId, organizationId, filters, limit });
        const user = await this.userRepository.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        if (!user) {
            console.log('User not found:', userId);
            return [];
        }
        const userPermissions = await this.getUserPermissions(user);
        console.log('User permissions:', Array.from(userPermissions));
        const results = [];
        const searchPromises = [];
        const userActiveModuleIds = user.activeModuleIds || [];
        const activeModules = await this.moduleRepository.find({
            where: { _id: { $in: userActiveModuleIds.map(id => new mongodb_1.ObjectId(id)) } }
        });
        const activeModuleKeys = activeModules.map(m => m.name);
        console.log('User active module keys:', activeModuleKeys);
        let modulesToSearch = filters?.modules || activeModuleKeys;
        modulesToSearch = modulesToSearch.filter(m => activeModuleKeys.includes(m));
        console.log('Modules to be searched:', modulesToSearch);
        if (modulesToSearch.includes('user-management')) {
            searchPromises.push(this.searchUsers(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('hr-management')) {
            searchPromises.push(this.searchEmployees(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('projects-management')) {
            searchPromises.push(this.searchProjects(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('tasks-management')) {
            searchPromises.push(this.searchTasks(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('crm')) {
            searchPromises.push(this.searchContacts(query, userPermissions, organizationId));
            searchPromises.push(this.searchLeads(query, userPermissions, organizationId));
            searchPromises.push(this.searchDeals(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('organization-management')) {
            searchPromises.push(this.searchDepartments(query, userPermissions, organizationId));
            searchPromises.push(this.searchOrganizations(query, userPermissions, user));
        }
        if (modulesToSearch.includes('client-management')) {
            searchPromises.push(this.searchClients(query, userPermissions, organizationId));
            searchPromises.push(this.searchClientRequests(query, userPermissions));
        }
        if (modulesToSearch.includes('catalogue')) {
            searchPromises.push(this.searchProducts(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('cms')) {
            searchPromises.push(this.searchCMS(query, userPermissions, organizationId));
        }
        if (modulesToSearch.includes('quotations')) {
            searchPromises.push(this.searchQuotations(query, userPermissions, organizationId));
        }
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
    async getUserPermissions(user) {
        const permissions = new Set();
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
            if (roles.some(role => role.type === 'super_admin')) {
                permissions.add('*:*:*');
            }
        }
        return permissions;
    }
    hasPermission(permissions, module, action, resource) {
        return permissions.has(`${module}:${action}:${resource}`) ||
            permissions.has(`${module}:${action}:organization`) ||
            permissions.has(`${module}:${action}:*`) ||
            permissions.has(`*:${action}:${resource}`) ||
            permissions.has(`*:*:*`) ||
            permissions.has(`admin:*:*`) ||
            permissions.size === 0;
    }
    async searchUsers(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'user-management', permission_entity_1.ActionType.READ, 'users'))
            return [];
        const searchQuery = {
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationIds: { $in: [new mongodb_1.ObjectId(organizationId)] } },
                    { organizationId: new mongodb_1.ObjectId(organizationId) }
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
    async searchEmployees(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'hr-management', permission_entity_1.ActionType.READ, 'employees'))
            return [];
        const searchQuery = {
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { employeeId: { $regex: query, $options: 'i' } },
                { position: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchProjects(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'projects-management', permission_entity_1.ActionType.READ, 'projects'))
            return [];
        const searchQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
        }
        catch (error) {
            console.error('Error searching projects:', error);
            return [];
        }
    }
    async searchTasks(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'tasks-management', permission_entity_1.ActionType.READ, 'tasks'))
            return [];
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
        }
        catch (error) {
            console.error('Error searching tasks:', error);
            return [];
        }
    }
    async searchContacts(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'crm', permission_entity_1.ActionType.READ, 'contacts'))
            return [];
        const searchQuery = {
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { company: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchLeads(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'crm', permission_entity_1.ActionType.READ, 'leads'))
            return [];
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { source: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchDeals(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'crm', permission_entity_1.ActionType.READ, 'deals'))
            return [];
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchDepartments(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'organization-management', permission_entity_1.ActionType.READ, 'departments'))
            return [];
        const searchQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchOrganizations(query, permissions, user) {
        if (!this.hasPermission(permissions, 'organization-management', permission_entity_1.ActionType.READ, 'organizations'))
            return [];
        const searchQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
        if (user.organizationIds?.length) {
            searchQuery._id = { $in: user.organizationIds.map(id => new mongodb_1.ObjectId(id)) };
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
    async searchClients(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'client-management', permission_entity_1.ActionType.READ, 'clients'))
            return [];
        const searchQuery = {
            $or: [
                { companyName: { $regex: query, $options: 'i' } },
                { contactPerson: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchClientRequests(query, permissions) {
        if (!this.hasPermission(permissions, 'client-management', permission_entity_1.ActionType.READ, 'requests'))
            return [];
        const searchQuery = {
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
    async searchProducts(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'catalogue', permission_entity_1.ActionType.READ, 'products'))
            return [];
        const searchQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { productCode: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
                    { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchCMS(query, permissions, organizationId) {
        const results = [];
        if (this.hasPermission(permissions, 'cms', permission_entity_1.ActionType.READ, 'blogs')) {
            const blogQuery = {
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
                        { organizationId: new mongodb_1.ObjectId(organizationId) },
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
        if (this.hasPermission(permissions, 'cms', permission_entity_1.ActionType.READ, 'pages')) {
            const pageQuery = {
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
                pageQuery.$and.push({
                    $or: [
                        { organizationId: new mongodb_1.ObjectId(organizationId) },
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
    async searchQuotations(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'quotations', permission_entity_1.ActionType.READ, 'quotations'))
            return [];
        const searchQuery = {
            $or: [
                { quotationNumber: { $regex: query, $options: 'i' } },
                { clientName: { $regex: query, $options: 'i' } },
                { clientEmail: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
    async searchOrders(query, permissions, organizationId) {
        if (!this.hasPermission(permissions, 'order-management', permission_entity_1.ActionType.READ, 'orders'))
            return [];
        const searchQuery = {
            $or: [
                { orderNumber: { $regex: query, $options: 'i' } },
                { clientName: { $regex: query, $options: 'i' } },
                { clientEmail: { $regex: query, $options: 'i' } }
            ]
        };
        const filter = {
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
    calculateRelevance(query, text) {
        if (!text)
            return 0;
        const queryLower = query.toLowerCase().trim();
        const textLower = text.toLowerCase();
        if (textLower === queryLower) {
            return 100;
        }
        if (textLower.startsWith(queryLower)) {
            return 90;
        }
        if (textLower.includes(queryLower)) {
            const position = textLower.indexOf(queryLower);
            return Math.max(80 - position, 50);
        }
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
        if (matchedWords > 1) {
            score += matchedWords * 5;
        }
        return Math.min(score, 95);
    }
    applyFilters(results, filters) {
        if (!filters)
            return results;
        let filtered = results;
        if (filters.modules?.length) {
            filtered = filtered.filter(result => filters.modules.includes(result.module));
        }
        if (filters.types?.length) {
            filtered = filtered.filter(result => filters.types.includes(result.type));
        }
        return filtered;
    }
    async getSearchSuggestions(query, userId, organizationId) {
        if (query.length < 2)
            return [];
        const results = await this.globalSearch(query, userId, organizationId, undefined, 10);
        return results.map(result => result.title).slice(0, 5);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(3, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(4, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(5, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(6, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(7, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(8, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __param(9, (0, typeorm_1.InjectRepository)(deal_entity_1.Deal)),
    __param(10, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(11, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(12, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(13, (0, typeorm_1.InjectRepository)(client_request_entity_1.ClientRequest)),
    __param(14, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(15, (0, typeorm_1.InjectRepository)(blog_post_entity_1.BlogPost)),
    __param(16, (0, typeorm_1.InjectRepository)(page_entity_1.Page)),
    __param(17, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(18, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], SearchService);
//# sourceMappingURL=search.service.js.map