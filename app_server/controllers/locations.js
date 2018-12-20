const moment = require('moment');
const request = require('request');
let apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://mymeantestapp.herokuapp.com/'
}
// GET Pages -----------------------------------------------------------------------------------------------------------
// Homepage
module.exports.homelist = function (req, res) {
  const path = '/api/locations';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -84.238690,
      lat: 33.879700,
      maxDistance: 20
    }
  };
  request(
    requestOptions,
    function (err, response, body) {
      let data = body;
      console.log(response.statusCode);
      if (response.statusCode === 200 && data.length) {
        for (let k = 0; k < data.length; k++) {
          data[k].distance = _formatDistance(data[k].distance)
        }
      }
      renderHomepage(req, res, data)
    }
  )
};

// Location Info Page
module.exports.locationInfo = function (req, res) {
  const path = '/api/locations/' + req.params.locationid;
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
  };
  request(
    requestOptions,
    function (err, response, body) {
      let data = body;
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      for (let k = 0; k < data.reviews.length; k++) {
        data.reviews[k].createdOn = moment(data.reviews[k].createdOn).format('D MMMM YYYY')
      }
      console.log(data);
      renderDetailPage(req, res, data)
    }
  )
};

// Add Review Page
module.exports.addReview = function (req, res) {
  res.render("location-review-form", {
    title: "Review Starcups on Loc8r",
    pageHeader: {title: "Review Starcups"}
  });
};

// Render Functions ----------------------------------------------------------------------------------------------------
// Render Homepage
const renderHomepage = function (req, res, responseBody) {
  let message;
  if (!(responseBody instanceof Array)) {
    message = 'API Lookup Error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render("locations-list", {
    title: "Loc8r - find a place to work with wifi",
    pageHeader: {
      title: "Loc8r",
      strapline: "Find places to work with wifi near you!"
    },
    sidebar:
      "Looking for wifi and a seat?  Loc8r helps you find places to work when out and about.  Perhaps with coffee, cake or a pint?  Let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message: message
  });
};

// Render Details Page
const renderDetailPage = function (req, res, locDetail) {
  res.render("location-info", {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context:
        "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction:
        "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
    },
    location: locDetail
  });
};
// Helper Functions ----------------------------------------------------------------------------------------------------
// Function to Format Homepage Distance
const _formatDistance = function (distance) {
  let numDistance, unit;
  if (distance > 1) {
    numDistance = parseFloat(distance).toFixed(1);
    unit = 'km'
  } else {
    numDistance = parseInt(distance * 1000, 10);
    unit = 'm'
  }
  return numDistance + unit
};