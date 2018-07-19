/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 05.07.2018
 * Time: 14:38
 *
 *
 */

class BomberGameLevel {
    constructor(field_size, monsters_count, hero_bombs_count, hero_explode_power, 
                improver_bombs_count, improver_power_count, lifes_power_count, bots_count,
                bot_walk_speed_delay_ms
    ) {
        this.field_size = field_size;
        this.monsters_count = monsters_count;
        this.hero_bombs_count = hero_bombs_count;
        this.hero_explode_power = hero_explode_power;
        this.improver_bombs_count = improver_bombs_count;
        this.improver_power_count = improver_power_count;
        this.lifes_power_count = lifes_power_count;
        this.bots_count = bots_count;
        this.bot_walk_speed = bot_walk_speed_delay_ms;
    }
}

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

    getLinearAroundCells(depth){
        let result = [];

        let left_cell;
        let right_cell;
        let top_cell;
        let bottom_cell;
        let aroud = this;

        // left
        for (let i = 0 ; i < depth ; i++){
            left_cell = aroud.left_cell;

            if (!left_cell)
                break;

            if (left_cell.is_wall)
                break;

            aroud = left_cell.around;
            result.push(left_cell);

            // TODO extract and separete result by filter function
            if (left_cell.is_earth && !left_cell.will_exployed)
                break;
        }

        // right
        aroud = this;
        for (let i = 0 ; i < depth ; i++){
            right_cell = aroud.right_cell;

            if (!right_cell)
                break;

            if (right_cell.is_wall)
                break;

            aroud = right_cell.around;
            result.push(right_cell);

            // TODO extract and separete result by filter function
            if (right_cell.is_earth && !right_cell.will_exployed)
                break;
        }

        // top
        aroud = this;
        for (let i = 0 ; i < depth ; i++){
            top_cell = aroud.top_cell;

            if (!top_cell)
                break;

            if (top_cell.is_wall)
                break;

            aroud = top_cell.around;
            result.push(top_cell);

            // TODO extract and separete result by filter function
            if (top_cell.is_earth && !top_cell.will_exployed)
                break;
        }

        // bottom
        aroud = this;
        for (let i = 0 ; i < depth ; i++){
            bottom_cell = aroud.bottom_cell;

            if (!bottom_cell)
                break;

            if (bottom_cell.is_wall)
                break;

            aroud = bottom_cell.around;
            result.push(bottom_cell);

            // TODO extract and separete result by filter function
            if (bottom_cell.is_earth && !bottom_cell.will_exployed)
                break;
        }

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

class BombImprover {
    constructor(cell) {
        this.cell = cell;
    }

    improveHero(hero){
        hero.bomb_count++;
    }

    render(){
        if (this.cell.is_earth)
            return;

        this.cell.$el.addClass("bomb");
        this.cell.$el.append('<i class="fas fa-bomb improver bomb_improver"> +1</i>');
    }
}

class LifesImprover {
    constructor(cell) {
        this.cell = cell;
    }

    improveHero(hero){
        hero.lifes_count++;
    }

    render(){
        if (this.cell.is_earth)
            return;

        this.cell.$el.append('<i class="fas fa-user-astronaut improver hero_improver"> +1</i>');
    }
}

class ExplodePowerImprover {
    constructor(cell) {
        this.cell = cell;
    }

    improveHero(hero){
        hero.explode_power++;
    }

    render(){
        if (this.cell.is_earth)
            return;

        this.cell.$el.append('<i class="fas fa-certificate improver gold "> +1</i>');
    }
}

class Bomb {
    constructor(cell, power) {
        this.cell = cell;
        this.power = power;
        this.timeout_seconds = 3;
        this.intervelId = 0;
    }

    render(){
        if (this.timeout_seconds)  {
            this.cell.$el.addClass("bomb");
            this.cell.$el.append('<i class="fas fa-bomb animated zoomIn bomb">' + this.timeout_seconds + '</i>');
        } else {
            this.cell.$el.addClass("explode");
            this.cell.$el.append('<i class="fas fa-certificate animated zoomIn"></i></i>');
        }
    }

    startTimer(after_explode_callback){
        let context = this;

        this.intervelId = setInterval(function () {
            context.timeout_seconds--;
            context.cell.render();

            if (!context.timeout_seconds){
                clearInterval(context.intervelId);
                context.explode();
                after_explode_callback();
            }

        }, 200 * this.timeout_seconds)
    }

    stopTimer(){
        clearInterval(this.intervelId);
    }

    explode(){
        this.cell.explode();

        let linearCells = this.cell.around.getLinearAroundCells(this.power);

        for (let cell of linearCells){
            if (!cell)
                continue;

            cell.explode();
        }
    }

    mark_exployed_cells(){
        this.cell.will_exployed = true;
        // console.log("cell will exployed", this.cell.$el[0]);

        let linearCells = this.cell.around.getLinearAroundCells(this.power);

        for (let cell of linearCells){
            if (!cell)
                continue;

            cell.will_exployed = true;
            // console.log("cell will exployed", cell.$el[0]);
        }
    }
}

class Monster {
    constructor(game, cell) {
        this.game = game;
        this.cell = cell;
        cell.is_monster = true;
        this.intervelId = 0;
        this.walk_direction = "none";
        this.walk_steps_count = 1;
    }

    wrap_with_earth(hero){
        let max = 3;
        let counter = 0;

        for (let aroundCell of this.cell.around.getLinearAroundCells(1)){
            if (!aroundCell)
                continue;

            if (hero.isLinearCell(aroundCell))
                continue;

            if (aroundCell.isEmptyCell())
                aroundCell.is_earth = true;

            counter++;

            if (counter == max)
                break;
        }
    }

    render(){
        this.cell.$el.addClass("monster"); // TODO render few types
        this.cell.$el.append('<i class="fab fa-d-and-d"></i>');
    }

    explode(){
        this.stopWalk();
        this.game.alive_monster_count--;
        this.game.checkTimeToOpenExitDoor();
    }

    resetWalkStepsCount(){
        this.walk_steps_count = Tools.random(1, 10);
    }

    changeWalkDirection(oldDirection){
        this.walk_direction = Tools.shuffle(["left", "right", "top", "bottom"]).pop();

        if (this.walk_direction == oldDirection){
            this.changeWalkDirection(oldDirection);
            return;
        }

        this.resetWalkStepsCount();
    }

    changeWalkDirectionLinear(oldDirection){
        let linearDirections = {
            "left" : "right",
            "top" : "bottom",
            "right" : "left",
            "bottom" : "top"
        }

        this.walk_direction = linearDirections[ oldDirection ];
        this.resetWalkStepsCount();
    }

    stopWalk(){
        clearInterval(this.intervelId);
    }

    walk(){
        let context = this;

        this.changeWalkDirection();

        this.intervelId = setInterval(function () {
            let around = context.cell.around;
            let cell;

            switch (context.walk_direction){
                case "top":
                    cell = around.top_cell;
                    break;
                case "left":
                    cell = around.left_cell;
                    break;
                case "right":
                    cell = around.right_cell;
                    break;
                case "bottom":
                    cell = around.bottom_cell;
                    break;
            }

            if (!cell){
                context.changeWalkDirection(context.walk_direction);
                return;
            }

            if (cell.isEnterableForMonster()){
                context.cell.is_monster = false;

                cell.is_monster = true;
                cell.monster = context;
                cell.enterMonster(context);

                context.cell.render();
                context.cell = cell;

                cell.render();

                context.walk_steps_count--;
                if (!context.walk_steps_count)
                    context.changeWalkDirection(context.walk_direction);
            } else {
                context.changeWalkDirection(context.walk_direction);
            }

        }, 700); // TODO get from config
    }
}

class Hero {
    constructor(cell) {
        this.cell = cell;
        this.safe_zone = [];
        this.explode_power = 1;
        this.bomb_count = 1;
        this.lifes_count = 1;
        this.is_locked = false;

        // render states
        this.is_exployed = false;
        this.is_improved = false;
    }

    isLinearCell(cell){
        return this.cell.around.getLinearAroundCells(1).indexOf(cell) > -1
    }

    isSafeZoneCell(cell){
        return this.safe_zone.indexOf(cell) > -1
    }

    render_getColor(){
        return "green";
    }

    render(){
        this.cell.$el.addClass("hero");

        let color = this.render_getColor();
        this.cell.$el.append('<i class="fas fa-user-astronaut hero ' + color + '"></i>');

        if (this.is_exployed){
            this.animateExplode();
        }

        if (this.is_improved){
            this.animateIproved();
        }
    }

    animateExplode(){
        this.cell.$el.find('.hero').addClass("animated rotateOut");
    }

    animateIproved(){
        this.cell.$el.find('.hero').addClass("animated bounceIn");
        this.is_improved = false;
    }

    animateEnterToDoor(){
        this.cell.$el.find('.hero').css("right", "23%");
        this.cell.$el.find('.hero').addClass("animated fadeInRight");
    }

    move_left(){
        if (this.is_locked)
            return;

        let cell = this.cell.getLeftCell();

        if (!cell)
            return;

        if (cell.isEnterableCell()){
            this.enter_cell(cell)
        }
    }

    enter_cell(cell){
        this.cell.exit();
        this.cell.render();

        this.cell = cell;
        cell.enter(this);
        this.cell.render();
    }

    move_right(){
        if (this.is_locked)
            return;

        let cell = this.cell.getRightCell();

        if (!cell)
            return;

        if (cell.isEnterableCell()){
            this.enter_cell(cell)
        }
    }

    move_top(){
        if (this.is_locked)
            return;

        let cell = this.cell.getTopCell();

        if (!cell)
            return;

        if (cell.isEnterableCell()){
            this.enter_cell(cell)
        }
    }

    move_bottom(){
        if (this.is_locked)
            return;

        let cell = this.cell.getBottomCell();

        if (!cell)
            return;

        if (cell.isEnterableCell()){
            this.enter_cell(cell)
        }
    }

    place_bomb(after_explode_callback){
        if (this.is_locked)
            return;

        if (!this.bomb_count)
            return;

        if (this.cell.is_bomb)
            return;

        this.bomb_count--;

        let bomb = new Bomb(this.cell, this.explode_power);
        this.cell.is_bomb = true;

        this.cell.game.bombs.push(bomb);

        this.cell.bomb = bomb;
        this.cell.render();

        bomb.mark_exployed_cells();

        let ctx = this;
        bomb.startTimer(function () {
            ctx.bomb_count++;

            if (after_explode_callback)
                after_explode_callback();
        });
    }

    spandLife(){
        // TODO fix cases then hero explodes many times - remove hero from cell instantly
        if (this.lifes_count > 0)
            this.lifes_count--;
    }
}

class Bot extends Hero{
    constructor(cell){
        // parent.constructor(cell)
        super(cell);

        // this.game = game;
        // this.cell = cell;
        this.intervelId_walk_random = 0;
        this.intervelId_place_bomb = 0;
        this.intervelId_hide_from_bomb = 0;
        this.intervelId_dangerous = 0;
        this.walk_direction = "none";
        this.walk_steps_count = 1;
        this.walk_speed = 0; // gets from config
        this.search_dengerous_speed = 200 * 1; // TODO get from config
    }
    render_getColor(){
        return "blue";
    }

    goWalk(){
        /*
        * search paths
        * sort paths by relevant
        * go
        * place bomb
        * hide from bomb
        * */

        // let ways = new BotWalkWaysCollection();
        // ways = ways.scan_ways(this.cell);
        // let best_way = ways.get_best_way();
        // this.walk(best_way);

        this.walk();
        this.start_scan_dangerous();
    }

    stop_scan_dangerous(){
        clearInterval(this.intervelId_dangerous);
    }

    start_scan_dangerous(){
        this.stop_scan_dangerous();

        let context = this;

        this.intervelId_dangerous = setInterval(function () {
            // если уже взорвался или съели
            if (!context.cell || context.is_locked){
                console.log("STOP scan for dangerous - context not exist more");
                context.stop_scan_dangerous();
                return;
            }

            // console.log("scan for dangerous...");

            if (context.cell.will_exployed){
                console.log("ALARM - found bomb around!");
                context.hide_from_bomb(context.cell);
            }
        }, this.search_dengerous_speed);
    }

    scan(way){
        // let ctx = this;
        // // let cell = way.cells.shift();
        // let cell = way.cells[0];
        // way.visit(cell);
        // way.scan_sub_ways(cell);
        // ctx.enter_cell(cell);
        //
        //     setTimeout(function () {
        //         ctx.goWalk();
        //     }, 3000); // TODO get bot speed from config
        //
        // // if (way.cells.length)
        // //     setTimeout(function () {
        // //         ctx.walk(way);
        // //     }, 700); // TODO get bot speed from config
    }


    resetWalkStepsCount(){
        this.walk_steps_count = Tools.random(1, 10);
    }

    changeWalkDirection(oldDirection){
        this.walk_direction = Tools.shuffle(["left", "right", "top", "bottom"]).pop();

        if (this.walk_direction == oldDirection){
            this.changeWalkDirection(oldDirection);
            return;
        }

        this.resetWalkStepsCount();
    }

    changeWalkDirectionLinear(oldDirection){
        let linearDirections = {
            "left" : "right",
            "top" : "bottom",
            "right" : "left",
            "bottom" : "top"
        }

        this.walk_direction = linearDirections[ oldDirection ];
        this.resetWalkStepsCount();
    }

    stopWalk(){
        clearInterval(this.intervelId_walk_random);
        clearInterval(this.intervelId_place_bomb);
        clearInterval(this.intervelId_hide_from_bomb);
    }

    walk(){
        this.stopWalk();

        // если уже взорвался или съели
        if (!this.cell || this.is_locked)
            return;

        let context = this;

        this.changeWalkDirection();

        this.intervelId_walk_random = setInterval(function () {
            // если уже взорвался или съели
            if (!context.cell || context.is_locked)
                return;

            let around = context.cell.around;
            let cell;

            switch (context.walk_direction){
                case "top":
                    cell = around.top_cell;
                    break;
                case "left":
                    cell = around.left_cell;
                    break;
                case "right":
                    cell = around.right_cell;
                    break;
                case "bottom":
                    cell = around.bottom_cell;
                    break;
            }

            if (!cell){
                context.changeWalkDirection(context.walk_direction);
                return;
            }

            if (cell.isEnterableForBot(context.cell.will_exployed)){
                context.enter_cell(cell);

                /*
                *
                * */
                let ways = new BotWalkWaysCollection(context);
                ways = ways.scan_ways(cell, context);
                let best_way = ways.get_best_way();
                // console.log('best_way', cell.$el[0], best_way);

                if (best_way){
                    context.stopWalk();
                    context.walk_way_and_place_bomb(best_way);
                    return;
                }

                // context.cell.is_monster = false;
                //
                // cell.is_monster = true;
                // cell.monster = context;
                // cell.enterMonster(context);

                // context.cell.render();
                // context.cell = cell;

                // cell.render();

                context.walk_steps_count--;
                if (!context.walk_steps_count){
                    // context.changeWalkDirection(context.walk_direction);

                    // TODO place bomb then end of random walk way ???
                    // context.stopWalk();
                    // context.place_bomb(function () {
                    //     context.walk();
                    // });
                    // console.log("place bomb while run...now run!");
                    // // context.walk();
                    // context.hide_from_bomb(cell);
                }
            } else {
                context.changeWalkDirection(context.walk_direction);
            }

        }, this.walk_speed);
    }

    walk_way_and_place_bomb(way){
        let context = this;
        let way_cells = way.cells;

        // bot already exployed
        if (!context.cell)
            return;

        let around = context.cell.around;
        let cell = way_cells.shift();
        // let cell = way.cells.pop(); // ?

        if (cell.isEnterableForBot(context.cell.will_exployed)){
           context.enter_cell(cell);
        } else {
            context.stopWalk();

            // TODO go walk after timeout?
            // context.walk();

            return;

        }

        if (way_cells.length){
            this.intervelId_place_bomb = setTimeout(function () {
                context.walk_way_and_place_bomb(way);
            }, this.walk_speed);
        } else {
            // detect best action
            // place bomb
            this.place_bomb(function () {
                // console.log("bomb exployed, lets go!");

                // TODO check can walk, still alive
                // context.walk();
            });
            // console.log("place bomb...now run!");
               // context.walk();
            context.stopWalk();

            setTimeout(function () {
                context.hide_from_bomb(cell);
            }, 150);
        }
    }

    walk_way_and_turn(way){
        let context = this;
        let way_cells = way.cells;

        if (!way_cells.length){
            console.log("the way is end - can't turn");
            // this.walk(); // TODO ?
            return;
        }

        if (!context.cell){
            console.log("context.cell is not exists - can't continue to turn. possible bot exployed?");
            context.stopWalk();
            return;
        }

        let around = context.cell.around;
        let cell = way_cells.shift();
        // let cell = way.cells.pop(); // ?

        if (!cell){
            console.log("the cell is null - can't turn");
            this.walk();
            return;
        }

        if (cell.isEnterableForBot(context.cell.will_exployed)){
            context.enter_cell(cell);
        } else {
            console.log("cant enter to cell while go to turn - lets just walk random");
            context.stopWalk();
            context.hide_from_bomb(context.cell);

            // this.hide_from_bomb(this.cell);

            // // lets wait some
            // let wait_ms = 150;
            // // debugger
            // console.log("cant enter to cell while go to turn - now wait " + wait_ms );
            // setTimeout(function () {
            //     console.log("cant enter to cell while go to turn - now walk");
            //     console.log("cant enter to cell while go to turn - now walk");
            //     // context.hide_from_bomb(context.cell);
            //     // context.walk();
            // }, wait_ms);
        }

        if (way_cells.length){
            this.intervelId_hide_from_bomb = setTimeout(function () {
                context.walk_way_and_turn(way);
            }, this.walk_speed);
        } else {
            // // detect best action
            // // place bomb
            // this.place_bomb(function () {
            //     // context.walk();
            // });
            // this.turn(way.direction);
            // context.start_scan_dangerous();
            context.goWalk();
            // this.hide_from_bomb(cell);
        }
    }

    // turn(old_direction){
    //
    // }

    check_is_dangerous_around(cell){
        return false;
    }

    hide_from_bomb(cell){
        let ways = new BotWalkWaysCollection(this);
        ways = ways.scan_ways(cell, this);
        // console.log('search for way to turn from cell ', cell.$el[0]);
        let way = ways.get_shortest_way_to_turn();

        this.stop_scan_dangerous();
        this.stopWalk();

        if (!way){
            console.log("can't turn find way to turn after place bomb - lets walk");
            this.goWalk();
            // this.walk();
            return;
        }

        this.walk_way_and_turn(way);
        // let best_way = ways.get_best_way();
        // console.log('best_way', cell.$el[0], best_way);
    }
}

class BotWalkWaysCollection {
    constructor(bot) {
        this.ways = [];
        this.bot = bot;
    }

    add_way(way){
        this.ways.push(way);
    }

    get_best_way(){
        let ranks = [];
        let best_rank = 0;
        let best_way = null;

        for (let way of this.ways){
            let rank = way.get_rank();

            if (rank > best_rank){
                best_rank = rank;
                best_way = way;
            }
        }

        // console.log('best_way', best_way);
        return best_way;
    }

    get_shortest_way_to_turn(){
        let ranks = [];
        let best_rank = 0;
        let best_way = null;
        let rank = -999;

        // debugger
        for (let way of this.ways){
            // if (way.is_bomb_on_way()){
            //     // debugger
            //     continue;
            // }

            rank = way.get_steps_to_turn();

            if (!rank)
                continue;

            if (rank > best_rank){
                best_rank = rank;
                best_way = way;
            }
        }

        if (best_rank){
            // best_way.cells = best_way.cells.slice(0, best_rank);
        } else {
            // TODO ?
        }

        // console.log('shortest_way_to_turn', best_rank, best_way);
        return best_way;
    }


    scan_ways(cell, bot){
        let ways = new BotWalkWaysCollection(bot);

        // 1 - top, 2- right, - 3 bottom, 4 - left
        let directions = ["top_cell", "right_cell", "bottom_cell", "left_cell"];

        for (let direction of directions){
            let way_first_cell = cell.around[ direction ];

            if (!way_first_cell)
                continue;

            let way = this.scan_way(way_first_cell, direction);
            ways.add_way( way );
        }

        // console.log('ways', ways);
        return ways;
    }

    scan_way(way_first_cell, direction){
        // debugger
        let way = new BotWalkWay(direction, this.bot);

        // debugger
        if (!way_first_cell.isEnterableForBot(this.bot.cell.will_exployed))
            return way;

        way.cells.push(way_first_cell);

        while (true){
            let way_next_cell = way_first_cell.around[ direction ];
            way_first_cell = way_next_cell;

            if (!way_next_cell)
                break;

            if (!way_next_cell.isEnterableForBot(this.bot.cell.will_exployed))
                break;

            way.cells.push(way_next_cell);
        }

        return way;
    }

    get_all_ways_cells(){
        let result = [];

        for (let way of this.ways){
            result.splice(0,0, way.cells);
        }

        // console.log('get_all_ways_cells', get_all_ways_cells);
        return result;
    }

    is_bomb_on_ways(){
        let result = false;

        for (let way of this.ways){
            if (way.is_bomb_on_way()){
                result = true;
                // debugger
                break;
            }
        }

        return result;
    }
}

class BotWalkWay {
    constructor(direction, bot) {
        this.direction = direction;
        this.cells = [];
        this.is_bomb = false;
        this.is_hero = false;
        this.is_monster = false;
        this.is_improver = false;

        this.visited_cells = [];
        this.sub_ways = [];
        this.bot = bot;
    }

    visit(cell) {
        this.visited_cells.push(cell);
    }

    scan_sub_ways(cell) {
        let ways = new BotWalkWaysCollection(this.bot);
        ways = ways.scan_ways(cell, this.bot);

        this.sub_ways = ways;
    }

    get_rank(){
        if (!this.cells.length)
            return -1000;

        let rank = 0;

        // rank -= this.cells.length;

        // if (this.is_target_cell(this.cells[ this.cells.length - 1 ]))
        //     rank += 2;

        let end_path_cell = this.cells[ this.cells.length - 1 ];
        rank += this.is_earth_around(end_path_cell);
        rank += this.is_hero_around(end_path_cell);
        rank += this.is_door_around(end_path_cell);
        rank += this.is_improver_on_way();
        // rank += this.is_improver_around(end_path_cell);

        // for (let cell of this.cells){
        //
        // }

        // let get_all_ways_cells()

        return rank;
    }

    get_steps_to_turn(){
        if (!this.cells.length)
            return 0;

        let result = 0;
        let counter = 0;
        let turn_cell = null;
// debugger
        for (let cell of this.cells){
            counter++;

            if (this.is_horizontal_way()){
                if ( cell.around.top_cell && cell.around.top_cell.isEnterableForBot(this.bot.cell.will_exployed)){
                    turn_cell = cell.around.top_cell;
                    break;
                }
                else if (cell.around.bottom_cell && cell.around.bottom_cell.isEnterableForBot(this.bot.cell.will_exployed)){
                    turn_cell = cell.around.bottom_cell;
                    break;
                }
            } else {
                if ( cell.around.left_cell && cell.around.left_cell.isEnterableForBot(this.bot.cell.will_exployed)){
                    turn_cell = cell.around.left_cell;
                    break;
                }
                else if ( cell.around.right_cell && cell.around.right_cell.isEnterableForBot(this.bot.cell.will_exployed)){
                    turn_cell = cell.around.right_cell;
                    break;
                }
            }
        }

        if (counter){
            this.cells = this.cells.slice(0, counter);
            this.cells.push(turn_cell);

            result = counter + 1;
        }

        return result;
    }

    is_horizontal_way(){
        return this.direction == "left_cell" || this.direction == "right_cell";
    }

    is_vertical_way(){
        return this.direction == "top_cell" || this.direction == "bottom_cell";
    }

    is_earth_around(cell){
        let aroundCells = cell.around.getLinearAroundCells(1);
        let result = 0;

        for (let cell of aroundCells){
            if (cell.is_earth){
                result += 1;

                // console.log('found is_earth_around', cell.$el[0]);
            }
        }

        return result;
    }

    is_hero_around(current_cell){
        let aroundCells = current_cell.around.getLinearAroundCells(1);
        let result = 0;

        for (let cell of aroundCells){
            if (cell.is_hero && cell.hero !== this.bot){
                result += 4;

                // console.log('found is_hero_around', cell.$el[0]);
            }
        }

        return result;
    }

    is_door_around(current_cell){
        let aroundCells = current_cell.around.getLinearAroundCells(1);
        let result = 0;

        for (let cell of aroundCells){
            if (cell.is_contain_exit_door && !cell.is_earth){
                result += 1;

                // console.log('found is_door_around', cell.$el[0]);
            }
        }

        return result;
    }

    is_improver_on_way(){
        // let aroundCells = current_cell.around.getLinearAroundCells(1);
        let result = 0;

        for (let cell of this.cells){
            if (cell.improver){
                result += 5;

                // console.log('found improver on way', cell.$el[0]);
            }
        }

        return result;
    }

    is_bomb_on_way(){
        let result = false;

        // debugger
        for (let current_cell of this.cells){
            let aroundCells = current_cell.around.getLinearAroundCells(1);

            for (let cell of aroundCells){
                if (cell.is_bomb){
                    result = true;
                    break;
                }
            }

        }

        return result;
    }
}

class Cell {
    constructor(game, domNode) {
        this.game = game;
        this.$el = $(domNode);
        this.is_earth = false;
        this.is_wall = false;
        this.is_monster = false;
        this.is_exit_door_open = false;
        this.is_contain_exit_door = false;
        this.around = null;
        this.is_bomb = false;
        this.is_exployed = false;

        this.bomb = null;
        this.hero = null;
        this.monster = null;

        this.improver = null;

        this.bot = null;
        this.will_exployed = false;
    }

    clean(){
        this.$el.attr("class", "cell");
        this.$el.html("");
    }

    render(){
        this.clean();

        if (this.is_wall) {
            this.$el.addClass("wall");
            return;
        }

        if (this.is_earth)
            this.$el.addClass("earth");

        else if (this.is_contain_exit_door) {
            this.$el.addClass("exit_door");

            if (this.is_exit_door_open)
                this.$el.append('<i class="fas fa-door-open exit_door"></i>');
            else
                this.$el.append('<i class="fas fa-door-closed exit_door"></i>');
        }


        if (this.is_exployed){
            this.clean();
            this.$el.addClass("explode");
            this.$el.append('<i class="fas fa-certificate animated zoomIn"></i></i>');
        }

        if (this.is_bomb){
            this.bomb.render();
        }

        // if (this.is_hero && this.game.bot && this.game.bot.cell === this.game.hero.cell ){
        //     this.$el.addClass("hero_and_bot");
        // }

        if (this.is_hero){
            this.hero.render();

            if (this.is_exit_door_open)
                this.hero.animateEnterToDoor();

        }

        // if (this.game.bot && this.game.bot.cell === this.game.hero.cell ){
        //     this.game.bot.render();
        // }


        if (this.is_monster){
            this.monster.render();
        }

        if (this.improver){
            this.improver.render();
        }
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

    isEnterableCell(){
        return !(this.is_wall || this.is_earth || this.is_bomb || this.is_hero);
    }

    isEnterableForMonster(){
        return !(this.is_wall || this.is_earth || this.is_bomb || this.is_monster || (this.is_hero && this.hero === this.game.bot));
    }

    isEnterableForBot(is_current_cell_will_exployed){
        return !(
            this.is_wall || this.is_earth || this.is_bomb || this.is_monster || this.is_exployed || this.is_hero || (this.is_contain_exit_door && !this.is_earth)
            || (!is_current_cell_will_exployed && this.will_exployed)
            || this.is_hero
        );
    }

    isEmptyCell(){
        return !(this.is_wall || this.is_earth || this.is_monster || this.is_contain_exit_door || this.is_hero);
    }

    explode(){
        if (this.is_wall)
            return;

        if (!this.is_earth)
            this.improver = null;

        this.is_exployed = true;

        if (this.is_monster) {
            this.is_monster = false;
            this.monster.explode();
        }

        this.is_bomb = false;

        if (this.is_hero){
            this.hero.spandLife();

            if (!this.hero.lifes_count){
                this.hero.is_exployed = true;

                if (this.hero instanceof Bot ){
                    console.log("bot has exployed")

                    this.hero.stopWalk();
                    this.hero.is_locked = true;
                    this.hero.cell = null;
                    this.is_hero = false;
                    this.game.bot = null;
                } else { // instanceof Hero
                    this.game.endGame(false);
                }
            }

        }

        this.render();


        if (this.is_contain_exit_door && !this.is_earth){
            let addMonsterCount = Math.ceil(this.game.basic_monster_count / 3);
            this.game.addMonsters( addMonsterCount );
            this.is_exit_door_open = false;
        }

        // allow next near placed bomb to explode next linear earth cell
        this.is_earth = false;
        this.game.checkTimeToOpenExitDoor();

        this.will_exployed = false;

        let context = this;
        setTimeout(function () {
            if (!context.game.getHero().lifes_count){
                context.is_hero = false;
            }

            context.is_exployed = false;
            context.render();
        }, 700); // TODO extract timeout to config
    }

    exit(){
        this.is_hero = false;
    }

    enter(hero){
        this.is_hero = true;
        this.hero = hero;

        if (this.is_exit_door_open){
            this.game.endGame(true);
        }

        if (this.is_monster){
            this.hero.spandLife();

            if (!this.hero.lifes_count){
                this.hero.is_exployed = true;
                this.game.endGame(false);
            }
        }

        if (this.is_exployed){
            this.hero.spandLife();

            if (!this.hero.lifes_count){
                this.hero.is_exployed = true;
                this.game.endGame(false);
            }
        }

        if (this.improver){
            this.hero.is_improved = true;
            this.improver.improveHero(this.hero);
            this.improver = null;
            // this.hero.animateIproved();
        }
    }

    enterMonster(moster){
        this.is_monster = true;
        this.moster = moster;

        if (this.is_exployed){
            this.is_monster = false;
            this.moster.explode();
        }

        if (this.is_hero){
            this.hero.spandLife();

            if (!this.hero.lifes_count){
                this.hero.is_exployed = true;
                this.game.endGame(false);
            }
        }
    }
}

class BomberGame {
    constructor(game_level){
        this.game_level = game_level;
        this.game_field_size = game_level.field_size;
        this.cells = [];
        this.walls = [];
        this.exit_door = null;
        this.hero = null;

        this.basic_monster_count = game_level.monsters_count;
        this.alive_monster_count = 0;
        this.monsters = [];

        this.on_game_end_callback = null;

        // for stop explode timer on game end
        this.bombs = [];
    }

    initGame($cells){
        this.initCells($cells);
        this.initWalls();
        this.initHero();
        this.initBots();
        this.initMonsters(this.basic_monster_count);
        this.initEarth();
        this.initExitDoor();
        this.initImprovers();

        this.renderGame();
    }

    checkTimeToOpenExitDoor(){
        if (!this.exit_door.is_earth && !this.alive_monster_count && !this.bot){
            this.exit_door.is_exit_door_open = true;
            this.exit_door.render();
        }
    }

    getHero(){
        return this.hero;
    }

    destroy(){
        this.stopMonsters();
        this.stopBots();
        this.stopBombTimers();
    }

    // --- privat ---


    initCells($cells){
        for (let $cell of $cells){
            let newCell = new Cell(this, $cell);

            this.cells.push(newCell);
        }

        for (let cellIndex in this.cells){
            let aroundCellsMatrix = Tools.get_around_cells(cellIndex, this.cells, this.game_field_size);
            this.cells[ cellIndex].around = new Around(aroundCellsMatrix);
        }
    }

    initHero(){
        let heroCell = this.cells[ 0 ];

        this.hero = new Hero(heroCell);
        this.hero.explode_power = this.game_level.hero_explode_power;
        this.hero.bomb_count = this.game_level.hero_bombs_count;
        this.hero.safe_zone = Tools.sub_matrix(this.cells, this.game_field_size, 3, 0);

        heroCell.is_hero = true;
        heroCell.hero = this.hero;
    }

    initBots(){
        // TODO spawn many bots in different corners
        if (!this.game_level.bots_count)
            return;

        let heroCell = Tools.get_corner_cell(this.cells, this.game_level.field_size, 4);
        // console.log('heroCell', heroCell);

        let bot  = new Bot(heroCell);
        this.bot = bot;
        bot.explode_power = this.game_level.hero_explode_power;
        bot.bomb_count = this.game_level.hero_bombs_count;
        bot.walk_speed = this.game_level.bot_walk_speed;
        // bot.safe_zone = Tools.sub_matrix(this.cells, this.game_field_size, -3, 0); // TODO
        // console.log('this.hero.safe_zone', this.hero.safe_zone);

        heroCell.is_hero = true;
        heroCell.hero = bot;

        // wait some tim
        setTimeout(function () {
            bot.goWalk();
        }, 500);
    }

    initWalls(){
        let wallsSubMatrixSize = this.game_field_size - 2;
        let sub_matrix = Tools.sub_matrix(this.cells, this.game_field_size, wallsSubMatrixSize, 1);

        for (let subY = 0; subY < wallsSubMatrixSize; subY++){
            for (let subX = 0; subX < wallsSubMatrixSize; subX++){
                if (subX % 2 || subY % 2)
                    continue;

                let cell_index = subY * wallsSubMatrixSize + subX;
                let cell = sub_matrix[ cell_index ];

                cell.is_wall = true;
            }
        }
    }

    initEarth(){
        let earthCount = this.cells.length / 10; // TODO get from game level config
        let counter = 0;
        let randomCells = Tools.shuffle( this.cells.slice(1) );

        for (let i = 0 ; counter < earthCount && i < this.cells.length  ; i++){
            let cell = randomCells[ i ];

            // already eatrh, after place monster
            if (cell.is_earth){
                counter++;
                continue;
            }

            if (!cell.isEmptyCell())
                continue;

            if (this.bot && this.bot.isLinearCell(cell))
                continue;

            if (this.hero.isLinearCell(cell))
                continue;

            cell.is_earth = true;
            counter++;
        }
    }

    // TODO refactor function
    initImprovers(){
        let maxBombsImp = this.game_level.improver_bombs_count;
        let maxPowerImp = this.game_level.improver_power_count;
        let lifes_power_count = this.game_level.lifes_power_count;
        let counter = 0;
        let cells = Tools.shuffle(this.cells);

        for (let cell of cells){
            if (counter == maxBombsImp)
                break;

            if (!cell.is_earth || cell.is_contain_exit_door || cell.improver)
                continue;

            cell.improver = new BombImprover(cell);
            counter++;
        }

        counter = 0;
        for (let cell of cells){
            if (counter == maxPowerImp)
                break;

            if (!cell.is_earth || cell.is_contain_exit_door || cell.improver)
                continue;

            cell.improver = new ExplodePowerImprover(cell);
            counter++;
        }

        counter = 0;
        for (let cell of cells){
            if (counter == lifes_power_count)
                break;

            if (!cell.is_earth || cell.is_contain_exit_door || cell.improver)
                continue;

            cell.improver = new LifesImprover(cell);
            counter++;
        }
    }

    initMonsters(monsterCount){
        let spawnedMonsterCount = 0;
        let randomCells = Tools.shuffle(this.cells.slice(1));

        for (let cell of randomCells){
            if (spawnedMonsterCount == monsterCount)
                break;

            if (!cell.isEmptyCell())
                continue;

            if (this.hero.isSafeZoneCell(cell))
                continue;

            if (this.bot && this.bot.isLinearCell(cell))
                continue;

            let newMonster = new Monster(this, cell);
            newMonster.wrap_with_earth(this.hero);
            newMonster.walk();
            // this.monsters.push(newMonster);
            this.alive_monster_count++;

            cell.is_monster = true;
            cell.monster = newMonster;

            spawnedMonsterCount++;
        }
    }

    addMonsters(monsterCount){
        let spawnedMonsterCount = 0;
        let randomCells = Tools.shuffle(this.cells);

        for (let cell of randomCells){
            if (spawnedMonsterCount == monsterCount)
                break;

            if (!cell.isEmptyCell())
                continue;

            let newMonster = new Monster(this, cell);
            newMonster.walk();
            // this.monsters.push(newMonster);
            this.alive_monster_count++;

            cell.is_monster = true;
            cell.monster = newMonster;
            cell.render();

            spawnedMonsterCount++;
        }
    }

    initExitDoor(){
        let possibleDoorCells = this.cells.slice(this.cells.length / 3);
        possibleDoorCells = Tools.shuffle(possibleDoorCells);

        for (let cell of possibleDoorCells){
            if (!cell.is_earth)
                continue

            cell.is_contain_exit_door = true;
            this.exit_door = cell;

            cell.render();
            break;
        }
    }

    renderGame(){
        for (let cell of this.cells){
            cell.render();
        }
    }

    endGame(is_win){
        if (is_win)
            this.winGame();
        else
            this.loseGame();

        if (this.on_game_end_callback){
            let ctx = this;

            // wait end of user enter animation
            setTimeout(function () {
                ctx.on_game_end_callback(is_win);
            }, 500);
        }
    }

    winGame(){
        console.log("GAME WIN - go to next level");
    }

    loseGame(){
        console.log("GAME OVER");

        this.stopMonsters()
        this.lockHero()
        this.stopBots();
        this.stopBombTimers();
    }

    stopMonsters(){
        for (let cell of this.cells){
            if (!cell.is_monster)
                continue;

            cell.monster.stopWalk();
        }
    }

    stopBombTimers(){
        for (let bomb of this.bombs){
            bomb.stopTimer();
        }
    }

    lockHero(){
        this.hero.is_locked = true;
    }

    stopBots(){
        if (this.bot){
            this.bot.stopWalk();
            this.bot.stop_scan_dangerous();
        }
    }
}