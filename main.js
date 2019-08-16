'use strict';

const [path, fs, readline] = [require('path'), require('fs'), require('readline')];
const request = require('request');
const batchLimit = 10;
let readFinish = false, tenUrls = [], arrayOfBatch = [], running = false;
let totalUrlCheck = 0, totalValidUrl = 0, totalInvalidUrl = 0;

const readFilePath = path.resolve(__dirname, './all_urls.txt'); // file, from where read urll
const outPutFile = path.resolve(__dirname, './invalid_url.txt'); // file, for save invalid url

//create empty file.
fs.writeFileSync(outPutFile, ''); // create new output file

const readLineInterface = readline.createInterface({ // create instance of readline
    input: fs.createReadStream(readFilePath)
});

readLineInterface.on('line', (line) => { // read one line at a time
    const urlIs = Buffer.from(line).toString(); // conver to string from Buffer
    if (tenUrls.length >= batchLimit) {
        // each batch consist of 10 urls
        arrayOfBatch.push(tenUrls); // insert into batch list
        tenUrls = [];
        if (!running) {
             // if process not checking any url then process last batch
            processBatch();
        }
    }
    tenUrls.push(urlIs); // making batch
})

readLineInterface.on('close', () => { // it will run when readLine finish reading the all_urls.txt file
    tenUrls.length? arrayOfBatch.push(tenUrls) : ''; // last batch if we have put into batch list
    readFinish = true; // denote file done tis reading
    if (!running) {
        // if process not checking any url then process last batch
        processBatch();
    }
    console.log('Number of batch:: ', arrayOfBatch.length);
});

//process each batch individually
async function processBatch() {
    running = true; // means process start checking url
    const taskList = [];
    for (let item of arrayOfBatch[arrayOfBatch.length - 1]) { // arrayOfBatch[arrayOfBatch.length - 1] means FIFO batch processing
        item ? taskList.push(checkUrl(item.trim())) : '';
    }
    if (taskList.length) {
        await Promise.all(taskList);
        arrayOfBatch.splice(arrayOfBatch.length - 1, 1); // remove the process batch from batch list
        if (arrayOfBatch[arrayOfBatch.length - 1]) {
            // batch is ready, so process it
            processBatch();
        } else if (readFinish) { 
            // if file read finish the close process
            urlCheckFinish();
        } else {
             // no batch but read is not finsh means still we are making batch
            running = false; // means no url checking now
        }
    } else if (!arrayOfBatch[arrayOfBatch.length - 1] && readFinish) {
         // file read finsh and no batch have, means all done
        urlCheckFinish();
    }
}

//check each url
function checkUrl(url) {
    totalUrlCheck += 1;
    console.log('Url process:: ', totalUrlCheck);
    return new Promise((resolve, reject) => {
        request.get(url, (err, data) => {
            if (err) {
                fs.appendFileSync(outPutFile, `${url}: invalid url\n`); // note invalid url at the end of output file
                totalInvalidUrl += 1; // counting invalid url
                resolve('procced');
            } else {
                totalValidUrl += 1;// counting valid url;
                resolve('procced'); 
            }
        });
    })
}

//all url process done, so close the process
function urlCheckFinish() {
    console.log('######=>All url checked<=######');
    console.log('Total Url Checked: ', totalUrlCheck);
    console.log('Total valid Urls: ', totalValidUrl);
    console.log('Total invalid urls: ', totalInvalidUrl);
    process.exit();
}