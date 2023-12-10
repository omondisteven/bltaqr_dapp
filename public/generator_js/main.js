//App.js
const generatorTab = document.querySelector(".nav-gene");

generatorTab.addEventListener("click", () => {
generatorTab.classList.add("active");

    document.querySelector(".generator").style.display = "block";
});
