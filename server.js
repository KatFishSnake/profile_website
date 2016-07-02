// Express
var	express = require("express"),
	app = express(),
	path = require("path"),
	// Helmet server security optimization (passive)
	helmet = require("helmet");

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
 * @param  {string} name Identifier for the route
 * @param  {string} url  Url for the route
 * @return {void}
 */
function route(name, url) {
	app.get(url, function(req, res) {
		res.sendFile(path.resolve(__dirname + "/public/" + name + "/" + name + ".html"));
	});
}

// Security optimization
app.use(helmet());

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
