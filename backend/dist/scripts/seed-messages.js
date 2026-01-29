"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedMessages = seedMessages;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const messages_service_1 = require("../messages/messages.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
async function seedMessages() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const messagesService = app.get(messages_service_1.MessagesService);
    const userRepo = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    const orgRepo = app.get((0, typeorm_1.getRepositoryToken)(organization_entity_1.Organization));
    try {
        console.log('Seeding messages data...');
        const users = await userRepo.find({ take: 5 });
        const orgs = await orgRepo.find({ take: 2 });
        if (users.length < 2 || orgs.length < 1) {
            console.log('Not enough users or organizations found. Please create some first.');
            return;
        }
        const [user1, user2, user3] = users;
        const org = orgs[0];
        console.log(`Creating conversations for organization: ${org.name}`);
        const dmConv = await messagesService.getOrCreateDM(org._id.toString(), user1._id.toString(), user2._id.toString());
        console.log('Created DM conversation:', dmConv._id);
        await messagesService.sendMessage(dmConv._id.toString(), user1._id.toString(), 'Hey there! How are you doing?');
        await messagesService.sendMessage(dmConv._id.toString(), user2._id.toString(), 'Hi! I\'m doing great, thanks for asking. How about you?');
        await messagesService.sendMessage(dmConv._id.toString(), user1._id.toString(), 'I\'m good too! Just working on some new features for our messaging system.');
        await messagesService.sendMessage(dmConv._id.toString(), user2._id.toString(), 'That sounds exciting! Can\'t wait to see what you\'ve built.');
        if (users.length >= 3) {
            const groupConv = await messagesService.createGroup(org._id.toString(), 'Project Team', [user1._id.toString(), user2._id.toString(), user3._id.toString()]);
            console.log('Created group conversation:', groupConv._id);
            await messagesService.sendMessage(groupConv._id.toString(), user1._id.toString(), 'Welcome to our project team chat!');
            await messagesService.sendMessage(groupConv._id.toString(), user2._id.toString(), 'Thanks for setting this up!');
            await messagesService.sendMessage(groupConv._id.toString(), user3._id.toString(), 'Great to be part of the team! 🎉');
        }
        console.log('Messages seeding completed successfully!');
    }
    catch (error) {
        console.error('Error seeding messages:', error);
    }
    finally {
        await app.close();
    }
}
if (require.main === module) {
    seedMessages();
}
//# sourceMappingURL=seed-messages.js.map