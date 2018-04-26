var express =   require('express');
var fs =        require('fs');
var app =       express();
// User fs and addpenFile method of fs
// to write down the logs

app.use(function(req, res, next) {
    // write your logging code here
    var log = {
        agent:     req.header('user-agent').replace(",", ""),
        time:      new Date().toISOString(),
        method:    req.method,
        resource:  req.path,
        Version:   "HTTP/1.1",
        Status:    200
    }
    //appends to current log file request information
    var logLine = log.agent + "," +
                  log.time + "," + 
                  log.method + "," + 
                  log.resource + "," + 
                  log.Version + "," + 
                  log.Status + "\n";

    //appends file to log line
    console.log(logLine);
    fs.appendFile("log.csv", logLine, function(){});
    next();
});

app.get('/', function (req, res) {
    // write your code to respond "ok" here
    res.send('ok')
});

app.get('/logs', function(req, res)  {
    fs.readFile("./log.csv", "utf8", function(err, data) {
        if (err) {
            throw err;
        }    
        console.log("Data", data);
        // Get lines from data      
        var lines = data.split('\n');
        lines.shift();
        var logs = [];
        lines.forEach(function(line) {
            console.log("Line: ", line);
            if (line) {
                var lineItems = line.split(',');
                // Createa logs objects and puts into JSON format 
                var log = {
                    "Agent":     lineItems[0],
                    "Time":      lineItems[1],
                    "Method":    lineItems[2],
                    "Resource":  lineItems[3],         
                    "Version":   lineItems[4],
                    "Status":    lineItems[5]
                };
                if (log.Agent !== "") {
                    logs.push(log);
                }
            }
        });
        res.json(logs);
    });
});

module.exports = app;
