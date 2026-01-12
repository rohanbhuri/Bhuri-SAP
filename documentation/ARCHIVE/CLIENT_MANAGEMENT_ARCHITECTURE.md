# Client Management Module - Component Architecture

## Visual Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Management Module                      │
│                  (client-management.component.ts)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────────┐                  ┌──────────────────────┐
│  Tab 1: Requests     │                  │  Tab 2: Clients      │
│  Request Login List  │                  │  Clients List        │
└──────────────────────┘                  └──────────────────────┘
        │                                           │
        │                                           │
        ▼                                           ▼
┌──────────────────────┐                  ┌──────────────────────┐
│ RequestLoginList     │                  │ ClientsList          │
│ Component            │                  │ Component            │
│                      │                  │                      │
│ • Date Range Filter  │                  │ • Client Table       │
│ • Search Box         │                  │ • Active Toggle      │
│ • Request Table      │                  │ • Edit/Delete        │
│ • Create Login Btn   │                  │                      │
└──────────────────────┘                  └──────────────────────┘
        │
        │ (Click "Create Login")
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              Create Client Login Dialog                          │
│         (create-client-login-dialog.component.ts)                │
│                                                                  │
│  ┌────────────────────────┬────────────────────────┐           │
│  │  Tab 1: Basic Info     │  Tab 2: Additional     │           │
│  │                        │                        │           │
│  │  • Company Name *      │  • Industry            │           │
│  │  • First Name *        │  • Company Size        │           │
│  │  • Last Name *         │  • Address             │           │
│  │  • Email *             │  • City                │           │
│  │  • Phone *             │  • Country             │           │
│  │  • Password            │  • Tax ID              │           │
│  │  • Confirm Password    │  • Billing Address     │           │
│  │  • Website             │  • Notes               │           │
│  └────────────────────────┴────────────────────────┘           │
│                                                                  │
│  [Cancel]                              [Create Login]           │
└─────────────────────────────────────────────────────────────────┘
        │
        │ (On Success)
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Credentials Display                           │
│                                                                  │
│  ✓ Client Login Created Successfully!                           │
│                                                                  │
│  Email: client@example.com                                      │
│  Password: aB3$xY9#mN2@                                         │
│                                                                  │
│  ⚠ Please save these credentials securely!                      │
│                                                                  │
│  (Auto-closes after 5 seconds)                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│   Website    │
│  (Public)    │
└──────┬───────┘
       │
       │ POST /api/client-management/requests
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    Backend API                                │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  ClientManagementController                        │     │
│  │                                                     │     │
│  │  • POST   /requests                (Public)        │     │
│  │  • GET    /requests                (Admin)         │     │
│  │  • POST   /requests/:id/convert    (Admin)         │     │
│  │  • GET    /clients                 (Admin)         │     │
│  │  • PUT    /clients/:id             (Admin)         │     │
│  │  • DELETE /clients/:id             (Super Admin)   │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                   │
│                           ▼                                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │  ClientManagementService                           │     │
│  │                                                     │     │
│  │  • createClientRequest()                           │     │
│  │  • getAllClientRequests()                          │     │
│  │  • convertToClient()                               │     │
│  │    - Create Organization                           │     │
│  │    - Create User (CLIENT role)                     │     │
│  │    - Create Client record                          │     │
│  │    - Generate password                             │     │
│  │    - Update request status                         │     │
│  │  • getAllClients()                                 │     │
│  │  • updateClient()                                  │     │
│  │  • deleteClient()                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ client_requests  │  │     clients      │               │
│  │                  │  │                  │               │
│  │ • _id            │  │ • _id            │               │
│  │ • companyName    │  │ • userId         │               │
│  │ • contactPerson  │  │ • organizationId │               │
│  │ • email          │  │ • companyName    │               │
│  │ • phone          │  │ • contactPerson  │               │
│  │ • status         │  │ • email          │               │
│  │ • ...            │  │ • phone          │               │
│  └──────────────────┘  │ • taxId          │               │
│                        │ • isActive       │               │
│  ┌──────────────────┐  │ • ...            │               │
│  │      users       │  └──────────────────┘               │
│  │                  │                                      │
│  │ • _id            │  ┌──────────────────┐               │
│  │ • email          │  │  organizations   │               │
│  │ • password       │  │                  │               │
│  │ • firstName      │  │ • _id            │               │
│  │ • lastName       │  │ • name           │               │
│  │ • roleIds        │  │ • code           │               │
│  │ • organizationId │  │ • memberCount    │               │
│  │ • isActive       │  │ • ...            │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend Service Layer                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ClientManagementService (Angular)                 │    │
│  │                                                     │    │
│  │  Methods:                                          │    │
│  │  • createClientRequest()                           │    │
│  │  • getAllClientRequests()                          │    │
│  │  • getClientRequestById()                          │    │
│  │  • updateClientRequest()                           │    │
│  │  • convertToClient()                               │    │
│  │  • getAllClients()                                 │    │
│  │  • getClientById()                                 │    │
│  │  • updateClient()                                  │    │
│  │  • deleteClient()                                  │    │
│  │  • toggleClientStatus()                            │    │
│  │                                                     │    │
│  │  All methods return Observable<T>                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Service Layer                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ClientManagementService (NestJS)                  │    │
│  │                                                     │    │
│  │  Dependencies:                                     │    │
│  │  • ClientRequestRepository                         │    │
│  │  • ClientRepository                                │    │
│  │  • UserRepository                                  │    │
│  │  • OrganizationRepository                          │    │
│  │  • RoleRepository                                  │    │
│  │                                                     │    │
│  │  Methods:                                          │    │
│  │  • createClientRequest()                           │    │
│  │  • getAllClientRequests()                          │    │
│  │  • getClientRequestById()                          │    │
│  │  • updateClientRequest()                           │    │
│  │  • convertToClient()                               │    │
│  │    └─> Creates: Organization, User, Client        │    │
│  │  • getAllClients()                                 │    │
│  │  • getClientById()                                 │    │
│  │  • updateClient()                                  │    │
│  │  • deleteClient()                                  │    │
│  │  • toggleClientStatus()                            │    │
│  │  • generatePassword() (private)                    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Form Validation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Create Client Login Dialog                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│  Basic Form      │                  │ Additional Form  │
│  (FormGroup)     │                  │  (FormGroup)     │
└──────────────────┘                  └──────────────────┘
        │                                       │
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│  Validators:     │                  │  All Optional    │
│                  │                  │  No Validators   │
│  • required      │                  │                  │
│  • email         │                  │                  │
│  • custom        │                  │                  │
└──────────────────┘                  └──────────────────┘
        │
        │
        ▼
