import osmosis from 'osmosis';
import { getListOfLicenses } from './getLicenseInfo';
import { viewState } from './viewState';

(async () => {
    try {
        const response = await getListOfLicenses(osmosis, viewState);
        console.log('response', response, 'end **');
    }
    catch (e) {
        console.log('error in index', e);
    }

})();