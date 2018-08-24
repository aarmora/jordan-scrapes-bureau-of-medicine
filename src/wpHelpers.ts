import request from 'request';

export async function getPhoneFromFindPerson(personDetails: any, findPersonAPIKey: string, potentialPhoneDetails: any[] = []) {
    const params = `?name=${personDetails.name}
                    &address.street_line_1=${personDetails.streetAddress1}
                    &address.street_line_2=${personDetails.streetAddress2}
                    &address.city=${personDetails.city}
                    &address.state_code=${personDetails.state}
                    &address.postal_code=${personDetails.zip}
                    &api_key=${findPersonAPIKey}`
    const url = `https://proapi.whitepages.com/3.0/person`;

    return new Promise((resolve, reject) => {
        try {
            request.get(`${url}${params}`, async (err, res, body) => {
                body = JSON.parse(body);
                if (body.person && body.person[0] && body.person[0].phones && body.person[0].phones.length > 0) {                    
                    potentialPhoneDetails.push({
                        name: body.person[0].name,
                        phones: body.person[0].phones
                    });
                }
                resolve(potentialPhoneDetails);
            });
        }
        catch (e) {
            reject(`Error making api request, ${e}`);
        }
    });
}

export async function getPhoneFromReverseAddress(personDetails: any, reverseAddressAPIKey: string, potentialPhoneDetails: any[] = []) {
    const params = `?street_line_1=${personDetails.streetAddress1}
                    &street_line_2=${personDetails.streetAddress2}
                    &city=${personDetails.city}
                    &state_code=${personDetails.state}
                    &postal_code=${personDetails.zip}
                    &api_key=${reverseAddressAPIKey}`
    const url = `https://proapi.whitepages.com/3.0/location`;

    return new Promise((resolve, reject) => {
        try {
            request.get(`${url}${params}`, async (err, res, body) => {
                body = await JSON.parse(body);
                if (body.current_residents && body.current_residents.length > 0) {
                    for (let resident of body.current_residents) {
                        if (resident.phones && resident.phones.length > 0) {
                            potentialPhoneDetails.push({
                                name: resident.name,
                                phones: resident.phones
                            });
                        }
                    }
                }
                resolve(potentialPhoneDetails);
            });
        }
        catch (e) {
            reject(`Error making api request, ${e}`);
        }
    });
}