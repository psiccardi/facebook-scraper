/*******************
 *UTILITY FUNCTIONS*
 *******************/

const pageTimeout = 30000;

/**
 * Parses arguments passed to the script
 *
 * @return Object
 */
const parseARGV = () => {
	let args = {};
	process.argv.forEach(function (val, index, array) {
		if (index > 1) {
			if (val.indexOf('=') !== -1) {
				val = val.split('=');
				args[val[0]] = val[1];
			} else {
				args[val] = true;
			}
		}
	});

	return args;
}

module.exports.parseARGV = parseARGV;


const parseCSVLine = (line, number, header) => {
	let lineArr = line.split(";");
	let lineObj = {};

	for (let i=0; i<lineArr.length; i++) {
		if (header) {
			lineObj[header[i]] = lineArr[i].replace(/(^"|"$)/g,'');
			lineObj.number     = number;
		} else {
			lineArr[i] = lineArr[i].replace(/(^"|"$)/g,'')
		}
	}

	return header ? lineObj : lineArr;
}

module.exports.parseCSVLine = parseCSVLine;

/**
 * Sleeps for "time" milliseconds
 *
 * @param (string|int) time: milliseconds to sleep 
 *
 * @return undefined
 */
const delay = (time) => {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}

module.exports.delay = delay;

/**
 * Prints colored text into the console
 *
 * @param (string|int) msg: message to print
 *
 * @param (string|Array) color: instruction(s) on how to format text
 *
 * @return undefined
 */
const printColored = (msg, color) => {
	const colorObj = {
		reset : '\x1b[0m',
		bright : '\x1b[1m',
		dim : '\x1b[2m',
		underscore : '\x1b[4m',
		blink : '\x1b[5m',
		reverse : '\x1b[7m',
		hidden : '\x1b[8m',

		fgBlack : '\x1b[30m',
		fgRed : '\x1b[31m',
		fgGreen : '\x1b[32m',
		fgYellow : '\x1b[33m',
		fgBlue : '\x1b[34m',
		fgMagenta : '\x1b[35m',
		fgCyan : '\x1b[36m',
		fgWhite : '\x1b[37m',

		bgBlack : '\x1b[40m',
		bgRed : '\x1b[41m',
		bgGreen : '\x1b[42m',
		bgYellow : '\x1b[43m',
		bgBlue : '\x1b[44m',
		bgMagenta : '\x1b[45m',
		bgCyan : '\x1b[46m',
		bgWhite : '\x1b[47m'
	}

	let prefix  = '';
	let postfix = '';

	switch (true) {
		case color instanceof Array:
			for (let i = 0; i < color.length; i++) {
				if (color[i] && colorObj[color[i]]) {
					prefix += colorObj[color[i]];
				}
			}
			break;
		case color && colorObj[color] !== undefined:
			prefix = colorObj[color];
			break;
	}

	if (prefix.length) {
		postfix = colorObj.reset;
	}
	console.log(prefix , msg , postfix);
}

module.exports.printColored = printColored;

/**
 * Prints help message
 *
 * @param (string|int) msg: message to print
 *
 * @param (string|Array) color: instruction(s) on how to format text
 *
 * @return undefined
 */
