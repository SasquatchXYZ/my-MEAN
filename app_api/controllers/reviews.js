const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.reviewsCreate = function(req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.reviewsReadOne = function(req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.reviewsUpdateOne = function(req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.reviewsDeleteOne = function(req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};


const sendJsonResponse = function(res, status, content) {
  res.status(status)
    .json(content)
};