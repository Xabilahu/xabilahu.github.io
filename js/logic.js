var currentlyActiveCircle = undefined;
var waitForWheel = false;

function swapActiveCircle(element, searchCircle) {
    var id = "";
    if (searchCircle == true) {
        hideActiveCircle();
        currentlyActiveCircle = document.querySelector("#navbar").children[element - 1];
        id = document.getElementsByClassName("section-" + element)[0].id;
        showActiveCircle();
    } else {
        currentlyActiveCircle = element;
        id = element.getAttribute("target-section");
    }
    document.querySelector("#" + id).scrollIntoView({behavior: "smooth", block: "end"});
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

    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');
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
