

/*
 * Class BoardModel
 * 
 * The life board model, a singleton.
 *
 */
function BoardModel() {}

/**
 * The current board state.
 */
BoardModel._state = null;

/**
 * BoardModel.init
 *
 * Initializes the board with the given width and initial density.
 */
BoardModel.init = function(width, density) {
    BoardModel._state = new BoardState(width, density);
    BoardModel._state.dump();
}

/**
 * BoardModel.step
 *
 * Proceeds forward one generation in the Life simulation.
 */
BoardModel.step = function() {
    var more = false;

    if (BoardModel._state != null) {
        var newState = new BoardState(BoardModel._state);
        //newState.dump();

        if (newState.equals(BoardModel._state)) {
            //BoardModel.stop();
        }
        else {
            BoardModel._state = newState;
            more = true;
        }
    }

    return more;
}




/**
 * Class BoardState
 * 
 * Represents a state of the puzzle board.
 *
 * Parameters:
 *
 *     widthOrPriorState - Either: the number of columns or rows (in which case a
 *                          new random layout is generated)
 *                         OR:  a prior board state (in which case a new layout is
 *                          generated according to the rules of the simulation).
 *
 *     density - (optional, used only if the first argument is the width)
 *                the initial density of the layout (0 - 1).
 */
function BoardState(widthOrPriorState, density) {
    var width;
    var priorState;

    if (typeof widthOrPriorState == 'object') {
        width = widthOrPriorState._width;
        priorState = widthOrPriorState;
    }
    else {
        width = widthOrPriorState;
        priorState = null;
    }
    
    this._width = width;
    this._tiles = null;

    if (priorState) {
        this._initFromPrior(priorState);
    }
    else {
        if (typeof density == 'undefined') {
            density = 0.2;
        }

        this._initRandom(density);
    }
}

/**
 * BoardState._width
 *
 * The number of rows or columns of the board.  The board is always square,
 * so the width and height are the same.
 */
BoardState.prototype._width;

/**
 * BoardState._step
 *
 * The step number in the simulation.
 */
BoardState.prototype._step;

/**
 * BoardState._tiles
 *
 * The matrix of tiles, stored in a 1-dimensional array.
 */
BoardState.prototype._tiles;


/**
 * BoardState._initEmpty()
 *
 * Initializes an empty board state.
 */
BoardState.prototype._initEmpty = function() {
    this._tiles = new Array(this._width * this._width);
    this._step = 0;
};


/**
 * BoardState._initRandom()
 *
 * Initializes the board state as a random layout of a given density.
 *
 * Parameters:
 * 
 * density - the initial density of the layout.  0 - 1.
 */
BoardState.prototype._initRandom = function(density) {
    this._initEmpty();
    var numCells = this._width * this._width;
        
    for (var i = 0; i < numCells; i++) {
        this._tiles[i] = Math.random() < density ? true : false; 
    }
};


/**
 * BoardState._initFromPrior(priorState, moveIndex)
 *
 * Initializes the board state based on a prior board state and the index of a tile
 * to move.
 */
BoardState.prototype._initFromPrior = function(priorState) {
    this._initEmpty();

    var numCells = this._width * this._width;
        
    for (var i = 0; i < numCells; i++) {
        this._tiles[i] = priorState.cellShouldLive(i); 
    }
    
    this._step = priorState._step + 1;
};


/**
 * BoardState._toPoint(index)
 *
 * Converts a cell index to an x, y point, returned as a two-slot array.
 */
BoardState.prototype._toPoint = function(index) {
    var y = Math.floor(index / this._width);
    var x = index - (y * this._width);
        
    return [x, y];
};


/**
 * BoardState._toIndex(point)
 *
 * Converts an x, y point to a cell index.
 */
BoardState.prototype._toIndex = function(point) {
    return point[1] * this._width + point[0];
};


/**
 * Determines whether this and another board state are equal.
 */
BoardState.prototype.equals = function(state2) {
    var equals = !!state2;

    if (equals) {
        for (var i = 0; equals && i < this._tiles.length; i++) {
            equals = this._tiles[i] == state2._tiles[i];
        }
    }

    return equals;
}


/**
 * BoardState.cellShouldLive(index)
 *
 * Determines whether the given cell should live in the next iteration.
 *
 * Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 * Any live cell with two or three live neighbours lives on to the next generation.
 * Any live cell with more than three live neighbours dies, as if by over-population.
 * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */
BoardState.prototype.cellShouldLive = function(index) {
    var neighbors = this.getNeighbors(index);
    var alive = this._tiles[index];
    var numLiveNeighbors = 0;

    for (var i = 0; i < neighbors.length; i++) {
        if (this._tiles[neighbors[i]]) {
            numLiveNeighbors++;
        }
    }

    /*
     * A cell lives:
     * if already alive and has 2-3 live neighbors
     * or not alive and has 3 live neighbors
     */
    return (alive && numLiveNeighbors == 2 || numLiveNeighbors == 3)
           || (!alive && numLiveNeighbors == 3);
};


/**
 * BoardState.getNeighbors(index)
 *
 * Computes the indices of the neighbor cells of the cell at the given index.
 */
BoardState.prototype.getNeighbors = function(index) {
    var neighbors = [];
    var loc = this._toPoint(index);
    var x = loc[0];
    var y = loc[1];
    var xl = x - 1;
    var xr = x + 1;
    var yu = y - 1;
    var yd = y + 1;

    if (y > 0) {
        neighbors.push(this._toIndex([x, yu]));

        if (x > 0) {
            neighbors.push(this._toIndex([xl, yu]));
        }

        if (x < this._width - 1) {
            neighbors.push(this._toIndex([xr, yu]));
        }
    }

    if (x < this._width - 1) {
        neighbors.push(this._toIndex([xr, y]));
    }

    if (x > 0) {
        neighbors.push(this._toIndex([xl, y]));
    }

    if (y < this._width - 1) {
        neighbors.push(this._toIndex([x, yd]));

        if (x < this._width - 1) {
            neighbors.push(this._toIndex([xr, yd]));
        }

        if (x > 0) {
            neighbors.push(this._toIndex([xl, yd]));
        }
    }
        
    return neighbors;
};


/**
 * BoardState.dump()
 *
 * Dumps an ASCII visualization of the board state to the console.
 */
BoardState.prototype.dump = function() {
    console.log('Step ' + this._step);

    var i = 0;
    for (var y = 0; y < this._width; y++) {
        var row = '' + y + ' ';

        for (var x = 0; x < this._width; x++) {
            if (this._tiles[i]) {
                row += '.';
            }
            else {
                row += ' ';
            }
            i++;
        }
        console.log(row);
    }
};
    

/**
 * BoardState.signature()
 *
 * Generates a unique string signature that represents the board state.
 */
BoardState.prototype.signature = function() {
    var sig = '';
    for (var i = 0; i < this._tiles.length; i++) {
        if (this._tiles[i]) {
            sig += this._tiles[i].id;
            sig += '.';
        }
        else {
            sig += ' ';
        }
    }

    return sig;
};
