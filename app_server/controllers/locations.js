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
module.exports.homelist = (req, res) => {
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
    requestOptions, (err, response, body) => {
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
module.exports.locationInfo = (req, res) => {
  getLocationInfo(req, res, (req, res, responseData) => {
    renderDetailPage(req, res, responseData)
  })
};

// GET 'Add Review' Page
module.exports.addReview = (req, res) => {
  getLocationInfo(req, res, (req, res, responseData) => {
    renderReviewForm(req, res, responseData)
  })
};

// POST New Review from 'Add Review' Page
module.exports.doAddReview = (req, res) => {
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect(`/location/${locationid}/reviews/new?err=val`)
  } else {
    request(
      requestOptions,
      (err, response, body) => {
        if (response.statusCode === 201) {
          res.redirect(`/location/${locationid}`)
        } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
          res.redirect(`/location/${locationid}/reviews/new?err=val`)
        } else {
          _showError(req, res, response.statusCode)
        }
      }
    )
  }
};

// Render Functions ----------------------------------------------------------------------------------------------------
// Render Homepage
const renderHomepage = (req, res, responseBody) => {
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
const renderDetailPage = (req, res, locDetail) => {
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

// Render Review Form Page
const renderReviewForm = (req, res, locDetail) => {
  res.render("location-review-form", {
    title: `Review ${locDetail.name} on Loc8r`,
    pageHeader: {title: `Review ${locDetail.name}`},
    error: req.query.err
  });
};
// Helper Functions ----------------------------------------------------------------------------------------------------
// Function to Format Homepage Distance
const _formatDistance = distance => {
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

// Error Handling Function for Details Page
const _showError = (req, res, status) => {
  let title, content;
  if (status === 404) {
    title = '404: Page Not Found';
    content = 'Oh dear.  It looks like we can\'t find this page. Sorry.';
  } else {
    title = status + ', something\'s gone wrong';
    content = 'Something, somewhere, bas gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic', {
    title: title,
    content: content
  })
};

// Reusable Function for GETting the Location Information
const getLocationInfo = (req, res, callback) => {
  const path = '/api/locations/' + req.params.locationid;
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions, (err, response, body) => {
      let data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        for (let k = 0; k < data.reviews.length; k++) {
          data.reviews[k].createdOn = moment(data.reviews[k].createdOn).format('D MMMM YYYY')
        }
        callback(req, res, data)
      } else {
        _showError(req, res, response.statusCode)
      }
    }
  )
};