┌──────────────────────────────────────────────────────────┐
│           Password Match Validator                        │
│                                                           │
│  if (password !== confirmPassword) {                     │
│    return { passwordMismatch: true };                    │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
        │
        │ (On Submit)
        ▼
┌──────────────────────────────────────────────────────────┐
│           Merge Both Forms                                │
│                                                           │
│  const data = {                                          │
│    ...basicForm.value,                                   │
│    ...additionalForm.value                               │
│  };                                                       │
└──────────────────────────────────────────────────────────┘
        │
        │
        ▼
┌──────────────────────────────────────────────────────────┐
│           Send to Backend                                 │
│                                                           │
│  POST /api/client-management/requests/:id/convert        │
└──────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Component State                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   requests   │  │   loading    │  │ credentials  │
│   (array)    │  │  (boolean)   │  │   (object)   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Display in   │  │ Show/Hide    │  │ Display in   │
│ Table        │  │ Spinner      │  │ Success Box  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    API Call                                  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│    Success       │                  │     Error        │
└──────────────────┘                  └──────────────────┘
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│ • Update state   │                  │ • Log error      │
│ • Show success   │                  │ • Show snackbar  │
│ • Display creds  │                  │ • Keep dialog    │
│ • Auto-close     │                  │   open           │
└──────────────────┘                  └──────────────────┘
```

## File Dependencies

```
request-login-list.component.ts
├── Imports:
│   ├── @angular/common
│   ├── @angular/forms
│   ├── @angular/material/*
│   └── client-management.service.ts
└── Opens:
    └── create-client-login-dialog.component.ts

create-client-login-dialog.component.ts
├── Imports:
│   ├── @angular/common
│   ├── @angular/forms
│   ├── @angular/material/*
│   └── client-management.service.ts
└── Receives:
    └── Request data via MAT_DIALOG_DATA

client-management.service.ts (Frontend)
├── Imports:
│   ├── @angular/common/http
│   └── brand-config.service.ts
└── Calls:
    └── Backend API endpoints

client-management.service.ts (Backend)
├── Imports:
│   ├── @nestjs/common
│   ├── typeorm
│   └── entities/*
└── Uses:
    ├── ClientRequestRepository
    ├── ClientRepository
    ├── UserRepository
    ├── OrganizationRepository
    └── RoleRepository
```

## Module Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    App Module                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Client Management Module                        │
│                                                              │
│  Routes:                                                     │
│  • /modules/client-management                               │
│  • /modules/client-management/requests                      │
│  • /modules/client-management/clients                       │
│  • /modules/client-management/request-access (public)       │
│                                                              │
│  Components:                                                 │
│  • ClientManagementComponent (main)                         │
│  • RequestLoginListComponent                                │
│  • CreateClientLoginDialogComponent                         │
│  • ClientsListComponent                                     │
│  • PublicClientRequestComponent                             │
│                                                              │
│  Services:                                                   │
│  • ClientManagementService                                  │
└─────────────────────────────────────────────────────────────┘
```

---

This visual architecture shows how all components work together to create a complete, production-ready Client Management module!
