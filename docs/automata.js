$(() => {
    const rows = 25, cols = 29;
    const frametime = 0.5;

    let playing = false;
    let grid = [];
    for (let col = 0; col < cols; col++) {
        grid[col] = [];
        for (let row = 0; row < rows; row++) {
            grid[col][row] = false;
        }
    }

    $('#hexframe').hexGridWidget(20, cols, rows, 'hex');

    $('#hexframe').on('hexclick', (e) => {
        if (!playing) {
            grid[e.column][e.row] = !grid[e.column][e.row];
            $(`#hexframe [hex-row=${e.row}][hex-column=${e.column}]`).toggleClass('alive');
        }
    });

    $('#start').click(() => {
        playing = true;
        setTimeout(update, frametime * 500);
    });
    $('#stop').click(() => {
        playing = false;
    });
    $('#reset').click(() => {
        if (playing) {
            playing = false;
        }
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                grid[col][row] = false;
                $(`#hexframe [hex-row=${row}][hex-column=${col}]`).toggleClass('alive', false);
            }
        }
    });

    function update () {
        if (playing) {
            grid = apply_rules(grid);
            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    $(`#hexframe [hex-row=${row}][hex-column=${col}]`).toggleClass('alive', grid[col][row]);
                }
            }
            setTimeout(update, frametime * 1000);
        }
    }

    function apply_rules (grid) {
        let newgrid = [];
        let neighbors;
        for (let col = 0; col < cols; col++) {
            newgrid[col] = [];
            if (col % 2 === 0) {
                neighbors = [-1, 0, -1, 1, -1, 0];
            } else {
                neighbors = [0, 1, -1, 1, 0, 1];
            }
            for (let row = 0; row < rows; row++) {
                let blackcount = 0;
                for (let i = 0; i < 6; i++) {
                    c = col + Math.floor(i / 2) - 1;
                    r = row + neighbors[i];
                    if (r >= 0 && r < rows && c >= 0 && c < cols && grid[c][r]) {
                        blackcount++;
                    }
                }
                // If a BLACK hex is adjacent zero or more than two black hexes, it changes to white
                if (grid[col][row] && (blackcount == 0 || blackcount > 2)) {
                    newgrid[col][row] = false;
                } else {
                    newgrid[col][row] = true;
                }
                // If a WHITE hex is adjacent to exactly two black hexes, it changes to black
                if (!grid[col][row] && blackcount == 2) {
                    newgrid[col][row] = true;
                } else {
                    newgrid[col][row] = false;
                }
            }
        }
        return newgrid;
    }
});

