<?php
header('Content-Type: text/plain');
echo 'OK METHOD=' . ($_SERVER['REQUEST_METHOD'] ?? '??');
