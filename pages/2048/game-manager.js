var Grid = require('./grid.js');
var Tile = require('./tile.js');

function GameManager(size) {
    this.size = size;
    this.startTiles = 2;
}
// 初始化棋盘
GameManager.prototype.init = function(){
    this.grid = new Grid(this.size)
    this.score = 0
    this.over = false
    this.won = false
    this.addStartTiles();
    return this.actuate();    
}
// 随机初始化两个格子
GameManager.prototype.addStartTiles = function(){
    for(var i = 0; i < this.startTiles; i++){
        this.addRandomTile()
    }
}
// 随机初始化一个格子
GameManager.prototype.addRandomTile = function(){
   if(this.grid.cellsAvailable()){
        var position = this.grid.randomAvailableCell()
        var insertValue = Math.random()<0.5 ? 2 : 4
        var tile = new Tile(position, insertValue)
        this.grid.insertTile(tile)
   }
}
// 返回更新数据
GameManager.prototype.actuate  = function() {
    return {
        grid: this.grid.cells,
        over: this.over,
        won: this.won,
        score: this.score,
        maxScore: this.maxScore = wx.getStorageSync('maxScore') || 0
    }
},
// 移动
GameManager.prototype.move = function(direction){
    var self = this
    var moved = false
    var cell, tile
    // 0: up, 1: right, 2: down, 3: left
    var vector = this.getVector(direction)
    var tranversals = this.buildTranversal(vector)
    // 清空merged
    this.prepareTiles();
    tranversals.x.forEach(x => {
        tranversals.y.forEach(y => {
            // cell:原位置
            cell = {x: x, y: y}
            // tile:原移动方块
            tile = self.grid.cells[x][y]
            if(tile){
                // positions里返回{farthest: previous,next:cell}
                // next要么越界要么该位置有值
                var positions = self.findFarthestPosition(cell, vector)
                var next = self.grid.cellContent(positions.next)
                // next有值 判断能否合并 并且该方块在此次move中未曾合并过
                if(next && next.value === tile.value && !next.mergedFrom){
                    var merged = new Tile(positions.next, tile.value*2)
                    merged.mergedFrom = [tile, next]
                    self.grid.insertTile(merged)
                    self.grid.removeTile(tile)                    
                    tile.updatePosition(positions.next)
                    self.score += merged.value
                    if(merged.value === 2048) self.won = true

                }else{
                    self.moveTile(tile, positions.farthest)
                }
                if(!self.positionEqual(cell,tile)){
                    moved = true
                }
            }
        })
    })
    if(moved){
        if(this.score > wx.getStorageSync('maxScore')) wx.setStorageSync('maxScore', this.score)
        this.addRandomTile();
        if(!this.movesAvailable()){
            this.over = true
        }
        return this.actuate()
    }
}
GameManager.prototype.positionEqual = function(first, second){
    return first.x === second.x && first.y === second.y
}
GameManager.prototype.moveTile = function(tile,cell){
    this.grid.cells[tile.x][tile.y] = null
    this.grid.cells[cell.x][cell.y] = tile
    tile.updatePosition(cell)
}
GameManager.prototype.findFarthestPosition = function(cell, vector){
    var previous
    do{
        previous = cell
        cell = {x: previous.x + vector.x, y: previous.y+ vector.y}
    }while(this.grid.withinBounds(cell) && this.grid.cellAvailable(cell))
    return {
        farthest: previous,
        next:cell
    }
}
GameManager.prototype.prepareTiles = function(){
    for(var i = 0; i < this.size; i++){
        for(var j = 0; j < this.size; j++){
            var tile = this.grid.cells[i][j]
            if(tile){
                tile.mergedFrom = null
                tile.savePosition();
            }
        }
    }
}

GameManager.prototype.buildTranversal = function(vector){
    var tranversals = {x:[],y:[]}
    for(var pos = 0; pos < this.size; pos++){
        tranversals.x.push(pos)
        tranversals.y.push(pos)
    }
    if(vector.x === 1) tranversals.x = tranversals.x.reverse()
    if(vector.y === 1) tranversals.y = tranversals.y.reverse()
    return tranversals
}

GameManager.prototype.getVector = function (direction) {
    var map = {
        0: { // 上
            x: -1,
            y: 0
        },
        1: { // 右
            x: 0,
            y: 1
        },
        2: { // 下
            x: 1,
            y: 0
        },
        3: { // 左
            x: 0,
            y: -1
        }
    };
  
    return map[direction];
  }
GameManager.prototype.movesAvailable = function(){
    return this.grid.cellsAvailable() || this.tileMatchAvailable()
}  
GameManager.prototype.tileMatchAvailable = function(){
    var self = this
    var tile
    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
          tile = this.grid.cellContent({ x: x, y: y });
    
          if (tile) {
            for (var direction = 0; direction < 4; direction++) {
              var vector = self.getVector(direction);
              var cell   = { x: x + vector.x, y: y + vector.y };
    
              var other  = self.grid.cellContent(cell);
    
              if (other && other.value === tile.value) {
                return true; // These two tiles can be merged
              }
            }
          }
        }
      }
      return false;
}

module.exports = GameManager;
