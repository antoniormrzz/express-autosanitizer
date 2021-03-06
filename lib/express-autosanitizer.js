let sanitizer = require('sanitizer');

const middlewareObj = {};

middlewareObj.all = function(req, res, next) {
  req.autosan={};
  req.autosan.body = middlewareObj.sanitizeIt(req.body);
  req.autosan.params = middlewareObj.sanitizeIt(req.params);
  req.autosan.query = middlewareObj.sanitizeIt(req.query);
  next();
};

middlewareObj.allUnsafe = function(req, res, next) {
  req.body = middlewareObj.sanitizeIt(req.body);
  req.params = middlewareObj.sanitizeIt(req.params);
  req.query = middlewareObj.sanitizeIt(req.query);
  next();
};

middlewareObj.route = function(req, res, next) {
  req.autosan={};
  req.autosan.body = middlewareObj.sanitizeIt(req.body);
  req.autosan.params = middlewareObj.sanitizeIt(req.params);
  req.autosan.query = middlewareObj.sanitizeIt(req.query);
  next();
};

middlewareObj.routeUnsafe = function(req, res, next) {
  req.body = middlewareObj.sanitizeIt(req.body);
  req.params = middlewareObj.sanitizeIt(req.params);
  req.query = middlewareObj.sanitizeIt(req.query);
  next();
};

function sanitizeObj(dirty) {
  let clean = {};
  Object.keys(dirty).forEach(key => {
    clean[key] = middlewareObj.sanitizeIt(dirty[key]);
  });
  return clean;
};

function sanitizeArray(dirty) {
  let clean = [];
  dirty.forEach((d) => {
    clean.push(middlewareObj.sanitizeIt(d));
  })
  return clean;
}

middlewareObj.sanitizeIt = function(theInput) {
  if (theInput === null || (typeof theInput === 'undefined') ) {
    return theInput;
  } else {
    if (typeof theInput === 'object' && theInput.constructor !== Array) {
      return sanitizeObj(theInput);
    } else if (theInput.constructor === Array) {
      return sanitizeArray(theInput);
    } else {
      if (typeof theInput === 'string') {
        let clean = sanitizer.sanitize(theInput);
        clean = sanitizer.escape(clean);
        return clean;
      } else {
        return theInput;
      }
    }
  }
}

module.exports = middlewareObj;
