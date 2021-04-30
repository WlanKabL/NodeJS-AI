module.exports.PickField = async (MovesS) => {
    var AvilableMoves = [];
    var TheMoves = MovesS.split(";")
    for (var x = 0; x <= 8; x++){
        if (TheMoves[x].substr(2, 1) == "/") {
            AvilableMoves.push(TheMoves[x])
        }
    }
    //console.log("Available moves: ")
    //console.table(AvilableMoves)
}