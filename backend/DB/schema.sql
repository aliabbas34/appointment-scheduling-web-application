CREATE DATABASE IF NOT EXISTS appointment_scheduling;

USE appointment_scheduling;

CREATE TABLE user(
    email VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE working_hours(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    opens_at VARCHAR(10) NOT NULL,
    closes_at VARCHAR(10) NOT NULL,
    FOREIGN KEY(email) REFERENCES user(email)
);

CREATE TABLE breaks(
    id INT AUTO_INCREMENT PRIMARY KEY,
    break_title VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    FOREIGN KEY(email) REFERENCES user(email)
);

CREATE TABLE days_off(
    id INT AUTO_INCREMENT PRIMARY KEY,
    dayname VARCHAR(10),
    email VARCHAR(50) NOT NULL,
    FOREIGN KEY(email) REFERENCES user(email)
);

CREATE TABLE appointment(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50),
    consultant VARCHAR(50),
    date VARCHAR(10),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    FOREIGN KEY(user) REFERENCES user(email),
    FOREIGN KEY(consultant) REFERENCES user(email)
);
