# Board of Medicine Scraper

Goes through the [Idaho Board of Medicine](https://bom.idaho.gov/BOMPortal/Home.aspx) and gets all newly licensed doctors.

## Getting Started

Clone the repository, run `npm i`, and then `npm run getNewContacts` in a terminal/bash/command prompt.

You will also need to rename `src/sample-config.ts` to `src/config.ts`. This file has example database connections for a mongo connnection and a url for a discord webhook. Valid credentials are required without making some serious code changes.

To run on ubuntu:

```
npm run getNewContacts:ubuntu
```
These dependences are also required:

```
sudo apt-get install libx11-xcb1 libxcomposite1 libXdamage1 libxi6 libxext6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
```


To run with the chrome browser running:
```
npm run getNewContacts:withHead
```



### Prerequisites

Tested on Node v8.11.2 and NPM v5.6.0.

### Installing

After installing [NodeJS](https://nodejs.org/en/) you should be able to just run the following in the terminal.

```
npm i
```

## Built With

* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Scraping library
* [NodeJS](https://nodejs.org/en/) - NodeJS

## Authors

* **Jordan Hansen** - *Initial work* - [Jordan Hansen](https://github.com/aarmora)


## License

This project is licensed under the ISC License
