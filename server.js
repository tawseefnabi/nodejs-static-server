"use strict";

var fs = require('fs');
var path = require('path');
var http = require('http');

var staticBasePath = './static';

var cache = {};

var staticServe = function(req, res) {
    var resolvedBase = path.resolve(staticBasePath);
    var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = path.join(resolvedBase, safeSuffix);

    var stream = fs.createReadStream(fileLoc);

     // Handle non-existent file
     stream.on('error', function(error) {
        res.writeHead(404, 'Not Found');
        res.write('404: File Not Found!');
        res.end();
    });

    // File exists, stream it to user
    res.statusCode = 200;
    stream.pipe(res);
    // Check the cache first...
    // if (cache[fileLoc] !== undefined) {
    //     res.statusCode = 200;

    //     res.write(cache[fileLoc]);
    //     return res.end();
    // }
    
    // // ...otherwise load the file
    // fs.readFile(fileLoc, function(err, data) {
    //     console.log('err', err);
    //     console.log('data', data);
    //     if (err) {
    //         res.writeHead(404, 'Not Found');
    //         res.write('404: File Not Found!');
    //         return res.end();
    //     }

    //     // Save to the cache
    //     cache[fileLoc] = data;
        
    //     res.statusCode = 200;

    //     res.write(data);
    //     return res.end();
    // });
};

var httpServer = http.createServer(staticServe);

httpServer.listen(8080);