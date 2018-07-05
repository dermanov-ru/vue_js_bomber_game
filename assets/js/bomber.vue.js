/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:16
 *
 *
 */

new Vue({
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

    },
});