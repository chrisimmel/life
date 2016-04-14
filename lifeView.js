
/*
 * Class BoardView
 * 
 * The slider puzzle board view, a singleton.
 *
 */
function BoardView() {}

/**
 * The displayed board width, in pixels.
 */
BoardView.boardWidth = 400;

/**
 * The displayed board height, in pixels.  (The board is always square, so this is the
 * same as the height.)
 */
BoardView.boardHeight = BoardView.boardWidth;

/**
 * The board.
 */
BoardView.board;


/**
 * Initializes the board display.
 */
BoardView.initBoard = function() {
    BoardView.board = d3.select(".board")
        .attr("width", BoardView.boardWidth)
        .attr("height", BoardView.boardHeight);
}


/**
 * Renders the given state.
 */
BoardView.renderState = function(state) {
    var cellWidth = BoardView.boardWidth / state._width;
    var data = state._tiles.map(function(t, i) {
                var p = state._toPoint(i);
                return {x: p[0],
                        y: p[1],
                        id: i,
                        state: t
                        }});

    // Join to set data on cells.
    var cellAll = BoardView.board.selectAll("circle")
        .data(data, function(t) { return t.id; });

    // Enter to render elements on new cells.
    var cellNew = cellAll.enter().append("circle")
        .attr("id", function(d) { return d.id; });

    // Update the class and dimensions af all cells (new and existing).
    cellAll.classed("alive", function(d) { return d.state; })
        .attr("r", (cellWidth - 1) / 2)
        .attr("cx", function(d) { return d.x * cellWidth + (cellWidth - 1) / 2; })
        .attr("cy", function(d) { return d.y * cellWidth + (cellWidth - 1) / 2; });

    // Remove obsolete elements (such as when reducing board size).
    cellAll.exit().remove();
}
