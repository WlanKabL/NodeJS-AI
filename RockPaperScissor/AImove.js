const fs = require('fs');
const GamesPath = __dirname + "/results/games.json";
const PossibleMoves = ["schere", "stein", "papier"];
RandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

Arraycutout = (array, place = -1, value = "unknown") => {
    if (place != -1 && value == "unknown") {
        var returnarray = [];
        for (var x = 0; x < array.length; x++) {
            if (x != place) {
                returnarray.push(array[x])
            }
        }
        return returnarray;
    } else if (place == -1 && value != "unknown") {
        var returnarray = [];
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

module.exports.RockPaperSisor = async (PlayerChoose) => {
    var AIGoodMoves = PossibleMoves;
    var RecentGames = JSON.parse(fs.readFileSync(GamesPath, "utf8"));
    RecentGames.forEach(oneGame => {
        if (oneGame.PM == PlayerChoose && oneGame.Gres == "1") {
            return oneGame.AIM;
        } else if (oneGame.PM == PlayerChoose && oneGame.Gres == "0") {
            AIGoodMoves = Arraycutout(AIGoodMoves, -1, oneGame.AIM);
        }
    })
    //console.log("AI Goodmoves length: " + AIGoodMoves.length);
    return AIGoodMoves[RandomNum(0,AIGoodMoves.length)];
}