const printHelp = () => {
	printColored('*********************************', ['bgGreen', 'fgWhite']);
	printColored('*   FACEBOOK COMMENTS SCRAPER   *', ['bgGreen', 'fgWhite']);
	printColored('*********************************', ['bgGreen', 'fgWhite']);

	printColored('Usage:\n','fgGreen'); 
	printColored('node scraper.js [arg1=value1 ... argN=valueN]\n', 'fgWhite')
	printColored('Valid arguments:\n', 'fgGreen');

	/* METHOD */

	printColored('- method', 'fgYellow')
	printColored('	DESCRIPTION:', 'fgGreen')
	printColored('		Specifies scraping method.\n')
	printColored('	DEFAULT:', 'fgGreen')
	printColored('		scrape')
	printColored('	VALID VALUES:', 'fgGreen')
	printColored('		- scrape', 'fgGreen')
	printColored('		Scraping starts from <YOUR_URL_HERE>/?parameter={NUMBER},')
	printColored('		where NUMBER is specified by argument "start" (1 is the default).')
	printColored('		It starts from that URL and follow the next pagination in a loop.')
	printColored('		With this method the script retrieves document URLs and then fetches the comments.')
	printColored('		This method is slow, use it ONLY if you don\'t have document URLs.')
	printColored('		- csv', 'fgGreen')
	printColored('		To use with "file" argument.')
	printColored('		Tells the program to parse a csv with header containing "id", "url" and then')
	printColored('		fetches the comments.')
	printColored('		Using "start" argument tells the program to skip rows until row number "start"')
	printColored('		Using "end" argument tells the program to stop at row "end"')
	printColored('	EXAMPLES:', 'fgGreen')
	printColored('		node scraper.js method=scrape')
	printColored('		node scraper.js method=scrape start=2')
	printColored('		node scraper.js method=csv file=pages-to-scrape.csv\n')

	/* START */

	printColored('- start', 'fgYellow')
	printColored('	DESCRIPTION:', 'fgGreen')
	printColored('		Is a number that defines where to start scraping.')
	printColored('		See "method" argument for more info.')
	printColored('	DEFAULT:', 'fgGreen')
	printColored('		1')
	printColored('	EXAMPLES:', 'fgGreen')
	printColored('		node scraper.js method=scrape start=3')
	printColored('		node scraper.js method=csv file=pages-to-scrape.csv start=2\n')

	/* END */

	printColored('- end', 'fgYellow')
	printColored('	DESCRIPTION:', 'fgGreen')
	printColored('		Is a number that defines where to end scraping.')
	printColored('		See "method" argument for more info.')
	printColored('		Valid only for method="csv".')
	printColored('	DEFAULT:', 'fgGreen')
	printColored('		1')
	printColored('	EXAMPLES:', 'fgGreen')
	printColored('		node scraper.js method=csv file=pages-to-scrape.csv start=2 end=10\n')

	/* FILE */

	printColored('- file', 'fgYellow')
	printColored('	DESCRIPTION:', 'fgGreen')
	printColored('		Specifies the csv file with document URLs to be parsed.')
	printColored('		To be used in conjunction with "method=csv"')
	printColored('	EXAMPLES:', 'fgGreen')
	printColored('		node scraper.js method=csv file=pages-to-scrape.csv\n')

	/* COMMENTS FILE */

	printColored('- outputfile', 'fgYellow')
	printColored('	DESCRIPTION:', 'fgGreen')
	printColored('		Specifies the csv file where to put parsed comments.')
	printColored('	DEFAULT:', 'fgGreen')
	printColored('		doc-comments.csv')
	printColored('	EXAMPLES:', 'fgGreen')
	printColored('		node scraper.js method=csv outputfile=outputfile.csv file=pages-to-scrape.csv\n')

	/* PAGE-ERROR FILE */

	printColored('- errorfile', 'fgYellow')
	printColored('	DESCRIPTION:', 'fgGreen')
	printColored('		Specifies the csv file where to put document URLs that went to timeout.')
	printColored('		Use with method="csv" only.')
	printColored('	DEFAULT:', 'fgGreen')
	printColored('		doc-comments.csv')
	printColored('	EXAMPLES:', 'fgGreen')
	printColored('		node scraper.js method=csv errorfile=errorfile.csv outputfile=outputfile.csv file=pages-to-scrape.csv\n')

	process.exit(0);
}

module.exports.printHelp = printHelp;

/**********************
 * EXTERNAL LIBRARIES *
 **********************/
const puppeteer        = require('puppeteer');
const fs               = require('fs');
const path             = require('path');
const createCsvWriter  = require('csv-writer').createObjectCsvWriter;
const fastCsv          = require('fast-csv');

/**
 * Default header of the csv
 */
const csvHeader        = [
	{
		id    : 'fullname',
		title : 'Nome Cognome'
	},
	{
		id    : 'userUrl',
		title : 'URL Utente Facebook'
	},
	{
		id    : 'image',
		title : 'URL Avatar Facebook'
	},
	{
		id    : 'comment',
		title : 'Commento'
	},
	{
		id    : 'timestamp',
		title : 'Data del commento'
	},
	{
		id    : 'documentURL',
		title : 'URL documento'
	},
	{
		id    : 'documentId',
		title : 'Id documento'
	}	
]

