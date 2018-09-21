<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\UploadedFile;

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content-Range, Cache-Control, Content-Disposition')
        ->withHeader('Access-Control-Allow-Methods', ' GET, HEAD, OPTIONS, POST, PUT');
});

$container = $app->getContainer();
$container['upload_directory'] = __DIR__ . '/upload/tmp';
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new \Monolog\Logger('test-app');
    $logger->pushHandler(new Monolog\Handler\StreamHandler('php://stdout', \Monolog\Logger::DEBUG));
    return $logger;
};


$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, './index.phtml', $args);
});


// get all todos
$app->post('/api/login', function ($request, $response) {
    $input = $request->getParsedBody();
    $sth = $this->db->prepare("SELECT * FROM users where email=:email");
    $sth->bindParam('email', $input['email']);
    $sth->execute();
    $users = $sth->fetchAll();
    $input['status'] = 'fail';
    foreach ($users as $user) {
        if (password_verify($input['password'], $user['password'])) {
            $input = $user;
            $input['status'] = 'success';
            break;
        }
    }
    return $this->response->withJson($input);
});

// Add a new todo
$app->post('/api/register', function ($request, $response) {

    $input = $request->getParsedBody();
    $ret['status'] = "fail";
    $chkSql = "SELECT * FROM users where email=:email";
    $chkSth = $this->db->prepare($chkSql);
    $chkSth->bindParam("email", $input['email']);
    $chkSth->execute();
    $chkRes = $chkSth->fetchAll();
    if (count($chkRes) >= 1) {
        $ret['error'] = 'The same email is already exist.';
        return $this->response->withJson($ret);
    }
    $ret['status'] = 'success';
    $created_at = date('Y-m-d H:i:s');
    $hashed_pwd = password_hash($input['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (name,surname,email,password,user_created,recovery_password,invite_by_user_id) VALUES (:name,:surname,:email,:password,:user_created,'','')";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("name", $input['name']);
    $sth->bindParam("surname", $input['surname']);
    $sth->bindParam("email", $input['email']);
    $sth->bindParam("password", $hashed_pwd);

    $sth->bindParam("user_created", $created_at);
    $sth->execute();
    $input['id'] = $this->db->lastInsertId();
    return $this->response->withJson($ret);
});

/**
 * get All group by user_id
 */
$app->get('/api/allGroup/[{user_id}]', function ($request, $response, $args) {
    $sql = "SELECT * FROM groups where user_id=:user_id";
    $sth = $this->db->prepare($sql);
    $ret['status'] = 'fail';
    try {
        $user_id = intval($args['user_id']);
        $sth->bindParam('user_id', $user_id);
        $sth->execute();
        $groups = $sth->fetchAll();
        $ret['status'] = 'success';
        $ret['groups'] = $groups;
        return $this->response->withJson($ret);
    } catch (Exception $e) {
        return $this->response->withJson($ret);
    }
});


/**
 * add group
 */
$app->post('/api/addGroup', function ($request, $response) {
    $input = $request->getParsedBody();
    $ret['status'] = 'fail';
    $chkSql = "SELECT * FROM groups where user_id=:user_id and group_name=:group_name";
    $chksth = $this->db->prepare($chkSql);
    $chksth->bindParam("user_id", $input['user_id']);
    $chksth->bindParam("group_name", $input['group_name']);
    $chksth->execute();
    $chkRes = $chksth->fetchAll();
    if (count($chkRes) >= 1) {
        $ret['error'] = 'The same group is already created.';
        return $this->response->withJson($ret);
    }
    try {
        $created_at = date('Y-m-d H:i:s');
        $sql = "INSERT INTO groups (user_id, group_name, group_created) VALUES (:user_id,:group_name,:group_created)";
        $sth = $this->db->prepare($sql);

        $sth->bindParam("group_name", $input['group_name']);
        $sth->bindParam("user_id", $input['user_id']);
        $sth->bindParam("group_created", $created_at);
        $sth->execute();
        $input['group_id'] = $this->db->lastInsertId();
        $ret['status'] = 'success';
        $ret['group'] = $input;
    } catch (Exception $e) {
        $ret['error'] = 'Database operation error.';
    }
    return $this->response->withJson($ret);
});

/**
 * add album
 */
$app->post('/api/addAlbum', function ($request, $response) {
    $input = $request->getParsedBody();
    $ret['status'] = 'fail';
    $chkSql = "SELECT * FROM albums where user_id=:user_id and album_name=:album_name and group_id=:group_id";
    $chksth = $this->db->prepare($chkSql);
    $chksth->bindParam("user_id", $input['user_id']);
    $chksth->bindParam("group_id", $input['group_id']);
    $chksth->bindParam("album_name", $input['album_name']);
    $chksth->execute();
    $chkRes = $chksth->fetchAll();
    if (count($chkRes) >= 1) {
        $ret['error'] = 'The same album is already exist.';
        return $this->response->withJson($ret);
    }
    try {

        $created_at = date('Y-m-d H:i:s');

        $sql = "INSERT INTO albums (group_id, user_id, album_name, album_path, album_created) VALUES (:group_id,:user_id,:album_name,:album_path,:album_created)";
        $sth = $this->db->prepare($sql);
        $album_path = '';
        $sth->bindParam("group_id", $input['group_id']);
        $sth->bindParam("user_id", $input['user_id']);
        $sth->bindParam("album_name", $input['album_name']);
        $sth->bindParam("album_path", $album_path);
        $sth->bindParam("album_created", $created_at);
        $sth->execute();
        $input['album_id'] = $this->db->lastInsertId();

        $album_path = 'upload/' . 'user_' . $input['user_id'] . 'group_' . $input['group_id'] . 'album_'.$input['album_id'];

        $sql2 = "UPDATE albums SET album_path=:album_path WHERE album_id=:album_id";
        $sth2 = $this->db->prepare($sql2);
        $sth2->bindParam("album_id", $input['album_id']);
        $sth2->bindParam("album_path", $album_path);
        $sth2->execute();

        if (!file_exists('public/'.$album_path)) {
            mkdir('public/'.$album_path, 0777, true);
        }
        $ret['status'] = 'success';
        $ret['album'] = $input;
    } catch (Exception $e) {
        $ret['error'] = 'Database operation error.';
    }
    return $this->response->withJson($ret);
});


/**
 * get All Album by user_id
 */
$app->get('/api/allAlbum/[{user_id}]', function ($request, $response, $args) {
    $sql = "SELECT * FROM albums where user_id=:user_id";
    $sth = $this->db->prepare($sql);
    $ret['status'] = 'fail';
    try {
        $user_id = intval($args['user_id']);
        $sth->bindParam('user_id', $user_id);
        $sth->execute();
        $groups = $sth->fetchAll();
        $ret['status'] = 'success';
        $ret['albums'] = $groups;
        return $this->response->withJson($ret);
    } catch (Exception $e) {
        return $this->response->withJson($ret);
    }
});

/**
 * get All Photos by user_id, group_id, album_id
 */
$app->post('/api/photos', function ($request, $response) {
    $input = $request->getParsedBody();
    $sql = "SELECT * FROM photos where album_id=:album_id";
    $sth = $this->db->prepare($sql);
    $ret['status'] = 'fail';
    try {

        $sth->bindParam('album_id', $input['album_id']);
        $sth->execute();
        $groups = $sth->fetchAll();
        $ret['status'] = 'success';
        $ret['photos'] = $groups;
        return $this->response->withJson($ret);
    } catch (Exception $e) {
        return $this->response->withJson($ret);
    }
});


$app->post('/api/upload_photo', function (Request $request, Response $response) {
    $directory = 'public/upload/tmp/';
    if (!file_exists($directory)) {
        mkdir($directory, 0777, true);
    }
    $uploadedFiles = $request->getUploadedFiles();

    // handle single input with single file upload
    $uploadedFile = $uploadedFiles['file'];
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $filename = moveUploadedFile($directory, $uploadedFile);
        return $this->response->withJson(['success' => $filename]);
    }


    // handle multiple inputs with the same key
    foreach ($uploadedFiles['file'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = moveUploadedFile($directory, $uploadedFile);

            return $this->response->withJson(['success' => $filename]);
        }
    }
});

$app->post('/api/savePhoto', function ($request, $response) {
    $this->get('logger')->info("api/savePhoto");
    $input = $request->getParsedBody();
    $album = $input['album'];
    $tmpFiles = $input['tmpFiles'];


    $directory = 'upload/' . 'user_' . $album['user_id'] . 'group_' . $album['group_id'] . 'album'.'_'.$album['album_id'];

    $this->get('logger')->info($directory);
    $created_at = date('Y-m-d H:i:s');

    $tmpDir = "public/upload/tmp";

    $sqlP = "INSERT INTO photos(album_id,group_id,user_id,photo_uploaded_name,photo_uploaded_time) VALUES (:album_id,:group_id,:user_id,:photo_uploaded_name,:photo_uploaded_time)";
    $sth = $this->db->prepare($sqlP);
    $sth->bindParam('user_id', $album['user_id']);
    $sth->bindParam('group_id', $album['group_id']);
    $sth->bindParam('album_id', $album['album_id']);
    $sth->bindParam('photo_uploaded_time', $created_at);
    if (file_exists('public/'.$directory)) {
        foreach ($tmpFiles as $tmpFile) {
            $this->get('logger')->info("api/savePhoto_tmpFile_274".$tmpFile);
            //$filePath = moveTmpFile($directory, $tmpFile);

            $realFileName = explode('_', $tmpFile)[1];

            $this->get('logger')->info("api/savePhoto_281".$realFileName);

            $tmpFilePath = $tmpDir . '/' . $tmpFile;
            $realFilePath = $directory . '/' . $realFileName;
            $this->get('logger')->info("moveTmpFile_334");
            if (file_exists($tmpFilePath)) {
                $this->get('logger')->info("moveTmpFile_336".$tmpFilePath);
                rename($tmpFilePath, 'public/'.$realFilePath);
            }

            $sth->bindParam('photo_uploaded_name', $realFilePath);
            $sth->execute();
        }
    }


    //get all photos of album
    $sql = "SELECT * FROM photos where album_id=:album_id";
    $sth = $this->db->prepare($sql);
    $ret['status'] = 'fail';
    try {

        $sth->bindParam('album_id', $album['album_id']);
        $sth->execute();
        $photos = $sth->fetchAll();
        $ret['status'] = 'success';
        $ret['photos'] = $photos;
        return $this->response->withJson($ret);
    } catch (Exception $e) {
        return $this->response->withJson($ret);
    }
});


/**
 * Moves the uploaded file to the upload directory and assigns it a unique name
 * to avoid overwriting an existing uploaded file.
 *
 * @param string $directory directory to which the file is moved
 * @param UploadedFile $uploaded file uploaded file to move
 * @return string filename of moved file
 */
function moveUploadedFile($directory, UploadedFile $uploadedFile)
{
    $filename = pathinfo($uploadedFile->getClientFilename(), PATHINFO_FILENAME);
    $filename = str_replace(' ','',$filename);
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $basename . '_' . $filename . '.' . $extension);
    //$uploadedFile->moveTo('public/upload/user_1group_1groupa-album1/'.$uploadedFile->getClientFilename());

    return $basename . '_' . $filename . '.' . $extension;
    //return $filename.$extension;
}

/**
 * @param $directory
 * @param $tmpFile
 * @return string
 * @throws Exception
 */

//function moveTmpFile($directory, $tmpFile)
//{
//
//    return $realFilePath;
//}

