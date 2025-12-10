SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `notice` (
  `id` bigint UNSIGNED NOT NULL,
  `todo_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `value` float NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` date NOT NULL,
  KEY `notice_todo_id_idx` (`todo_id`),
  KEY `notice_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tasks` (
  `id` bigint UNSIGNED NOT NULL,
  `todo_id` bigint NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  KEY `tasks_todo_id_idx` (`todo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `todo` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint NOT NULL,
  `private` tinyint(1) NOT NULL DEFAULT '1',
  `aut_emails` json DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `categories` json NOT NULL,
  `tags` json DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `due_time` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT 'not started',
  `cron_passed` tinyint(1) NOT NULL DEFAULT '0',
  KEY `todo_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `contactLink` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '/default-avatar.png',
  `ended_todos` int NOT NULL DEFAULT '0',
  `ended_tasks` int NOT NULL DEFAULT '0',
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `todo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `notice`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `tasks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `todo`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `notice`
  ADD CONSTRAINT `fk_notice_todo_id` FOREIGN KEY (`todo_id`) REFERENCES `todo` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_notice_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tasks_todo_id` FOREIGN KEY (`todo_id`) REFERENCES `todo` (`id`) ON DELETE CASCADE;

ALTER TABLE `todo`
  ADD CONSTRAINT `fk_todo_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

COMMIT;