const request = require('request');
const fs = require('fs');

module.exports = (image) => {
  return new Promise((resolve, reject) => {
    const req = request({
      url: 'http://telegra.ph/upload',
      method: 'POST',
      json: true
    }, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
    const form = req.form();
    form.append('file', fs.createReadStream(image));
  });
};