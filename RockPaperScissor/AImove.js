const fs = require('fs');
const GamesPath = __dirname + "/results/games.json";
const PossibleMoves = ["rock", "paper", "scissor"];
RandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

Arraycutout = (array, place = -1, value = "unknown") => {
    var returnarray = [];
    if (place != -1 && value == "unknown") {
        for (var x = 0; x < array.length; x++) {
            if (x != place) {
                returnarray.push(array[x])
            }
        }
        return returnarray;
    } else if (place == -1 && value != "unknown") {
        for (var x = 0; x < array.length; x++) {
            if (array[x] != value) {
                returnarray.push(array[x])
            }
        }
        return returnarray;
    } else {
        return false;
    }
};

module.exports.RockPaperScissor = async (PlayerChoose) => {
    var AIGoodMoves = PossibleMoves;
    var RecentGames = JSON.parse(fs.readFileSync(GamesPath, "utf8"));
    var AwnserWorkedBefore = undefined;
    RecentGames.forEach(oneGame => {
        if (AwnserWorkedBefore == undefined) {
            if (oneGame.PM == PlayerChoose && oneGame.Gres == "1") {
                //console.log(oneGame.AIM + " is the correct awnser because it worked before!");
                AwnserWorkedBefore = oneGame.AIM;
                return oneGame.AIM;
            } else if (oneGame.PM == PlayerChoose && oneGame.Gres == "0") {
                //console.log("Removing '" + oneGame.AIM + "' because bad move");
                //console.table(AIGoodMoves)
                AIGoodMoves = Arraycutout(AIGoodMoves, -1, oneGame.AIM);
                //console.table(AIGoodMoves)
            }
        }
    })
    if (AwnserWorkedBefore != undefined) {
        //console.log("Returning '" + AwnserWorkedBefore + "', because it worked before!");
        return AwnserWorkedBefore;
    } else {
        return AIGoodMoves[RandomNum(0,AIGoodMoves.length)];
    }   
}