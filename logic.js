var currectlyActiveCircle = undefined;

function swapActiveCircle(element) {
    currectlyActiveCircle = element;
}

function hideActiveCircle() {
    currectlyActiveCircle = document.querySelector("#navbar .active");
    if (currectlyActiveCircle != undefined) {
        currectlyActiveCircle.classList.remove("active");
    }
}

function showActiveCircle() {
    if (currectlyActiveCircle != undefined) {
        currectlyActiveCircle.classList.add("active");
        currectlyActiveCircle = undefined;
    }
}

function generateNavbarDivs() {
    var navbar = document.querySelector("#navbar");
    var first = true;
    for (var d of document.querySelectorAll("div[class^='section-']")) {
        var div = document.createElement("div");
        div.setAttribute("onclick", "swapActiveCircle(this);")
        div.classList.add("circle");
        if (first) div.classList.add("active");
        navbar.appendChild(div);
        first = false;
    }
}
