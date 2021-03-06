/**
 * @author Michael Mitchell-Halter
 */

import { UserRateAPI } from "./user-rate-api";

describe("UserRateAPI", () => {
    const userRateAPI = new UserRateAPI();

    it("should reject user-rate calls that aren't made with POST", () => {
        const input = {
            id: "deadbeef",
        };

        try {
            userRateAPI.validateParams(userRateAPI.USER_RATE, input, "get");
        } catch (e) {
            expect(e.name).toEqual(userRateAPI.METHOD_ERROR);
        }
    });

    it("should reject a call to user-rate without parameters", () => {
        try {
            userRateAPI.validateParams(userRateAPI.USER_RATE, {}, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRateAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to user-rate without a graffiti ID", () => {
        const input = {
            rating: true,
        };

        try {
            userRateAPI.validateParams(userRateAPI.USER_RATE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRateAPI.MISSING_PARAMETER_ERROR);
        }
    });

    it("should reject a call to user-rate with an id that is not a string", () => {
        const input = {
            id: {},
            rating: true,
        };

        try {
            userRateAPI.validateParams(userRateAPI.USER_RATE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRateAPI.PARAMETER_TYPE_ERROR);
        }
    });

    it("should reject a call to user-rate with an id that is not alphanumeric", () => {
        const input = {
            id: "!!!!!!",
            rating: true,
        };

        try {
            userRateAPI.validateParams(userRateAPI.USER_RATE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRateAPI.PARAMETER_REGEX_ERROR);
        }
    });

    it("should reject a call to user-rate with a rating that is not a boolean", () => {
        const input = {
            id: "deadbeef",
            rating: "false",
        };

        try {
            userRateAPI.validateParams(userRateAPI.USER_RATE, input, "post");
            expect(true).toBe(false);
        } catch (e) {
            expect(e.name).toEqual(userRateAPI.PARAMETER_TYPE_ERROR);
        }
    });

});
