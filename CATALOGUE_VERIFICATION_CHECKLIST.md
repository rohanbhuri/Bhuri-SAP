# Catalogue Module - Verification Checklist

## Pre-Deployment Checklist

### Backend Setup
- [ ] MongoDB is running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Upload directories created:
  - [ ] `backend/uploads/products/images/`
  - [ ] `backend/uploads/products/videos/`
  - [ ] `backend/uploads/products/models/`
- [ ] Environment variables configured (`.env`)
- [ ] Database seeded (`node src/scripts/seed-racconti.js`)
- [ ] Backend starts without errors (`npm run start:dev`)

### Frontend Setup
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Environment file exists (`src/environments/environment.ts`)
- [ ] Frontend starts without errors (`npm start`)
- [ ] Can access application at `http://localhost:4200`

### Authentication
- [ ] Can login with admin@racconti.com / admin123
- [ ] Redirects to dashboard after login
- [ ] Can navigate to Catalogue module

## Feature Verification

### Product Table
- [ ] Table displays with correct columns:
  - [ ] Image (60x60px)
  - [ ] Product (name + code)
  - [ ] Collection
  - [ ] Category
  - [ ] Tags (max 2 shown)
  - [ ] Status
  - [ ] Actions
- [ ] Header is properly aligned (space-between)
- [ ] "Add Product" button is visible
- [ ] Sample products are displayed
- [ ] Actions menu works (Edit, Duplicate, Publish, Delete)

### Product Dialog - Basic Info Tab
- [ ] Dialog opens when clicking "Add Product"
- [ ] All fields are present:
  - [ ] Product Name (required)
  - [ ] Product Code (required)
  - [ ] Slug (auto-generated)
  - [ ] Short Description
  - [ ] Full Description (HTML)
  - [ ] Base Price
  - [ ] Currency dropdown
  - [ ] Category dropdown
  - [ ] Collection dropdown
  - [ ] Tags input (chip-based)
  - [ ] Published checkbox
- [ ] Slug auto-generates from name
- [ ] Form validation works
- [ ] Can add tags by typing and pressing Enter
- [ ] Can remove tags by clicking X

### Product Dialog - Media Tab
- [ ] Tab is accessible
- [ ] Images section:
  - [ ] Upload button works
  - [ ] Can select multiple images
  - [ ] Images upload successfully
  - [ ] Preview shows uploaded images
  - [ ] Can remove images
  - [ ] URL input field works
- [ ] Videos section:
  - [ ] Upload button works
  - [ ] Can upload video
  - [ ] URL input field works
- [ ] 3D Models section:
  - [ ] Upload button works
  - [ ] Can upload .glb/.gltf files
  - [ ] URL input field works

### Product Dialog - Measurements Tab
- [ ] Tab is accessible
- [ ] "Add Measurement" button works
- [ ] Can add measurement with name
- [ ] Can add options to measurement
- [ ] Each option has:
  - [ ] Value field
  - [ ] Price modifier field
- [ ] Can remove options
- [ ] Can remove measurements
- [ ] Accordion expands/collapses
- [ ] Multiple measurements can be added

### Product Dialog - SEO Tab
- [ ] Tab is accessible
- [ ] SEO Title field present
- [ ] SEO Description field present
- [ ] SEO Keywords field present
- [ ] All fields save correctly

### CRUD Operations
- [ ] Create Product:
  - [ ] Fill all required fields
  - [ ] Upload media
  - [ ] Add measurements
  - [ ] Click "Create"
  - [ ] Product appears in table
  - [ ] Success feedback shown
- [ ] Edit Product:
  - [ ] Click Edit from actions menu
  - [ ] Dialog opens with existing data
  - [ ] All fields are populated
  - [ ] Can modify fields
  - [ ] Click "Update"
  - [ ] Changes reflect in table
- [ ] Duplicate Product:
  - [ ] Click Duplicate from actions menu
  - [ ] Dialog opens with copied data
  - [ ] Name has "(Copy)" suffix
  - [ ] Product code has "-COPY" suffix
  - [ ] Status is set to Draft
  - [ ] Can create duplicate
- [ ] Publish/Unpublish:
  - [ ] Click Publish/Unpublish from actions menu
  - [ ] Status changes immediately
  - [ ] Table updates
- [ ] Delete Product:
  - [ ] Click Delete from actions menu
  - [ ] Confirmation dialog appears
  - [ ] Product is removed from table

## Dynamic Pricing Verification

### Test Scenario 1: Simple Measurement
- [ ] Create product with base price $100
- [ ] Add "Size" measurement:
  - [ ] Small: +$0
  - [ ] Large: +$50
- [ ] Save product
- [ ] Verify data saved correctly

### Test Scenario 2: Multiple Measurements
- [ ] Create product with base price $899
- [ ] Add "Seating" measurement:
  - [ ] 2 Seater: +$0
  - [ ] 3 Seater: +$200
  - [ ] 4 Seater: +$400
- [ ] Add "Material" measurement:
  - [ ] Fabric: +$0
  - [ ] Leather: +$300
  - [ ] Velvet: +$250
