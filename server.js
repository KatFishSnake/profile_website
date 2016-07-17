// Express
var express = require("express"),
    app = express(),
    path = require("path"),
    // Helmet server security optimization (passive)
    helmet = require("helmet"),
    // File compression for browser
    compression = require('compression'),
    // Cache headers for all res
    cache = require('express-cache-headers');

// Global routes
var config = {
    path: {
        assets: "./assets",
        public: "./public"
    },
    port: 5000
};

/**
 * Set up generic GET html serve
 * 
 * @param  {string} name Identifier for the route
 * @param  {string} url  Url for the route
 */
function route(name, url) {
    app.get(url, function(req, res) {
        res.sendFile(path.resolve(__dirname + "/public/" + name + "/" + name + ".html"));
    });
}

/**
 * Filter for compression plugin
 * 
 */
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

// Security optimization
app.use(helmet());
//- No iframes
app.use(helmet.frameguard({ action: 'deny' }));
//- Obscuring powered-by header 
app.use(helmet.hidePoweredBy({ setTo: 'mod_rails 4.2.0' }));
//- X-Content-Type-Options fix
app.use(helmet.noSniff());
//- CSP configuration 
app.use(helmet.contentSecurityPolicy({
    // Specify directives as normal. 
    directives: {
        defaultSrc: ["'self'", '*.andrekuznetcov.com', 'andrekuznetcov.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", "www.google-analytics.com", "d1l6p2sc9645hc.cloudfront.net", "data2.gosquared.com"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com', 'fonts.googleapis.com'],
        imgSrc: ["'self'", "www.google-analytics.com"],
        sandbox: ['allow-scripts', 'allow-same-origin', 'allow-popups'],
        objectSrc: [] // An empty array allows nothing through 
    },

    // Set to true if you only want browsers to report errors, not block them 
    reportOnly: false,

    // Set to true if you want to blindly set all headers: Content-Security-Policy, 
    // X-WebKit-CSP, and X-Content-Security-Policy. 
    setAllHeaders: true,

    // Set to true if you want to disable CSP on Android where it can be buggy. 
    disableAndroid: true,

    // Set to false if you want to completely disable any user-agent sniffing. 
    // This may make the headers less compatible but it will be much faster. 
    // This defaults to `true`. 
    browserSniff: false
}));

// Redirect from www to @
app.use(function (req, res, next) {
    if (req.headers.host.slice(0, 4) === 'www.') {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
    }
    next();
});

// Compression plugin
app.use(compression({filter: shouldCompress}));

// Set Cache-headers ( 1 hour )
app.use(cache(3600));

// Generic assets to use
app.use("/", express.static(path.resolve(config.path.public)));
app.use("/assets", express.static(path.resolve(config.path.assets)));

// SEO/crawlers optimization necessary files
app.use("/robots.txt", express.static(path.resolve(__dirname + "/robots.txt")));
app.use("/humans.txt", express.static(path.resolve(__dirname + "/humans.txt")));
app.use("/sitemap.xml", express.static(path.resolve(__dirname + "/sitemap.xml")));

// Download route for logo ( /involved/ambasador )
app.get("/download/resume", function(req, res) {
    res.download(__dirname + "/img/involved/ambassador-1.png", "children-of-art-logo.png");
});

// Site routes
route("home", "/");

/**
 * Error Handling
 */
app.use(function(req, res, next) {
    console.log("404")
    var err = new Error("Not Found");
    err.status = 404;

    // respond with html page
    if (req.accepts("html")) {
        res.sendFile(path.resolve(__dirname + "/error.html"));
        return;
    }

    // respond with json
    if (req.accepts("json")) {
        res.send({
            error: "Not found"
        });
        return;
    }

    // Redirect home if no-match found
    res.redirect("/");
});

app.use(function(err, req, res, next) {
    res.sendStatus(err.status || 500);
});

/**
 * Start the application
 */
app.listen(config.port);
console.log("Listening on port: " + config.port);
