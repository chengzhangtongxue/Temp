/**
 * Created by Administrator on 2015/12/18.
 */

//游戏对象
var game = {
    WIDTH:20,           // 生成游戏的宽度
    HEIGHT:20,
    snakeLength:3,
    doc:document,
    snake:new Array(),
    flag:true,
    title:['小样还可以嘛','好厉害，继续加油哦','再接再厉哦','大神膜拜'],
    stop:false,

    init:function() {   // 游戏初始化
        this.gameCell = this.initCell();        // 游戏网格
        var oContent = this.doc.getElementsByClassName('content')[0];
        var table = this.doc.createElement('table');
        for(var i=0; i<this.WIDTH; i++) {
            var tr = this.doc.createElement('tr');
            for(var j=0; j<this.HEIGHT; j++) {
                var td = this.doc.createElement('td');
                td.setAttribute('class','');
                tr.appendChild(td);
                this.gameCell[i][j] = td;
            }
            table.appendChild(tr);
        }
        oContent.appendChild(table);


        this.gridAttr = this.initCell();        // 游戏网格属性
    },
    initCell:function() {
        var arr = new Array(this.WIDTH);
        for(var i=0; i<this.WIDTH; i++) {
            arr[i] = new Array(this.HEIGHT);
        }
        return arr;
    },
    initSnake:function() {
        var x = Math.floor(Math.random()*(this.WIDTH-6)+3);     // [0,20)
        var y = Math.floor(Math.random()*(this.HEIGHT-6)+3);
        if(y>this.HEIGHT/2) {
            snake.direction = 37;
        } else {
            snake.direction = 39;
        }
        for(var i=0; i<this.snakeLength; i++) {
            if(snake.direction == 37) {
                this.snake.push([x,y+i]);
            } else {
                this.snake.unshift([x,y+i]);
            }
            this.gameCell[x][y+i].className = 'active';
            this.gridAttr[x][y+i] = 'snake';
        }
    },
    initFood:function() {
        do {
            var x = Math.floor(Math.random()*this.WIDTH);     // [0,20)
            var y = Math.floor(Math.random()*this.HEIGHT);
        } while(this.gridAttr[x][y]=='snake');

        console.info('x:'+x+',y:'+y);
        this.gameCell[x][y].className = 'food';
        this.gridAttr[x][y] = 'food';

    },
    clear:function() {
        for(var i=0; i<this.WIDTH; i++) {
            for(var j=0; j<this.HEIGHT; j++) {
                this.gameCell[i][j].className = '';
                this.gridAttr[i][j] = '';
            }
        }
        this.snake = new Array();
    }

}

//蛇对象
var snake = {
    timer:1,
    speed:200,
    direction:undefined,
    walk:function() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(step,this.speed);
    }
}

//蛇移动方法
function step() {
    if(game.stop) {
        return;
    }

    var headX = game.snake[0][0];
    var headY = game.snake[0][1];
    switch(snake.direction) {
        case 37:headY--;
            break;
        case 38:headX--;
            break;
        case 39:headY++;
            break;
        case 40:headX++;
            break;
    }

    if(headX<0 || headY<0 || headX>=game.WIDTH || headY>=game.HEIGHT || game.gridAttr[headX][headY]=='snake') {
        show();
        clearInterval(snake.timer);
        document.getElementById('startGame').removeAttribute('disabled');
        game.flag = true;
        return;
    }

    if(game.gridAttr[headX][headY] != 'food') {
        var lastX = game.snake[game.snake.length-1][0];
        var lastY = game.snake[game.snake.length-1][1];

        game.snake.pop();
        game.snake.unshift([headX,headY]);
        game.gameCell[lastX][lastY].className = '';
        game.gameCell[headX][headY].className = 'active';

        game.gridAttr[lastX][lastY] = '';
    } else {
        game.snake.unshift([headX,headY]);
        game.gameCell[headX][headY].className = 'active';
        game.initFood();

        //分数++
        score.setScore(++score.initScore);

        if(score.initScore<10) {
            show(game.title[0]);
        } else if(score.initScore<20) {
            snake.speed = 150;
            show(game.title[1]);
        } else if(score.initScore<30) {
            snake.speed = 100;
            show(game.title[2]);
        } else {
            snake.speed = 80;
            show(game.title[3]);
        }
    }

    game.gridAttr[headX][headY] = 'snake';

}

//绑定页面加载完毕事件
addEvent(window,'load',function() {
    game.init();
    var oStartGame = document.getElementById('startGame');
    addEvent(oStartGame,'click',function() {
        console.info(1);
        if(game.flag) {
            this.setAttribute('disabled','disabled');
            game.flag = false;
            game.clear();
            game.initSnake();
            game.initFood();
            snake.walk();
        }
    });

    var oStopGame = document.getElementById('stopGame');
    addEvent(oStopGame,'click',function() {
        if(game.stop) {
            game.stop = false;
            this.innerHTML = '暂停游戏';
        } else {
            game.stop = true;
            this.innerHTML = '继续游戏';
        }
    });
});

//绑定键盘事件
addEvent(document,'keydown',function() {
    var e =  e || window.event;
    if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        if(Math.abs(e.keyCode-snake.direction)!=2) {
            snake.direction = e.keyCode;
        }
    }
});

//显示游戏标语
function show(str) {
    var str = str || 'Game Over';
    var oTitle = document.getElementsByClassName('title')[0];
    oTitle.innerText = str;
}

//设置游戏分数
var score = (function() {
    var oScore = document.getElementById('score');
    var scoreVal = oScore.innerHTML;
    return {
        initScore:scoreVal,
        setScore:function(val) {
            scoreVal = val;
            oScore.innerHTML = val;
        }
    }
}());