- [ ] Add "Color" measurement:
  - [ ] Gray: +$0
  - [ ] Blue: +$0
  - [ ] Beige: +$0
- [ ] Save product
- [ ] Verify all measurements saved
- [ ] Calculate: 3 Seater + Leather + Blue = $899 + $200 + $300 = $1,399

## File Upload Verification

### Image Upload
- [ ] Select image file
- [ ] File uploads to backend
- [ ] File saved in `backend/uploads/products/images/`
- [ ] URL returned from API
- [ ] Preview shows in dialog
- [ ] Product saves with image URL

### Video Upload
- [ ] Select video file
- [ ] File uploads to backend
- [ ] File saved in `backend/uploads/products/videos/`
- [ ] URL returned from API
- [ ] Product saves with video URL

### 3D Model Upload
- [ ] Select .glb or .gltf file
- [ ] File uploads to backend
- [ ] File saved in `backend/uploads/products/models/`
- [ ] URL returned from API
- [ ] Product saves with model URL

## API Verification

### Test with Postman/cURL
- [ ] GET /api/catalogue/products - Returns products array
- [ ] GET /api/catalogue/products/:id - Returns single product
- [ ] POST /api/catalogue/products - Creates product
- [ ] PUT /api/catalogue/products/:id - Updates product
- [ ] DELETE /api/catalogue/products/:id - Deletes product
- [ ] POST /api/catalogue/products/upload-images - Uploads images
- [ ] POST /api/catalogue/products/upload-video - Uploads video
- [ ] POST /api/catalogue/products/upload-model - Uploads model

## Data Integrity

### Database Check
- [ ] Products collection exists
- [ ] Products have correct schema:
  - [ ] productCode (not sku)
  - [ ] basePrice (not price)
  - [ ] images (array)
  - [ ] videos (array)
  - [ ] models3d (array)
  - [ ] tags (array)
  - [ ] measurements (array)
- [ ] Categories collection exists
- [ ] Collections collection exists

## Error Handling

### Test Error Scenarios
- [ ] Try to create product without required fields
- [ ] Try to upload invalid file type
- [ ] Try to upload oversized file
- [ ] Try to delete non-existent product
- [ ] Test with network disconnected
- [ ] Verify error messages are user-friendly

## Performance

### Load Testing
- [ ] Table loads quickly with 10 products
- [ ] Table loads acceptably with 100 products
- [ ] Dialog opens quickly
- [ ] File uploads complete in reasonable time
- [ ] No memory leaks in browser
- [ ] No console errors

## Browser Compatibility

### Test in Multiple Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Responsiveness

### Test on Different Screen Sizes
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Documentation

### Verify Documentation
- [ ] CATALOGUE_PRODUCTION_READY.md is complete
- [ ] CATALOGUE_CHANGES_SUMMARY.md is accurate
- [ ] CATALOGUE_QUICK_REFERENCE.md is helpful
- [ ] CATALOGUE_IMPLEMENTATION_COMPLETE.md is comprehensive
- [ ] README.md has links to catalogue docs
- [ ] setup-catalogue.sh works correctly

## Security

### Security Checks
- [ ] File upload validates file types
- [ ] File upload has size limits
- [ ] HTML input is sanitized (or will be)
- [ ] Authentication guards in place (or planned)
- [ ] No sensitive data in console logs
- [ ] No API keys exposed in frontend

## Production Readiness

### Final Checks
- [ ] All features work as expected
- [ ] No critical bugs
- [ ] Performance is acceptable
- [ ] Documentation is complete
- [ ] Code is clean and maintainable
- [ ] Error handling is robust
- [ ] Logging is adequate
- [ ] Backup strategy in place

## Post-Deployment

### After Going Live
- [ ] Monitor error logs
- [ ] Check upload directory size
- [ ] Monitor database performance
- [ ] Gather user feedback
- [ ] Plan Phase 2 features

## Known Issues / Limitations

Document any known issues:
- [ ] WYSIWYG editor not yet integrated (planned for Phase 2)
- [ ] Pagination not implemented (planned)
- [ ] Search/filter not implemented (planned)
- [ ] Cloud storage not configured (local storage only)
- [ ] Image optimization not implemented

## Sign-Off

### Development Team
- [ ] Backend implementation complete
- [ ] Frontend implementation complete
- [ ] Testing complete
- [ ] Documentation complete

### QA Team
- [ ] Functional testing passed
- [ ] Integration testing passed
- [ ] Performance testing passed
- [ ] Security review passed

### Product Owner
- [ ] All requirements met
- [ ] User acceptance testing passed
- [ ] Ready for production deployment

---

## Notes

Use this checklist to verify the implementation before deploying to production.

Check off each item as you verify it. Any unchecked items should be addressed before going live.

For issues, refer to:
- `documentation/CATALOGUE_PRODUCTION_READY.md`
- `documentation/CATALOGUE_QUICK_REFERENCE.md`
- Backend logs
- Browser console

---

**Date:** _______________
**Verified By:** _______________
**Status:** [ ] Ready for Production [ ] Needs Work
