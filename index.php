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
    <meta name="viewport" content="width=device-width">
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

        <!-- RULES -->
        <div class="rules">
            <h2  class="center">Управление</h2>


            <p><strong>На компьютере</strong><br />
                Ходить - стрелочками<br />
                Поставить бомбу - пробел</p>

            <p><strong>На телефоне</strong><br />
                Будет доступен геймпад с виртуальными кнопками управления
            </p>

            
            <h2  class="center">Правила игры</h2>

            <p>Суть игры заключается в том, найти дверь, открыть ее и войти в нее - для этого нужно всех взорвать и не взорваться самому.
                <br />
                <br />
                В игре доступно 6 уровней разной сложности.</p>

            <p><strong>Драконы</strong><br />
                Красные ползующие штуки - это драконы - они хотят съесть вас :)</p>

            <p><strong>Бонусы</strong><br />
                В игре есть различные бонусы: увеличение кол-ва бомб, силы взрыва и кол-ва жизней - их нужно собирать.
                Они появятся где-то на месте взорванной земли.
            </p>

            <p><strong>Дверь</strong>
                <br />
                Дверь появится где-то на месте взорванной земли. Сначал дверь закрыта. Чтобы открыть дверь - нужно взорвать всех драконов.
                <br />
                Взрыв двери приведет к появлению дополнительных драконов.&nbsp;</p>

            <p><strong>Бот&nbsp;</strong><br />
                Начиная с 3-го уровня в игре появится бот. Бот будет вредить вам: взрывать вас и дверь.
                С каждым уровнем бот ходит немного быстрее.
                <br />
                А также он может собирать ваши бонусы :)
                <br />
                <br />
                Вы должны взорвать бота.
            </p>

            <p><strong>Если вы проиграли</strong><br />
                Повторная игра начнется заново с текущего уровня, а не с самого начала :)
                <br>
                <br>
                На компе - нужно кликнуть на &quot;Начать с начала&quot; или нажать клавишу Escape.
                <br>
                <br>
                На телефоне - игра начнется заново сама.
            </p>


            <h2 class="center">Условные обозначения</h2>

            <img src="/i/how_to.png" alt="how_to">

            <p>1 - это вы<br />
                2 - это бот<br />
                3 - это дракон<br />
                4 - это земля, ее можно взорвать<br />
                5 - это стена, она не взрывается<br />
                6 - текущий уровень/всего уровней<br />
                7 - кол-во драконов на поле<br />
                8 - кол-во ваших жизней<br />
                9 - сила взрыва ваших бомб (радиус)<br />
                10 - кол-во бомб, которые можно постваить одновременно</p>
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
