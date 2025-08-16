# CRM Module Setup Guide

## Overview
The CRM (Customer Relationship Management) module provides comprehensive tools for managing customer relationships, sales pipeline, and business processes.

## Features

### 1. Contact Management
- Store customer details (name, email, phone, company, position)
- Add notes and track conversation history
- Organize contacts by status and categories
- Search and filter contacts

### 2. Lead Handling
- Collect and manage new customer leads
- Track lead sources and estimated values
- Mark leads as: new, qualified, contacted, converted, or lost
- Convert leads to deals

### 3. Task & Reminder System
- Set follow-up reminders for customers
- Track sales and support tasks
- Organize tasks by priority (low, medium, high, urgent)
- Task types: task, call, email, meeting, follow-up

### 4. Sales Tracking
- Track sales opportunities ("deals")
- Record deal stages: prospecting, qualification, proposal, negotiation, closed-won, closed-lost
- Set expected values and close dates
- Monitor win/loss ratios

### 5. Reporting Dashboard
- Real-time statistics on contacts, leads, deals
- Pipeline value tracking
- Pending tasks overview
- Visual charts and summary tables

### 6. User Roles & Security
- Role-based access control
- Protect sensitive customer data
- Organization-level data isolation

### 7. Integration Ready
- RESTful API for external integrations
- Import/export capabilities
- Extensible architecture

## Installation

### 1. Backend Setup

The CRM module has been integrated into the existing NestJS backend:

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Initialize CRM module in database
npm run init:crm

# Start the backend server
npm run start:dev
```

### 2. Frontend Integration

The CRM module is automatically available in the frontend:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the frontend server
npm start
```

## Database Entities

### Contact Entity
- Personal information (name, email, phone)
- Company details (company, position)
- Notes and custom fields
- Status tracking
- Organization association

### Lead Entity
- Lead title and description
- Status tracking (new → converted/lost)
- Estimated value and source
- Expected close date
- Contact association

### Deal Entity
- Deal title and description
- Value and probability
- Stage progression
- Expected and actual close dates
- Contact and lead associations

### Task Entity
- Task details and description
- Status and priority levels
- Due dates and reminders
- Type classification
- Entity associations (contact, lead, deal)

## API Endpoints

### Dashboard
- `GET /crm/dashboard` - Get CRM statistics

### Contacts
- `GET /crm/contacts` - List all contacts
- `POST /crm/contacts` - Create new contact

### Leads
- `GET /crm/leads` - List all leads
- `POST /crm/leads` - Create new lead

### Deals
- `GET /crm/deals` - List all deals
- `POST /crm/deals` - Create new deal

### Tasks
- `GET /crm/tasks` - List all tasks
- `POST /crm/tasks` - Create new task

## Usage

### 1. Accessing CRM
- Navigate to the dashboard
- Click on the CRM widget or use the modules page
- Access via `/modules/crm` route

### 2. Widget Integration
The CRM widget displays on the dashboard showing:
- Active leads count
- Open deals count
- Pipeline value

### 3. Module Activation
The CRM module is configured as a public module, meaning:
- No special permissions required
- Automatically available to all organizations
- Can be activated through the modules page

## Development

### Adding New Features
1. Backend: Add new endpoints in `CrmController`
2. Backend: Extend `CrmService` with business logic
3. Frontend: Update `CrmService` for API calls
4. Frontend: Extend components as needed

### Customization
- Modify entity fields in backend entities
- Update frontend interfaces in `crm.service.ts`
- Extend dashboard statistics in `CrmService.getDashboardStats()`

## Security Considerations
- All endpoints require JWT authentication
- Data is isolated by organization
- Role-based access can be added for sensitive operations
- Input validation on all API endpoints

## Future Enhancements
- Email integration
- Calendar synchronization
- Advanced reporting and analytics
- Mobile app support
- Third-party CRM integrations
- Automated workflows
- AI-powered lead scoring

## Troubleshooting

### Module Not Appearing
1. Ensure CRM module is in database: `npm run init:crm`
2. Check if module is activated for your organization
3. Verify user permissions

### API Errors
1. Check backend server is running
2. Verify database connection
3. Check authentication tokens
4. Review server logs for detailed errors

### Widget Not Loading
1. Verify CRM service is properly imported
2. Check API endpoints are accessible
3. Review browser console for errors