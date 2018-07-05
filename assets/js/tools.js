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
    }
};