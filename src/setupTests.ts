import "@testing-library/jest-dom";
import nock from "nock";
import config from "@config";

jest.setTimeout(20000);

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

// Test API responses
nock(config.backendUrl)
  .persist()
  .defaultReplyHeaders({
    "access-control-allow-origin": "*",
    "access-control-allow-credentials": "true",
  })
  .options(/.*/)
  .reply(200, undefined, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Session-Token",
    "Content-Type": "application:json",
  })
  .get("/api/getlistofplans")
  .reply(200, {
    success: true,
    data: { plans: [{ id: 1, name: "Test Plan" }] },
  })
  .get("/api/getexerciselist")
  .reply(200, {
    success: true,
    data: { exercises: [{ id: 1, title: "Test Exercise" }] },
  })
  .get("/api/getdoneexercises")
  .reply(200, {
    success: true,
    data: {
      exercises: [
        { id: 1, sets: 2, repeats_per_set: 3, date: "monday", done: false },
        { id: 1, sets: 2, repeats_per_set: 3, date: "tuesday", done: false },
        { id: 1, sets: 2, repeats_per_set: 3, date: "wednesday", done: false },
        { id: 1, sets: 2, repeats_per_set: 3, date: "thursday", done: false },
        { id: 1, sets: 2, repeats_per_set: 3, date: "friday", done: false },
        { id: 1, sets: 2, repeats_per_set: 3, date: "saturday", done: false },
        { id: 1, sets: 2, repeats_per_set: 3, date: "sunday", done: false },
      ],
    },
  })
  .post("/api/getexercise")
  .reply(200, {
    success: true,
    data: {
      description: "This description",
      title: "Test Exercise",
      activated: true,
      video: "Test Video",
    },
  })
  .post("/api/listleaderboard")
  .reply(200, {
    success: true,
    data: {
      leaderboard: [
        {
          rank: 1,
          username: "UserA",
          score: 1000,
          speed: 1,
          intensity: 1,
          cleanliness: 1,
        },
        {
          rank: 2,
          username: "UserB",
          score: 100,
          speed: 1,
          intensity: 1,
          cleanliness: 1,
        },
        {
          rank: 3,
          username: "UserC",
          score: 10,
          speed: 1,
          intensity: 1,
          cleanliness: 1,
        },
      ],
    },
  })
  .get("/api/getprofile")
  .reply(200, {
    success: true,
    data: {
      motivation: "Test",
      avatar: 1,
      first_login: 0,
    },
  })
  .get("/api/gettrainercontact")
  .reply(200, {
    success: true,
    data: {
      address: "None",
      telephone: "0123",
      email: "",
      name: "",
    },
  })
  .get("/api/getdoneexercises")
  .reply(200, {
    success: true,
    data: {
      exercises: [
        {
          id: 1,
          date: 0,
          done: true,
          sets: 1,
          repeats_per_set: 1,
          exercise_plan_id: 1,
        },
      ],
    },
  })
  .post("/api/getdoneexercisesinmonth")
  .reply(200, {
    success: true,
    data: {
      done: [
        {
          exercise_plan_id: 0,
          id: 0,
          data: 0,
          points: 0,
        },
      ],
    },
  })
  .get("/api/getfriendrequests")
  .reply(200, {
    success: true,
    data: {
      requests: [],
    },
  })
  .post("/api/getuserlevel")
  .reply(200, {
    success: true,
    data: {
      level: 0,
      progress: "1/1",
    },
  });
