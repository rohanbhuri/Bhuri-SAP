"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("@nestjs/typeorm");
const organization_entity_1 = require("./entities/organization.entity");
async function updateOrganizationName() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const organizationRepository = app.get((0, typeorm_1.getRepositoryToken)(organization_entity_1.Organization));
        const result = await organizationRepository.updateMany({ name: 'Racconti Corporation' }, { $set: { name: 'RACCONTI' } });
        console.log(`✅ Updated ${result.modifiedCount} organization(s)`);
        console.log('Organization name changed from "Racconti Corporation" to "RACCONTI"');
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await app.close();
    }
}
updateOrganizationName();
//# sourceMappingURL=update-org-name.js.map