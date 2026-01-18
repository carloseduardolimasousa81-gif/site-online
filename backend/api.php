<?php
header("Content-Type: application/json");

$arquivo = __DIR__ . "/dados.json";

if (!file_exists($arquivo)) {
    file_put_contents($arquivo, json_encode([]));
}

$dadosAtuais = json_decode(file_get_contents($arquivo), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $entrada = json_decode(file_get_contents("php://input"), true);
    $texto = $entrada['texto'] ?? '';

    if ($texto) {
        $dadosAtuais[] = [
            "texto" => $texto,
            "data" => date("Y-m-d H:i:s")
        ];
        file_put_contents($arquivo, json_encode($dadosAtuais));
    }

    echo json_encode(["status" => "ok"]);
    exit;
}

echo json_encode($dadosAtuais);
