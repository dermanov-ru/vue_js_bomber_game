/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 05.07.2018
 * Time: 15:15
 *
 *
 */
 
let Tools = {
    random : function (min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     */
    shuffle : function shuffle(a) {
        var result = a.slice(0);

        var j, x, i;
        for (i = result.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = result[i];
            result[i] = result[j];
            result[j] = x;
        }
        return result;
    },

    get_around_cells : function(cell_index, cells, matrix_size){
        let cells_around = [];
        let size = matrix_size;
        let cell_row = Math.floor(cell_index / size) ;
        let cell_col = cell_index % size;

        /*
        * lets imagine mini matrix with all possible around cells
        * current cell - is E cell, with coords (X=1;Y=1)
        * A|B|C
        * D|E|I
        * F|G|H
        *
        * now lets calc around cells coords diff
        * A = x-1;y-1
        * B = x;y-1
        * C = x+1;y-1
        * D = x-1;y
        * E - current cell - skip :)
        * I = x+1;y
        * F = x-1;y+1
        * G = x;y+1
        * H = x+1;y+1
        * */
        let around_cells_diff_coords = [
            [-1, -1], // A
            [0, -1],  // B
            [1, -1],  // C
            [-1, 0],  // D
                      // E - current cell - skip :)
            [1, 0],   // I
            [-1, 1],  // F
            [0, 1],   // G
            [1, 1],   // G
        ];

        let i = 0;
        for (; i < around_cells_diff_coords.length; i++){
            let around_cell_col = cell_col + around_cells_diff_coords[ i ][ 0 ];
            let around_cell_row = cell_row + around_cells_diff_coords[ i ][ 1 ];

            // check around cell coords exists
            if (
                around_cell_row >= 0 && around_cell_row < size
                && around_cell_col >= 0 && around_cell_col < size
            ) {
                let around_cell_index = around_cell_row * size + around_cell_col;
                let around_cell = cells[ around_cell_index ];

                cells_around.push(around_cell);
            } else {
                cells_around.push(null);
            }
        }

        return cells_around;
    },
};