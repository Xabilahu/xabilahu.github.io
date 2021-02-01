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

function onPageLoad() {
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
