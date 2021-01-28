This project is deploy at www.stonkTA.com

The motivation for this project was to create an easy way for stock traders to visualize charts and share their feedback

The backend is written in Flask (located in StockData/algoPlatform1_project) using blueprints to connect routes and models. 
The User and Post data are stored in an Postgresql database

Stock data is pull from IEX cloud and Financial Modeling Preo API's.

The Frontend is a single react app with react-router to directing towards various components. Semantic-UI-react was used to stlye
most components with CSS updated where needed.

If you are cloning this database, and would like to make changes to the frontend, navigate to react-frontend, and run 'npm run build' 
and the webpack configuration will create the react app in the flask backend folder. Run the run.py file in 'algoPlatform1_project' to
start the flask app. 

If you would like to pull stock data from a cloned version of this project, you will need your own api keys assigned as environment variables
in the __init__.py and algoPlatform1_project/algo/routes.py files. 

please contact me at jacob.anderson10 (at) gmail with any questions, comments, or suggestions. 
