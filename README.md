# express-autosanitizer

automatic sanitization of req **body**, **params** and **query** strings. uses caja. automatically does sanitization and escaping as middleware.

makes your life a lot easier.

**important note: do not use with large amounts of input, it might overflow. it goes through the fields recursively.
in that case, use singular sanitization instead.**

## Install

```
npm i -S express-autosanitizer
```

## Usage

### Import 

```javascript
const expAutoSan = require('express-autosanitizer');
```
**important note: if you intend to use it with app.use(), mount the middleware *below* the `express.json()` (or `bodyParser()`) instantiation**

### Use middleware everywhere (safe):

  writes sanitized data to req.autosan (req.autosan.body, req.autosan.params, req.autosan.query)
  
```javascript
app.use(express.json());

// Mount here
app.use(expAutoSan.all);

app.post('/', (req, res, next) => {
  //req is automatically sanitized, as middleware is used for all routes
  doYourStuff(req.autosan.body);
  res.render("pagewithtrusteddata");
});
```

### Use middleware everywhere (UNSAFE):

  writes sanitized data to req, mutes req object so it might cause problems.
  p.s: this is to apply sanitization for lazy people like me.
  
```javascript
app.use(express.json());

// Mount here
app.use(expAutoSan.allUnsafe);

//no extra middleware needed
app.post('/', (req, res, next) => {
  //req is automatically sanitized, as middleware is used for all routes
  doYourStuff(req.body);
  res.render("pagewithtrusteddata");
});
```

### Use middleware for a route (safe):

   writes sanitized data to req.autosan (req.autosan.body, req.autosan.params, req.autosan.query)

```javascript

//use the middleware
app.post('/:myParam', expAutoSan.route, (req, res, next) => {
  //req is automatically sanitized, as middleware is used for body, query and params of this route
  //req is not mutated, results are stored in req.autosan.body, req.autosan.params, req.autosan.query
  doYourStuff(req.autosan.body);
  .
  .
  .
  res.render("pagewithtrusteddata");
});
```

### Use middleware for a route (UNSAFE):

   writes sanitized data to req (req.body, req.params, req.query)

```javascript

//use different middleware
app.post('/:myParam', expAutoSan.routeUnsafe, (req, res, next) => {
  //req is automatically sanitized, as middleware is used for body, query and params of this route
  //req IS mutated, results are stored in req.body, req.params, req.query
  doYourStuff(req.body);
  .
  .
  .
  res.render("pagewithtrusteddata");
});
```

### Use as function (safe):

```javascript
app.get('/:myParam', (req, res, next) => {
  //you can pass array/object/string or whatever you want, only string parts will be sanitized
  //again, do not pass highly-nested structures, this middleware works recursively
  let mySanitizedData = expAutoSan.sanitizeIt(myDirtyData);
  doYourStuff(mySanitizedData);
  .
  .
  .
  res.render("pagewithtrusteddata");
});
```

## What it does

When you use it on a field or a route, it will remove all script tags, and escape html characters. this improves security in your app.


## Caveats

This module uses "sanitizer" module, the sanitization logic is done in that package, review the package yourself.
This package goes over the data recursively, it is your duty to be wise enough not to use data that will crash it, you should be fine for most cases (forms, ajax apps, api etc).

## License

Copyright (c) 2019 Antonio Ramirez <sepehralizade@live.com>, MIT License
