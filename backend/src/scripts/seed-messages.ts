import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MessagesService } from '../messages/messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { MongoRepository } from 'typeorm';

async function seedMessages() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const messagesService = app.get(MessagesService);
  const userRepo = app.get<MongoRepository<User>>(getRepositoryToken(User));
  const orgRepo = app.get<MongoRepository<Organization>>(getRepositoryToken(Organization));

  try {
    console.log('Seeding messages data...');

    // Get existing users and organizations
    const users = await userRepo.find({ take: 5 });
    const orgs = await orgRepo.find({ take: 2 });

    if (users.length < 2 || orgs.length < 1) {
      console.log('Not enough users or organizations found. Please create some first.');
      return;
    }

    const [user1, user2, user3] = users;
    const org = orgs[0];

    console.log(`Creating conversations for organization: ${org.name}`);

    // Create a DM conversation between user1 and user2
    const dmConv = await messagesService.getOrCreateDM(
      org._id.toString(),
      user1._id.toString(),
      user2._id.toString()
    );

    console.log('Created DM conversation:', dmConv._id);

    // Send some sample messages
    await messagesService.sendMessage(
      dmConv._id.toString(),
      user1._id.toString(),
      'Hey there! How are you doing?'
    );

    await messagesService.sendMessage(
      dmConv._id.toString(),
      user2._id.toString(),
      'Hi! I\'m doing great, thanks for asking. How about you?'
    );

    await messagesService.sendMessage(
      dmConv._id.toString(),
      user1._id.toString(),
      'I\'m good too! Just working on some new features for our messaging system.'
    );

    await messagesService.sendMessage(
      dmConv._id.toString(),
      user2._id.toString(),
      'That sounds exciting! Can\'t wait to see what you\'ve built.'
    );

    // Create a group conversation if we have enough users
    if (users.length >= 3) {
      const groupConv = await messagesService.createGroup(
        org._id.toString(),
        'Project Team',
        [user1._id.toString(), user2._id.toString(), user3._id.toString()]
      );

      console.log('Created group conversation:', (groupConv as any)._id);

      await messagesService.sendMessage(
        (groupConv as any)._id.toString(),
        user1._id.toString(),
        'Welcome to our project team chat!'
      );

      await messagesService.sendMessage(
        (groupConv as any)._id.toString(),
        user2._id.toString(),
        'Thanks for setting this up!'
      );

      await messagesService.sendMessage(
        (groupConv as any)._id.toString(),
        user3._id.toString(),
        'Great to be part of the team! 🎉'
      );
    }

    console.log('Messages seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding messages:', error);
  } finally {
    await app.close();
  }
}

// Run the seeding function
if (require.main === module) {
  seedMessages();
}

export { seedMessages };