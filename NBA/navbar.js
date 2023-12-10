var icon = document.getElementById("icon");

// Check for saved theme preference
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("darktheme");
    icon.src = "sun.png"; // Assuming sun.png is the dark theme icon
}

icon.onclick = function() {
    document.body.classList.toggle("darktheme");
    if(document.body.classList.contains("darktheme")) {
        icon.src = "sun.png";
        localStorage.setItem("theme", "dark");
    } else {
        icon.src = "moon.png";
        localStorage.setItem("theme", "light");
    }
}