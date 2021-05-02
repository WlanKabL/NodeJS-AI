const fs = require('fs');
var levenshtein = require('fast-levenshtein');
const readline = require('readline');
const prompt = require('prompt');
const AImove = require('./AImove');
const { exit } = require('process');
const GamePath = __dirname + '/results/games.json';
const RulesPath = __dirname + "/Rules.json";

const Teams = ["X", "O"];
var OnTheMove = "X";
var MoveCounter = 0;
var win = false;
var Moves = "A1/;A2/;A3/;B1/;B2/;B3/;C1/;C2/;C3/";
var AllMoves = [];

class SaveGame {
    constructor(WinnerTeam, MovesArr) {
        for (var x = 0; x < MovesArr.length; x++) {
            if (x == 0) {
                this.move0 = MovesArr[x];
            } else if (x == 1) {
                this.move1 = MovesArr[x];
            }else if (x == 2) {
                this.move2 = MovesArr[x];
            }else if (x == 3) {
                this.move3 = MovesArr[x];
            }else if (x == 4) {
                this.move4 = MovesArr[x];
            }else if (x == 5) {
                this.move5 = MovesArr[x];
            }else if (x == 6) {
                this.move6 = MovesArr[x];
            }else if (x == 7) {
                this.move7 = MovesArr[x];
            }else if (x == 8) {
                this.move8 = MovesArr[x];
            }else if (x == 9) {
                this.move9 = MovesArr[x];
            }
        }
        this.winner = WinnerTeam;
    }
}

