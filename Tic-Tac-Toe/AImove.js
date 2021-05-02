const fs = require('fs');
const { exit } = require('process');
const OldGamesPath = __dirname + "/results/games.json";
const RulesPath = __dirname + "/Rules.json";

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

DetectWinToCancel = (MovesS, AIteam) => {
    var ReturnValue = "0";
    var AllFields = [];
    var MovesArr = [];
    var AvailableFields = [];

    var TheMoves = MovesS.split(";")

    for (var x = 0; x <= 8; x++) {
        MovesArr.push(TheMoves[x])
        AllFields.push(TheMoves[x].substr(0, 2))
        if (TheMoves[x].substr(2, 1) == "/") {
            AvailableFields.push(TheMoves[x].substr(0, 2));
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
            var FieldsToWin = objValue;
            objValue.forEach(WinFields => {
                MovesArr.forEach(Field => {

                    if (Field == (WinFields + TeamToCheck)) {
                        FieldsToWin = Arraycutout(FieldsToWin, -1, WinFields)
                        OnThreeWin++;
                    }
                })
            });
            if (OnThreeWin == 2) {
                if (AvailableFields.includes(FieldsToWin[0]) && TeamToCheck != AIteam) {
                    //console.log("Player is near the win with field: " + FieldsToWin[0])
                    ReturnValue = FieldsToWin[0];
                }
            }

        })
    }
    return ReturnValue;
}

