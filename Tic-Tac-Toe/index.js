const fs = require('fs');
var levenshtein = require('fast-levenshtein');
const readline = require('readline');
const prompt = require('prompt');
const AImove = require('./AImove');
const GamePath = __dirname + '/results/games.json';

const Teams = ["X", "O"];
var OnTheMove = "X";
var win = false;
var Moves = "A1/;A2/;A3/;B1/;B2/;B3/;C1/;C2/;C3/";

function onErr(err) {
    console.log(err);
    return 1;
}

const properties = [
    {
        
        description: "Field you want to set",
        message: "Field you want to set",
        name: 'field',
        validator: /^[a-zA-Z0-9\s\-]+$/,
        warning: 'Field must be a empty field between <A1-C3>'
    }
];

/* const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function lineInput(query) {
    const rl = await readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return await new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
} */

CommandLOutput = (S) => {
    var TheReturn = "";

    var BaseString = " --------------------\n|    1     2     3   |\n";
    var DefaultLineBase = "| ";
    var BottomBaseS = " --------------------";

    var TheMoves = S.split(";");
    var Spalte = 0;

    TheReturn = BaseString;
    for (var x = 0; x <= 8; x++) {
        if (x < 3 && x >= 0) {
            if (x == 0) {
                TheReturn += DefaultLineBase + "A";
            }
            TheReturn += "[ " + TheMoves[x].substr(2,1) + " ] ";
            if (x == 2) {
                TheReturn += "|\n"
            }
        } else if (x >= 3 && x <= 5) {
            if (x == 3) {
                TheReturn += DefaultLineBase + "B";
            }
            TheReturn += "[ " + TheMoves[x].substr(2,1) + " ] ";

            if (x == 5) {
                TheReturn += "|\n"
            }
        } else if (x >= 6 && x <= 8) {
            if (x == 6) {
                TheReturn += DefaultLineBase + "C";
            }
            TheReturn += "[ " + TheMoves[x].substr(2,1) + " ] ";
            if (x == 8) {
                TheReturn += "|\n"
            }
        }
    }
    TheReturn += BottomBaseS;
    return TheReturn;
}

CheckFieldAwailable = (FieldName) => {
    
}

async function Place(PlayerTeam, AITeam) {
    if (PlayerTeam == OnTheMove) {
        prompt.get(properties , function (err, result) {
            if (err) { return onErr(err); }
            console.log('Command-line input received:');
            console.log('  Username: ' + result.field);
        });
        OnTheMove = AITeam;
    } else {
        console.log("AI chooses: " + "a1")
        OnTheMove = PlayerTeam;
    }
    return "a"
}

StartGame = (PlayerTeam, AITeam) => {
    /* console.log(" --------------------")
    console.log("|    1     2     3   |")
    console.log("| A[ / ] [ / ] [ / ] |")
    console.log("| B[ / ] [ / ] [ / ] |")
    console.log("| C[ / ] [ / ] [ / ] |")
    console.log(" --------------------") */
    console.log(CommandLOutput(Moves))
    
    Place(PlayerTeam, AITeam).then(Res => {
        console.log(Res)
    })
}

StartUp = () => {
    var YourTeam = process.argv.slice(2);
    if (YourTeam == undefined || YourTeam.length < 1) {
        console.log("ERROR: Please enter <X/O> as startparameter");
        return;
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
    }
}

StartUp();