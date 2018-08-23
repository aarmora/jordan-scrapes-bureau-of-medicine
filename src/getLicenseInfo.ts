import { ILicense } from './models';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import { setUpNewPage, getPropertyByHandle, getPropertyBySelector } from 'puppeteer-helpers';


export async function getListOfLicenses(viewState: string, foundDetails: any[] = [], ubuntu = false, headless = true) {
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

    let browser: Browser;
    try {
        if (ubuntu) {
            browser = await puppeteer.launch({ headless: true, args: [`--window-size=${1800},${1200}`, '--no-sandbox', '--disable-setuid-sandbox'] });
        }
        else {
            browser = await puppeteer.launch({ headless: headless, args: [`--window-size=${1800},${1200}`] });
        }

        try {
            const url = 'https://isecure.bom.idaho.gov/BOMPublic/LPRBrowser.aspx';
            const page = await setUpNewPage(browser);
            await page.setViewport({ height: 1200, width: 1900 });
            await page.goto(url);
            await page.type('#ctl00_CPH1_txtsrcOriginalLicenseDate', '8-1-2018');
            await page.click('#ctl00_CPH1_btnGoFind');
            await page.waitForSelector('#ctl00_CPH1_PnlGrid');
            let currentPage = 1;
            let totalPages = 1;
            const totalPagesHTML = await getPropertyBySelector(page, '#ctl00_CPH1_lblPage strong', 'innerHTML');
            totalPages = parseInt(totalPagesHTML.trim().split(' ')[3]);

            while (currentPage <= totalPages) {
                console.log('Searching page ****** ', currentPage);
                let rows = await page.$$('.GridItemStyle');
                if (rows) {
                    await handleRows(rows, browser);
                }

                let aRows = await page.$$('.GridAItemStyle');
                if (aRows) {
                    await handleRows(aRows, browser);
                }
                currentPage++;
                await page.click('#ctl00_CPH1_btnNext');
                await delay(750);
            }

        }
        catch (e) {
            return Promise.reject(`Error setting up puppeteer page, ${e}`);
        }
    }
    catch (e) {
        return Promise.reject(`Error setting up puppeteer browser, ${e}`);
    }
}

export async function handleRows(rows: ElementHandle[], browser: Browser) {
    const acceptableCities = ['BOISE', 'KUNA', 'STAR', 'EAGLE', 'NAMPA', 'CALDWELL', 'MERIDIAN'];
    for (let i = 0; i < rows.length; i++) {
        const cells = await rows[i].$$('td');
        /**
         * Result cells legend
         * 0 - Details image/link
         * 1 - Name (Last, First)
         * 2 - License number
         * 3 - Expiration
         * 4 - Current
         * 5 - Status
         * 6 - Status date,
         * 7 - Actions
         * 8 - Posting date
         * 9 - City, State, Zip
         * 10 - Profession
         * 11 - License Type
         */


        const licenseType = await getPropertyByHandle(cells[5], 'innerHTML');
        const cityStateZip = await getPropertyByHandle(cells[9], 'innerHTML');
        const city = cityStateZip.trim().split(' ')[0].trim().toLowerCase();
        // If it's a new license and in the treasure valley, let's get all the details
        // console.log('city test', city, acceptableCities.some(acceptableCity => city.indexOf(acceptableCity) >= 0));
        if (licenseType.trim() === 'New License' && acceptableCities.some(acceptableCity => city.indexOf(acceptableCity.toLowerCase()) >= 0)) {
            const detailsUrl = await getPropertyBySelector(cells[0], 'a', 'href');
            await getDetails(browser, detailsUrl);
        }
    }
    return Promise.resolve();
}

export async function getDetails(browser: Browser, url: string) {
    try {
        let details: any = {};
        const page = await setUpNewPage(browser);
        await page.setViewport({ height: 1200, width: 1900 });
        await page.goto(url);
        details.name = (await getPropertyBySelector(page, '#ctl00_CPH1_txtLicenseeName', 'value')).trim();
        details.businessPhone = (await getPropertyBySelector(page, '#ctl00_CPH1_txtShopPhoneNo', 'value')).trim();
        details.streetAddress1 = (await getPropertyBySelector(page, '#ctl00_CPH1_txtAddress1', 'value')).trim();
        details.streetAddress2 = (await getPropertyBySelector(page, '#ctl00_CPH1_txtAddress2', 'value')).trim();
        details.cityStateZip = (await getPropertyBySelector(page, '#ctl00_CPH1_txtCityStateZip', 'value')).trim();
        const cityStateZipSplit = details.cityStateZip.split(' ');
        details.city = cityStateZipSplit[0];
        details.state = cityStateZipSplit[1];
        details.zip = cityStateZipSplit[2];
        details.board = (await getPropertyBySelector(page, '#ctl00_CPH1_txtBureauName', 'value')).trim();
        details.licenseType = (await getPropertyBySelector(page, '#ctl00_CPH1_txtLicenseTypeDescription', 'value')).trim();
        details.number = (await getPropertyBySelector(page, '#ctl00_CPH1_txtLicenseNumber', 'value')).trim();
        details.dateOfIssue = (await getPropertyBySelector(page, '#ctl00_CPH1_txtLicenseIssueDate', 'value')).trim();
        details.status = (await getPropertyBySelector(page, '#ctl00_CPH1_txtLicenseStatus', 'value')).trim();


        console.log('details', details);
        page.close();

        return Promise.resolve();
    }
    catch (e) {
        return Promise.reject(`Error on details page, ${e}`);
    }
}

function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    });
}