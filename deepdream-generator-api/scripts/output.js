const fs = require("fs");
const path = require("path");

const apiConfigPath = path.join(
  __dirname,
  "..",
  "..",
  "client/public/api-config.json"
);

function handler(data, serverless, options) {
  const apiConfigs = { apiEndpointUrl: data.ServiceEndpoint };
  fs.writeFile(apiConfigPath, JSON.stringify(apiConfigs), function (err) {
    if (err) throw err;
    console.log(
      `Created configure file api-config.json for the client application`
    );
  });
}

module.exports = { handler };
