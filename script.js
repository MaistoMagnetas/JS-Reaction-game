

const mainWindow = document.getElementById("main");
const gameWindow = document.getElementById("game");
const statsWindow = document.getElementById("stats");
const gameBtn = document.getElementById("gameBtn");
const statsBtn = document.getElementById("statsBtn");

const waitingScreen = document.getElementById("waiting");
const clickScreen = document.getElementById("click");
const resultScreen = document.getElementById("result");
const oppsieScreen = document.getElementById("oppsie");
const initialScreen = document.getElementById("initial");

const reactionTimes = [];
const active = "active";
const hidden = "hidden";

var gameState = "initialized";
var startingTime;
var worker = new Worker('timer.js', {type: "module"});

initializeGame();

worker.addEventListener("message", function(e){
    if (e.data === "Worker finished"){
        hideAllReactionBlocks();
        gameState = clickScreen.id;
        mainWindow.innerHtml = clickScreen;
        clickScreen.classList.remove(hidden);
        startingTime = new Date().getTime();
    }
});

function initializeGame(){
    mainWindow.innerHtml = initialScreen;
}

function startWaiting(){
    worker.postMessage("Start Timer");
}

function addStat(stat){
    var stats = loadStats();
    if (stats){
        stats.push(stat);
    }
    else { 
        stats = [stat];
    }
    localStorage.setItem('stats', JSON.stringify(stats));
}

function loadStats(){
    return JSON.parse(localStorage.getItem('stats'));
}

function addClassToComponent(component, classToAdd){
    if (!component.classList.contains(classToAdd)){
        component.classList.add(classToAdd);
    }
}

function hideAllReactionBlocks(){
    addClassToComponent(initialScreen, hidden);
    addClassToComponent(oppsieScreen, hidden);
    addClassToComponent(clickScreen, hidden);
    addClassToComponent(resultScreen, hidden);
    addClassToComponent(waitingScreen, hidden);
}

function changeClickComponent(component){
    gameState === component.id;
    mainWindow.innerHtml = component;
    component.classList.remove(hidden);
}

mainWindow.addEventListener("click", () => {
    if (!gameWindow.classList.contains('hidden')){
        hideAllReactionBlocks();
        if (gameState === "initialized" || gameState === "oppsie" || gameState === "result"){
            changeClickComponent(waitingScreen);
            startWaiting();
        }else{
            if (gameState === "click"){
                gameState = resultScreen.id;
                const passedTime = new Date().getTime() - startingTime;
                addStat(passedTime);
                resultScreen.innerHTML = `
                <i class="fas fa-clock"></i>
                <h2>${passedTime} ms</h2>
                <p>Click to keep going</p>`;
                resultScreen.classList.remove(hidden);
            }else if (gameState === "waiting"){
                changeClickComponent(oppsieScreen);
            }
        }
    }
});

gameBtn.addEventListener("click", () => {
    if (!gameBtn.classList.contains(active))
    {
        statsBtn.classList.remove(active);
        addClassToComponent(statsWindow, hidden);
        gameWindow.classList.remove(hidden);
        addClassToComponent(gameBtn, active)
        initializeGame();
    }
});

statsBtn.addEventListener("click", () => {
    if (!statsBtn.classList.contains(active))
    {
        const stats = loadStats();
        const p = document.createElement("p");
        const ul = document.createElement("ul");
        var minStat = 99999999999999999999999999999999999;
        stats.forEach(stat => {
            const li = document.createElement("li");
            li.innerText = `${stat} ms`;
            ul.appendChild(li);
            if (stat < minStat){
                minStat = stat;
            }
        });
        p.innerText = `
            Fastest time: ${minStat} ms
        `;
        statsWindow.appendChild(p);
        statsWindow.appendChild(ul);

        gameBtn.classList.remove(active);
        addClassToComponent(gameWindow, hidden);
        statsWindow.classList.remove(hidden);
        addClassToComponent(statsBtn, active)
    }
});

