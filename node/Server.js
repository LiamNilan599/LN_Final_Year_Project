var url = require('url');
var http = require('http');
var TestModule = require('./TestModule');
var fs = require('fs');

function renderHTML(path, response) 
{
    fs.readFile(path, null, function(error,data)
    {
        if(error)
        {
            response.writeHead(404);
            response.write('File not found');
        }
        else
        {
            response.write(data);
        }
        response.end();
    })
}

function onRequest(request, response)
{
    //response.writeHead(200, {'Content-Type':'text/plain'});
    response.writeHead(200, {'Content-Type':'text/html'});
    var path = url.parse(request.url).pathname;
    switch(path)
    {
        case '/':
            {
                renderHTML("./Website so far.html", response);
                break;
            }
        case '/other':
            {
                renderHTML("./other.html", response);
                break;
            }
        default:
            {
                response.writeHead(404);
                response.write("Page Not found");
                response.end();
                break;
            }
    }
    //response.write("hello this is a test");
    //TestModule.testFuncntion();
    //response.end();
}
http.createServer(onRequest).listen(8000);