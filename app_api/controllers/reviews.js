const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

// API Reviews Routes --------------------------------------------------------------------------------------------------
module.exports.reviewsCreate = function (req, res) {
  let locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(function (err, location) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          addReview(req, res, location)
        }
      })
  } else {
    sendJsonResponse(res, 404, {
      'message': 'Not Found: LocationID Required.'
    })
  }
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

// Function for Adding and Saving a Subdocument ------------------------------------------------------------------------
const addReview = function (req, res, location) {
  if (!location) {
    sendJsonResponse(res, 404, {
      'message': 'LocationID Not Found.'
    })
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText,
    });
    location.save(function (err, location) {
      let thisReview;
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview)
      }
    })
  }
};

// Function for Calculating and Updating the Average Rating ------------------------------------------------------------
// Finding the Correct Document from the Location ID
const updateAverageRating = function (locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(
      function (err, location) {
        if (!err) {
          setAverageRating(location)
        }
      }
    )
};

// Setting the Average Rating
const setAverageRating = function (location) {
  let k, reviewCount, ratingAverage, ratingTotal;
  if (location.review && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (k = 0; k < reviewCount; k++) {
      ratingTotal = ratingTotal + location.reviews[k].rating
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log(`Average Rating Updated To ${ratingAverage}`)
      }
    })
  }
};

// Reusable Function for the sending of JSON Responses -----------------------------------------------------------------
const sendJsonResponse = function (res, status, content) {
  res.status(status)
    .json(content)
};