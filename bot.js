var HTTPS = require('https');


var botID = process.env.BOT_ID;

//
const {readFileSync, promises: fsPromises} = require('fs');

// ✅ read file SYNCHRONOUSLY
function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');

  const arr = contents.split(/\r?\n/);

  console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

  return arr;
}



// --------------------------------------------------------------

// ✅ read file ASYNCHRONOUSLY
async function asyncReadFile(filename) {
  try {
    const contents = await fsPromises.readFile(filename, 'utf-8');

    const arr = contents.split(/\r?\n/);

    console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

    return arr;
  } catch (err) {
    console.log(err);
  }
}

asyncReadFile('./example.txt');
//

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/remindme$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = Arrays.toString(syncReadFile('./example.txt'));

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
