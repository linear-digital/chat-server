const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) DEFAULT '',
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      photo VARCHAR(255) DEFAULT '',
      cover VARCHAR(255) DEFAULT '',
      relo VARCHAR(255) DEFAULT '',
      info VARCHAR(255) DEFAULT '',
      location VARCHAR(255) DEFAULT '',
      status VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

const createTableChat = `
    CREATE TABLE IF NOT EXISTS chats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender VARCHAR(255),
      receiver VARCHAR(255),
      type VARCHAR(50),
      message VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
      image VARCHAR(11155) DEFAULT '',
      imageTitle VARCHAR(255) DEFAULT '',
      document VARCHAR(255) DEFAULT '',
      fileSize VARCHAR(255) DEFAULT '',
      fileName VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

const createTableFriendList = `
    CREATE TABLE IF NOT EXISTS friendlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255),
      friend_email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

module.exports = {
  createTableQuery,
  createTableChat,
  createTableFriendList
}