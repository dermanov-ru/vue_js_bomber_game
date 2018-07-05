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
    data: {
        bomber_game : new BomberGame(10)
    },
    computed : {},
    mounted : function() {
        this.bomber_game.initGame( $(".bomber_game .cell") );

        console.log('this.bomber_game', this.bomber_game);
    },
    methods : {
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
        }
    },
});