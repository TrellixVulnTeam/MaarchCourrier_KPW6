<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

use PHPUnit\Framework\TestCase;

class ConfigurationControllerTest extends TestCase
{
    public function testUpdate()
    {
        $configurationController = new \Configuration\controllers\ConfigurationController();

        //  UPDATE
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'type'       => 'smtp',
            'host'       => 'smtp.outlook.com',
            'port'       => '45',
            'auth'       => true,
            'user'       => 'user@test.com',
            'password'   => '12345',
            'secure'     => 'ssl',
            'from'       => 'info@maarch.org',
            'charset'    => 'utf-8',
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('success', $responseBody->success);

        //  READ
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'GET']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);
        $response       = $configurationController->getByService($request, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody   = json_decode((string)$response->getBody());

        $this->assertNotNull($responseBody->configuration);
        $this->assertInternalType('int', $responseBody->configuration->id);
        $this->assertSame('admin_email_server', $responseBody->configuration->service);
        $this->assertNotNull($responseBody->configuration->value);

        $jsonTest = json_encode(
            [
                'type'       => 'smtp',
                'host'       => 'smtp.outlook.com',
                'port'       => '45',
                'auth'       => true,
                'user'       => 'user@test.com',
                'secure'     => 'ssl',
                'from'       => 'info@maarch.org',
                'charset'    => 'utf-8',
                'passwordAlreadyExists' => true
            ]
        );

        $this->assertJsonStringEqualsJsonString($jsonTest, json_encode($responseBody->configuration->value));

        //  UPDATE auth false
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'type'       => 'smtp',
            'host'       => 'smtp.outlook.com',
            'port'       => '231',
            'auth'       => false,
            'user'       => '',
            'password'   => '',
            'secure'     => 'tls',
            'from'       => 'info@maarch.org',
            'charset'    => 'utf-8',
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('success', $responseBody->success);

        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'GET']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);
        $response       = $configurationController->getByService($request, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody   = json_decode((string)$response->getBody());

        $this->assertNotNull($responseBody->configuration);
        $this->assertInternalType('int', $responseBody->configuration->id);
        $this->assertSame('admin_email_server', $responseBody->configuration->service);
        $this->assertNotNull($responseBody->configuration->value);

        $jsonTest = json_encode(
            [
                'type'       => 'smtp',
                'host'       => 'smtp.outlook.com',
                'port'       => '231',
                'auth'       => false,
                'user'       => '',
                'secure'     => 'tls',
                'from'       => 'info@maarch.org',
                'charset'    => 'utf-8',
                'passwordAlreadyExists' => true
            ]
        );

        $this->assertJsonStringEqualsJsonString($jsonTest, json_encode($responseBody->configuration->value));


        //  UPDATE SENDMAIL
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'type'       => 'sendmail'
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('success', $responseBody->success);

        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'GET']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);
        $response       = $configurationController->getByService($request, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody   = json_decode((string)$response->getBody());

        $this->assertNotNull($responseBody->configuration);
        $this->assertInternalType('int', $responseBody->configuration->id);
        $this->assertSame('admin_email_server', $responseBody->configuration->service);
        $this->assertNotNull($responseBody->configuration->value);

        $jsonTest = json_encode(
            [
                'type'       => 'sendmail',
                'passwordAlreadyExists' => false
            ]
        );

        $this->assertJsonStringEqualsJsonString($jsonTest, json_encode($responseBody->configuration->value));

        //  UPDATE ERROR
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'type'       => 'sendmail'
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server_fail']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('Service configuration does not exist', $responseBody->errors);

        //  UPDATE ERROR
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('Configuration type is missing', $responseBody->errors);

        //  UPDATE ERROR
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'type'       => 'smtp',
            'port'       => '231',
            'auth'       => 'aze',
            'user'       => '',
            'password'   => '',
            'secure'     => 'tls',
            'from'       => 'info@maarch.org',
            'charset'    => 'utf-8',
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('smtp configuration data is missing or not well formatted', $responseBody->errors);
    }

    public function testReset()
    {
        $configurationController = new \Configuration\controllers\ConfigurationController();

        //  UPDATE
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'PUT']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);

        $aArgs = [
            'type'       => 'smtp',
            'host'       => 'smtp.gmail.com',
            'port'       => '465',
            'auth'       => true,
            'user'       => 'name@maarch.org',
            'password'   => '12345',
            'secure'     => 'ssl',
            'from'       => 'notifications@maarch.org',
            'charset'    => 'utf-8',
        ];
        $fullRequest = \httpRequestCustom::addContentInBody($aArgs, $request);

        $response     = $configurationController->update($fullRequest, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody = json_decode((string)$response->getBody());

        $this->assertSame('success', $responseBody->success);

        //  READ
        $environment    = \Slim\Http\Environment::mock(['REQUEST_METHOD' => 'GET']);
        $request        = \Slim\Http\Request::createFromEnvironment($environment);
        $response       = $configurationController->getByService($request, new \Slim\Http\Response(), ['service' => 'admin_email_server']);
        $responseBody   = json_decode((string)$response->getBody());

        $this->assertNotNull($responseBody->configuration);
        $this->assertInternalType('int', $responseBody->configuration->id);
        $this->assertSame('admin_email_server', $responseBody->configuration->service);
        $this->assertNotNull($responseBody->configuration->value);

        $jsonTest = json_encode(
            [
                'type'       => 'smtp',
                'host'       => 'smtp.gmail.com',
                'port'       => '465',
                'auth'       => true,
                'user'       => 'name@maarch.org',
                'secure'     => 'ssl',
                'from'       => 'notifications@maarch.org',
                'charset'    => 'utf-8',
                'passwordAlreadyExists' => true
            ]
        );

        $this->assertJsonStringEqualsJsonString($jsonTest, json_encode($responseBody->configuration->value));
    }
}
