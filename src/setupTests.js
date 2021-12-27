import "@testing-library/jest-dom";
import nock from "nock";
import api from "./util/api";

jest.setTimeout(20000);

global.matchMedia = global.matchMedia || function () {
  return {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// Test API responses
nock(api.serverUrl)
  .persist()
  .defaultReplyHeaders({
    "access-control-allow-origin": "*",
    "access-control-allow-credentials": "true"
  })
  .options(/.*/)
  .reply(200, undefined, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Session-Token",
    "Content-Type": "application:json"
  })
  .get("/api/getlistofplans")
  .reply(200, {
    success: true,
    data: { plans: [{id: 1, name: "Test Plan"}] },
  })
  .get("/api/getexerciselist")
  .reply(200, {
    success: true,
    data: { exercises: [{id: 1, title: "Test Exercise"}] }
  })
  .post("/api/requestplanofuser")
  .reply(200, {
    success: true,
    data: { exercises: [{id: 1, sets: 2, repeats_per_set: 3, date: "monday"}] }
  })
  .post("/api/getexercise")
  .reply(200, {
    success: true,
    data: { description: "This description", title: "Test Exercise", activated: true, video: "Test Video" }
  })
;