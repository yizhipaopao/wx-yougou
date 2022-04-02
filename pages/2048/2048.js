const GameManager = require('./game-manager')
const TouchManager = require('./touch-manager')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        size: 4,
        score: 0,
        maxScore: 0,
        grid:[],
        over: false,
        won: false,
        overMsg:'',
        keepPlaying:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.GameManager = new GameManager(4);
        this.TouchManager = new TouchManager();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData(
            this.GameManager.init()
        );
    },
    updateView: function(data){
        if(data.over){
            data.overMsg = 'over'
        }else if(this.data.keepPlaying){
            data.won = false
        }else if(data.won){
            data.overMsg = 'won'
        }
        this.setData(data)
    },
    handleNewGame:function(){
        this.setData({
            ...this.GameManager.init(),
            keepPlaying:false           
        });
    },
    handleGameProcess:function(){
        if(this.data.overMsg === 'over'){
            this.setData({overMsg:''})
            this.setData(
                this.GameManager.init()
            );
        }else if(this.data.overMsg === 'won'){
            this.setData({
                overMsg:'',
                keepPlaying:true
            })
        }
    },
    touchStart: function(e){
        this.TouchManager.touchStart(e)
    } ,
    touchMove: function(e){
        this.TouchManager.touchMove(e)
    },
    touchEnd: function(e){
        var direction = this.TouchManager.touchEnd(e)
        if(direction != null){
            var data = this.GameManager.move(direction) || {
                grid: this.data.grid,
                over: this.data.over,
                won: this.data.won,
                score: this.data.score
            };
            this.updateView(data)
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})
