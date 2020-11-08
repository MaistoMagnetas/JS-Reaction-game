const mainWindow = document.getElementById("main");
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
var timer;
var startingTime;

initializeGame();

function initializeGame(){
    mainWindow.innerHtml = initialScreen;
}

function startWaiting(){
    timer = setTimeout(function initClickScreen() {
        hideAllReactionBlocks();
        gameState = clickScreen.id;
        mainWindow.innerHtml = clickScreen;
        clickScreen.classList.remove(hidden);
        startingTime = new Date().getTime();
    }, getRandomTime());  
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

function showStats(){
    const stats = loadStats();

}

function loadStats(){
    return JSON.parse(localStorage.getItem('stats'));
}

function getRandomTime(){
    //1 - 5s range
    return Math.floor(Math.random() * 5000) + 1000; 
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
    hideAllReactionBlocks();
    if (gameState === "initialized" || gameState === "oppsie" || gameState === "result"){
        changeClickComponent(waitingScreen);
        startWaiting();
    }else{
        clearTimeout(timer);
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
            console.log('clicked');
            changeClickComponent(oppsieScreen);
        }
    }
});

gameBtn.addEventListener("click", () => {
    if (!gameBtn.classList.contains(active))
    {
        statsBtn.classList.remove(active);
        addClassToComponent(gameBtn, active)
        initializeGame();
    }
});

statsBtn.addEventListener("click", () => {
    if (!statsBtn.classList.contains(active))
    {
        gameBtn.classList.remove(active);
        addClassToComponent(statsBtn, active)
        showStats();
    }
});

