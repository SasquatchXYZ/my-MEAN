const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

// Function for determining the distance in radians --------------------------------------------------------------------
const theEarth = (() => {
  const earthRadius = 6371; // km, miles is 3959

  const getDistanceFromRads = rads => parseFloat(rads * earthRadius);

  const getRadsFromDistance = distance => parseFloat(distance / earthRadius);

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  }
})();

// API Locations Routes ------------------------------------------------------------------------------------------------
// POST - Create a Location
module.exports.locationsCreate = (req, res) => {
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
  }, (err, location) => {
    if (err) {
      sendJsonResponse(res, 400, err)
    } else {
      sendJsonResponse(res, 201, location)
    }
  })
};

// GET Locations
module.exports.locationsListByDistance = (req, res) => {
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

  if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
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
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        distanceMultiplier: 6371,
        distanceField: 'distance',
        num: 10
      }
    }
  ]).then(results => {
    // let locations;
    // console.log('Geo Results', results);
    // console.log('Geo Stats', stats);
    if (!results) {
      sendJsonResponse(res, 404, {'message': 'No Results Found.'});
    } else {
      // locations = makeLocationsList(req, res, results, stats);
      sendJsonResponse(res, 200, results)
    }
  })
};

// GET One Location
module.exports.locationsReadOne = (req, res) => {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec((err, location) => {
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

// POST - Update One Location
module.exports.locationsUpdateOne = (req, res) => {
  if (!req.params.locationid) {
    sendJsonResponse(res, 404, {
      'message': 'Not Found: LocationID is Required.'
    });
    return
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec((err, location) => {
        if (!location) {
          sendJsonResponse(res, 404, {
            'message': 'LocationID Not Found.'
          });
          return
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(',');
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }];
        location.save((err, location) => {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, location);
          }
        })
      }
    )
};

// DELETE One Location
module.exports.locationsDeleteOne = (req, res) => {
  const locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec((err, location) => {
          if (err) {
            sendJsonResponse(res, 303, err);
            return
          }
          sendJsonResponse(res, 204, null)
        })
  } else {
    sendJsonResponse(res, 404, {
      'message': 'No LocationID'
    })
  }
};

// Function for the Creationg of the Locations List --------------------------------------------------------------------
const makeLocationsList = (req, res, results, stats) => {
  let locations = [];
  results.forEach(doc => {
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

// Reusable Function for the sending of JSON Responses -----------------------------------------------------------------
const sendJsonResponse = (res, status, content) => res.status(status).json(content);