/**
 * Gets the browser object
 *
 * @return Browser
 */
const getBrowser = async () => {
	try {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=site-per-process', '--headless'],
			headless: false,
			ignoreHTTPSErrors:true
		});

		return browser;
	} catch (e) {
		printColored("Could not init browser", ["bgRed", "fgWhite"]);
		process.exit(1);
	}
}

module.exports.getBrowser = getBrowser;

/**
 * Gets the write handler for the csv
 * 
 * @param filename: the name of the file to be written into
 *
 * @param append: if we should append or create a new file
 *
 * @return CsvWriter
 */
const getCSVWriter = (filename, append = false) => {

	/*if (append == false) {
		const realPath = fs.realPathSync(filename);
		const onlyPath = path.dirname(realPath);

		let isDirExists = fs.existsSync(onlyPath) && fs.lstatSync(onlyPath).isDirectory();	
		if (!isDirExists) {
			fs.mkdirSync(onlyPath, { recursive: true });
		}
	}*/


	return createCsvWriter({
		path: filename,
		header: csvHeader,
	    fieldDelimiter : ';',
	    append : append
	});
}

module.exports.getCSVWriter = getCSVWriter;

/**
 * Handles error for page not scraped
 * 
 * @param filename: the file where to write the URL of the document that the script couldn't scrape
 *
 * @param id: EBAH document Id
 *
 * @param url: document URL
 *
 * @param page: Page object
 *
 * @param start: the Date Object which represents the start time of the scraping of the URL
 *
 * @return Array
 */
const notScrapedErrorHandling = async (filename, id, url, page, start) => {
	if (!fs.existsSync(filename)) {
		fs.appendFileSync(filename, '"id";"url"' + "\n");
	}

	fs.appendFileSync(filename, `"${id}";"${url}"\n`);
	await page.close()

	let end = new Date();
	printColored("Scrape elapsed time" + ((end - start)/1000) + "s", ["fgYellow"]);

	return [];
}

module.exports.notScrapedErrorHandling = notScrapedErrorHandling;

/**
 * Clicks when present the "load more" button of a list of elements
 *
 * @param page: Page object
 * 
 * @param selector: CSS selector of the button
 *
 * @param msg: the msg to print when the button is clicked
 *
 * @return undefined
 */
const loadMoreContentLoop = async (page, selector, msg) => {
	let loadMoreVisible = await isElementVisible(page, selector);
	while (loadMoreVisible) {
		await page
			.click(selector)
			.catch(() => {});
		loadMoreVisible = await isElementVisible(page, selector);
		printColored(msg, 'fgYellow');
	}
}

module.exports.loadMoreContentLoop = loadMoreContentLoop;

/**
 * Checks if an element is visible or not
 *
 * @param page: Page object
 * 
 * @param selector: CSS selector of the element
 *
 * @return undefined
 */
const isElementVisible = async (page, selector) => {
	let visible = true;
	await page
		.waitForSelector(selector, { visible: true, timeout: 2000 })
		.catch(() => {
		  visible = false;
		})
	;
	
	return visible;
}

module.exports.isElementVisible = isElementVisible;

/**
 * Writes comments to output file
 *
 * @param comments: Array of comments
 * 
 * @param file: The file where to write comments
 *
 * @return true|false
 */
