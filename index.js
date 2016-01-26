function Board(n, boardId) {
    this.p1 = [];
    this.p2 = [];
    this.inner = [];
    this.outer = [];
    this.n = n;
    this.board = document.getElementById(boardId);
    this.board.style.width = (2 * n + 1) * 60 + 'px';
    if (!this.board) {
        throw new Error('No element with id ' + boardId + '.');
    }
    this.currentPlayer = 'p2';
    this.lastClicked = null;

    var div;
    var i, j;
    var horizontal;
    var vertical;

    for (i = 0; i < n + 1; i++) {
        this.p1[i] = [];
        for (j = 0; j < n; j++) {
            div = document.createElement('div');
            div.className = 'dot p1';
            this.p1[i][j] = div;
        }
    }

    for (i = 0; i < n; i++) {
        this.p2[i] = [];
        for (j = 0; j < n + 1; j++) {
            div = document.createElement('div');
            div.className = 'dot p2';
            this.p2[i][j] = div;
        }
    }

    for (i = 0; i < n - 1; i++) {
        this.inner[i] = [];
        for (j = 0; j < n - 1; j++) {
            div = document.createElement('div');
            vertical = document.createElement('div');
            vertical.className = 'vertical';
            horizontal = document.createElement('div');
            horizontal.className = 'horizontal';
            div.appendChild(vertical);
            div.appendChild(horizontal);
            div.className = 'line inner';
            this.inner[i][j] = div;
        }
    }

    for (i = 0; i < n; i++) {
        this.outer[i] = [];
        for (j = 0; j < n; j++) {
            div = document.createElement('div');
            vertical = document.createElement('div');
            vertical.className = 'vertical';
            horizontal = document.createElement('div');
            horizontal.className = 'horizontal';
            div.appendChild(vertical);
            div.appendChild(horizontal);
            div.className = 'line outer';
            this.outer[i][j] = div;
        }
    }
}

Board.prototype.draw = function () {	
    //first row of p1
    for (var i = 0; i < this.n; i++) {
        this.board.appendChild(this.p1[0][i]);
    }

    for (var i = 0; i < this.n; i++) {
        //p2 row with lines
        for (var j = 0; j < this.n; j++) {
            this.board.appendChild(this.p2[i][j]);
            this.board.appendChild(this.outer[i][j]);
        }
        this.board.appendChild(this.p2[i][j]);
		
        //p1 row with lines
        for (var j = 0; j < this.n - 1; j++) {
            this.board.appendChild(this.p1[i + 1][j]);
            if (i < this.n - 1) {
                this.board.appendChild(this.inner[i][j]);
            }
        }
        this.board.appendChild(this.p1[i + 1][j]);
    }
}

Board.prototype.attachHandler = function () {
    this.board.addEventListener('click', function (event) {
        var target = event.target;
        if (target.className &&
            target.className.indexOf('line') != -1 &&
            target.className.indexOf('taken') == -1) {
                this.makeMove(target);
        }
    }.bind(this));
}

Board.prototype.makeMove = function (target) {
    target.className += ' taken';
    target.children[0].className += ' ' + this.currentPlayer;
    target.children[1].className += ' ' + this.currentPlayer;
    this.nextTurn();    
}

Board.prototype.nextTurn = function () {
    var otherPlayer = (this.currentPlayer == 'p1') ? 'p2' : 'p1';
    this.currentPlayer = otherPlayer;
    this.board.className = this.currentPlayer;
}

var b = new Board(4, 'board');
b.draw();
b.nextTurn();
b.attachHandler();