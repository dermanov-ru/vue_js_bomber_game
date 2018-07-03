<?php
/**
 * Created by PhpStorm.
 * User: dev@dermanov.ru
 * Date: 23.06.2018
 * Time: 0:18
 *
 *
 */
 
function includeAssetFile($localPath){
    $result = $localPath . "?v=" . filemtime($_SERVER["DOCUMENT_ROOT"] . $localPath);
    
    return $result;
    
}