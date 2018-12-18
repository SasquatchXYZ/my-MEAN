const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const theEarth = (function () {
  const earthRadius = 6371; // km, miles is 3959

  const getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadius);
  };

  const getRadsFromDistance = function (distance) {
    return parseFloat(distance / earthRadius)
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  }
})();

module.exports.locationsCreate = function (req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function (err, location) {
    if (err) {
      sendJsonResponse(res, 400, err)
    } else {
      sendJsonResponse(res, 201, location)
    }
  })
};

module.exports.locationsListByDistance = function (req, res) {
  let lng = parseFloat(req.query.lng);
  let lat = parseFloat(req.query.lat);
  let maxDistance = parseFloat(req.query.maxDistance);
  let point = {
    type: 'Point',
    coordinates: [lng, lat]
  };

  let geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10
  };

  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      'message': 'Longitude and Latitude Query Parameters are Required.'
    });
    return
  }

  Loc.aggregate([
    {
      $geoNear: {
        type: 'Point',
        near: [lng, lat],
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(20),
        distanceField: 'dis',
        num: 10
      }
    }
  ]).then(function (err, results, stats) {
    let locations;
    console.log('Geo Results', results);
    console.log('Geo Stats', stats);
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      locations = makeLocationsList(req, res, results, stats);
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

const makeLocationsList = function (req, res, results, stats) {
  let locations = [];
  results.forEach(function (doc) {
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    })
  });
  return locations
};
