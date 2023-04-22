let animationSpeed = 30;

document.querySelector("#animationSpeedSlider").addEventListener("input", (event) => {
    animationSpeed = event.target.value
})

let populationSize = 10;

document.querySelector("#populationSizeSlider").addEventListener("input", (event) => {
    animationSpeed = event.target.value
    document.querySelector("#populationSizeText").textContent = event.target.value;
})

let mutationChance = 5;

document.querySelector("#mutationChanceSlider").addEventListener("input", (event) => {
    animationSpeed = event.target.value
    document.querySelector("#mutationChanceText").textContent = event.target.value;
})

let generationAmount = 30;

document.querySelector("#generationAmountSlider").addEventListener("input", (event) => {
    animationSpeed = event.target.value
    document.querySelector("#generationAmountText").textContent = event.target.value;
})

function changeAccesebility(action, amount) {
    if (action === "enable") {
        document.getElementById("populationSizeSlider").style.pointerEvents = "all";
        document.getElementById("mutationChanceSlider").style.pointerEvents = "all";
        document.getElementById("generationAmountSlider").style.pointerEvents = "all";
        if (amount === "all") {
            document.getElementById("animationSpeedSlider").style.pointerEvents = "all";
        }
    }
    else if (action === "disable") {
        document.getElementById("populationSizeSlider").style.pointerEvents = "none";
        document.getElementById("mutationChanceSlider").style.pointerEvents = "none";
        document.getElementById("generationAmountSlider").style.pointerEvents = "none";
        if (amount === "all") {
            document.getElementById("animationSpeedSlider").style.pointerEvents = "none";
        }
    }
}