# facebook-scraper
Project that uses puppeter to perform scraping of facebook comments.

## Installation and setup
* Install docker ([Docker install instructions](https://docs.docker.com/install/))
* Install git ([Git install instructions](https://gist.github.com/derhuerst/1b15ff4652a867391f03)
* Clone this repo on a folder with following instruction:\
  `git clone git://github.com/psiccardi/facebook-scraper.git folder-name`
* Run `cd folder-name`
* Build the container with the command `docker-compose build scraper`
* Run the container with the following instruction from the main folder of the project:\
  `docker-compose up -d`.

## Usage
Before using the scraper you have to Enter into the container with the command:\
`docker-compose exec scraper bash`
Then you can launch the program:\
`node scraper.js "argument1=value1" "argument2=value2" ... "argumentN=valueN"`
The arguments defined in the programs are:
* **method**: defines how the URLs are passed to the program. The possible values are two:
  * **scrape**: in the file scraper.js there is at [this line](https://github.com/psiccardi/facebook-scraper/blob/master/app/scraper.js#L35) the definition of a constant **CONTENTS_URL**.
  In order to use this method you must substitute the value of this constant with the value of the URL containing the list of pages' links that actually contain the facebook widgets to be scraped. The parameter **parameter={NUMBER}** contained in the URL is present in case the contents are paginated (you can specify the parameters **start** and **end** fetch all URLs between the one with **parameter=\<start\>** to the URL with **parameter=\<end\>**.
Suppose you have an URL like 'https://site-to-be-scraped.com/listing/?page={NUMBER}' and you launched the script with start=1 and end=5. This is equivalent this script with the following values for **CONTENTS_URL**:
    1. https://site-to-be-scraped.com/listing/?page=1
    2. https://site-to-be-scraped.com/listing/?page=2
    3. https://site-to-be-scraped.com/listing/?page=3
    4. https://site-to-be-scraped.com/listing/?page=4
    5. https://site-to-be-scraped.com/listing/?page=5

  It's important to change also the values of the selectors at [this line](https://github.com/psiccardi/facebook-scraper/blob/master/app/scraper.js#L633), and maybe a bunch of lines of code in the method parseContentPage.
  My personal advice is to use this method only if you know exactly what you're doing. 
  * **csv**: with this method you specify a list of URLs containing the Facebook Comment Widget.
* **start**: specifies where to start. What this parameter means depends on the method: if the method is **scrape**, it refers to the pagination parameter value in the URL **CONTENTS_URL**, if the method is **csv**, it refers to the first row of the csv you want to start with.
* **outputfile**: specifies the csv containing the comments
* **errorfile**: this program sometimes fails. If you specify this parameter, will be generated a csv with the URLs that gave birth to a failure. You can then re-use this file as the value of the **csv** parameter.
