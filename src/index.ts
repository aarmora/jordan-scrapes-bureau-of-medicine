import { getListOfLicenses } from './getLicenseInfo';
import { viewState } from './viewState';

(async () => {
    try {
        let ubuntu = false;
        let headless = true;
        if (process.argv[2] === 'ubuntu' || process.argv[3] === 'ubuntu')  {
            ubuntu = true;
        }
        if (process.argv[2] === 'withHead' || process.argv[3] === 'withHead') {
            headless = false;
        }
        const response = await getListOfLicenses(viewState, [], ubuntu, headless);
        // console.log('response', response, 'end **');
    }
    catch (e) {
        console.log('error in index', e);
    }
})();