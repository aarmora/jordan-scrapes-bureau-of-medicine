import mailgun from 'mailgun-js';
import { config } from './config';
import json2csv from 'json2csv';
import * as fs from 'fs';

export async function sendEmail(jsonData: any) {
    const toEmails = 'jbhansen84@gmail.com';
    const csv = json2csv.parse(jsonData);
    const filePath = `Some docs.csv`;

    const mg = mailgun({
        apiKey: config.mailGunApiKey,
        domain: 'mg.cobaltintelligence.com'
    });

    try {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, csv, async (err) => {
                if (err) {
                    console.log('an error on file creation', err);
                }
                const attachment = new mg.Attachment({
                    data: filePath,
                    filename: filePath,
                    contentType: 'text/csv'
                });
                const mailData = {
                    from: `Jordan Hansen <jordan@cobaltintelligence.com>`,
                    to: toEmails,
                    bcc: 'jbhansen84@gmail.com',
                    subject: `Doctors`,
                    html: ` `,
                    attachment: attachment
                };

                mg.messages().send(mailData, async (error, body) => {
                    if (error) {
                        console.log('some error', error);
                    }
                    console.log('Sent message', body);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log('error deleting file', err);
                            reject(err);
                        }
                        resolve();
                    });
                });
            });
        })
    }
    catch (e) {
        return Promise.reject(`Error sending email, ${e}`);
    }
}