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
    paths: {[path: string]: any},
    definitions?: any,
    parameters?: any,
    responses?: any,
    securityDefinitions?: any,
    security?: any[],
    tags?: any[],
    externalDocs?:any,
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
        "successResponseString": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "string"
                }
            }
        },
        "successResponseArray": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "array"
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
                    "InvalidParameters": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
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
                    "InvalidParameters": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InvalidRegistration": {
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
                    "InvalidParameters": {
                        "$ref": "#/responses/InvalidParameters"
                    },
                    "InvalidRegistration": {
                        "$ref": "#/responses/InvalidRegistration"
                    },
                    "InternalServerError": {
                        "$ref": "#/responses/InternalServerError"
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
        "MissingParamater": {
            "description": "A parameter is missing from an API call",
            "schema": {
                "$ref": "#/definitions/errorResponse"
            }
        },
        "NoActiveSession": {
            "description": "An call was made requiring an active session when none was found.",
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
    "schemes": [
        "http",
        "https"
    ],
    "swagger": "2.0"
}