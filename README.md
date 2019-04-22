# express-autosanitizer

automatic sanitization of req **body fields**, **params** and **query** fields. uses caja. automatically does sanitization and escaping as middleware.

makes your life a lot easier.

**important note: do not use the automatic middleware with nested objects or arrays (usually happens with ajax calls and API endpoints), it will crash your server.
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


### use middleware everywhere (if you don't use nested objects or arrays, good for simple projects using forms only):

**important note: Mount the middleware *below* the `express.json()` (or `bodyParser()`) instantiation**

```javascript
app.use(express.json());

// Mount here
app.use(expAutoSan.all);

app.post('/', (req, res, next) => {
  //req is automatically sanitized, as middleware is used for all routes
  doYourStuff(req.body);
  res.render("pagewithtrusteddata");
});
```

### use middleware for all fields in a route (if you don't use nested objects or arrays in this route, good for html form routes and get routes):

```javascript

app.get('/:myParam', expAutoSan.route, (req, res, next) => {
  //req is automatically sanitized, as middleware is used for body, query and params
  doYourStuff(req.params.myParam);
  doYourStuff(req.query);
  .
  .
  .
  res.render("pagewithtrusteddata");
});
```

### use middleware for a route safely (stores sanitized values in req.*type*.autosanitized):
```javascript

 assume following json:

    {
      myString:"unsafe string",
      nestedObject1:{
                myNestedString:"unsafe string 2"
                myNestedArray:[0,1,2]
              },
      myArray:["one","two","three"]
    }
```

```javascript

//use different middleware
app.post('/:myParam', expAutoSan.routeSafe, (req, res, next) => {
  //req is automatically sanitized, as middleware is used for body, query and params
  //req is not mutated, results are stored in params.autosanitized, body.autosanitized and query.autosanitized
  //for the string fields that are not nested in the object you can use values autosanitized,
  //sanitize the nested values with singular function

  doYourStuff(req.params.autosanitized.myParam);
  doYourStuff(req.query.autosanitized);
  doYourStuff(req.body.autosanitized.myString);
  
  //because myNestedString is nested
  let mySanitizedString=expAutoSan.single(req.body.nestedObject1.myNestedString);
  doYourStuff(mySanitizedString);
  
  //because myArray is an Array
  let mySanitizedArrayString=expAutoSan.single(req.body.myArray[0]);
  doYourStuff(mySanitizedArrayString);
  .
  .
  .
  res.render("pagewithtrusteddata");
});
```

### use middleware for a singular field/param/query (don't use with objects/arrays, use with strings):

```javascript

//DO NOT use as middleware
app.get('/:myParam',/*not used,*/ (req, res, next) => {
  //you can pass any fields you suspect, the field in the req will not be sanitized, use the returned value
  let mySanitizedParam=expAutoSan.single(req.params.myParam);
  doYourStuff(mySanitizedParam);
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

## Contributors

- Antonio Ramirez <sepehralizade@live.com>

## License

Copyright (c) 2019 Antonio Ramirez <sepehralizade@live.com>, MIT License
