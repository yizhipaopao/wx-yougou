
function Grid(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
}

Grid.prototype.empty = function(){
    var cells = []
    for(var x = 0; x < this.size; x++){
        cells[x] = []
        for(var y = 0; y < this.size; y++){
            cells[x].push(null)
        }
    }
    return cells
}
// 所有空位的位置
Grid.prototype.availableCells = function(){
    var cells = []
    for(var i = 0; i < this.size; i++){
        for(var j = 0; j < this.size; j++){
            if(this.cells[i][j]===null){
                cells.push({
                    x: i,
                    y: j
                })
            }
        }
    }
    return cells
}
// 是否有空位
Grid.prototype.cellsAvailable = function(){
    return this.availableCells().length
}
// 返回随机空位
Grid.prototype.randomAvailableCell = function(){
    if(this.cellsAvailable()){
        var cell = this.availableCells()
        return cell[Math.floor(Math.random()*cell.length)]
    }
}
// 插入tile
Grid.prototype.insertTile = function(tile){
    this.cells[tile.x][tile.y] = tile
}
Grid.prototype.removeTile = function(tile){
    this.cells[tile.x][tile.y] = null
}
// cell:{x:..,y:..}
Grid.prototype.cellContent = function (cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
};
Grid.prototype.cellAvailable = function(cell){
    return !this.cellContent(cell)
}
Grid.prototype.withinBounds = function(position){
    return position.x >=0 && position.x < this.size && position.y >=0 && position.y < this.size
}
module.exports = Grid