async function lineInput(query) {
    const rl = await readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return await new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

CommandLOutput = (S) => {
    var TheReturn = "";

    var BaseString = " --------------\n|   1   2   3  |\n";
    var DefaultLineBase = "| ";
    var BottomBaseS = " --------------";

    var TheMoves = S.split(";");
    var Spalte = 0;

    TheReturn = BaseString;
    for (var x = 0; x <= 8; x++) {
        if (x < 3 && x >= 0) {
            if (x == 0) {
                TheReturn += DefaultLineBase + "A";
            }
            TheReturn += "[" + TheMoves[x].substr(2, 1) + "] ";
            if (x == 2) {
                TheReturn += "|\n"
            }
        } else if (x >= 3 && x <= 5) {
            if (x == 3) {
                TheReturn += DefaultLineBase + "B";
            }
            TheReturn += "[" + TheMoves[x].substr(2, 1) + "] ";

            if (x == 5) {
                TheReturn += "|\n"
            }
        } else if (x >= 6 && x <= 8) {
            if (x == 6) {
                TheReturn += DefaultLineBase + "C";
            }
            TheReturn += "[" + TheMoves[x].substr(2, 1) + "] ";
            if (x == 8) {
                TheReturn += "|\n"
            }
        }
    }
    TheReturn += BottomBaseS;
    return TheReturn;
}

CheckFieldAvailable = (FieldName) => {
    var AllFields = Moves.split(";");
    var isAvailable = "0";
    for (var x = 0; x <= 8; x++) {
        if (AllFields[x] == (FieldName.toUpperCase() + "/")) {
            isAvailable = "1";
        }
    }
    return isAvailable;
}

PlaceField = (FieldName, Team) => {
    var TheField = FieldName.toUpperCase();
    if (CheckFieldAvailable(TheField) == "1") {
        Moves = Moves.replace(TheField + "/", TheField + Team)
        console.log(CommandLOutput(Moves))
        AllMoves.push(Moves);
    }
}

SetWin = (WinnerTeam, MovesArr) => {
    var CurrentGames = JSON.parse(fs.readFileSync(GamePath, "utf-8"));
    CurrentGames.push(new SaveGame(WinnerTeam, MovesArr))
    fs.writeFileSync(GamePath, JSON.stringify(CurrentGames), (err) => {
        if (err) {
            console.error(err);
            exit(0);
        }
    })
}

CheckWin = (S) => {

    var AllFields = [];
    var MovesArr = [];
    var AvailableFields = [];
    var TheMoves = S.split(";")
    
    for (var x = 0; x <= 8; x++) {
        MovesArr.push(TheMoves[x])
        AllFields.push(TheMoves[x].substr(0, 2))
        if (TheMoves[x].substr(2, 1) == "/") {
            AvailableFields.push(TheMoves[x].substr(0,2));
        }
    }
    var Rules = JSON.parse(fs.readFileSync(RulesPath, "utf-8"));
    var objectKeysArray = Object.keys(Rules)
    for (var x = 0; x <= 1; x++) {
        var TeamToCheck = "";
        if (x == 0) {
            TeamToCheck = "X";
        } else {
            TeamToCheck = "O";
        }
        objectKeysArray.forEach(function (objKey) {
            var OnThreeWin = 0;
            var objValue = Rules[objKey]
            objValue.forEach(WinFields => {
                MovesArr.forEach(Field => {
                    //console.log("Field: " + Field + " and idk: " + WinFields + TeamToCheck)
                    if (Field == (WinFields + TeamToCheck)) {
                        OnThreeWin++;
                    }
                })
            });
            if (OnThreeWin == 3) {
                console.log(" ------------------------------")
                console.log("|Win detected. '" + TeamToCheck + "' won the game|")
                console.log(" ------------------------------")
                SetWin(TeamToCheck, AllMoves);
                exit(0);
                return ["1", TeamToCheck];
            }

        })
    }
    if (AvailableFields.length < 1) {
        console.log(" ------------------------")
        console.log("| No win detected. Draw! |")
        console.log(" ------------------------")
        SetWin("/", AllMoves);
        exit(0);
    }
    return ["0", "/"];
}

async function Place(PlayerTeam, AITeam) {

    if (CheckWin(Moves)[0] == "0") {
        if (PlayerTeam == OnTheMove) {
            lineInput("Enter the field u want to set... ").then(FieldChoosen => {
                if (CheckFieldAvailable(FieldChoosen) == "1") {
                    //console.log(FieldChoosen + " F")
                    PlaceField(FieldChoosen, PlayerTeam);
                    OnTheMove = AITeam;
                    MoveCounter++;
                    Place(PlayerTeam, AITeam)
                } else {
                    console.log(FieldChoosen + " is not avilable!")
                    Place(PlayerTeam, AITeam)
                }
            })

        } else {
            AImove.PickField(Moves, AITeam, MoveCounter).then(AIchoose => {
                console.log("AI chooses: " + AIchoose)
                if (AIchoose == undefined) {
                    console.log("ERROR: Critical game error. AI tried to pick 'undefined'");
                    exit(0);
                }
                if (AIchoose.length == 2) {
                    PlaceField(AIchoose, AITeam);
                } else {
                    Moves = AIchoose;
                    console.log(CommandLOutput(Moves))
                }
                OnTheMove = PlayerTeam;
                MoveCounter++;
                Place(PlayerTeam, AITeam)
            })
        }
        return
    } else {
        console.log("Win detected. '" + CheckWin(Moves)[1] + "' won the game")
    }

}

StartGame = (PlayerTeam, AITeam) => {
    /* console.log(" --------------------")
    console.log("|    1     2     3   |")
    console.log("| A[ / ] [ / ] [ / ] |")
    console.log("| B[ / ] [ / ] [ / ] |")
    console.log("| C[ / ] [ / ] [ / ] |")
    console.log(" --------------------") */
    console.log(CommandLOutput(Moves))

    Place(PlayerTeam, AITeam).then(Res => { })
}

StartUp = () => {
    var YourTeam = process.argv.slice(2);
    if (YourTeam == undefined || YourTeam.length < 1) {
        console.log("ERROR: Please enter <X/O> as startparameter");
        exit(0);
    }
    YourTeam = YourTeam.toString().toUpperCase();
    console.log("Welcome to Tic-Tac-Toe against the AI of WlanKabl.");
    if (YourTeam == "X") {
        console.log("Starting game as team: " + YourTeam)
        StartGame(YourTeam, "O")
    } else if (YourTeam == "O") {
        console.log("Starting game as team: " + YourTeam)
        StartGame(YourTeam, "X")
    } else {
        console.log("ERROR: Please enter a valid Team!")
        exit(0);
    }
}

StartUp();