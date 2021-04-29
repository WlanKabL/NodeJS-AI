const fs = require('fs');
const GamesPath = __dirname + "/results/games.json";
const PossibleMoves = ["schere", "stein", "papier"];
function RandomNum(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports.RockPaperSisor = async (PlayerChoose) => {
    var AIGoodMoves = [];
    var RecentGames = JSON.parse(fs.readFileSync(GamesPath, "utf8"));
    RecentGames.forEach(oneGame => {
        if (oneGame.PM == PlayerChoose && oneGame.Gres == "1") {
            return oneGame.AIM;
        } else if (oneGame.PM == PlayerChoose && oneGame.Gres == "0") {
        } else {
            return PossibleMoves[RandomNum(0, 2)];
        }
    })
}