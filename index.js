function Board(n) {
	this.p1 = [];
	this.p2 = [];
	this.inner = [];
	this.outer = [];
	this.n = n;
	var div;

	for (var i = 0; i < n + 1; i++) {
		this.p1[i] = [];
		for (var j = 0; j < n; j++) {
			div = document.createElement('div');
			div.className = 'dot p1';
			this.p1[i][j] = div;
		}
	}

	for (var i = 0; i < n; i++) {
		this.p2[i] = [];
		for (var j = 0; j < n + 1; j++) {
			div = document.createElement('div');
			div.className = 'dot p2';
			this.p2[i][j] = div;
		}
	}

	for (var i = 0; i < n - 1; i++) {
		this.inner[i] = [];
		for (var j = 0; j < n - 1; j++) {
			div = document.createElement('div');
			div.className = 'line';
			this.inner[i][j] = div;
		}
	}

	for (var i = 0; i < n; i++) {
		this.outer[i] = [];
		for (var j = 0; j < n; j++) {
			div = document.createElement('div');
			div.className = 'line';
			this.outer[i][j] = div;
		}
	}
}

Board.prototype.draw = function (boardId) {
	var board = document.getElementById(boardId);

	if (!board) {
		throw new Error('No element with id ' + boardId + '.');
	}
	
	//first row of p1
	for (var i = 0; i < this.n; i++) {
		board.appendChild(this.p1[0][i]);
	}

	for (var i = 0; i < this.n; i++) {
		//p2 row with lines
		for (var j = 0; j < this.n; j++) {
			board.appendChild(this.p2[i][j]);
			board.appendChild(this.outer[i][j]);
		}
		board.appendChild(this.p2[i][j]);
		
		//p1 row with lines
		for (var j = 0; j < this.n - 1; j++) {
			board.appendChild(this.p1[i + 1][j]);
			if (i < this.n - 1) {
				board.appendChild(this.inner[i][j]);
			}
		}
		board.appendChild(this.p1[i + 1][j]);
	}
}

var b = new Board(3);
b.draw('board');