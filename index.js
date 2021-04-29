const fs = require('fs');
var levenshtein = require('fast-levenshtein');
const readline = require('readline');
const AImove = require('./AImove');
const GamePath = __dirname + '/results/games.json';

const PossibleMoves = ["schere", "stein", "papier"];
const PossibleInputs = PossibleMoves;

var CurrentPlayerMove = "";

async function askQuestion(query) {
    const rl = await readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return await new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

class GameSave {
    constructor(PlayerMove, AIMove, GameRes) {
        this.PM = PlayerMove;
        this. AIM = AIMove;
        this.Gres = GameRes;
    }
}

SaveGame = (PlayerChoose, AIChoose, GameRes) => {
    console.log("Saving Game with result: " + GameRes)
    var FileContent = JSON.parse(fs.readFileSync(GamePath, "utf-8"));
    var ForGamesFile = new GameSave(PlayerChoose, AIChoose, GameRes);
    FileContent.push(ForGamesFile);
    fs.writeFileSync(GamePath, JSON.stringify(FileContent), function (err) {
        if (err) {
            console.error(err)
            return;
        }
        console.log("File saved")
    })
}

StartGame = (PlayerChoose) => {
    AImove.RockPaperSisor(PlayerChoose).then(AIMove => {
        console.log("The AI choose: " + AIMove);
        askQuestion("Did i beat you? ").then(Theanswer => {
            var StringAwnser = Theanswer.toString().toLowerCase();
            if (StringAwnser == "1" || StringAwnser == "true" || StringAwnser == "yes" || StringAwnser == "fuck") {
                SaveGame(PlayerChoose, AIMove, "1")
            } else {
                SaveGame(PlayerChoose, AIMove, "0")
            }
        })  
    })
      
}

StartUp = () => {
    var YourChoise = process.argv.slice(2).toString().toLowerCase();
    if (YourChoise == undefined) {
        console.log("ERROR: Please enter a move as start parameter")
        return;
    }
    console.log(YourChoise)
    var WordFound = false;
    PossibleMoves.forEach(oneMove => {
        if (!WordFound) {
            if (oneMove == YourChoise) {
                CurrentPlayerMove = oneMove;
                WordFound = true;
            }
        }
    })
    if (WordFound) {
        console.log("Starting game with: " + CurrentPlayerMove)
        StartGame(CurrentPlayerMove);
    } else {
        console.log("ERROR: Please enter a valid move!")
    }
}

StartUp();