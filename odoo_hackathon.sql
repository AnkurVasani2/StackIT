-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2025 at 01:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `odoo_hackathon`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text NOT NULL,
  `upvotes` int(11) DEFAULT 0,
  `downvotes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `comment_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`answer_id`, `question_id`, `user_id`, `title`, `description`, `upvotes`, `downvotes`, `created_at`, `updated_at`, `comment_count`) VALUES
(1, 9, 556411, 'Wankhede Stadium', 'You can practice at Wankhede Stadium Ground. Membership fee is ₹5000/year. Contact: 022-12345678', 0, 0, '2025-07-12 08:03:32', '2025-07-12 08:03:32', 0),
(2, 10, 937232, 'Traditional Recipe', 'First marinate chicken with yogurt and spices for 4 hours. Then prepare gravy with tomatoes, butter, and cream...', 0, 0, '2025-07-12 08:03:32', '2025-07-12 08:03:32', 0),
(3, 11, 420188, 'Structured Approach', 'Focus on NCERT books first, then move to advanced problems. Join a good coaching institute...', 0, 0, '2025-07-12 08:03:32', '2025-07-12 08:03:32', 0),
(4, 12, 521493, 'Market Analysis', 'Currently Bangalore has huge demand for React developers. Average package is 12-18 LPA for 3 years experience', 0, 0, '2025-07-12 08:03:32', '2025-07-12 08:03:32', 0),
(5, 15, 521493, 'How to implement FastAPI with MySQL', 'Here\'s how you can implement FastAPI with MySQL...', 0, 0, '2025-07-12 11:08:13', '2025-07-12 11:08:13', 0),
(6, 17, 420188, 'Answer submission', 'hello issue resolved', 0, 0, '2025-07-12 11:13:10', '2025-07-12 11:13:10', 0);

--
-- Triggers `answers`
--
DELIMITER $$
CREATE TRIGGER `after_answer_delete` AFTER DELETE ON `answers` FOR EACH ROW BEGIN
    UPDATE questions 
    SET answer_count = (
        SELECT COUNT(*) 
        FROM answers 
        WHERE question_id = OLD.question_id
    )
    WHERE question_id = OLD.question_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_answer_insert` AFTER INSERT ON `answers` FOR EACH ROW BEGIN
    UPDATE questions 
    SET answer_count = (
        SELECT COUNT(*) 
        FROM answers 
        WHERE question_id = NEW.question_id
    )
    WHERE question_id = NEW.question_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `answer_votes`
--

CREATE TABLE `answer_votes` (
  `answer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) DEFAULT 0,
  `dislikes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answer_votes`
--

INSERT INTO `answer_votes` (`answer_id`, `user_id`, `created_at`, `likes`, `dislikes`) VALUES
(1, 521493, '2025-07-12 08:09:52', 12, 3),
(1, 937232, '2025-07-12 08:04:03', 0, 0),
(2, 420188, '2025-07-12 08:09:52', 28, 2),
(3, 556411, '2025-07-12 08:09:52', 35, 6),
(4, 937232, '2025-07-12 08:09:52', 20, 4);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `answer_id`, `user_id`, `comment_text`, `created_at`) VALUES
(1, 1, 521493, 'Also check Shivaji Park ground, its more economical', '2025-07-12 08:03:41'),
(2, 2, 420188, 'Adding kasuri methi at the end enhances flavor', '2025-07-12 08:03:41'),
(3, 3, 937232, 'Allen coaching is good for JEE preparation', '2025-07-12 08:03:41'),
(4, 4, 556411, 'Which companies are currently hiring?', '2025-07-12 08:03:41');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `upvotes` int(11) DEFAULT 0,
  `downvotes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `answer_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `user_id`, `title`, `description`, `upvotes`, `downvotes`, `created_at`, `updated_at`, `answer_count`) VALUES
