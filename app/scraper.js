/**
 * Utility functions:
 *
 * - delay((string|int)time): sleeps "time" time
 * - printColored((string)msg, (mixed)colors): prints colored text into the console
 * - parseARGV: parses arguments passed to the script
 * - printHelp: prints help message
 * - getCSVWriter((string)file, (bool)append): gets the write handler for the csv
 * - getBrowser: gets the browser
 * - writeCommentsToFile((Array)comments, (string)file)
 *	
 */
const {
	delay,
	printColored,
	parseARGV,
	printHelp,
	getCSVWriter,
	getBrowser,
	writeCommentsToFile,
	parseCommentsInPage,
	parseContentPage,
	parseCSVLine
}                = require("./lib/utils.js");
const fs         = require('fs');
const fastCsv    = require('fast-csv');
const LineByLine = require('n-readlines');

// CONSTANTS
/* 
 * When you launch the command with method=scrape, this script automatically takes this url on
 * each iteration, using the parametric value {NUMBER} for substitution.
 * This is useful when you have to scrape listing pages with pagination defined by a querystring.
 */
const CONTENTS_URL = '<YOUR_URL_HERE>?parameter={NUMBER}'


/**
 * PROGRAM STARTS HERE
 */

// We parse the arguments passed to the scripts.
const scriptArgs = parseARGV();

// We define default values for arguments
let start        = scriptArgs.start      || 1;
let end          = scriptArgs.end        || null;
let method       = scriptArgs.method     || 'scrape';
let file         = scriptArgs.file       || null; //ebah-documents.csv
let outputfile   = scriptArgs.outputfile || 'doc-comments.csv'; // CSV_FILENAME
let errorfile    = scriptArgs.errorfile  || 'pages-not-scraped.csv'; // NOT_SCRAPED_FILE

let errorfile2   = 'content-page-errors.csv'; // CONTENT_PAGE_ERR


// We define the writers 
const csvWriter       = getCSVWriter(outputfile, false);
const csvWriterAppend = getCSVWriter(outputfile, true);

(async () => {
	const browser = await getBrowser();

	// We print help message if argument "help" is passed
	if (scriptArgs.help) {
		printHelp();
	}

	switch (scriptArgs.method) {
		case 'scrape':
			let curURL = CONTENTS_URL.replace('{NUMBER}', start);
			let ret = await parseContentPage(curURL, browser, errorfile2);

			console.log('PROCESSING: \x1b[32m ' + curURL + ' \x1b[0m');

			while (ret && ret.urls && ret.urls.length && ret.next) {

				for (let i = 0; i < ret.urls.length; i++) {

					//pageURL, browser, notScrapedFile, documentId = null

					let comments = await parseCommentsInPage(ret.urls[i], browser, errorfile);
					await writeCommentsToFile(comments, outputfile, { csvWriter, csvWriterAppend});
				}
				console.log('PROCESSING: \x1b[32m ' + ret.next + ' \x1b[0m');
				ret = await parseContentPage(ret.next, browser, errorfile2);
			}
			break;
		case 'csv':
			if (!file) {
				printColored('Please specify a filename for the csv to read', ['bgRed', 'fgWhite']);
				process.exit(1);
			}

			let i          = 0;
			const liner    = new LineByLine(file);
			let header     = [];
			let lineNumber = -1;
			let line;

			while (line = liner.next()) {
				lineNumber++;

				let curLine = null;


				if (lineNumber == 0) {
					header = parseCSVLine(line.toString());
					printColored(header);

					continue;
				} else {
					curLine = parseCSVLine(line.toString(), lineNumber, header);
					
					let isNumberGreater = (curLine.number >= start);
					let isNumberLower   = true;

					if (end !== null) {
						isNumberLower = (curLine.number < end);
					}

					if (isNumberLower && isNumberGreater) {
						printColored(`id:${curLine.id}, number:${curLine.number}`, 'fgCyan');
						let comments = await parseCommentsInPage(curLine.url, browser, errorfile, curLine.id);
						await writeCommentsToFile(comments, outputfile, { csvWriter, csvWriterAppend});
					} else if (!isNumberLower) {
						liner.close();
					} else {
						printColored(`skipping id:${curLine.id}, number:${curLine.number}`, 'fgRed');
					}
				}
			}
			break;
	}

	await browser.close();
})()