const writeCommentsToFile = async (comments, file, writers) => {
	let writer = writers.csvWriter;

	if (fs.existsSync(file)) { //CSV_FILENAME
		writer = writers.csvWriterAppend;
	}

	if (comments.length > 0) {
		try {
			await writer.writeRecords(comments)
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	} else {
		console.log('No comments to write.');
	}

	return true;
}

module.exports.writeCommentsToFile = writeCommentsToFile;

/**
 * Parses the comments in a page
 *
 * @param pageURL: Url of document
 *
 * @param browser: Browser object
 *
 * @param notScrapedFile: Error file
 *
 * @param documentId: Id of document
 *
 * @return Array of comments
 */
const parseCommentsInPage = async (pageURL, browser, notScrapedFile, documentId = null) => {
	const IFRAME_SELECTOR = 'iframe[title^="fb:comments"]';

	const CONTENTS_PAGE_SELECTORS = {
		'list'     : '#listOfFiles',
		'document' : 'ul li .border3',
		'nav'      : '.results-nav',
		'next'     : '.results-nav a'
	}

	const FB_SELECTORS    = {
		'mainBox'     : '#u_0_0',
		'singleBox'   : '._3-8y._5nz1',
		'fullname'    : '.UFICommentActorName',
		'image'       : '._ohe.lfloat > a > img',
		'comment'     : '._30o4 ._5mdd',
		'loadMore'    : '._1gl3._4jy0._4jy3._517h._51sy._42ft',
		'commentMore' : '._30o4 ._5mdd ._5v47.fss',
		'timestamp'   : '.UFISutroCommentTimestamp'
	};

	let start = new Date();

	const page = await browser.newPage();
	printColored('PROCESSING: ' + pageURL, 'fgGreen');
	
	/* DISABILITIAMO LE IMMAGINI E I CSS */
	await page.setRequestInterception(true);

	page.on('request', (req) => {
        if(
        	req.resourceType() == 'stylesheet' 
        	|| req.resourceType() == 'font' 
        	|| req.resourceType() == 'image'
        ){
            req.abort();
        }
        else {
            req.continue();
        }
    });

	try {
		await page.goto(pageURL,{timeout: pageTimeout});
	} catch (err) {
		printColored(`page.goto failed to URL ${pageURL}: `+err.message, 'fgRed');
		await notScrapedErrorHandling(notScrapedFile, documentId, pageURL, page, start);
		return [];
	}

	
	let foundIframe = true;

	try {
		await page.waitForSelector(IFRAME_SELECTOR, {timeout: pageTimeout});
	} catch (err) {
		foundIframe = false;
		printColored('Selector ' + IFRAME_SELECTOR + ' not found', 'fgRed');
	}

	if (!foundIframe) {
		await notScrapedErrorHandling(notScrapedFile, documentId, pageURL, page, start);
		return [];
	}

	//page.on('console', consoleObj => console.log(consoleObj.text()));
	// @TODO: Sostituire questa schifezza
	await delay(2000);

	let timeout = false;
	let srcURL  = null;


	try {
		srcURL = await page.evaluate((IFRAME_SELECTOR) => {
			return document.querySelector(IFRAME_SELECTOR).src
		}, IFRAME_SELECTOR);
	} catch (err) {
		timeout = true;
		printColored('Timeout exceeded', 'fgRed');
		await notScrapedErrorHandling(notScrapedFile, documentId, pageURL, page, start);
		return [];
	}

	if (!srcURL) {
		await notScrapedErrorHandling(notScrapedFile, documentId, pageURL, page, start);
		return [];
	}

	try {
		await page.goto(srcURL,{timeout: pageTimeout});
	} catch (err) {
		await notScrapedErrorHandling(notScrapedFile, documentId, pageURL, page, start);
		return [];
	}

	let foundBox = true;

	try {
		await page.waitForSelector(FB_SELECTORS.mainBox, {timeout: pageTimeout});
	} catch (err) {
		foundBox = false;
		printColored('Selector ' + FB_SELECTORS.mainBox + ' not found', 'fgRed');
	}

	if (!foundBox) {
		await notScrapedErrorHandling(notScrapedFile, documentId, pageURL, page, start);
		return [];
	}

	await loadMoreContentLoop(page, FB_SELECTORS.loadMore, 'Clicking "Load More"')
	await loadMoreContentLoop(page, FB_SELECTORS.commentMore, 'Clicking "vér mais"')

	const comments = await page.evaluate((selectors, pageURL, documentId) => {
		const mysqlDateFormat = (date) => {
			var aaaa = date.getUTCFullYear();
			var gg = date.getUTCDate();
			var mm = (date.getUTCMonth() + 1);

			if (gg < 10)
				gg = "0" + gg;

		    if (mm < 10)
				mm = "0" + mm;

		    var cur_day = aaaa + "-" + mm + "-" + gg;

		    var hours = date.getUTCHours()
		    var minutes = date.getUTCMinutes()
		    var seconds = date.getUTCSeconds();

		    if (hours < 10)
				hours = "0" + hours;

		    if (minutes < 10)
				minutes = "0" + minutes;

		    if (seconds < 10)
			seconds = "0" + seconds;

		    return cur_day + " " + hours + ":" + minutes + ":" + seconds;
		}

		let mainBox  = document.querySelector(selectors.mainBox);
		let comments = Array.prototype.slice.call(mainBox.querySelectorAll(selectors.singleBox));

		let commentObj = [];

		for (let i=0; i < comments.length; i++) {
			let curObj = {
			}
			let htmlFullname  = comments[i].querySelector(selectors.fullname)
			let htmlImage     = comments[i].querySelector(selectors.image);
			let htmlComment   = comments[i].querySelector(selectors.comment);
			let htmlTimestamp = comments[i].querySelector(selectors.timestamp);

			curObj.fullname    = htmlFullname.innerText;
			curObj.userUrl     = htmlFullname.href;
			curObj.image       = htmlImage.src
			curObj.comment     = htmlComment.innerText;
			curObj.timestamp   = mysqlDateFormat(new Date(+(''+ htmlTimestamp.dataset['utime'] + '000')));
			curObj.documentURL = pageURL;
			curObj.documentId  = documentId;
			commentObj.push(curObj);
		}

		return commentObj;
	}, FB_SELECTORS, pageURL, documentId)

	await page.close();

	let end = new Date();

	printColored("Scrape elapsed time" + ((end - start)/1000) + "s", ["fgYellow"]);

	return comments;

};

module.exports.parseCommentsInPage = parseCommentsInPage;

const parseContentPage = async (pageURL, browser, errorfile2) => {
	const IFRAME_SELECTOR = 'iframe[title^="fb:comments"]';

	const CONTENTS_PAGE_SELECTORS = {
		'list'     : '#listOfFiles',
		'document' : 'ul li .border3',
		'nav'      : '.results-nav',
		'next'     : '.results-nav a'
	}

	const FB_SELECTORS    = {
		'mainBox'     : '#u_0_0',
		'singleBox'   : '._3-8y._5nz1',
		'fullname'    : '.UFICommentActorName',
		'image'       : '._ohe.lfloat > a > img',
		'comment'     : '._30o4 ._5mdd',
		'loadMore'    : '._1gl3._4jy0._4jy3._517h._51sy._42ft',
		'commentMore' : '._30o4 ._5mdd ._5v47.fss',
		'timestamp'   : '.UFISutroCommentTimestamp'
	};

	const page = await browser.newPage();
	await page.goto(pageURL,{timeout: pageTimeout});
	
	let listFound = true;

	try {
		await page.waitForSelector(CONTENTS_PAGE_SELECTORS.list, {timeout: pageTimeout});

	} catch (err) {
		listFound = false;
		console.log('\x1b[31m Selector ' + CONTENTS_PAGE_SELECTORS.list + ' not found \x1b[0m');
	}

	if (!listFound) {
		fs.appendFileSync(errorfile2, pageURL + "\n");
		return {
			urls : []
		}
	}

	const ret = await page.evaluate((selectors) => {
		let listEl = document.querySelector(selectors.list);

		let returnObj = {
			urls : [],
			next : ''
		};

		let navButtons = Array.prototype.slice.call(listEl.querySelectorAll(selectors.next));

		for (let i = 0; i < navButtons.length; i++) {
			if (navButtons[i].innerText.indexOf('próximo') !== -1) {
				returnObj.next = navButtons[i].href;
			}
		}

		let docBoxes = Array.prototype.slice.call(listEl.querySelectorAll(selectors.document));

		for (let i = 0; i < docBoxes.length; i++) {
			returnObj.urls.push(docBoxes[i].href);
		}

		return returnObj;
	}, CONTENTS_PAGE_SELECTORS);

	return ret;
}

module.exports.parseContentPage = parseContentPage;