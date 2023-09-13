
# Appointment Scheduling Web Application

As the name describes it is an Appointment scheduler. which offers services to both parties. One, who wants to list their working hours and other details. Two, who wants to book an oppointment with the listed businesses.

## Requirements

To run this project locally you need few things installed on your computer. 

1. node.js
2. mysql
3. mysql workbench


## Setting up Project Locally

Clone the project

```bash
  git clone https://github.com/aliabbas34/appointment-scheduling-web-application
```

Go to the project directory

```bash
  cd appointment-scheduling-web-application
```

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Go to the DB directory

```bash
    cd DB
```
Copy the contents from schema.sql and paste it into sql workbench then run it to create database and required tables.

Otherwise you can do it using terminal.
1. Open Command Prompt.
2. Navigate to the bin folder. For example: cd C:\Program Files\MySQL\MySQL Server 8.0\bin.
3. Run the mysql -u root -p command.
4. Enter the password.
5. paste the content of schema.sql file and run it

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MYSQL_HOST`
`MYSQL_USER`
`MYSQL_PASSWORD`
`MYSQL_DATABASE`
`SECRET`

&nbsp;

Start the server

```bash
  node app.js
```


Go to the frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```
Start the frontend server

```bash
    npm run dev
```

