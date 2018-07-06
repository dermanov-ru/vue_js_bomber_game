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
        restart_game : function () {
            this.bomber_game = new BomberGame(this.level.field_size, this.level.monster_count );
            this.bomber_game.initGame( $(".bomber_game .cell") );

            this.reset_timer();
            this.start_timer();
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

            window.addEventListener('keyup', function(event) {
                // left
                if (event.keyCode == 37) {
                    ctx.move_left();
                }
                // right
                if (event.keyCode == 39) {
                    ctx.move_right();
                }
                // top
                if (event.keyCode == 38) {
                    ctx.move_top();
                }
                // down
                if (event.keyCode == 40) {
                    ctx.move_bottom();
                }
                // space
                if (event.keyCode == 32) {
                    event.preventDefault();
                    ctx.place_bomb();
                }
                // escape
                if (event.keyCode == 27) {
                    ctx.restart_game();
                }
            });
        }

    },
});