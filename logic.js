var currectlyActiveCircle = undefined;

function swapActiveCircle(element, searchCircle) {
    var id = "";
    if (searchCircle == true) {
        hideActiveCircle();
        currectlyActiveCircle = document.querySelector("#navbar").children[element - 1];
        id = document.getElementsByClassName("section-" + element)[0].id;
        showActiveCircle();
    } else {
        currectlyActiveCircle = element;
        id = element.getAttribute("target-section");
    }
    document.querySelector("#" + id).scrollIntoView({behavior: "smooth", block: "end"});
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
        div.setAttribute("onclick", "swapActiveCircle(this, false);");
        div.setAttribute("target-section", d.id);
        div.classList.add("circle");
        if (first) div.classList.add("active");
        navbar.appendChild(div);
        first = false;
    }
}
