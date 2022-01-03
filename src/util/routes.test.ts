import Routes from "./routes";

test("Check routes", () => {
  expect(Routes.auth({ refreshToken: "" }).method).toBe("POST");
  expect(Routes.auth({ refreshToken: "" }).needsAuth).toBe(false);
  expect(
    Routes.registerUser({ registerToken: "", username: "", password: "" })
      .needsAuth
  ).toBe(false);
  expect(
    Routes.registerUser({ registerToken: "", username: "", password: "" })
      .method
  ).toBe("POST");
  expect(Routes.login({ password: "", username: "" }).route).toBe("/api/login");
  expect(Routes.login({ password: "", username: "" }).needsAuth).toBe(false);
  expect(Routes.getExercises().method).toBe("GET");
  expect(Routes.getExercises().needsAuth).toBe(true);
  expect(
    Routes.createUser({ email: "", firstName: "", lastName: "" }).needsAuth
  ).toBe(true);
  expect(
    Routes.createUser({ email: "", firstName: "", lastName: "" }).method
  ).toBe("POST");
  expect(Routes.assignPlanToUser({ username: "", planId: "" }).needsAuth).toBe(
    true
  );
  expect(Routes.assignPlanToUser({ username: "", planId: "" }).method).toBe(
    "POST"
  );
  expect(Routes.deleteAccount().method).toBe("POST");
  expect(Routes.deleteAccount().needsAuth).toBe(true);
  expect(Routes.deleteTrainingPlan({ planId: "" }).needsAuth).toBe(true);
  expect(Routes.deleteTrainingPlan({ planId: "" }).method).toBe("POST");
  expect(Routes.getExercise({ id: "" }).method).toBe("POST");
  expect(Routes.getExercise({ id: "" }).needsAuth).toBe(true);
  expect(Routes.getAssignedPlanOfUser({ username: "" }).needsAuth).toBe(true);
  expect(Routes.getAssignedPlanOfUser({ username: "" }).method).toBe("POST");
  expect(Routes.getAssignedPlans().needsAuth).toBe(true);
  expect(Routes.getAssignedPlans().method).toBe("POST");
  expect(Routes.getTrainingPlan({ planId: "" }).method).toBe("POST");
  expect(Routes.getTrainingPlan({ planId: "" }).needsAuth).toBe(true);
  expect(Routes.getTrainingPlans().needsAuth).toBe(true);
  expect(Routes.getTrainingPlans().method).toBe("GET");
  expect(
    Routes.saveTrainingPlan({
      id: 0,
      exercise: [{ id: 0, date: "", sets: 1, repeats_per_set: 1 }],
      name: "",
    }).method
  ).toBe("POST");
  expect(
    Routes.saveTrainingPlan({
      id: 0,
      exercise: [{ id: 0, date: "", sets: 1, repeats_per_set: 1 }],
      name: "",
    }).needsAuth
  ).toBe(true);
});
