var currentlyActiveCircle = undefined;
var waitForWheel = false;

// Taken from: https://stackoverflow.com/questions/24567441/how-do-i-detect-two-fingers-at-touchstart-in-javascript
class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

        this.element.addEventListener('touchstart', function(evt) {
            this.xDown = evt.touches[0].clientX;
            this.yDown = evt.touches[0].clientY;
        }.bind(this), false);

    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        if ( evt.touches.length > 1 ) return;
        if ( ! this.xDown || ! this.yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) { // Most significant.
            if ( this.xDiff > 0 ) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if ( this.yDiff > 0 ) {
                this.onUp();
            } else {
                this.onDown();
            }
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }

    run() {
        this.element.addEventListener('touchmove', function(evt) {
            this.handleTouchMove(evt).bind(this);
        }.bind(this), false);
    }
}

function swapActiveCircle(element, searchCircle) {
    var id = "";
    if (searchCircle == true) {
        hideActiveCircle();
        currentlyActiveCircle = document.querySelector("#navbar").children[element - 1];
        id = document.getElementsByClassName(`section-${element}`)[0].id;
        showActiveCircle();
    } else {
        currentlyActiveCircle = element;
        id = element.getAttribute("target-section");
    }
    document.querySelector(`#${id}`).scrollIntoView({behavior: "smooth", block: "end"});
}

function hideActiveCircle(preventSearch = false) {
    if (! preventSearch) currentlyActiveCircle = document.querySelector("#navbar .active");
    if (currentlyActiveCircle != undefined) {
        currentlyActiveCircle.classList.remove("active");
    }
}

function showActiveCircle() {
    if (currentlyActiveCircle != undefined) {
        currentlyActiveCircle.classList.add("active");
    }
}

function generateNavbarDivs() {
    var navbar = document.querySelector("#navbar");
    var first = true;
    for (var d of document.querySelectorAll("div[class^='section-']")) {
        var div = document.createElement("div");
        div.setAttribute("onclick", "swapActiveCircle(this, false);");
        div.setAttribute("target-section", d.id);
        div.classList.add("circle");
        if (first) {
            div.classList.add("active");
            currentlyActiveCircle = div;
        }
        navbar.appendChild(div);
        first = false;
    }
}

function autoScaleForMobile() {
    var siteWidth = 1280;
    var scale = screen.width /siteWidth;

    document.querySelector('meta[name="viewport"]').setAttribute('content', `width=${siteWidth}, initial-scale=${scale}`);
}

function onPageLoad() {
    var host = "xabilahu.github.io"
    if (window.location.host == host && window.location.protocol != "https:") {
        window.location.protocol = "https:"
    } else {
        generateNavbarDivs();
        document.addEventListener("wheel", (event) => {
            if (currentlyActiveCircle == undefined || waitForWheel) return;
            waitForWheel = true;

            var isDownDirection = event.deltaY > 0;
            scrollDirection(isDownDirection);

            setTimeout(() => {
                waitForWheel = false;
            }, 300);
        });

        var swiper = new Swipe('body');
        swiper.onUp(function() { scrollDirection(true); });
        swiper.onDown(function() { scrollDirection(false); });
        swiper.run();       

        document.querySelector("form").addEventListener("submit", sendContactForm);

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Down":
                case "ArrowDown":
                    scrollDirection(true);
                    break;
                case "Up":
                case "ArrowUp":
                    scrollDirection(false);
                    break;
            }
        });
        autoScaleForMobile();
    }
}

function scrollDirection(isDownDirection) {
    hideActiveCircle(preventSearch=true);
    if (isDownDirection && currentlyActiveCircle.nextElementSibling != null) {
        swapActiveCircle(currentlyActiveCircle.nextElementSibling, false);
    } else if (!isDownDirection && currentlyActiveCircle.previousElementSibling != null) {
        swapActiveCircle(currentlyActiveCircle.previousElementSibling, false);
    }
    showActiveCircle();
}

function sendContactForm(evt) {
    evt.preventDefault();

    var data = {};
    var form = document.querySelector("form");
	for (var i = 0, ii = form.length; i < ii; ++i) {
		var input = form[i];
		if (input.name) {
			data[input.name] = input.value;
		}
	}

    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else xhr = new ActiveXObject("Microsoft.XMLHTTP");

    xhr.open("POST", "https://formspree.io/f/meqvoenn", true);
    xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));

    xhr.onloadend = (response) => {
        if (response.target.status == 200) {
            document.getElementById("tick").classList.add('show');
            for (var child of form.children[0].children) {
                child.value = "";
            }
            setTimeout(() => {
                document.getElementById("tick").classList.remove('show');
            }, 2000)
        } else {
            console.log(response);
            alert("failed!");
        }
    }
}
