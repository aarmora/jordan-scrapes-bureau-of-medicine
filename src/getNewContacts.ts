import { getListOfLicenses, getDetails } from './getLicenseInfo';
import { viewState } from './viewState';
import puppeteer from 'puppeteer';
import { config } from './config';
import * as dbHelper from 'database-helpers';

(async () => {
    try {
        const dbUrl = `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoUrl}/bom-contacts`;
        const db = await dbHelper.initializeMongo(dbUrl);
        let contacts = await dbHelper.getAllFromMongo(db, 'contacts', {}, {}, );
        let ubuntu = false;
        let headless = true;
        if (process.argv[2] === 'ubuntu' || process.argv[3] === 'ubuntu') {
            ubuntu = true;
        }
        if (process.argv[2] === 'withHead' || process.argv[3] === 'withHead') {
            headless = false;
        }
        contacts = await getListOfLicenses(viewState, contacts, ubuntu, headless);
        for (let i = 0; i < contacts.length; i++) {
            const currentDate = new Date();
            if (!contacts[i]._id) {
                contacts[i].createdAt = currentDate;
                contacts[i].updatedAt = currentDate;
                const insertResponse = await dbHelper.insertToMongo(db, 'contacts', contacts[i]);
                console.log('insert response', insertResponse);
            }
            else {
                contacts[i].updatedAt = currentDate;
                const updateResponse = await dbHelper.insertToMongo(db, 'contacts', contacts[i]);
                console.log('insert response', updateResponse);

            }
        }
        process.exit();
    }
    catch (e) {
        console.log('error in index', e);
    }
})();