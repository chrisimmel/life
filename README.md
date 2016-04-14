# life
The classic Conway game of Life.

This is pure HTML + JavaScript.  There are no moving parts or state on the server side.  The only external
dependency is on the D3 library for UI rendering.  All you have to do to run it is put all the files together
in a directory, then open index.html in a browser.

Features:

* Board sizes from 10x10 to 100x100.

* Varying initial density of the board layout.

* Button to start/stop the simulation.

* Button to generate a new random starting layout.

Have fun, and let me know what you think!

Chris Immel

-----------------------------------



File Contents

index.html
The single page of this single-page application.

lifeController.js
The UI controller through which the user runs the show.

lifeView.js
The UI view, in which all rendering to the DOM is done.

life.css
Some simple styling.

lifeModel.js
The model of the life simulation.
