import { getListOfLicenses, getDetails } from './getLicenseInfo';
import { viewState } from './viewState';
import puppeteer from 'puppeteer';
import { config } from './config';
import * as dbHelper from 'database-helpers';

(async () => {
    try {
        const dbUrl = `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoUrl}/bom-contacts`;
        const db = await dbHelper.initializeMongo(dbUrl);
        const contacts = await dbHelper.getAllFromMongo(db, 'contacts', {}, {}, );
        let ubuntu = false;
        let headless = true;
        if (process.argv[2] === 'ubuntu' || process.argv[3] === 'ubuntu') {
            ubuntu = true;
        }
        if (process.argv[2] === 'withHead' || process.argv[3] === 'withHead') {
            headless = false;
        }
        const licenseDetails = await getListOfLicenses(viewState, contacts, ubuntu, headless, '7-1-2018');
        for (let i = 0; i < licenseDetails.length; i++) {
            const insertResponse = await dbHelper.insertToMongo(db, 'contacts', licenseDetails[i]);
            console.log('insert response', insertResponse);
        }
        process.exit();
    }
    catch (e) {
        console.log('error in index', e);
    }
})();