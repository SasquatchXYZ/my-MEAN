const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.reviewsReadOne = function (req, res) {
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function (err, location) {
          let response, review;
          if (!location) {
            sendJsonResponse(res, 404, {
              'message': 'LocationID Not Found.'
            });
            return
          } else if (err) {
            sendJsonResponse(res, 404, err);
            return
          }
          if (location.reviews && location.reviews.length > 0) {
            review = location.reviews.id(req.params.reviewid);
            if (!review) {
              sendJsonResponse(res, 404, {
                'message': 'ReviewID Not Found.'
              })
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJsonResponse(res, 200, response)
            }
          } else {
            sendJsonResponse(res, 404, {
              'message': 'No Reviews Found'
            })
          }
        }
      )
  } else {
    sendJsonResponse(res, 404, {
      'message': 'Not Found: LocationID and ReviewID are both required'
    })
  }
};

module.exports.reviewsUpdateOne = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.reviewsDeleteOne = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};


const sendJsonResponse = function (res, status, content) {
  res.status(status)
    .json(content)
};