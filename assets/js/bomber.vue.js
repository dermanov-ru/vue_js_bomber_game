/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:16
 *
 *
 */

let BomberApp = new Vue({
    el: '#bomber_game',
    mounted : function() {
        // rapid start game
        this.level = this.levels[ 0 ];

        // wait while field render
        this.$nextTick(function () {
            this.restart_game();
        });

        this.init_gamepad_control();
    },
    data: {
        level : null,
        levels : [
            new BomberGameLevel(9, 1, 10, 10, 3, 3, 4), // TODO remove debug level
            new BomberGameLevel(5, 5, 1, 1, 1, 0, 0),
            new BomberGameLevel(7, 7, 2, 1, 0, 1, 1, 0),
            new BomberGameLevel(9, 9, 2, 1, 2, 1, 1, 1),
            new BomberGameLevel(11, 11, 2, 2, 2, 1, 2, 1),
            new BomberGameLevel(13, 13, 2, 2, 3, 2, 3, 2),
            new BomberGameLevel(15, 15, 5, 5, 5, 5, 5, 3),
        ],
        bomber_game : null,

        game_time_seconds : 0,
        timer : 0,
        message : 0,
    },
    computed : {
        game_time_formated : function () {
            var result = "";

            result += Math.round(this.game_time_seconds / 3600) + ":";
            result += Math.round(this.game_time_seconds % 3600 / 60) + ":";
            result += Math.round(this.game_time_seconds % 60) + "";

            return result;
        },
        monsters_count : function() {
            if (!this.bomber_game)
                return 0;

            return this.bomber_game.alive_monster_count;
        },
        bombs_count : function() {
            if (!this.bomber_game)
                return 0;

            return this.bomber_game.hero.bomb_count;
        },
        explode_power : function() {
            if (!this.bomber_game)
                return 0;

            return this.bomber_game.hero.explode_power;
        },
        lifes_count : function() {
            if (!this.bomber_game)
                return 0;

            return this.bomber_game.hero.lifes_count;
        }
    },
    methods : {
        start_timer : function() {
            let app_context = this;

            this.timer = setInterval(function () {
                app_context.game_time_seconds++;
            }, 1000);
        },
        stop_timer : function() {
            clearInterval(this.timer);
        },
        reset_timer : function() {
            this.game_time_seconds = 0;
            clearInterval(this.timer);
        },
        start_game : function () {
            if (this.bomber_game)
                this.bomber_game.destroy();

            this.bomber_game = new BomberGame(this.level);
            this.bomber_game.initGame( $(".bomber_game .cell") );
            this.bomber_game.on_game_end_callback = this.game_end;

            this.message = "";
        },
        restart_game : function () {
            this.start_game();

            this.reset_timer();
            this.start_timer();
        },

        game_end : function(is_win){
            if (is_win){
                this.start_next_level();
            }  else {
                // TODO show message
                this.message = "Вы проиграли!";
                this.stop_timer();
            }
        },

        start_next_level : function(){
            let oldLevel = this.levels.indexOf(this.level);
            let nextLevel = this.levels[ oldLevel + 1 ];

            if (!nextLevel){
                // TODO show user message
                this.message = "Вы прошли всю игру!";
                console.log("YOU WIN AT ALL GAME!");
                return;
            }

            this.level = nextLevel;

            // wait while field render
            this.$nextTick(function () {
                this.start_game();
            });
        },

        move_left : function () {
            this.bomber_game.getHero().move_left();
        },

        move_right : function () {
            this.bomber_game.getHero().move_right();
        },

        move_top : function () {
            this.bomber_game.getHero().move_top();
        },

        move_bottom : function () {
            this.bomber_game.getHero().move_bottom();
        },

        place_bomb : function () {
            this.bomber_game.getHero().place_bomb();
        },

        init_gamepad_control(){
            // TODO if mobile
            // this.initMobileGamePad();
            // else
            this.initDesktopGamePad();
        },

        initDesktopGamePad : function () {
            let ctx = this;

            window.addEventListener('keydown', function(event) {
                // left
                if (event.keyCode == 37) {
                    ctx.move_left();
                    event.preventDefault();
                }
                // right
                if (event.keyCode == 39) {
                    ctx.move_right();
                    event.preventDefault();
                }
                // top
                if (event.keyCode == 38) {
                    ctx.move_top();
                    event.preventDefault();
                }
                // down
                if (event.keyCode == 40) {
                    ctx.move_bottom();
                    event.preventDefault();
                }
                // space
                if (event.keyCode == 32) {
                    ctx.place_bomb();
                    event.preventDefault();
                }
                // escape
                if (event.keyCode == 27) {
                    ctx.restart_game();
                    event.preventDefault();
                }
            });
        }

    },
});