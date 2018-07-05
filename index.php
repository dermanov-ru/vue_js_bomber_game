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
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta property="og:title" content='Игра «Бомбер» на vue.js' />
    <meta property="og:image" content='/i/screen.png' />
    
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <link rel="stylesheet" href="<?=includeAssetFile("/assets/css/template.css")?>" />
    <link rel="stylesheet" href="<?=includeAssetFile("/assets/css/main.css")?>" />
</head>
<body>
    <div id="bomber_game" class="bomber_game" v-cloak>
        
        <div >
            <div class="bomber_game_status_bar titlle">
                <div class="bomber_game_status_bar_item" title="">Игра «Бомбер»</div>
            </div>

            <div class="bomber_game_table">
                <template  v-for="bomber_game_status_bar_item in bomber_game.game_field_size">
                    <div class="bomber_game_row">
                        <div v-for="bomber_game_status_bar_item1 in bomber_game.game_field_size" class="cell"></div>
                    </div>
                </template>
            </div>

            <div class="bomber_game_status_bar" >
                <a class="bomber_game_status_bar_item orange" href="https://dermanov.ru#from=bomber_game" target="_blank">Марк Дерманов</a>
                <div class="bomber_game_status_bar_item bomber_game_status_bar_item_sep">|</div>
                <a class="bomber_game_status_bar_item orange" href="https://github.com/dermanov-ru/vue_js_bomber_game" target="_blank" >Fork me on GitHub</a>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://unpkg.com/vue"></script>
    <script src="<?=includeAssetFile( "/assets/js/tools.js" )?>"></script>
    <script src="<?=includeAssetFile( "/assets/js/bomber_game.js" )?>"></script>
    <script src="<?=includeAssetFile( "/assets/js/bomber.vue.js" )?>"></script>

    <?
    if (file_exists(__DIR__ . "/counters.php"))
        require __DIR__ . "/counters.php";
    ?>
</body>
</html>
