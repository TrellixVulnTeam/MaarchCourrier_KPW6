<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* @brief Attachment Type Controller
* @author dev@maarch.org
*/

namespace Attachment\controllers;

use Attachment\models\AttachmentModel;
use Attachment\models\AttachmentTypeModel;
use Group\controllers\PrivilegeController;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;

class AttachmentTypeController
{
    public function get(Request $request, Response $response)
    {
        $rawAttachmentsTypes = AttachmentTypeModel::get(['select' => ['*'], 'where' => ['type_id <> ?'], 'data' => ['summary_sheet']]);

        $attachmentsTypes = [];
        foreach ($rawAttachmentsTypes as $rawAttachmentsType) {
            $attachmentsTypes[$rawAttachmentsType['type_id']] = [
                'id'                => $rawAttachmentsType['id'],
                'typeId'            => $rawAttachmentsType['type_id'],
                'label'             => $rawAttachmentsType['label'],
                'visible'           => $rawAttachmentsType['visible'],
                'emailLink'         => $rawAttachmentsType['email_link'],
                'signable'          => $rawAttachmentsType['signable'],
                'icon'              => $rawAttachmentsType['icon'],
                'chrono'            => $rawAttachmentsType['chrono'],
                'versionEnabled'    => $rawAttachmentsType['version_enabled'],
                'newVersionDefault' => $rawAttachmentsType['new_version_default']
            ];
        }

        return $response->withJson(['attachmentsTypes' => $attachmentsTypes]);
    }

    public function getBydId(Request $request, Response $response, array $args)
    {
        $attachmentType = AttachmentTypeModel::getById(['select' => ['*'], 'id' => $args['id']]);
        if (empty($attachmentType)) {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment type does not exist']);
        }

        $attachmentType = [
            'id'                => $attachmentType['id'],
            'typeId'            => $attachmentType['type_id'],
            'label'             => $attachmentType['label'],
            'visible'           => $attachmentType['visible'],
            'emailLink'         => $attachmentType['email_link'],
            'signable'          => $attachmentType['signable'],
            'icon'              => $attachmentType['icon'],
            'chrono'            => $attachmentType['chrono'],
            'versionEnabled'    => $attachmentType['version_enabled'],
            'newVersionDefault' => $attachmentType['new_version_default']
        ];

        return $response->withJson($attachmentType);
    }

    public function create(Request $request, Response $response)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_attachments', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $body = $request->getParsedBody();

        if (empty($body)) {
            return $response->withStatus(400)->withJson(['errors' => 'Body is not set or empty']);
        } elseif (!Validator::stringType()->notEmpty()->validate($body['typeId'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body typeId is empty or not a string']);
        } elseif (!Validator::stringType()->notEmpty()->validate($body['label'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body label is empty or not a string']);
        }

        $type = AttachmentTypeModel::getByTypeId(['typeId' => $body['typeId'], 'select' => [1]]);
        if (!empty($type)) {
            return $response->withStatus(400)->withJson(['errors' => 'Body typeId is already used by another type', 'lang' => 'attachmentTypeIdAlreadyUsed']);
        }

        $id = AttachmentTypeModel::create([
            'type_id'               => $body['typeId'],
            'label'                 => $body['label'],
            'visible'               => empty($body['visible']) ? 'false' : 'true',
            'email_link'            => empty($body['emailLink']) ? 'false' : 'true',
            'signable'              => empty($body['signable']) ? 'false' : 'true',
            'chrono'                => empty($body['chrono']) ? 'false' : 'true',
            'icon'                  => $body['icon'] ?? null,
            'version_enabled'       => empty($body['versionEnabled']) ? 'false' : 'true',
            'new_version_default'   => empty($body['newVersionDefault']) ? 'false' : 'true'
        ]);

        return $response->withJson(['id' => $id]);
    }

    public function update(Request $request, Response $response, array $args)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_attachments', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $body = $request->getParsedBody();

        if (empty($body)) {
            return $response->withStatus(400)->withJson(['errors' => 'Body is not set or empty']);
        } elseif (!Validator::stringType()->notEmpty()->validate($body['label'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body label is empty or not a string']);
        }

        $attachmentType = AttachmentTypeModel::getById(['select' => [1], 'id' => $args['id']]);
        if (empty($attachmentType)) {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment type does not exist']);
        }

        $set = ['label' => $body['label']];
        if (isset($body['visible'])) {
            $set['visible'] = empty($body['visible']) ? 'false' : 'true';
        }
        if (isset($body['emailLink'])) {
            $set['email_link'] = empty($body['emailLink']) ? 'false' : 'true';
        }
        if (isset($body['signable'])) {
            $set['signable'] = empty($body['signable']) ? 'false' : 'true';
        }
        if (isset($body['chrono'])) {
            $set['chrono'] = empty($body['chrono']) ? 'false' : 'true';
        }
        if (isset($body['versionEnabled'])) {
            $set['version_enabled'] = empty($body['versionEnabled']) ? 'false' : 'true';
        }
        if (isset($body['newVersionDefault'])) {
            $set['new_version_default'] = empty($body['newVersionDefault']) ? 'false' : 'true';
        }
        if (isset($body['icon'])) {
            $set['icon'] = $body['icon'];
        }

        AttachmentTypeModel::update([
            'set'       => $set,
            'where'     => ['id = ?'],
            'data'      => [$args['id']],
        ]);

        return $response->withStatus(204);
    }

    public function delete(Request $request, Response $response, array $args)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_attachments', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $attachmentType = AttachmentTypeModel::getById(['select' => ['type_id'], 'id' => $args['id']]);
        if (empty($attachmentType)) {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment type does not exist']);
        }

        $attachments = AttachmentModel::get(['select' => [1], 'where' => ['attachment_type = ?', 'status != ?'], 'data' => [$attachmentType['type_id'], 'DEL']]);
        if (!empty($attachments)) {
            return $response->withStatus(400)->withJson(['errors' => 'Type is used in attachments', 'lang' => 'attachmentTypeUsed']);
        }

        AttachmentTypeModel::delete([
            'where'     => ['id = ?'],
            'data'      => [$args['id']],
        ]);

        return $response->withStatus(204);
    }
}
