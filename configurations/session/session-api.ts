import { CoSAPI } from "../cos-api";

// As of May 30, 2017 there is still no standardized way of importing JSON with
// an 'import' statement.
/* tslint:disable:no-var-requires */
const swaggerAPI = require("../cos-swagger.json");
/* tslint:enable:no-var-requires */

/**
 * Use this class to enforce the schema definitions assigned to session related
 * tasks.
 */
export class SessionAPI extends CoSAPI {

    public readonly SESSION_CREATE_USER_PATH: string = "/session-create-user";
    public readonly SESSION_END_USER_PATH: string = "/session-end-user";
    public readonly SESSION_VERIFY_USER_PATH: string = "/session-verify-user";
    public readonly SESSION_PARAM_ERROR: string = "SessionParamError";

    private readonly SESSION_CREATE_USER_PATH_PARAMS: object[] =
        swaggerAPI.paths[this.SESSION_CREATE_USER_PATH].post.parameters;

    private readonly PATH_PARAMETER_MAP: {[path: string]: object[]} = {
        "/session-create-user" : this.SESSION_CREATE_USER_PATH_PARAMS,
    };

    /**
     * Use this to verify all params given to SESSION_CREATE_USER_PATH as per
     * CoS schema.
     *
     * @param input - The object to be validated.
     * @param schema - The schema to validate the object against.
     */
    public validateParams(path: string,
                          inputParams: { [index: string]: string | number | object | any[]; }): void {
        if (!this.PATH_PARAMETER_MAP[path]) {
            const error = Error("This path doesn't accept parameters.");
            error.name = this.SESSION_PARAM_ERROR;
            throw error;
        }
        try {
            this.validate(inputParams, this.PATH_PARAMETER_MAP[path]);
        } catch (error) {
            throw error;
        }
    }

}