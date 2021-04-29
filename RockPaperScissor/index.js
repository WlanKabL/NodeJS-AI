const fs = require('fs');
var levenshtein = require('fast-levenshtein');
const readline = require('readline');
const AImove = require('./AImove');
const GamePath = __dirname + '/results/games.json';

const PossibleMoves = ["rock", "paper", "scissor"];
const PossibleInputs = PossibleMoves;

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

SaveGame = (CurrentPlayerMove, AIMove, GameRes) => {
    console.log("Saving Game with result: " + GameRes)
    var FileContent = JSON.parse(fs.readFileSync(GamePath, "utf-8"));
    var ForGamesFile = new GameSave(CurrentPlayerMove, AIMove, GameRes);
    FileContent.push(ForGamesFile);
    fs.writeFileSync(GamePath, JSON.stringify(FileContent), function (err) {
        if (err) {
            console.error(err);
            return;
        }
    })
}

StartGame = (CurrentPlayerMove) => {
    AImove.RockPaperScissor(CurrentPlayerMove).then(AIMove => {
        console.log("The AI choose: " + AIMove);
        askQuestion("Did i beat you? ").then(YourAwnser => {
            var YourAwnserS = YourAwnser.toString().toLowerCase();
            if (YourAwnserS == "1" || YourAwnserS == "true" || YourAwnserS == "yes" || YourAwnserS == "y") {
                SaveGame(CurrentPlayerMove, AIMove, "1");
            } else {
                SaveGame(CurrentPlayerMove, AIMove, "0");
            }
        })  
    })
      
}

StartUp = () => {
    var YourChoice = process.argv.slice(2).toString().toLowerCase();
    if (YourChoice == undefined) {
        console.log("ERROR: Please enter a move as start parameter")
        return;
    }

    var WordFound = false;
    var CurrentPlayerMove = "";
    PossibleMoves.forEach(oneMove => {
        if (!WordFound) {
            if (oneMove == YourChoice) {
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