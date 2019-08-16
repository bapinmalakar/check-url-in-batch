# check-url-in-batch

#This node.js app for demostarate the use of readLine, fs, request package

#Problem:
I have file all_urls.txt, which contains list of urls. My job is to read the urls from file and check url is valid or not and list invalid urls in invalid_url.txt file

#Solution1:
We can read all file together, and process can one by one but issue is
1. Read all url together and store then in an Array, need more storage if file contain 100k urls
2. Process each url one by one going to take lots of time to process each urls

#Solution2:
We can read all file together and process all url together with the help of Promise.all(). But issue is
1. If you hit so many url, means creating high traffic. And if you do so your server can block you(DNS spoffing)

#Solution3: 
step1: We can read url one by one from url and going to make batch of 10 urls. When we have 10 urls then process them using Promise.all().
step: During mean time we can prepare batches and whenever server free with previous batch then start with new batch, thats we already prepared

It will solve:
1. Memory Issue: We are not going to store all url together, we storing batch and whenever one batch is complete then delete that batch from list.
2. Speed up and Low traffic: Here we process 10 urls together so it will speed up the process rather than one by one. We are not process all url together, only processing 10 url together so low traffic

The number 10 is depend on you

#Packages usages
1. npm request: is used to check url by making http request
2. npm fs: for read, write and append file
3. npm readline: for read the file line by line
4. npm path: for resolve path of input and output files

#How to run
1. clone the repo
2. npm init
3. npm start
