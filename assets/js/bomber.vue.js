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
        level : {},
        levels : [
            {
                title : "1",
                field_size : 5,
                monster_count : 5,
                bombs_count : 1,
                explode_power : 1,
            },
            {
                title : "2",
                field_size : 7,
                monster_count : 7,
                bombs_count : 2,
                explode_power : 1,
            },
            {
                title : "3",
                field_size : 9,
                monster_count : 9,
                bombs_count : 2,
                explode_power : 1,
            },
            {
                title : "4",
                field_size : 11,
                monster_count : 11,
                bombs_count : 2,
                explode_power : 1,
            },
            {
                title : "5",
                field_size : 13,
                monster_count : 13,
                bombs_count : 2,
                explode_power : 1,
            }
        ],
        bomber_game : null,

        game_time_seconds : 0,
        timer : 0,
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

            this.bomber_game = new BomberGame(this.level.field_size, this.level.monster_count );
            this.bomber_game.initGame( $(".bomber_game .cell") );
            this.bomber_game.on_game_end_callback = this.game_end;
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
                this.stop_timer();
            }
        },

        start_next_level : function(){
            let oldLevel = this.levels.indexOf(this.level);
            let nextLevel = this.levels[ oldLevel + 1 ];

            if (!nextLevel){
                // TODO show user message
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