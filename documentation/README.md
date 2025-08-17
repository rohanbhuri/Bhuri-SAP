# Bhuri SAP Documentation Index

## Overview
Centralized documentation for Bhuri SAP, covering setup, architecture, modules, and operations. Use this index for easy navigation on GitHub.

## Quick Links
- Root Project: ../README.md
- Backend: ../backend
- Frontend: ../frontend

## Getting Started
- Setup Guide: ./SETUP_GUIDE.md
- API Documentation: ./API_DOCUMENTATION.md
- System Blueprint: ./blueprint.md
- Database Blueprint: ./DATABASE_BLUEPRINT.md

## Brand & Build
- Brand Configuration: ./BRAND_CONFIG.md
- PWA Setup: ./PWA_SETUP.md
- Landing Page Setup: ./LANDING_PAGE_SETUP.md

## Modules
- Modules Created (overview): ./MODULES_CREATED.md
- Module Management (user story): ./MODULE_MANAGEMENT_USER_STORY.md
- Project Management Modules: ./PROJECT_MANAGEMENT_MODULES.md
- CRM Setup: ./crm-setup.md

## User Management
- User Management Setup: ./user-management-setup.md
- User Management Complete: ./user-management-complete.md
- Setup User Management (widgets & integration): ./setup-user-management.md

## Database & Data Ops
- Database Setup: ./database-setup.md
- Database Modules Setup (seeding & flows): ./DATABASE_MODULES_SETUP.md

## Current Status (Summary)
- Backend (NestJS): Core modules present (auth, users, organizations, roles, modules, preferences, CRM, HR, projects). Logs and dist present indicating builds are working.
- Frontend (Angular 20+): SSR and prerender files exist; PWA assets and update flow are documented; landing page and 404 documented; module widgets integrated.
- Deployment: PM2-based, EC2 t3.micro noted; production ports 3000/3001 backend, 4200/4201 frontend.
- Brand System: beax-rm (default) and true-process supported via config.js and start.js workflows.

## Future Work
- Backend
  - Harden RBAC with permission guards across all routes
  - Add e2e and unit tests for critical modules (auth, users, roles)
  - Implement WebSocket events for live dashboards (optional)
- Frontend
  - Expand SSR/prerender coverage where useful (analytics pages)
  - Add role-based route guards to module routes where missing
  - Improve error states and skeleton loaders across modules
- Modules
  - Complete placeholders (project-tracking, timesheet, finance ops)
  - Add analytics dashboards and reporting endpoints
- DevOps
  - Document PM2 ecosystem config per brand, add health checks
  - Add CI (build, lint) and basic test stage
- Documentation
  - Merge overlapping docs after review (e.g., user-management setup guides)
  - Keep secrets out of docs; prefer .env for URIs and secrets

## Notes on Obsolete/Overlapping Docs
- The following pairs overlap and can be merged after a quick content review:
  - user-management-setup.md and setup-user-management.md
  - DATABASE_MODULES_SETUP.md and MODULES_CREATED.md
- Marking for consolidation here only; files retained to avoid breaking links.