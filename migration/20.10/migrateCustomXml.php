<?php

require '../../vendor/autoload.php';

chdir('../..');


$file = 'custom/custom.xml';

if (is_file($file)) {
    if (!is_readable($file) || !is_writable($file)) {
        printf("File custom/custom.xml is not readable or not writable.\n");
        exit;
    }
    $loadedXml = simplexml_load_file($file);

    $jsonFile = [];
    if ($loadedXml) {
        foreach ($loadedXml->custom as $value) {
            $jsonFile[] = [
                'id'                => (string)$value->custom_id,
                'ip'                => (string)$value->ip,
                'externalDomain'    => (string)$value->external_domain,
                'domain'            => (string)$value->domain,
                'path'              => (string)$value->path
            ];
        }

        $jsonFile = json_encode($jsonFile);
        file_put_contents('custom/custom.json', $jsonFile);
    }
    unlink($file);
    printf("Fichier custom/custom.xml migré en fichier json.\n");
}

