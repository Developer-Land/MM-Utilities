import { client } from '../..';
import { Duty } from '../../Models/Go/duty';

Duty.watch().on('change', async (data) => {
  if (data.operationType === 'delete') {
    let duty = await Duty.find({ guildID: '485463924007763970' });
    let users: string[] = [];
    duty.forEach((user) => {
      users.push(user.userID);
    });
    client.guilds.cache
      .get('485463924007763970')
      .roles.cache.get('980496476985761872')
      .members.forEach((member) => {
        if (users.includes(member.id)) return;
        member.roles.remove('980496476985761872', 'Duty expired or duty off');
      });
  }
});
