(function() {

    /**
     * Greet the visitor
     * 
     */
    function greet() {

        // Was about to display https://imgflip.com/i/16y9za here
        // But console doesn't render images anymore :(
        console.log("%cWell, hello there!", "font-weight:bold; color: grey; font-size:16pt");
        console.log("%cIf you are interested in anything related to this website, its source is publicly available here: https://github.com/KatFishSnake/profile_website", "font-weight:bold; color: grey; font-size:16pt");
    }

    /**
     * Update DOM nodes for email links
     * 
     * @param {element}
     * @param {element}
     * @param {string}
     */
    function setLinkContent(link_el, label_el, link) {
    	// Set link href
    	link_el.href = "mailto:"+link+"?Subject=Hello%20";
    	
		// Set link label
    	label_el.textContent = link;
    }

    /**
     * Secure email from spam bots
     *
     */
    function spamSecure() {

        // Grab elements
        var email_links = document.querySelectorAll(".contact .email");
        var email_labels = document.querySelectorAll(".contact .email span");

        // Email obfuscator script 2.1 by Tim Williams, University of Arizona
        // Random encryption key feature by Andrew Moulden, Site Engineering Ltd
        // This code is freeware provided these four comment lines remain intact
        // A wizard to generate this code is at http://www.jottings.com/obfuscator/
        var coded = "6dWNI.n9xd@rhJ79W.h7o",
            key = "3w6tGFp97Kx2cDYNIykWlPSQbO8jmXL4shfiR0TnUJAa51VquoBzvHgMreECdZ",
            shift = coded.length,
            link = "";

        for (i = 0; i < coded.length; i++) {
            if (key.indexOf(coded.charAt(i)) == -1) {
                ltr = coded.charAt(i)
                link += (ltr)
            } else {
                ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length
                link += (key.charAt(ltr))
            }
        }

        setLinkContent(email_links[0], email_labels[0], link)
        setLinkContent(email_links[1], email_labels[1], link)
    }

    /*============*/
    /*   INIT     */
    /*============*/

    greet();
    spamSecure();
})();
