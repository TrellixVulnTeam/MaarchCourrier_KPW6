<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

use PHPUnit\Framework\TestCase;

class ResControllerTest extends TestCase
{
    private static $id = null;

    public function testCreate()
    {
        $resController = new \Resource\controllers\ResController();

        //  CREATE
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'POST']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $fileContent = file_get_contents('modules/convert/Test/Samples/test.txt');
        $encodedFile = base64_encode($fileContent);

        $data = [
            [
                'column'    => 'subject',
                'value'     => 'Breaking News : Superman is alive',
                'type'      => 'string',
            ],
            [
                'column'    => 'type_id',
                'value'     => 102,
                'type'      => 'integer',
            ],
            [
                'column'    => 'typist',
                'value'     => 'LLane',
                'type'      => 'string',
            ]
        ];

        $aArgs = [
            'collId'        => 'letterbox_coll',
            'table'         => 'res_letterbox',
            'status'        => 'NEW',
            'encodedFile'   => $encodedFile,
            'fileFormat'    => 'txt',
            'data'          => $data
        ];

        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $resController->create($fullRequest, new \Slim\Http\Response());
        $responseBody = json_decode((string)$response->getBody());

        self::$id = $responseBody->resId;

        $this->assertInternalType('int', self::$id);

        //  READ
        $res = \Resource\models\ResModel::getById(['resId' => self::$id]);

        $this->assertInternalType('array', $res);

        $this->assertSame('Breaking News : Superman is alive', $res['subject']);
        $this->assertSame(null, $res['title']);
        $this->assertSame(null, $res['description']);
        $this->assertSame(102, $res['type_id']);
        $this->assertSame('txt', $res['format']);
        $this->assertSame('NEW', $res['status']);
        $this->assertSame('LLane', $res['typist']);
        $this->assertSame(null, $res['destination']);
    }

    public function testUpdateStatus()
    {
        $resController = new \Resource\controllers\ResController();

        //  UPDATE STATUS
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'resId'         => self::$id,
            'status'        => 'EVIS'
        ];

        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $resController->updateStatus($fullRequest, new \Slim\Http\Response());
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('success', $responseBody->success);

        //  READ
        $res = \Resource\models\ResModel::getById(['resId' => self::$id]);
        $this->assertInternalType('array', $res);
        $this->assertSame('EVIS', $res['status']);

        //  UPDATE WITHOUT STATUS
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'resId'         => self::$id
        ];

        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $resController->updateStatus($fullRequest, new \Slim\Http\Response());
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('success', $responseBody->success);

        //  READ
        $res = \Resource\models\ResModel::getById(['resId' => self::$id]);
        $this->assertInternalType('array', $res);
        $this->assertSame('COU', $res['status']);
    }

    public function testDelete()
    {
        //  DELETE
        \Resource\models\ResModel::delete(['resId' => self::$id]);

        //  READ
        $res = \Resource\models\ResModel::getById(['resId' => self::$id]);
        $this->assertInternalType('array', $res);
        $this->assertSame('DEL', $res['status']);

        //  REAL DELETE
        \SrcCore\models\DatabaseModel::delete([
            'table' => 'res_letterbox',
            'where' => ['res_id = ?'],
            'data'  => [self::$id]
        ]);

        //  READ
        $res = \Resource\models\ResModel::getById(['resId' => self::$id]);
        $this->assertSame(null, $res);
    }

}
