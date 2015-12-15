function Board(n, boardId) {
	this.p1 = [];
	this.p2 = [];
	this.inner = [];
	this.outer = [];
	this.n = n;
	this.board = document.getElementById(boardId);
	if (!this.board) {
		throw new Error('No element with id ' + boardId + '.');
	}
	this.currentPlayer = 'p1';

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
			target.className.indexOf('dot') != -1 &&
			target.className.indexOf(this.currentPlayer) != -1) {
			this.highlightMoves(target);
			this.nextTurn();
		}
	}.bind(this));
}

Board.prototype.getTargetCoords = function(target) {
	for (var i = 0; i < this[this.currentPlayer].length; i++) {
		for (var j = 0; j < this[this.currentPlayer][i].length; j++) {
			if (this[this.currentPlayer][i][j] === target) {
				return [i, j];
			}
		}
	}
};

Board.prototype.highlightMoves = function(target) {
	var targetCoords = this.getTargetCoords(target);
	var targetX = targetCoords[0];
	var targetY = targetCoords[1];
	var neighbours = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1]
	];
	var possibleMoves = {
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
	
	var playerMatrix = this[this.currentPlayer];
	for (var i = 0; i < 4; i++) {
		var movesRow = possibleMoves[this.currentPlayer][i];
		
		var lineMatrix = this[movesRow[2]];
		var lineX = targetX + movesRow[0];
		var lineY = targetY + movesRow[1];
		var line = lineMatrix[lineX] && lineMatrix[lineX][lineY];
		
		if (line && line.childNodes.length === 0) {
			var neighbourX = targetX + neighbours[i][0];
			var neighbourY = targetY + neighbours[i][1];
			var neighbour = playerMatrix[neighbourX] && playerMatrix[neighbourX][neighbourY];
			if (neighbour) {
				neighbour.className += ' highlighted';
			}
		}
	}
}

Board.prototype.nextTurn = function () {
	var otherPlayer = (this.currentPlayer == 'p1') ? 'p2' : 'p1';

	this.currentPlayer = otherPlayer;
}

var b = new Board(3, 'board');
b.draw();
b.attachHandler();