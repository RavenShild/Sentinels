CREATE DATABASE `sisregex`;
USE `sisregex`;

CREATE TABLE `config_servico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `configurado` tinyint(1) DEFAULT NULL,
  `servico_ref` date NOT NULL,
  `sgtNomeGuerra` varchar(255) NOT NULL,
  `cbNomeGuerra` varchar(255) NOT NULL,
  `motoristaNomeGuerra` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `civis` (
  `cpf` varchar(14) DEFAULT NULL,
  `dataEntrada` date DEFAULT NULL,
  `destino` varchar(255) DEFAULT NULL,
  `horaEntrada` time DEFAULT NULL,
  `horaSaida` time DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `config_servico_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_config_civis` (`config_servico_id`),
  CONSTRAINT `fk_config_civis` FOREIGN KEY (`config_servico_id`) REFERENCES `config_servico` (`id`)
);


CREATE TABLE `oom_durante_expediente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pg` varchar(20) DEFAULT NULL,
  `nomeGuerra` varchar(50) DEFAULT NULL,
  `om` varchar(50) DEFAULT NULL,
  `idtMil` varchar(50) DEFAULT NULL,
  `dataEntrada` date DEFAULT NULL,
  `horaEntrada` time DEFAULT NULL,
  `horaSaida` time DEFAULT NULL,
  `origem` varchar(50) DEFAULT NULL,
  `config_servico_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_config_oom_durante_expediente` (`config_servico_id`),
  CONSTRAINT `fk_config_oom_durante_expediente` FOREIGN KEY (`config_servico_id`) REFERENCES `config_servico` (`id`)
);

CREATE TABLE `oom_fora_expediente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pg` varchar(20) DEFAULT NULL,
  `nomeGuerra` varchar(50) DEFAULT NULL,
  `om` varchar(50) DEFAULT NULL,
  `idtMil` varchar(50) DEFAULT NULL,
  `dataEntrada` date DEFAULT NULL,
  `horaEntrada` time DEFAULT NULL,
  `horaSaida` time DEFAULT NULL,
  `origem` varchar(50) DEFAULT NULL,
  `config_servico_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_config_oom_fora_expediente` (`config_servico_id`),
  CONSTRAINT `fk_config_oom_fora_expediente` FOREIGN KEY (`config_servico_id`) REFERENCES `config_servico` (`id`)
);

CREATE TABLE `qg_durante_expediente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pg` varchar(20) DEFAULT NULL,
  `nomeGuerra` varchar(50) DEFAULT NULL,
  `idtMil` varchar(50) DEFAULT NULL,
  `dataEntrada` date DEFAULT NULL,
  `horaEntrada` time DEFAULT NULL,
  `horaSaida` time DEFAULT NULL,
  `origem` varchar(50) DEFAULT NULL,
  `config_servico_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_config_qg_durante_expediente` (`config_servico_id`),
  CONSTRAINT `fk_config_qg_durante_expediente` FOREIGN KEY (`config_servico_id`) REFERENCES `config_servico` (`id`)
);

CREATE TABLE `qg_fora_expediente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pg` varchar(20) DEFAULT NULL,
  `nomeGuerra` varchar(50) DEFAULT NULL,
  `idtMil` varchar(50) DEFAULT NULL,
  `dataEntrada` date DEFAULT NULL,
  `horaEntrada` time DEFAULT NULL,
  `horaSaida` time DEFAULT NULL,
  `origem` varchar(50) DEFAULT NULL,
  `config_servico_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_config_qg_fora_expediente` (`config_servico_id`),
  CONSTRAINT `fk_config_qg_fora_expediente` FOREIGN KEY (`config_servico_id`) REFERENCES `config_servico` (`id`)
);

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `nome_completo` varchar(100) NOT NULL,
  `administrador` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `militares_qg` (
  `id_militar` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) NOT NULL,
  `nome_guerra` varchar(50) NOT NULL,
  `posto_graduacao` varchar(20) NOT NULL,
  `idt_militar` varchar(50) NOT NULL,
  PRIMARY KEY (`id_militar`)
)