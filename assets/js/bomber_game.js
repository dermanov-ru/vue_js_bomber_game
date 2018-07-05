/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 05.07.2018
 * Time: 14:38
 *
 *
 */

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
    constructor(cell, cells) {
        this.cell = cell;
        this.cells = cells;
        this.explode_power = 1;
    }

    render(){
        this.cell.$el.addClass("hero");
        this.cell.$el.html('<i class="fas fa-user-astronaut"></i>');
    }
}

class Cell {
    constructor(el) {
        this.$el = $(el);
        this.is_wall = false;
        this.is_exit_door_open = false;
        this.is_contain_exit_door = false;
    }

    render(){
        this.$el.attr("class", "cell");

        if (this.is_wall)
            this.$el.addClass("wall");

        else if (this.is_contain_exit_door) {
            this.$el.addClass("exit_door");
            this.$el.html('<i class="fas fa-door-closed"></i>');
        }

        if (this.is_exit_door_open)
            this.$el.html('<i class="fas fa-door-open"></i>');
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
        this.initMonsters();
        this.initHero();
        this.initExitDoor();
        // place power improver

        this.renderGame();
    }


    // --- privat ---


    initCells($cells){
        for (let $cell of $cells){
            let newCell = new Cell($cell);

            this.cells.push(newCell);
        }
    }

    initHero(){
        this.hero = new Hero(this.cells[ 0 ], this.cells);
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