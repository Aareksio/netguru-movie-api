### netguru-movie-api

## Setup
```
git pull
npm install
npm start
```

Required environment variables:
- TypeORM settings
- `OMDBAPI_KEY` - api key for [omdbapi](http://www.omdbapi.com/)
- `APP_PORT` - port on which the API should be exposed

Example TypeORM settings:
```dotenv
TYPEORM_CONNECTION = sqlite
TYPEORM_DATABASE = database.sqlite
TYPEORM_SYNCHRONIZE = true
TYPEORM_LOGGING = false
TYPEORM_ENTITIES = src/entity/**/*.ts
```

## Assignment
We’d like you to build simple REST API for us - a basic movie database interacting with external API. **Here’s full specification of endpoints that we’d like it to have**:

- POST /movies:
    Based on passed data, other movie details should be fetched from http://www.omdbapi.com/ (or other similar, public movie database) - and saved to application database.
- GET /movies:
    Should fetch list of all movies already present in application database.
- POST /comments:
    Comment should be saved to application database
- GET /comments:
    Should fetch list of all comments present in application database.
        
**Rules & hints*​*

- Please consider those requirements as basic.
- During implementing the assignment use many different and appropriate layers (i.e. middleware), design patterns (i.e. serializers), and so on.
- Don’t forget to test appropriate amount of code.
- Usage of latest ECMAScript/TypeScript standard and features is encouraged.
- The application's code should be kept in a public repository so that we can read it, pull it and build it ourselves. Remember to include README file or at least basic notes on application requirements and setup - we should be able to easily and quickly get it running.
- Written application must be hosted and publicly available for us online - we recommend [Heroku](https://www.heroku.com/).

## Application
The specifications, despite it's description, is far from being _full_. There are no requirements regarding accepted input nor expected output, so I decided to implement the following:

- `POST /movies`
  - Accepts following query parameters:
    - `id` - IMDB entry id
    - `title`
    - `year`
    - `type` - 'Movie' | 'Series' | 'Episode'
  - Either `id` or `title` query parameter is required
  - Returns parsed response object
  - Always performs a request to external api
- `GET /movies`
  - Returns a list of all entries available in local database by default
  - Supports following filters, parameters marked as arrays accept multiple values separated by comma:
    - `title` - Entry title, gets surrounded by wildcards
    - `year[]`
    - `genre[]`
    - `director[]`
    - `actor[]`
    - `language[]`
    - `country[]`
    - `imdbID[]`
    - `type[]`
  - Multiple filter values are connected by OR, while filters themselves are connected by AND
  - Supports pagination via `limit` and `start` query parameters
  - Supports sorting via `sortBy` and `sotrType` query parameters
- `POST /comments`
  - Accepts `text` and `movieId` parameters
  - Performs existence check for given `movieId`
- `GET /comments`
  - Returns a list of all entries available in local database by default
  - Support following filters, parameters marked as arrays accept multiple values separated by comma:
    - `movieId`
    - `id[]`
  - Multiple filter values are connected by OR, while filters themselves are connected by AND
  
Additionally, I added the following endpoints:

- `GET /movies/:movieId/comments`
  - Returns all comments for given `movieId`
- `POST /movies/:movieId/comments`
  - Saves a comment for given `movieId`
  - Accepts `text` parameter

Please note movie objects returned by the API have different structure than omdbapi response, nevertheless contain all required information.

## Tests

A few unit tests are included in `tests/unit`, use `npm test` to run them

The API was also manually tested using Postman - collection located in `tests/api/collection.json` and can later be used for automated testing

## Personal note

Since I had 4 days to deliver rather simple application, I decided to code it using technologies I had no former experience with - TypeScript, TypeORM and tsoa.
Because of that, it's quite possible some solutions are far from ideal, I'll gladly share my motivations and discuss other approaches.
