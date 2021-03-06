/**
 * @author Michael Mitchell-Halter
 */

import { async, inject, TestBed } from "@angular/core/testing";
import { HttpModule, Response, ResponseOptions, XHRBackend } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { SubjectSubscription } from "rxjs/SubjectSubscription";
import { ISessionDetails, SessionService } from "./session.service";

let emitterSubscription: SubjectSubscription<ISessionDetails>;

const sessionEndEventCallback: Observer<ISessionDetails> = {
    complete: null,
    error: null,
    next: (details) => {
        expect(details.email).toBeFalsy();
        expect(details.error).toBeFalsy();

        // Ensure that sesison is terminated
        expect(SessionService.isSessionActive()).toBe(false);

        // Have this observer remove itself
        const index = SessionService.sessionStatusEmitter.observers.indexOf(sessionEndEventCallback);
        SessionService.sessionStatusEmitter.observers.splice(index, 1);
        emitterSubscription.unsubscribe();
    },

};

const sessionStartEventCallback: Observer<ISessionDetails> = {
    complete: null,
    error: null,
    next: (details) => {
        expect(details.email).toBeTruthy();
        expect(details.error).toBeFalsy();

        // Ensure that sesison is initialized
        expect(SessionService.isSessionActive()).toBe(true);

        // Have this observer remove itself
        const index = SessionService.sessionStatusEmitter.observers.indexOf(sessionStartEventCallback);
        SessionService.sessionStatusEmitter.observers.splice(index, 1);
        emitterSubscription.unsubscribe();
    },
};

const serverErrorCallback: Observer<ISessionDetails> = {
    complete: null,
    error: null,
    next: (details) => {
        expect(details.email).toBeFalsy();
        expect(details.error).toBeTruthy();

        // Have this observer remove itself
        const index = SessionService.sessionStatusEmitter.observers.indexOf(serverErrorCallback);
        SessionService.sessionStatusEmitter.observers.splice(index, 1);
        emitterSubscription.unsubscribe();

    },
};

describe("SessionService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                SessionService,
                { provide: XHRBackend, useClass: MockBackend }],
        });
    });

    it("should broadcast session status after checking when a user is logged in", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                sessionStartEventCallback);

            SessionService.sessionStatusEmitter.subscribe(sessionStartEventCallback);

            const mockResponse = {
                result: "test@test.com",
            };

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse),
                })));
            });

            sessionService.checkUserIsActive();

        })));

    it("should broadcast session status after checking when a user is logged out", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                serverErrorCallback);

            SessionService.sessionStatusEmitter.subscribe(serverErrorCallback);

            const mockResponse = {
                error: {
                    message: "There is no session",
                },
            };

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse),
                })));
            });

            sessionService.checkUserIsActive();

        })));

    it("should be able to broadcast session change after starting a new session", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                sessionStartEventCallback);

            SessionService.sessionStatusEmitter.subscribe(sessionStartEventCallback);

            const mockResponse = JSON.stringify({
                result: "test@test.com",
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            sessionService.beginSession("test@test.com", "password").then((result: any) => {
                // Promise should resolve to true for components that run on
                // login conditionals.
                expect(result.result).toBe(JSON.parse(mockResponse).result);
            });

        })));

    it("should be able to broadcast session change after ending session", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                sessionEndEventCallback);

            SessionService.sessionStatusEmitter.subscribe(sessionEndEventCallback);

            const mockResponse = JSON.stringify({
                result: "test@test.com",
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            sessionService.endSession();

        })));

    it("shouldn't be able to start a new session if one is still active", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            // Try to create two sessions. The first should be successful but
            // attempting a second time should end without an HTTP call.
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                sessionStartEventCallback);

            SessionService.sessionStatusEmitter.subscribe(sessionStartEventCallback);

            const mockResponse = {
                result: "test@test.com",
            };

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse),
                })));
            });

            sessionService.beginSession("test@test.com", "password").then(() => {
                mockBackend.connections.subscribe((connection: any) => {
                    // Should not make HTTP calls when there is an active session.
                    expect(true).toBe(false);
                });
                sessionService.beginSession("test@test.com", "password");
            });
        })));

    it("should broadcast server errors when checking if session is active", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                serverErrorCallback);

            SessionService.sessionStatusEmitter.subscribe(serverErrorCallback);

            const mockResponse = JSON.stringify({
                error: {
                    message: "Test error.",
                },
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            sessionService.checkUserIsActive();

        })));

    it("should broadcast server errors when trying to start a new session", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                serverErrorCallback);

            SessionService.sessionStatusEmitter.subscribe(serverErrorCallback);

            const mockResponse = JSON.stringify({
                error: {
                    message: "Test error.",
                },
            });

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.parse(mockResponse),
                })));
            });

            sessionService.beginSession("test@test.com", "password").then((result: any) => {
                // Need to be sure that components relying on this resolution
                // get the correct response.
                expect(result.error.message).toBe(JSON.parse(mockResponse).error.message);
            });

        })));

    it("should broadcast server errors when trying to end a session", async(
        inject([SessionService, XHRBackend], (sessionService: SessionService, mockBackend: MockBackend) => {
            emitterSubscription = new SubjectSubscription(SessionService.sessionStatusEmitter,
                serverErrorCallback);

            SessionService.sessionStatusEmitter.subscribe(serverErrorCallback);

            const mockResponse = {
                error: {
                    message: "Test error.",
                },
            };

            mockBackend.connections.subscribe((connection: any) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse),
                })));
            });

            sessionService.endSession();

        })));
});
