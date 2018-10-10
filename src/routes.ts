/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { CommentsController } from './controllers/commentsController';
import { MoviesController } from './controllers/moviesController';

const models: TsoaRoute.Models = {
    "Movie": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "title": { "dataType": "string", "required": true },
            "year": { "dataType": "double", "required": true },
            "rated": { "dataType": "string", "required": true },
            "released": { "dataType": "string", "required": true },
            "runtime": { "dataType": "string", "required": true },
            "genres": { "dataType": "array", "array": { "ref": "Genre" }, "required": true },
            "director": { "ref": "Director", "required": true },
            "writer": { "dataType": "string", "required": true },
            "actors": { "dataType": "array", "array": { "ref": "Actor" }, "required": true },
            "plot": { "dataType": "string", "required": true },
            "language": { "ref": "Language", "required": true },
            "country": { "dataType": "string", "required": true },
            "awards": { "dataType": "string", "required": true },
            "poster": { "dataType": "string", "required": true },
            "ratings": { "dataType": "array", "array": { "ref": "Rating" }, "required": true },
            "metascore": { "dataType": "string", "required": true },
            "imdbID": { "dataType": "string", "required": true },
            "imdbRating": { "dataType": "double", "required": true },
            "imdbVotes": { "dataType": "string", "required": true },
            "type": { "ref": "Type", "required": true },
            "dvd": { "dataType": "string", "required": true },
            "boxOffice": { "dataType": "string", "required": true },
            "production": { "dataType": "string", "required": true },
            "website": { "dataType": "string", "required": true },
            "comments": { "dataType": "array", "array": { "ref": "Comment" }, "required": true },
        },
    },
    "Genre": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "movies": { "dataType": "array", "array": { "ref": "Movie" }, "required": true },
        },
    },
    "Director": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "movies": { "dataType": "array", "array": { "ref": "Movie" }, "required": true },
        },
    },
    "Actor": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "movies": { "dataType": "array", "array": { "ref": "Movie" }, "required": true },
        },
    },
    "Language": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "movies": { "dataType": "array", "array": { "ref": "Movie" }, "required": true },
        },
    },
    "Rating": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "source": { "dataType": "string", "required": true },
            "value": { "dataType": "string", "required": true },
            "movie": { "ref": "Movie", "required": true },
        },
    },
    "Type": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "movies": { "dataType": "array", "array": { "ref": "Movie" }, "required": true },
        },
    },
    "Comment": {
        "properties": {
            "target": { "dataType": "object", "required": true },
            "id": { "dataType": "double", "required": true },
            "text": { "dataType": "string", "required": true },
            "movieId": { "dataType": "double", "required": true },
            "movie": { "ref": "Movie", "required": true },
        },
    },
    "MovieSearchBody": {
        "properties": {
            "type": { "dataType": "enum", "enums": ["movie", "series", "episode"] },
            "year": { "dataType": "double" },
            "id": { "dataType": "string" },
            "title": { "dataType": "string" },
        },
    },
};

export function RegisterRoutes(router: any) {
    router.get('/comments',
        async (context, next) => {
            const args = {
                movieId: { "in": "query", "name": "movieId", "dataType": "double" },
                id: { "in": "query", "name": "id", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new CommentsController();

            const promise = controller.getComments.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.post('/comments',
        async (context, next) => {
            const args = {
                text: { "in": "body-prop", "name": "text", "required": true, "dataType": "string" },
                movieId: { "in": "body-prop", "name": "movieId", "required": true, "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new CommentsController();

            const promise = controller.createComment.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.get('/movies',
        async (context, next) => {
            const args = {
                title: { "in": "query", "name": "title", "dataType": "string" },
                year: { "in": "query", "name": "year", "dataType": "string" },
                genre: { "in": "query", "name": "genre", "dataType": "string" },
                director: { "in": "query", "name": "director", "dataType": "string" },
                actor: { "in": "query", "name": "actor", "dataType": "string" },
                language: { "in": "query", "name": "language", "dataType": "string" },
                country: { "in": "query", "name": "country", "dataType": "string" },
                imdbID: { "in": "query", "name": "imdbID", "dataType": "string" },
                type: { "in": "query", "name": "type", "dataType": "string" },
                limit: { "in": "query", "name": "limit", "dataType": "double" },
                start: { "in": "query", "name": "start", "dataType": "double" },
                sortBy: { "in": "query", "name": "sortBy", "dataType": "string" },
                sortType: { "in": "query", "name": "sortType", "dataType": "string" },
                comments: { "in": "query", "name": "comments", "dataType": "boolean" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new MoviesController();

            const promise = controller.getMovies.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.post('/movies',
        async (context, next) => {
            const args = {
                movieSearchBody: { "in": "body", "name": "movieSearchBody", "required": true, "ref": "MovieSearchBody" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new MoviesController();

            const promise = controller.createMovie.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.get('/movies/:id/comments',
        async (context, next) => {
            const args = {
                movieId: { "in": "path", "name": "id", "required": true, "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new MoviesController();

            const promise = controller.getMovieComments.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });
    router.post('/movies/:id/comments',
        async (context, next) => {
            const args = {
                movieId: { "in": "path", "name": "id", "required": true, "dataType": "double" },
                text: { "in": "body-prop", "name": "text", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
                context.status = error.status || 500;
                context.body = error;
                return next();
            }

            const controller = new MoviesController();

            const promise = controller.createMovieComment.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, next);
        });


    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: Promise<any>, context: any, next: () => Promise<any>) {
        return Promise.resolve(promise)
            .then((data: any) => {
                if (data || data === false) {
                    context.body = data;
                    context.status = 200;
                } else {
                    context.status = 204;
                }

                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        context.set(name, headers[name]);
                    });

                    const statusCode = controllerObj.getStatus();
                    if (statusCode) {
                        context.status = statusCode;
                    }
                }
                next();
            })
            .catch((error: any) => {
                context.status = error.status || 500;
                context.body = error;
                next();
            });
    }

    function getValidatedArgs(args: any, context: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return context.request;
                case 'query':
                    return ValidateParam(args[key], context.request.query[name], models, name, errorFields)
                case 'path':
                    return ValidateParam(args[key], context.params[name], models, name, errorFields)
                case 'header':
                    return ValidateParam(args[key], context.request.headers[name], models, name, errorFields);
                case 'body':
                    return ValidateParam(args[key], context.request.body, models, name, errorFields, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], context.request.body[name], models, name, errorFields, 'body.');
            }
        });
        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}
