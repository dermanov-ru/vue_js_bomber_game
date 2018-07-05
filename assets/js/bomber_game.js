/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 05.07.2018
 * Time: 14:38
 *
 *
 */

class Around {
    /*
    * around_cells_matrix - not contain current cell!
    * C - is current cell
    * 0|1|2
    * 3|C|4
    * 5|6|7
    * */
    constructor(around_cells_matrix) {
        this.left_cell   = around_cells_matrix[ 3 ];
        this.right_cell  = around_cells_matrix[ 4 ];
        this.top_cell    = around_cells_matrix[ 1 ];
        this.bottom_cell = around_cells_matrix[ 6 ];

        this.top_left_cell   = around_cells_matrix[ 0 ];
        this.top_right_cell  = around_cells_matrix[ 2 ];
        this.bottom_left_cell   = around_cells_matrix[ 5 ];
        this.bottom_right_cell  = around_cells_matrix[ 7 ];
    }

    getLinearAroundCells(){
        let result = [];

        result.push(this.left_cell);
        result.push(this.right_cell);
        result.push(this.top_cell);
        result.push(this.bottom_cell);

        return result;
    }

    getAllAroundCells(){
        let result = [];

        result.push(this.left_cell);
        result.push(this.right_cell);
        result.push(this.top_cell);
        result.push(this.bottom_cell);

        result.push(this.top_left_cell);
        result.push(this.top_right_cell);
        result.push(this.bottom_left_cell);
        result.push(this.bottom_right_cell);

        return result;
    }
}

class Monster {
    constructor(cell, cells) {
        this.cell = cell;
        this.cells = cells;
    }

    render(){
        this.cell.$el.addClass("monster"); // TODO render few types
        this.cell.$el.html('<i class="fab fa-d-and-d"></i>');
    }
}

class Hero {
    constructor(cell) {
        this.cell = cell;
        this.explode_power = 1;
    }

    render(){
        this.cell.$el.addClass("hero");
        this.cell.$el.html('<i class="fas fa-user-astronaut"></i>');
    }

    move_left(){
        let cell = this.cell.getLeftCell();

        if (cell){
            if (cell.is_wall){
                console.log("Hero can't move_left - WALL");
            } else {
                this.cell.render();
                this.cell = cell;
                this.render();
            }
        }
    }

    move_right(){
        let cell = this.cell.getRightCell();

        if (cell){
            if (cell.is_wall){
                console.log("Hero can't move_right - WALL");
            } else {
                this.cell.render();
                this.cell = cell;
                this.render();
            }
        }
    }

    move_top(){
        let cell = this.cell.getTopCell();

        if (cell){
            if (cell.is_wall){
                console.log("Hero can't move_top - WALL");
            } else {
                this.cell.render();
                this.cell = cell;
                this.render();
            }
        }
    }

    move_bottom(){
        let cell = this.cell.getBottomCell();

        if (cell){
            if (cell.is_wall){
                console.log("Hero can't move_bottom - WALL");
            } else {
                this.cell.render();
                this.cell = cell;
                this.render();
            }
        }
    }

    place_bomb(){
        console.log("Hero place_bomb");
    }
}

class Cell {
    constructor(el) {
        this.$el = $(el);
        this.is_wall = false;
        this.is_exit_door_open = false;
        this.is_contain_exit_door = false;
        this.around = null;
    }

    render(){
        this.$el.attr("class", "cell");
        this.$el.html("");

        if (this.is_wall)
            this.$el.addClass("wall");

        else if (this.is_contain_exit_door) {
            this.$el.addClass("exit_door");
            this.$el.html('<i class="fas fa-door-closed"></i>');
        }

        if (this.is_exit_door_open)
            this.$el.html('<i class="fas fa-door-open"></i>');
    }

    getLeftCell(){
        return this.around.left_cell;
    }

    getRightCell(){
        return this.around.right_cell;
    }

    getTopCell(){
        return this.around.top_cell;
    }

    getBottomCell(){
        return this.around.bottom_cell;
    }
}

class BomberGame {
    constructor(game_field_size){
        this.game_field_size = game_field_size;
        this.cells = [];
        this.walls = [];
        this.exit_door = null;
        this.hero = null;

        this.monster_count = 4; // TODO get from game level param
        this.monsters = [];
    }

    initGame($cells){
        this.initCells($cells);
        this.initWalls();
        this.initHero();
        this.initMonsters();
        this.initExitDoor();
        // place power improver

        this.renderGame();
    }

    getHero(){
        return this.hero;
    }


    // --- privat ---


    initCells($cells){
        for (let $cell of $cells){
            let newCell = new Cell($cell);

            this.cells.push(newCell);
        }

        for (let cellIndex in this.cells){
            let aroundCellsMatrix = Tools.get_around_cells(cellIndex, this.cells, this.game_field_size);
            this.cells[ cellIndex].around = new Around(aroundCellsMatrix);
        }
    }

    initHero(){
        this.hero = new Hero(this.cells[ 0 ]);

        // allow user to start game :)
        this.hero.cell.getRightCell().is_wall = false;
        this.hero.cell.getBottomCell().is_wall = false;
    }

    initWalls(){
        let wallsCount = this.cells.length / 3;
        let randomCells = Tools.shuffle( this.cells.slice(1) ).slice(0, wallsCount);

        for (let cell of randomCells){
            cell.is_wall = true;
        }

        this.walls = randomCells;
    }

    initMonsters(){
        let monsterCount = this.monster_count;
        let spawnedMonsterCount = 0;
        let randomCells = Tools.shuffle(this.cells.slice(1));

        for (let cell of randomCells){
            if (spawnedMonsterCount == monsterCount)
                break;

            if (cell.is_wall)
                continue;

            if (this.hero.cell.around.getAllAroundCells().indexOf(cell) > -1)
                continue;

            let newMonster = new Monster(cell, this.cells);
            this.monsters.push(newMonster);

            spawnedMonsterCount++;
        }
    }

    initExitDoor(){
        let doorIndex = Tools.random(0, this.walls.length - 1);

        this.walls[ doorIndex ].is_contain_exit_door = true;
        this.exit_door = this.walls[ doorIndex ];
    }

    renderGame(){
        for (let cell of this.cells){
            cell.render();
        }

        for (let monster of this.monsters){
            monster.render();
        }

        this.hero.render();
    }
}