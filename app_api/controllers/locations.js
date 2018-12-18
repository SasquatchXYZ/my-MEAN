const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const theEarth = (function() {
  const earthRadius = 6371; // km, miles is 3959

  const getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  const getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius)
  };

  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  }
})();

module.exports.locationsCreate = function (req, res) {
  sendJsonResponse(res, 200, {'status': 'success'})
};

module.exports.locationsListByDistance = function (req, res) {
  let lng = parseFloat(req.query.lng);
  let lat = parseFloat(req.query.lat);
  let point = {
    type: 'Point',
    coordinates: [lng, lat]
  };

  let geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };

  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      'message': 'Longitude and Latitude Query Parameters are Required.'
    });
    return
  }

  Loc.geoNear(point, geoOptions, function (err, results, stats) {
    let locations = [];
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      results.forEach(function(doc) {
        locations.push({
          distance: theEarth.getDistanceFromRads(doc.dis),
          name: doc.obj.name,
          address: doc.obj.address,
          rating: doc.obj.rating,
          facilities: doc.obj.facilities,
          _id: doc.obj._id
        })
      });
      sendJsonResponse(res, 200, locations)
    }
  })
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