(9, 420188, 'Best Cricket Ground in Mumbai?', 'Looking for recommendations for cricket grounds in Mumbai for weekend practice', 0, 0, '2025-07-12 08:02:56', '2025-07-12 08:43:53', 1),
(10, 556411, 'Authentic Butter Chicken Recipe', 'Need a traditional North Indian butter chicken recipe with proper spice measurements', 0, 0, '2025-07-12 08:02:56', '2025-07-12 08:43:53', 1),
(11, 521493, 'IIT JEE Preparation Tips', 'What are the best strategies to crack IIT JEE in first attempt?', 0, 0, '2025-07-12 08:02:56', '2025-07-12 08:43:53', 1),
(12, 937232, 'React.js Job Market in Bangalore', 'How is the current job market for React developers in Bangalore?', 0, 0, '2025-07-12 08:02:56', '2025-07-12 08:43:53', 1),
(15, 921327, 'How to implement FastAPI with MySQL?', 'I need help implementing FastAPI with MySQL database connection', 1, 0, '2025-07-12 09:09:16', '2025-07-12 11:08:13', 2),
(16, 308584, 'How to implement FastAPI with MySQL?', 'I need help implementing FastAPI with MySQL database connection', 0, 0, '2025-07-12 09:12:00', '2025-07-12 09:12:00', 0),
(17, 78532, 'Hello React Issue', 'The Router Dom is Not good with three.js', 0, 0, '2025-07-12 09:58:28', '2025-07-12 11:13:10', 2),
(18, 843725, 'heloo java issue', '<b>fdhffefewfnjefn</b>', 0, 0, '2025-07-12 10:25:56', '2025-07-12 10:25:56', 0);

-- --------------------------------------------------------

--
-- Table structure for table `question_tags`
--

