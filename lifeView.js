
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
    // A left and right board margin, in pixels.  (Prevents overlap with svg boundary due to auto-scaling on iPhone.)
    var marginX = 20;
    var cellWidth = (BoardView.boardWidth - marginX * 2) / state._width;
    var data = state._cells.map(function(t, i) {
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
        .attr("cx", function(d) { return marginX + d.x * cellWidth + (cellWidth - 1) / 2; })
        .attr("cy", function(d) { return d.y * cellWidth + (cellWidth - 1) / 2; });

    // Remove obsolete elements (such as when reducing board size).
    cellAll.exit().remove();

    d3.select("#stepValue").html(state._step);
    d3.select("#densityValue").html('' + Math.round(state.getDensity() * 100) + '%');

    if (BoardModel._finished) {
        d3.select("#state").html("(finished)");
    }
}

