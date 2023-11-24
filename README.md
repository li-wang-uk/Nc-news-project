# Northcoders News API
**Author**: *Li Wang*
Please visit https://liwang-ncnews.onrender.com/api/ to access this project. 

## Project Summary: 
- This project is called Northcoders News API. 
- It is an API for the purpose of application data programmatically like a real world backend service. Users are able to use GET/POST/PATCH/DELETE to access/change the information they needed based on their query on SQL database. 
- The database is PSQL and hosted on Elephant SQL.
- The web service is hosted on Render. 
- https://liwang-ncnews.onrender.com/api/ will show you all available endpoints you can access. 

## Project instructions: 
- Clone the repo on your local machine by using this command


        git clone https://github.com/li-wang-uk/Nc-news-project
        

- Then you will need to install dependencies by typing 

        npm install

- Please note, you will need to create your own env files on your machine. 


    Create a file called .env.development in the root folder of this project
    Set .env.development to:

        PGDATABASE=nc_news

        
    Create a file called .env.test in the root folder of this project
    Set .env.test to:

        PGDATABASE=nc_news_test

- After that, please set up your local database & run the tests

        npm setup-dbs
        npm run seed 
        npm run test app

You should be able to see all tests are passed 

## Other information (minimum versions required)
- node.js 18.18.0
- postgres 8.11.3



For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).