const fs = require('fs');
const readline = require('readline');
const GamePath = __dirname + '/results/games.json';


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
    var FileContent = JSON.parse(fs.readFileSync(GamePath, "utf-8"));
    var ForGamesFile = new GameSave(PlayerChoose, AIChoose, GameRes);
    FileContent.push(ForGamesFile);
    fs.writeFileSync(GamePath, JSON.parse(FileContent), function (err) {
        if (err) {
            console.error(err)
            return;
        }
    })
    console.table(FileContent);
}

ResultOfGame = () => {
    askQuestion("Did i beat you? ").then(Theanswer => {
        var StringAwnser = Theanswer.toString().toLowerCase();
        if (StringAwnser == "1" || StringAwnser == "true" || StringAwnser == "yes" || StringAwnser == "fuck") {
            return "1";
        } else {
            return "0";
        }
    })
}

StartGame = (PlayerChoose) => {
    while (gameAwnser = ResultOfGame()) {
        SaveGame("Schere", "Schere", gameAwnser)
    }
    
}

StartUp = () => {
    var YourChoise = process.argv.slice(2);
    console.log(YourChoise)
    StartGame(YourChoise[0]);
}

StartUp();