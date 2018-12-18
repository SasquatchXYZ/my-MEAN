const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.locationsCreate = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.locationsListByDistance = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function (err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            'message': 'LocationID Not Found.'
          });
          return
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return
        }
        sendJsonResponse(res, 200, location)
      })
  } else {
    sendJsonResponse(res, 404, {
      "message": "No LocationID In Request."
    })
  }
};

module.exports.locationsUpdateOne = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.locationsDeleteOne = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};


const sendJsonResponse = function (res, status, content) {
  res.status(status)
    .json(content)
};