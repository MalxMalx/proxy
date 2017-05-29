const router = require('express').Router();
const config = require('./config');
const https = require('https');

const resData = {
  status: {
    code: 0,
    msg: ""
  },
  results: {},
  errors: {}
};

router.use(function (req, res, next) {
  let url = req.url;
  let reqData = JSON.stringify(req.body);
  let result = null;
  let str = "";
  let options = {
    host: config.api.host,
    path: config.api.verPath + url,
    method: req.method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': reqData.length
    }
  };

  options.headers.cookie = req.headers.cookie || '';

  const apiReq = https.request(options, function (apiRes) {
    apiRes.setEncoding('utf8');
    apiRes.on('data', function (chunk) {
      res.setHeader('Content-Type', 'application/json');
      str += chunk;
    });
    apiRes.on('end', function () {
      console.log(`Request URL: ${req.url}\n\n` + 
        `Request headers from client: ${JSON.stringify(req.headers)}\n\n` +
        `Server response: ${str}\n\n` +
        `Server response headers: ${JSON.stringify(apiRes.headers)}\n\n`);
      
      try {
        result = JSON.parse(str);
        apiRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        Object.keys(apiRes.headers)
          .forEach(headerName => res.setHeader(headerName, apiRes.headers[headerName]));
        res.status(200).send(str);
      } catch(e) {
        console.log(`Error: ${e}\n`);
      }
    });
  });

  apiReq.on('error', function (e) {
    console.log(`problem with request: ${e.message}\n`);

    resData.status.msg = e.message;
    res.status(400).send(resData);
  });
  // write data to request body
  apiReq.write(reqData);
  apiReq.end();
});

module.exports = router;