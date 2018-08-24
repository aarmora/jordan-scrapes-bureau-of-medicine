import { config } from './config';
import * as dbHelper from 'database-helpers';
import { sendEmail } from './sendEmail';

(async () => {
    try {
        const dbUrl = `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoUrl}/bom-contacts`;
        const db = await dbHelper.initializeMongo(dbUrl);
        let contacts = await dbHelper.getAllFromMongo(db, 'contacts', { businessPhone: { $ne: ''}, region: 'Eastern Idaho'}, {}, 3);

        await sendEmail(contacts);

        process.exit();
    }
    catch (e) {
        console.log('error in index', e);
    }
})();