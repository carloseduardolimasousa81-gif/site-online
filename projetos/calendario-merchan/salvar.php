<?php
$conn = pg_connect("host=SEU_HOST dbname=SEU_DB user=SEU_USER password=SUA_SENHA");

$data = json_decode(file_get_contents("php://input"), true);

foreach($data as $d){
    $id = intval($d['dia']);
    $mes = intval($d['mes']);
    $ano = intval($d['ano']);
    $info = '{'.implode(",", $d['info']).'}';
    $imagem = $d['imagem'] ?? '';

    pg_query_params($conn, "
        INSERT INTO dias (dia, mes, ano, info, imagem)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (dia, mes, ano) 
        DO UPDATE SET info=$4, imagem=$5
    ", [$id,$mes,$ano,$info,$imagem]);
}

echo json_encode(["status"=>"ok"]);
?>
