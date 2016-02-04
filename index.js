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

Board.prototype.isWinner = function () {
    var queue = [];
    var visited = [];
    for (var i = 0; i < this.n + 1; i++) {
        visited[i] = [];
        for (var j = 0; j < this.n + 1; j++) {
            visited[i].push(false);
        }
    }
    for (var i = 0; i < this.n; i++) {
        if (this.currentPlayer == 'p1') {
            queue.push({ x: 0, y: i });
            visited[0][i] = true;
        }
        else {
            queue.push({ x: i, y: 0 });
            visited[i][0] = true;
        }
    }

    while (queue.length > 0) {
        //console.log(this.currentPlayer, ': ', queue.map(a => `[${a.x},${a.y}]`).join(','));
        var vert = queue.shift();


        if ((this.currentPlayer == 'p1' && vert.x == this.n)
            || (this.currentPlayer == 'p2' && vert.y == this.n)) {
            return true;
        }

        var neighbours = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ];
        var edgeDeltas = {
            p1: [
                [-1, 0, 'outer'],
                [-1, 0, 'inner'],
                [0, 0, 'outer'],
                [-1, -1, 'inner']
            ],
            p2: [
                [-1, -1, 'inner'],
                [0, 0, 'outer'],
                [0, -1, 'inner'],
                [0, -1, 'outer']
            ]
        };
        for (var i = 0; i < neighbours.length; i++) {
            var x = vert.x + neighbours[i][0];
            var y = vert.y + neighbours[i][1];

            if (((this.currentPlayer == 'p1' && x >= 0 && x <= this.n && y >= 0 && y <= this.n + 1)
                || (this.currentPlayer == 'p2' && x >= 0 && x <= this.n + 1 && y >= 0 && y <= this.n))
                && !visited[x][y]) {
                var movesRow = edgeDeltas[this.currentPlayer][i];

                var lineMatrixName = movesRow[2];
                var lineMatrix = this[lineMatrixName];
                var lineX = vert.x + movesRow[0];
                var lineY = vert.y + movesRow[1];
                if (lineMatrix[lineX] && lineMatrix[lineX][lineY] && lineMatrix[lineX][lineY].className.indexOf('taken') != -1
                    && lineMatrix[lineX][lineY].children[0].className.indexOf(this.currentPlayer) != -1) {
                    queue.push({ x: x, y: y });
                    visited[x][y] = true;
                }
            }
        }
    }
    return false;
}

Board.prototype.nextTurn = function () {
    if (this.isWinner()) {
        alert((this.currentPlayer == 'p1' ? 'Red' : 'Green') + " wins!");
        return;
    }
    var otherPlayer = (this.currentPlayer == 'p1') ? 'p2' : 'p1';
    this.currentPlayer = otherPlayer;
    this.board.className = this.currentPlayer;
}

var b = new Board(3, 'board');
b.draw();
b.nextTurn();
b.attachHandler();