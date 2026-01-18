<?php
$conn = pg_connect("host=SEU_HOST dbname=SEU_DB user=SEU_USER password=SUA_SENHA");

$result = pg_query($conn, "SELECT dia, mes, ano, info, imagem FROM dias ORDER BY ano, mes, dia");
$dados = [];

while($row = pg_fetch_assoc($result)){
    $row['info'] = json_decode(json_encode($row['info']));
    $dados[] = $row;
}

echo json_encode($dados);
?>