module.exports.PickField = async (MovesS, AIteam, Movecounter) => {
    if (DetectWinToCancel(MovesS, AIteam) != "0") {
        //This is OP mode to INSTANTLY block all moves from enemy.
        return DetectWinToCancel(MovesS, AIteam)
    }
    var AvilableMoves = [];
    var IfEverythingIsLost = [];
    var TheMoves = MovesS.split(";");

    for (var x = 0; x <= 8; x++) {
        if (TheMoves[x].substr(2, 1) == "/") {
            AvilableMoves.push(TheMoves[x].substr(0, 2));
        }
    }
    IfEverythingIsLost = AvilableMoves;

    var GoodMovesToMake = [];
    var MovesDontWork = [];

    var OldGames = JSON.parse(fs.readFileSync(OldGamesPath, "utf-8"));
    OldGames.forEach(Agame => {
        if (Agame.winner == AIteam) {
            var Currentpattern = (Movecounter == 0) ? Agame.move0 : (Movecounter == 1) ? Agame.move1 : (Movecounter == 2) ? Agame.move2 : (Movecounter == 3) ? Agame.move3 : (Movecounter == 4) ? Agame.move4 : (Movecounter == 5) ? Agame.move5 : (Movecounter == 6) ? Agame.move6 : (Movecounter == 7) ? Agame.move7 : (Movecounter == 8) ? Agame.move8 : (Movecounter == 9) ? Agame.move9 : "BROKE";
            if (Currentpattern == "BROKE") {
                console.log("ERROR: Critical game error detected!")
                exit(0);
            }
            if (Currentpattern == MovesS) {
                console.log("Pattern found!")
                GoodMovesToMake.push(Agame);
            }

        } else if (Movecounter >= 7 && Agame.winner == "/") {
            var Currentpattern = (Movecounter == 0) ? Agame.move0 : (Movecounter == 1) ? Agame.move1 : (Movecounter == 2) ? Agame.move2 : (Movecounter == 3) ? Agame.move3 : (Movecounter == 4) ? Agame.move4 : (Movecounter == 5) ? Agame.move5 : (Movecounter == 6) ? Agame.move6 : (Movecounter == 7) ? Agame.move7 : (Movecounter == 8) ? Agame.move8 : (Movecounter == 9) ? Agame.move9 : "BROKE";
            if (Currentpattern == "BROKE") {
                console.log("ERROR: Critical game error detected!")
                exit(0);
            }

            if (Currentpattern == MovesS) {
                console.log("Pattern found!")
                GoodMovesToMake.push(Agame);
            }
        } else {
            var Currentpattern = (Movecounter == 0) ? Agame.move0 : (Movecounter == 1) ? Agame.move1 : (Movecounter == 2) ? Agame.move2 : (Movecounter == 3) ? Agame.move3 : (Movecounter == 4) ? Agame.move4 : (Movecounter == 5) ? Agame.move5 : (Movecounter == 6) ? Agame.move6 : (Movecounter == 7) ? Agame.move7 : (Movecounter == 8) ? Agame.move8 : (Movecounter == 9) ? Agame.move9 : "BROKE";
            if (Currentpattern == "BROKE") {
                console.log("ERROR: Critical game error detected!")
                exit(0);
            }

            if (Currentpattern == MovesS) {
                MovesDontWork.push(Agame);
            }
        }
    })

    if (GoodMovesToMake.length != 0) {
        if (GoodMovesToMake.length == 0) {
            var Currentpattern = (Movecounter == 0) ? GoodMovesToMake[0].move0 : (Movecounter == 1) ? GoodMovesToMake[0].move1 : (Movecounter == 2) ? GoodMovesToMake[0].move2 : (Movecounter == 3) ? GoodMovesToMake[0].move3 : (Movecounter == 4) ? GoodMovesToMake[0].move4 : (Movecounter == 5) ? GoodMovesToMake[0].move5 : (Movecounter == 6) ? GoodMovesToMake[0].move6 : (Movecounter == 7) ? GoodMovesToMake[0].move7 : (Movecounter == 8) ? GoodMovesToMake[0].move8 : (Movecounter == 9) ? GoodMovesToMake[0].move9 : "BROKE";
            var NextMove = (Movecounter == 0) ? GoodMovesToMake[0].move1 : (Movecounter == 1) ? GoodMovesToMake[0].move2 : (Movecounter == 2) ? GoodMovesToMake[0].move3 : (Movecounter == 3) ? GoodMovesToMake[0].move4 : (Movecounter == 4) ? GoodMovesToMake[0].move5 : (Movecounter == 5) ? GoodMovesToMake[0].move6 : (Movecounter == 6) ? GoodMovesToMake[0].move7 : (Movecounter == 7) ? GoodMovesToMake[0].move8 : (Movecounter == 8) ? GoodMovesToMake[0].move9 : "BROKE";
            console.log("Good move return Only1")
            return NextMove
        } else {
            var Currentpattern = (Movecounter == 0) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move0 : (Movecounter == 1) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move1 : (Movecounter == 2) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move2 : (Movecounter == 3) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move3 : (Movecounter == 4) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move4 : (Movecounter == 5) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move5 : (Movecounter == 6) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move6 : (Movecounter == 7) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move7 : (Movecounter == 8) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move8 : (Movecounter == 9) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move9 : "BROKE";
            var NextMove = (Movecounter == 0) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move1 : (Movecounter == 1) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move2 : (Movecounter == 2) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move3 : (Movecounter == 3) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move4 : (Movecounter == 4) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move5 : (Movecounter == 5) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move6 : (Movecounter == 6) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move7 : (Movecounter == 7) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move8 : (Movecounter == 8) ? GoodMovesToMake[(GoodMovesToMake.length - 1)].move9 : "BROKE";
            console.log("Good move return MoreThan1")
            return NextMove
        }
    } else if (MovesDontWork.length != 0) {
        console.log("Moves dont work called");
        if (MovesDontWork.length == 0) {
            var Currentpattern = (Movecounter == 0) ? MovesDontWork[0].move0 : (Movecounter == 1) ? GoodMovesToMake.move1 : (Movecounter == 2) ? MovesDontWork[0].move2 : (Movecounter == 3) ? MovesDontWork[0].move3 : (Movecounter == 4) ? MovesDontWork[0].move4 : (Movecounter == 5) ? MovesDontWork[0].move5 : (Movecounter == 6) ? MovesDontWork[0].move6 : (Movecounter == 7) ? MovesDontWork[0].move7 : (Movecounter == 8) ? MovesDontWork[0].move8 : (Movecounter == 9) ? MovesDontWork[0].move9 : "BROKE";
            var NextMove = (Movecounter == 0) ? MovesDontWork[0].move1 : (Movecounter == 1) ? MovesDontWork[0].move2 : (Movecounter == 2) ? MovesDontWork[0].move3 : (Movecounter == 3) ? MovesDontWork[0].move4 : (Movecounter == 4) ? MovesDontWork[0].move5 : (Movecounter == 5) ? MovesDontWork[0].move6 : (Movecounter == 6) ? MovesDontWork[0].move7 : (Movecounter == 7) ? MovesDontWork[0].move8 : (Movecounter == 8) ? MovesDontWork[0].move9 : "BROKE";

            while (true) {
                if (AvilableMoves.length == 0) {
                    return IfEverythingIsLost[RandomNum(0, IfEverythingIsLost.length)]
                }
                var WouldReturn = AvilableMoves[RandomNum(0, AvilableMoves.length)];
                if (MovesS.replace(WouldReturn + "/", WouldReturn + AIteam) == NextMove) {
                    console.log("Shit idea dont return")
                    AvilableMoves = Arraycutout(AvilableMoves, -1, WouldReturn);
                } else {
                    console.log("Good idea return")
                    return WouldReturn;
                }
            }

        } else {
            var Currentpattern = (Movecounter == 0) ? MovesDontWork[(MovesDontWork.length - 1)].move0 : (Movecounter == 1) ? GoodMovesToMake.move1 : (Movecounter == 2) ? MovesDontWork[(MovesDontWork.length - 1)].move2 : (Movecounter == 3) ? MovesDontWork[(MovesDontWork.length - 1)].move3 : (Movecounter == 4) ? MovesDontWork[(MovesDontWork.length - 1)].move4 : (Movecounter == 5) ? MovesDontWork[(MovesDontWork.length - 1)].move5 : (Movecounter == 6) ? MovesDontWork[(MovesDontWork.length - 1)].move6 : (Movecounter == 7) ? MovesDontWork[(MovesDontWork.length - 1)].move7 : (Movecounter == 8) ? MovesDontWork[(MovesDontWork.length - 1)].move8 : (Movecounter == 9) ? MovesDontWork[(MovesDontWork.length - 1)].move9 : "BROKE";
            var NextMove = (Movecounter == 0) ? MovesDontWork[(MovesDontWork.length - 1)].move1 : (Movecounter == 1) ? MovesDontWork[(MovesDontWork.length - 1)].move2 : (Movecounter == 2) ? MovesDontWork[(MovesDontWork.length - 1)].move3 : (Movecounter == 3) ? MovesDontWork[(MovesDontWork.length - 1)].move4 : (Movecounter == 4) ? MovesDontWork[(MovesDontWork.length - 1)].move5 : (Movecounter == 5) ? MovesDontWork[(MovesDontWork.length - 1)].move6 : (Movecounter == 6) ? MovesDontWork[(MovesDontWork.length - 1)].move7 : (Movecounter == 7) ? MovesDontWork[(MovesDontWork.length - 1)].move8 : (Movecounter == 8) ? MovesDontWork[(MovesDontWork.length - 1)].move9 : "BROKE";
            while (true) {
                if (AvilableMoves.length == 0) {
                    return IfEverythingIsLost[RandomNum(0, IfEverythingIsLost.length)]
                }
                var WouldReturn = AvilableMoves[RandomNum(0, AvilableMoves.length)];
                if (MovesS.replace(WouldReturn + "/", WouldReturn + AIteam) == NextMove) {
                    console.log("Shit idea dont return")
                    AvilableMoves = Arraycutout(AvilableMoves, -1, WouldReturn);
                } else {
                    console.log("Good idea return")
                    return WouldReturn;
                }
            }
        }
        console.log("Moves dont work AHHHH")
        return AvilableMoves[RandomNum(0, AvilableMoves.length)]
    } else {
        var ArrIndex = RandomNum(0, AvilableMoves.length)
        console.log("No good or bad move detected. Returning Random: " + ArrIndex)
        return AvilableMoves[ArrIndex]
    }
}