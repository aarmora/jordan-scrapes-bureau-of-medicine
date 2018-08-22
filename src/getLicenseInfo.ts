import { ILicense } from './models';


export async function getListOfLicenses(osmosis: any, viewState: string) {
    const formData = {
        ctl00$CPH1$txtsrcOriginalLicenseDate: "8-1-2018",
        ctl00$ScriptManager1: "ctl00$CPH1$UpdatePnl0|ctl00$CPH1$btnGoFind",
        ctl00_ScriptManager1_HiddenField: ";;AjaxControlToolkit, Version=3.5.40412.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:065e08c0-e2d1-42ff-9483-e5c14441b311:de1feab2:fcf0e993:f2c8e708:720a52bf:f9cec9bc:589eaa30:698129cf:fb9b4c57:ccb96cf9:8ad18101:ab09e3fe:87104b7c:a67c2700:8613aea7:3202a5a2:be6fb298;",
        ctl00$CPH1$chksrcHasFA: "None",
        __VIEWSTATE: viewState,
        __VIEWSTATEGENERATOR: "F219E5FD",
        __ASYNCPOST: true,
        ctl00$CPH1$btnGoFind: "Start Search"
    };
    const acceptableCities = ['BOISE', 'KUNA', 'STAR', 'EAGLE', 'NAMPA', 'CALDWELL', 'MERIDIAN'];

    return new Promise((resolve, reject) => {
        try {
            const url = 'https://isecure.bom.idaho.gov/BOMPublic/LPRBrowser.aspx';
            const results: any[] = [];
            osmosis.post(url, formData, { timeout: 10000 })
                .click('.btnNext')
                .find('.Grid tr:gt(0)')
                .follow('td[3] a@href')
                .set({
                    name: '#ctl00_CPH1_txtLicenseeName@value',
                    licenseStatus: '#ctl00_CPH1_txtLicenseStatus@value',
                    streetAddress1: '#ctl00_CPH1_txtAddress1@value',
                    streetAddress2: '#ctl00_CPH1_txtAddress2@value',
                    cityStateZip: '#ctl00_CPH1_txtCityStateZip@value',
                    profession: '#ctl00_CPH1_txtProfessionDescription@value',
                    licenseType: '#ctl00_CPH1_txtLicenseTypeDescription@value'
                })
                .data((data: ILicense) => {
                    data.city = data.cityStateZip.split(' ')[0].trim();
                    data.state = data.cityStateZip.split(' ')[1].trim();
                    data.zip = data.cityStateZip.split(' ')[2].trim();
                    if (data.licenseStatus === 'New License' && acceptableCities.some(city => data.city.indexOf(city) >= 0)) {
                        console.log('data', data);
                        results.push(data);
                    }
                })
                .done(() => resolve(results))
                .error(err => {
                    reject(`Direct osmosis error ${err}`);
                });
        }
        catch (e) {
            reject(`Error getting new list of results, ${e}`);
        }
    });

}