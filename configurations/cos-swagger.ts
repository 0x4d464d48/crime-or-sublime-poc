/**
 * @author Michael Mitchell-Halter
 */

/* tslint:disable */

/**
 * Have to define the schema as an interface for importing issues. Should
 * consider sharing this as a library later.
 */
interface ISwaggerAPI {
    swagger: string,
    info: any,
    host?: string,
    basePath?: string,
    schemes?: string[],
    consumes?: string[],
    produces?: string[],
    paths: { [path: string]: any },
    definitions?: any,
    parameters?: any,
    responses?: any,
    securityDefinitions?: any,
    security?: any[],
    tags?: any[],
    externalDocs?: any,
}

/**
 * This is a temporary fix until a way can be founded to load .json files
 * directly into typescript files as es6 modules during compilation. Export as
 * a class so that no issues arise with jasmine-ts
 */
export const cosAPI: any = {
    "basePath": "/",
    "consumes": [
        "application/json"
    ],
    "definitions": {
        "successResponseArray": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "array"
                }
            }
        },
        "successResponseObject": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "object"
                }
            }
        },
        "successResponseString": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "string"
                }
            }
        },
        "errorResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "info": {
        "description": "This is the alpha version of the CoS API. This will likely get broken up into a public and private API and the future.",
        "title": "CoS API",
        "version": "0.0.0"
    },
    "host": "https://crime-or-sublime.herokuapp.com",
    "paths": {
        "/graffiti-get/:id": {
            "get": {
                "consumes": [
                    "application/json"
                ],
                "description": "This retrieves graffiti data based on the ID (URL) given as a parameter.",
                "responses": {
                    "200": {
                        "description": "The graffiti data associated with the URL given.",
                        "schema": {
                            "$ref": "#/definitions/successResponseObject"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoGraffitiFoundError": {
                        "$ref": "#/responses/NoGraffitiFound"
                    }
                },
                "parameters": [
                    {
                        "description": "The URL of the graffiti from imgur",
                        "in": "url",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9]+$"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/graffiti-get-filter": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "This retrieves an array of graffiti that satisfy a filter. Preliminary work will be done to allow users to get graffiti based on location and popularity but more work will be required in the future. For now, making this request with empty paramters returns random graffiti.",
                "responses": {
                    "200": {
                        "description": "The graffiti data that satisfied filter constraints was received.",
                        "schema": {
                            "$ref": "#/definitions/successResponseObject"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoGraffitiFoundError": {
                        "$ref": "#/responses/NoGraffitiFound"
                    }
                },
                "parameters": [
                    {
                        "description": "The latitude to search for graffiti at",
                        "in": "body",
                        "name": "latitude",
                        "schema": {
                            "type": "number"
                        }
                    },
                    {
                        "description": "The longitude to search for graffiti at",
                        "in": "body",
                        "name": "longitude",
                        "schema": {
                            "type": "number"
                        }
                    },
                    {
                        "description": "Whether or not to search for the most popular",
                        "in": "body",
                        "name": "popularity",
                        "schema": {
                            "type": "boolean"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/graffiti-get-random": {
            "get": {
                "consumes": [
                    "application/json"
                ],
                "description": "This retrieves a random graffiti.",
                "responses": {
                    "200": {
                        "description": "The graffiti data associated with the random selected graffiti.",
                        "schema": {
                            "$ref": "#/definitions/successResponseObject"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    }
                },
                "parameters": [],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/graffiti-submit-new-submission": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "This make a new graffiti submission to be reviewed before it is posted to the site.",
                "responses": {
                    "200": {
                        "description": "The new submission was received and stored.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "GraffitiAlreadyRegisteredError": {
                        "$ref": "#/responses/GraffitiAlreadyRegistered"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InvalidSubmissionError": {
                        "$ref": "#/responses/InvalidSubmission"
                    },
                    "MaxSubmissionsExceededError": {
                        "$ref": "#/responses/MaxSubmissionsExceeded"
                    }
                },
                "parameters": [
                    {
                        "description": "The URL of the graffiti from imgur",
                        "in": "body",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9]+$"
                        }
                    },
                    {
                        "description": "The latitude where the picture was taken at",
                        "in": "body",
                        "name": "latitude",
                        "required": true,
                        "schema": {
                            "type": "number",
                            "maximum": 180,
                            "minimum": -180
                        }
                    },
                    {
                        "description": "The longitude where the picture was taken at",
                        "in": "body",
                        "name": "longitude",
                        "required": true,
                        "schema": {
                            "type": "number",
                            "maximum": 180,
                            "minimum": -180
                        }
                    },
                    {
                        "description": "The captcha response",
                        "in": "body",
                        "name": "recaptcha",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/session-create-user": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "This is the path users will use to submit credentials for an active session (i.e. login).",
                "responses": {
                    "200": {
                        "description": "The temp user account has been created and the user sent an email at the address they specified.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "AlreadyActiveSessionError": {
                        "$ref": "#/responses/AlreadyActiveSession"
                    },
                    "InvalidCredentialsError": {
                        "$ref": "#/responses/InvalidCredentials"
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "SessionLockoutError": {
                        "$ref": "#/responses/SessionLockout"
                    }
                },
                "parameters": [
                    {
                        "description": "A user's username or email.",
                        "in": "body",
                        "name": "identifier",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "maxLength": 20
                        }
                    },
                    {
                        "description": "A password selected by the user.",
                        "in": "body",
                        "name": "password",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "minLength": 8,
                            "maxLength": 20,
                            "pattern": "^[a-zA-Z0-9_]+$"
                        }
                    },
                    {
                        "description": "ReCaptcha response required if an IP address has too many login attempts.",
                        "in": "body",
                        "name": "recaptcha",
                        "required": false,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/session-end-user": {
            "get": {
                "consumes": [
                    "application/json"
                ],
                "description": "User successfully terminates their active session.",
                "responses": {
                    "200": {
                        "description": "A user successfully registers with CoS",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoActiveSessionError": {
                        "$ref": "#/responses/NoActiveSession"
                    }
                },
                "parameters": [],
                "produces": [
                    "application/json"
                ],
                "summarry": "This is responsible for registering new users."
            }
        },
        "/session-verify-user": {
            "get": {
                "consumes": [
                    "application/json"
                ],
                "description": "Simple getter method to test if a sesison is active.",
                "responses": {
                    "200": {
                        "description": "This response means the request has an active session.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "InvalidParameters": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "NoActiveSession": {
                        "$ref": "#/responses/NoActiveSession"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    }
                },
                "parameters": [],
                "produces": [
                    "application/json"
                ],
                "summarry": "This is responsible for registering new users."
            }
        },
        "/user-profile-add-favourite": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "User adds a graffiti to his favourites list.",
                "responses": {
                    "200": {
                        "description": "The user has added the graffiti to his favourites list.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "AlreadyFavouritedGraffitiError": {
                        "$ref": "#/responses/AlreadyFavouritedGraffiti"
                    },
                    "GraffitiDoesNotExistError": {
                        "$ref": "#/responses/GraffitiDoesNotExist"
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoActiveSession": {
                        "$ref": "#/responses/NoActiveSession"
                    }
                },
                "parameters": [
                    {
                        "description": "The URL of the favourited graffiti.",
                        "in": "body",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9]+$"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/user-profile-get-favourites": {
            "get": {
                "consumes": [
                    "application/json"
                ],
                "description": "Get a list of favourites associated with a user.",
                "responses": {
                    "200": {
                        "description": "The complete list of a user's favourite graffiti",
                        "schema": {
                            "$ref": "#/definitions/successResponseObject"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoActiveSession": {
                        "$ref": "#/responses/NoActiveSession"
                    }
                },
                "parameters": [],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/user-profile-remove-favourite": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "User removes a graffiti to his favourites list.",
                "responses": {
                    "200": {
                        "description": "The user has removed the graffiti from her favourites list.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "GraffitiNotFavouritedError": {
                        "$ref": "#/responses/GraffitiNotFavourited"
                    },
                    "GraffitiDoesNotExistError": {
                        "$ref": "#/responses/GraffitiDoesNotExist"
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoActiveSession": {
                        "$ref": "#/responses/NoActiveSession"
                    }
                },
                "parameters": [
                    {
                        "description": "The URL of the favourited graffiti to remove.",
                        "in": "body",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9]+$"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/user-rate": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "User submits a rating to a graffiti tag.",
                "responses": {
                    "200": {
                        "description": "The temp user account has been created and the user sent an email at the address they specified.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "AlreadyRatedGraffitiError": {
                        "$ref": "#/responses/AlreadyRatedGraffiti"
                    },
                    "GraffitiDoesNotExistError": {
                        "$ref": "#/responses/GraffitiDoesNotExist"
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "NoActiveSession": {
                        "$ref": "#/responses/NoActiveSession"
                    }
                },
                "parameters": [
                    {
                        "description": "The URL of the rated graffiti.",
                        "in": "body",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9]+$"
                        }
                    },
                    {
                        "description": "The rating the user assigned to the graffiti tag.",
                        "in": "body",
                        "name": "rating",
                        "required": true,
                        "schema": {
                            "type": "boolean"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/user-register-confirm/:id/:key": {
            "get": {
                "consumes": [
                    "application/json"
                ],
                "description": "This link is sent to users via their email after they register with CoS. Using this link will activate accounts that are on hold for registartion. Accounts on hold for registration exist for one hour before they are deleted.",
                "responses": {
                    "200": {
                        "description": "A simple string with the user's username.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InvalidRegistrationError": {
                        "$ref": "#/responses/InvalidRegistration"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    }
                },
                "parameters": [
                    {
                        "description": "A user's username.",
                        "in": "path",
                        "name": "username",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "maxLength": 20,
                            "pattern": "^[a-zA-Z0-9_]+$"
                        }
                    },
                    {
                        "description": "User's unique registration key.",
                        "in": "path",
                        "name": "registrationKey",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-f0-9]+$"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        },
        "/user-register-submit": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "description": "This link is used when users register. After a valid request is submitted, a temporary account is stored on the server for one hour. If the user fails to register before the alotted time the account is deleted, otherwise the user is registered and the temporary account removed.",
                "responses": {
                    "200": {
                        "description": "The temp user account has been created and the user sent an email at the address they specified.",
                        "schema": {
                            "$ref": "#/definitions/successResponseString"
                        }
                    },
                    "InvalidParametersError": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InvalidRegistrationError": {
                        "$ref": "#/responses/InvalidRegistration"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
                    },
                    "UsernameOrEmailTakenError": {
                        "$ref": "#/definitions/UsernameOrEmailTaken"
                    }
                },
                "parameters": [
                    {
                        "description": "A username selected by the user.",
                        "in": "body",
                        "name": "username",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+$",
                            "maxLength": 20
                        }
                    },
                    {
                        "description": "The email address of a user trying to register.",
                        "in": "body",
                        "name": "email",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "email"
                        }
                    },
                    {
                        "description": "A user's password.",
                        "in": "body",
                        "name": "password",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+$",
                            "minLength": 8,
                            "maxLength": 20
                        }
                    },
                    {
                        "description": "The reCaptcha response a user receieves after verification.",
                        "in": "body",
                        "name": "captcha",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "produces": [
                    "application/json"
                ]
            }
        }
    },
    "produces": [
        "application/json"
    ],
    "responses": {
        "AlreadyActiveSession": {
            "description": "Someone attempted to create a session over an already active sesison",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "AlreadyFavouritedGraffiti": {
            "description": "Someone tried to favourtie a graffiti more than once.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "AlreadyRatedGraffiti": {
            "description": "Someone tried to reassign the same rating to a graffiti.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "GraffitiAlreadyRegistered": {
            "description": "Someone attempted to resubmit a graffiti",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "GraffitiDoesNotExist": {
            "description": "Someone attempted to query a graffiti tag that doesn't exist",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "GraffitiNotFavourited": {
            "description": "Someone attempted to do something with a graffiti not found on the user's graffiti list.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "InternalServerError": {
            "description": "An internal server error occured.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "InvalidCredentials": {
            "description": "Someone attempted to login with invalid credentials",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "InvalidRegistration": {
            "description": "Someone attempted to register with invalid credentials",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "InvalidParameters": {
            "description": "A request is made with invalid parameters",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "InvalidSubmission": {
            "description": "Someone attempted to make an invalid new Graffiti submission",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "MaxSubmissionsExceeded": {
            "description": "A user has made too many submissions in a day",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "MissingParamater": {
            "description": "A parameter is missing from an API call",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "NoActiveSession": {
            "description": "A call was made requiring an active session when none was found.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "NoGraffitiFound": {
            "description": "A call to query graffiti returned nothing.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "SessionLockout": {
            "description": "A user has been locked out for attempting to login to many times. This should only be triggered after a client fails to sign on over 1000 times",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "UsernameOrEmailTaken": {
            "description": "Someone tried to register with a taken username or email",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "UserNotFound": {
            "description": "A query searching for a user returned nothing.",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        }
    },
    "schems": [
        "http",
        "https"
    ],
    "swagger": "2.0"
}
