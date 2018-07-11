<?php
/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 17.06.2018
 * Time: 21:07
 *
 *
 */
 
require_once $_SERVER["DOCUMENT_ROOT"] . "/functions.php";
 ?>
<!DOCTYPE html>
<html>
<head>
    <title>Игра «Бомбер» на vue.js</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=500">
<!--    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />-->

    <meta property="og:title" content='Игра «Бомбер» на vue.js' />
    <meta property="og:image" content='/i/screen.png' />
    
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <link rel="stylesheet" href="<?=includeAssetFile("/assets/css/template.css")?>" />
    <link rel="stylesheet" href="<?=includeAssetFile("/assets/css/main.css")?>" />
</head>
<body>
    <div id="bomber_game" class="bomber_game" v-cloak v-bind:style="{ width: (level.field_size * 52 + 50) + 'px' }">
        
        <div class="bomber_game_status_bar titlle">
            <div class="bomber_game_status_bar_item" title="">Игра «Бомбер»</div>
        </div>

        <div class="bomber_game_status_bar" v-if="level">
            <div class="bomber_game_status_bar_item" title="Уровень игры"><i class="fas fa-signal"></i> {{levels.indexOf(level) + 1}} / {{levels.length}} </div>
            <div class="bomber_game_status_bar_item" title="Время игры"><i class="far fa-clock"></i> {{game_time_formated}}</div>
            <div class="bomber_game_status_bar_item" title="Осталось взорвать монстров"><i class="fab fa-d-and-d red"></i> {{monsters_count}}</div>
            <div class="bomber_game_status_bar_item" title="Количество жизней (может съесть монстр или взорваться)"><i class="fas fa-user-astronaut green"></i> {{lifes_count}}</div>
            <div class="bomber_game_status_bar_item" title="Мощность взрыва"><i class="fas fa-certificate gold"></i> {{explode_power}}</div>
            <div class="bomber_game_status_bar_item" title="Количество бомб"><i class="fas fa-bomb"></i> {{bombs_count}}</div>
        </div>

        <div class="bomber_game_table" v-if="level">
            <template v-for="row in level.field_size">
                <div class="bomber_game_row">
                    <div v-for="cell in level.field_size" class="cell"></div>
                </div>
            </template>
        </div>

        <div class="bomber_game_status_bar"  v-if="game_over">
            <div class="bomber_game_status_bar_item">{{message}}</div>
            <div class="bomber_game_status_bar_item bomber_game_status_bar_item_sep"> - </div>
            <a class="bomber_game_status_bar_item green" href="#" @click.prevent="restart_game">Esc - начать с начала</a>
        </div>

        <div class="bomber_game_status_bar" >
            <a class="bomber_game_status_bar_item orange" href="https://dermanov.ru#from=bomber_game" target="_blank">Марк Дерманов</a>
            <div class="bomber_game_status_bar_item bomber_game_status_bar_item_sep">|</div>
            <a class="bomber_game_status_bar_item orange" href="https://github.com/dermanov-ru/vue_js_bomber_game" target="_blank" >Fork me on GitHub</a>
        </div>
        
        <div class="bomber_mobile_gamepad" v-if="!game_over && show_mobile_gamepad">
            <button class="bomber_mobile_gamepad_item bomber_mobile_gamepad_item__top" @click.prevent="move_top"></button>
            <button class="bomber_mobile_gamepad_item bomber_mobile_gamepad_item__left" @click.prevent="move_left"></button>
            <button class="bomber_mobile_gamepad_item bomber_mobile_gamepad_item__right" @click.prevent="move_right"></button>
            <button class="bomber_mobile_gamepad_item bomber_mobile_gamepad_item__bottom" @click.prevent="move_bottom"></button>
            <button class="bomber_mobile_gamepad_item bomber_mobile_gamepad_item__place_bomb" @click.prevent="place_bomb"><i class="fas fa-bomb"></i></button>
        </div>
    </div>

    <script src="<?=includeAssetFile( "/assets/js/plugins/jquery-3.3.1.slim.min.js" )?>"></script>
    <script src="<?=includeAssetFile( "/assets/js/plugins/vue-2.5.16.min.js" )?>"></script>
    <script src="<?=includeAssetFile( "/assets/js/tools.js" )?>"></script>
    <script src="<?=includeAssetFile( "/assets/js/bomber_game.js" )?>"></script>
    <script src="<?=includeAssetFile( "/assets/js/bomber.vue.js" )?>"></script>

    <?
    if (file_exists(__DIR__ . "/counters.php"))
        require __DIR__ . "/counters.php";
    ?>
</body>
</html>
