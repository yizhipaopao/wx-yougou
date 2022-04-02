function TouchManager(){
    this.touchStartClienX = null,
    this.touchStartClientY = null,
    this.touchEndClientX = null,
    this.touchEndClientY = null
}
TouchManager.prototype.touchStart = function(e){
    this.generateStartTouches(e)
}
TouchManager.prototype.touchMove = function(e){
    this.generateMoveTouches(e)
}
TouchManager.prototype.touchEnd = function(e){
    var dx = this.touchEndClientX - this.touchStartClientX;
    var absDx = Math.abs(dx);
    var dy = this.touchEndClientY - this.touchStartClientY;
    var absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 10) {
        // (1:rigth 3:left)(2: down)(0: up)
        var direction = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
         return direction
    }
    return null
}
TouchManager.prototype.generateStartTouches = function(e){
    var touch = e.touches[0]
    this.touchStartClientX = touch.clientX;
    this.touchStartClientY = touch.clientY;
}
TouchManager.prototype.generateMoveTouches = function(e){
    var touch = e.touches[0]
    this.touchEndClientX = touch.clientX;
    this.touchEndClientY = touch.clientY;
}
function changeData(){
    this.setData({
        score: 100,
        maxScore: 200,
        grids: this.grids
    })
}
module.exports = TouchManager