CREATE TABLE `question_tags` (
  `question_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_tags`
--

INSERT INTO `question_tags` (`question_id`, `tag_id`) VALUES
(9, 11),
(10, 12),
(11, 13),
(12, 14),
(15, 15),
(15, 16),
(15, 17),
(16, 15),
(16, 16),
(16, 17),
(17, 21),
(17, 22),
(17, 23),
(18, 21),
(18, 24);

-- --------------------------------------------------------

--
-- Table structure for table `question_votes`
--

CREATE TABLE `question_votes` (
  `question_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) DEFAULT 0,
  `dislikes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_votes`
--

INSERT INTO `question_votes` (`question_id`, `user_id`, `created_at`, `likes`, `dislikes`) VALUES
(9, 521493, '2025-07-12 08:08:25', 15, 2),
(10, 420188, '2025-07-12 08:08:25', 25, 3),
(11, 937232, '2025-07-12 08:08:25', 42, 5),
(12, 556411, '2025-07-12 08:08:25', 33, 4),
(15, 308584, '2025-07-12 10:20:39', 1, 0),
(15, 420188, '2025-07-12 09:22:29', 1, 0),
(16, 420188, '2025-07-12 09:25:10', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `name`, `description`, `created_at`) VALUES
(1, 'cricket', 'Questions related to Indian cricket', '2025-07-12 07:54:38'),
(2, 'bollywood', 'Topics about Indian cinema and entertainment', '2025-07-12 07:54:38'),
(3, 'cooking', 'Indian cuisine and cooking techniques', '2025-07-12 07:54:38'),
(4, 'tech', 'Technology related questions', '2025-07-12 07:54:38'),
(5, 'education', 'Questions about Indian education system', '2025-07-12 07:54:38'),
(11, 'cricket_rules', 'Questions related to Indian cricket', '2025-07-12 08:05:17'),
(12, 'indian_cooking', 'Indian cuisine and cooking techniques', '2025-07-12 08:05:17'),
(13, 'education_india', 'Questions about Indian education system', '2025-07-12 08:05:17'),
(14, 'tech_jobs', 'Technology and job related questions', '2025-07-12 08:05:17'),
(15, 'python', NULL, '2025-07-12 09:09:16'),
(16, 'fastapi', NULL, '2025-07-12 09:09:16'),
(17, 'mysql', NULL, '2025-07-12 09:09:16'),
(21, 'javascript', NULL, '2025-07-12 09:58:28'),
(22, 'node.js', NULL, '2025-07-12 09:58:28'),
(23, 'css', NULL, '2025-07-12 09:58:28'),
(24, 'api', NULL, '2025-07-12 10:25:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `skills` text DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `role` enum('user','moderator','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `mobile`, `full_name`, `skills`, `password_hash`, `last_login`, `is_active`, `role`, `created_at`) VALUES
(78532, 'user_PsMQRBrt', 'user_PsMQRBrt@example.com', '1234567890', 'Temporary User PsMQRBrt', 'general', 'temp_hash', '2025-07-12 09:58:28', 1, 'user', '2025-07-12 09:58:28'),
(308584, 'user_BvS4eLj2', 'user_BvS4eLj2@example.com', '1234567890', 'Temporary User BvS4eLj2', 'general', 'temp_hash', '2025-07-12 09:12:00', 1, 'user', '2025-07-12 09:12:00'),
(420188, 'rajesh_kumar', 'rajesh.k@gmail.com', '9876543210', 'Rajesh Kumar', 'Python, Java, MySQL', 'hash123', '2025-07-12 07:54:38', 1, 'user', '2025-07-12 07:54:38'),
(521493, 'amit_patel', 'amit.p@outlook.com', '7654321098', 'Amit Patel', 'PHP, Laravel, MongoDB', 'hash789', '2025-07-12 07:54:38', 1, 'user', '2025-07-12 07:54:38'),
(556411, 'priya_sharma', 'priya.s@yahoo.com', '8765432109', 'Priya Sharma', 'JavaScript, React, Node.js', 'hash456', '2025-07-12 07:54:38', 1, 'moderator', '2025-07-12 07:54:38'),
(843725, 'user_LNkbPuGX', 'user_LNkbPuGX@example.com', '1234567890', 'Temporary User LNkbPuGX', 'general', 'temp_hash', '2025-07-12 10:25:56', 1, 'user', '2025-07-12 10:25:56'),
(921327, 'user_2aPUTpOK', 'user_2aPUTpOK@example.com', '1234567890', 'Temporary User 2aPUTpOK', 'general', 'temp_hash', '2025-07-12 09:09:16', 1, 'user', '2025-07-12 09:09:16'),
(937232, 'neha_gupta', 'neha.g@gmail.com', '9876543211', 'Neha Gupta', 'Angular, TypeScript', 'hash101', '2025-07-12 07:54:38', 1, 'admin', '2025-07-12 07:54:38');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `before_insert_users` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
    SET NEW.user_id = FLOOR(RAND() * (999999 - 1000 + 1)) + 1000;
    WHILE EXISTS (SELECT 1 FROM users WHERE user_id = NEW.user_id) DO
        SET NEW.user_id = FLOOR(RAND() * (999999 - 1000 + 1)) + 1000;
    END WHILE;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vote_summary`
-- (See below for the actual view)
--
CREATE TABLE `vote_summary` (
`Question` varchar(200)
,`Asked_By` varchar(50)
,`Question_Likes` int(11)
,`Question_Dislikes` int(11)
,`Answer` varchar(200)
,`Answered_By` varchar(50)
,`Answer_Likes` int(11)
,`Answer_Dislikes` int(11)
);

-- --------------------------------------------------------

--
-- Structure for view `vote_summary`
--
DROP TABLE IF EXISTS `vote_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vote_summary`  AS SELECT `q`.`title` AS `Question`, `u1`.`username` AS `Asked_By`, `qv`.`likes` AS `Question_Likes`, `qv`.`dislikes` AS `Question_Dislikes`, `a`.`title` AS `Answer`, `u2`.`username` AS `Answered_By`, `av`.`likes` AS `Answer_Likes`, `av`.`dislikes` AS `Answer_Dislikes` FROM (((((`questions` `q` left join `users` `u1` on(`q`.`user_id` = `u1`.`user_id`)) left join `question_votes` `qv` on(`q`.`question_id` = `qv`.`question_id`)) left join `answers` `a` on(`q`.`question_id` = `a`.`question_id`)) left join `users` `u2` on(`a`.`user_id` = `u2`.`user_id`)) left join `answer_votes` `av` on(`a`.`answer_id` = `av`.`answer_id`)) ORDER BY `qv`.`likes` DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `idx_answers_created_at` (`created_at`),
  ADD KEY `idx_answers_user_id` (`user_id`);

--
-- Indexes for table `answer_votes`
--
ALTER TABLE `answer_votes`
  ADD PRIMARY KEY (`answer_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `answer_id` (`answer_id`),
  ADD KEY `idx_comments_user_id` (`user_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `idx_questions_title` (`title`),
  ADD KEY `idx_questions_created_at` (`created_at`),
  ADD KEY `idx_questions_user_id` (`user_id`);

--
-- Indexes for table `question_tags`
--
ALTER TABLE `question_tags`
  ADD PRIMARY KEY (`question_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `question_votes`
--
ALTER TABLE `question_votes`
  ADD PRIMARY KEY (`question_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_tags_name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `answer_votes`
--
ALTER TABLE `answer_votes`
  ADD CONSTRAINT `answer_votes_ibfk_1` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`answer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `answer_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`answer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `question_tags`
--
ALTER TABLE `question_tags`
  ADD CONSTRAINT `question_tags_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `question_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE;

--
-- Constraints for table `question_votes`
--
ALTER TABLE `question_votes`
  ADD CONSTRAINT `question_votes_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `question_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
