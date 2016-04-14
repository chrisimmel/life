
/*
 * Class BoardController
 * 
 * The life board controller, a singleton.
 *
 */
function BoardController() {}

/**
 * BoardController._width
 *
 * The number of rows or columns of the board.  The board is always square,
 * so the width and height are the same.
 */
BoardController._width = 20;

/**
 * BoardController._initialDensity
 *
 * The initial board density (0 - 1).
 */
BoardController._initialDensity = 0.2;

/**
 * Whether a simulation is running.
 */
BoardController._running = false;


/**
 * Initializes the user controls.
 */
BoardController.initControls = function() {
    d3.select("#width").on("change", function() {
            BoardController._width = this.value;
            d3.select("#widthValue").html(BoardController._width);

            BoardController.resetBoard();
        })
        .attr("value", BoardController._width);
    d3.select("#widthValue").html(BoardController._width);

    d3.select("#density").on("change", function() {
            BoardController._initialDensity = this.value / 100.0;
            d3.select("#densityValue").html(Math.round(BoardController._initialDensity * 100));

            BoardController.resetBoard();
        })
        .attr("value", Math.round(BoardController._initialDensity * 100));
    d3.select("#densityValue").html(Math.round(BoardController._initialDensity * 100));
}


/**
 * BoardController.resetBoard()
 *
 * Re-initializes the game board with a newly randomized configuration.
 */
BoardController.resetBoard = function() {

    // Create a new board of the correct size in a solved state.
    BoardModel.init(BoardController._width, BoardController._initialDensity);

    // Render the new state.
    BoardView.renderState(BoardModel._state);

    //d3.select("#results").selectAll("p").remove();
};


/**
 * BoardController.toggleSimulation
 *
 * Toggles the simulation running state.  If stopped, starts.  If running, stops.
 */
BoardController.toggleSimulation = function() {
    if (BoardController._running) {
        BoardController.stopSimulation();
    }
    else {
        BoardController.startSimulation();
    }
}


/**
 * BoardController.simulate
 *
 * Animates the simulation.
 */
BoardController.startSimulation = function() {
    if (!BoardController._running) {
        BoardController._running = true;
        
        d3.select("#toggleSim").html("Stop");

        function continueSim() {
            if (BoardController._running) {
                var more = BoardModel.step();

                // Render the new state.
                BoardView.renderState(BoardModel._state);

                if (more) {
                    setTimeout(function() {
                         // Show the next step in 50ms.
                         continueSim();
                    }, 50);
                }
                else {
                    BoardController.stopSimulation();
                }
            }
        }
    }

    // Show the first step in the simulation, which kicks off the timer chain.
    continueSim();
}

/**
 * BoardController.stop
 *
 * Stops the simulation in progress, if any.
 */
BoardController.stopSimulation = function() {
    BoardController._running = false;

    d3.select("#toggleSim").html("Go");
}

