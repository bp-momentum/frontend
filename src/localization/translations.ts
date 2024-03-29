/**
 * Contains all keys of the translation files ordered by their belonging.
 */
const Translations = {
  errors: {
    unknownError: "errors.unknown-error",
    internalServerError: "errors.internal-server-error",
    loggedOut: "errors.logged-out",
    empty: "errors.empty",
  },
  common: {
    confirmLeave: "common.confirm-leave",
    confirmLeaveProgress: "common.confirm-leave-progress",
    confirmLeaveChanges: "common.confirm-leave-changes",
  },
  user: {
    username: "user.username",
    password: "user.password",
    firstName: "user.first-name",
    lastName: "user.last-name",
    email: "user.email",
    user: "user.user",
    trainer: "user.trainer",
    admin: "user.admin",
  },
  login: {
    welcome: "login.welcome",
    enterCredentials: "login.enter-credentials",
    rememberMe: "login.remember-me",
    login: "login.login",
    enterUsername: "login.enter-username",
    enterPassword: "login.enter-password",
    enterEmail: "login.enter-email",
    enterValidEmail: "login.enter-valid-email",
    back: "login.back",
    reset: "login.reset",
    forgotPassword: "login.forgot-password",
  },
  autoLogin: {
    signingIn: "auto-login.signing-in",
  },
  createUser: {
    create: "create-user.create",
    title: "create-user.title",
    subtitle: "create-user.subtitle",
    successfullyCreatedUser: "create-user.successfully-created-user",
    enterFirstName: "create-user.enter-first-name",
    enterLastName: "create-user.enter-last-name",
    enterEmail: "create-user.enter-email",
  },
  register: {
    title: "register.title",
    subtitle: "register.subtitle",
    passwordsDontMatch: "register.passwords-dont-match",
    chooseUsername: "register.choose-username",
    enterPassword: "register.enter-password",
    repeatPassword: "register.repeat-password",
    register: "register.register",
  },
  resetPw: {
    title: "reset-pw.title",
    subtitle: "reset-pw.subtitle",
    passwordsDontMatch: "reset-pw.passwords-dont-match",
    oldPassword: "reset-pw.old-password",
    newPassword: "reset-pw.new-password",
    enterPassword: "reset-pw.enter-password",
    repeatPassword: "reset-pw.repeat-password",
    submit: "reset-pw.submit",
    error: "reset-pw.error",
    success: "reset-pw.success",
  },
  home: {
    youAre: "home.you-are",
    logout: "home.logout",
    createUser: "home.create-user",
    welcome: "home.welcome",
    faq: "home.frequently-asked-questions",
  },
  tabBar: {
    home: "tab-bar.home",
    settings: "tab-bar.settings",
    overview: "tab-bar.overview",
    statistics: "tab-bar.statistics",
    profile: "tab-bar.profile",
    user: "tab-bar.user",
    plans: "tab-bar.plans",
    manage: "tab-bar.manage",
    logout: "tab-bar.logout",
    confirmLogout: "tab-bar.confirm-logout",
    confirmLogoutContent: "tab-bar.confirm-logout-content",
  },
  settings: {
    accountSettings: "settings.account-settings",
    changeLanguage: "settings.change-language",
    logout: "settings.logout",
    dangerZone: "settings.danger-zone",
    security: "settings.security",
    deleteAccount: "settings.delete-account",
    deleteModalTitle: "settings.delete-modal-title",
    deleteModalMessage: "settings.delete-modal-msg",
    deleteModalConfirm: "settings.delete-modal-confirm",
    deleteModalCancel: "settings.delete-modal-cancel",
    successfullyDeletedAccount: "settings.successfully-deleted-account",
    changePassword: {
      buttonTitle: "settings.change-password.button-title",
      title: "settings.change-password.title",
      subtitle: "settings.change-password.subtitle",
      samePassword: "settings.change-password.same-password",
      currentPassword: "settings.change-password.password",
      newPassword: "settings.change-password.new-password",
      newPasswordRepeat: "settings.change-password.new-password-repeat",
      enterPassword: "settings.change-password.enter-password",
      enterNewPassword: "settings.change-password.enter-new-password",
      enterNewPasswordRepeat:
        "settings.change-password.enter-new-password-repeat",
      submit: "settings.change-password.submit",
      success: "settings.change-password.success",
    },
  },
  planManager: {
    newPlan: "plan-manager.new-plan",
    loading: "plan-manager.loading",
    error: "plan-manager.error",
  },
  planEditor: {
    unnamed: "plan-editor.unnamed",
    exercises: "plan-editor.exercises",
    addExercise: "plan-editor.add-exercise",
    deleteExercise: "plan-editor.delete-exercise",
    deletePlanConfirm: "plan-editor.delete-plan-confirm",
    deletePlanDescription: "plan-editor.delete-plan-description",
    savePlanMissingName: "plan-editor.save-plan-missing-name",
    saveSuccess: "plan-editor.save-success",
    saveError: "plan-editor.save-error",
    deleteSuccess: "plan-editor.delete-success",
    deleteError: "plan-editor.delete-error",
    cardTooltipRepeats: "plan-editor.card-tooltip-repeats",
    cardTooltipSets: "plan-editor.card-tooltip-sets",
  },
  weekdays: {
    monday: "weekdays.monday",
    tuesday: "weekdays.tuesday",
    wednesday: "weekdays.wednesday",
    thursday: "weekdays.thursday",
    friday: "weekdays.friday",
    saturday: "weekdays.saturday",
    sunday: "weekdays.sunday",
  },
  confirm: {
    yes: "confirm.yes",
    no: "confirm.no",
    save: "confirm.save",
    cancel: "confirm.cancel",
    delete: "confirm.delete",
  },
  exercises: {
    noExercises: "exercises.no-exercises",
    nextExercise: "exercises.next-exercise",
    dayOff: "exercises.day-off",
    motivation: "exercises.motivation",
    loading: "exercises.loading",
    noPlan: "exercises.no-plan",
  },
  userManagement: {
    users: "user-management.users",
    trainers: "user-management.trainers",
    active: "user-management.active",
    invited: "user-management.invited",
    invite: "user-management.invite",
    trainerDeleted: "user-management.trainer-deleted",
    userDeleted: "user-management.user-deleted",
    name: "user-management.name",
    email: "user-management.email",
    manage: "user-management.manage",
    deleteTrainerConfirm: "user-management.delete-trainer-confirm",
    deleteUserConfirm: "user-management.delete-user-confirm",
    trainingPlan: "user-management.training-plan",
    selectPlan: "user-management.select-plan",
    activity: "user-management.activity",
    canceledInvite: "user-management.canceled-invite",
    revoke: "user-management.revoke",
    cancelInviteConfirm: "user-management.cancel-invite-confirm",
    search: "user-management.search",
    reset: "user-management.reset",
    SearchName: "user-management.search-name",
    SearchEmail: "user-management.search-email",
    lastLogin: "user-management.last-login",
    noEmail: "user-management.no-email",
    never: "user-management.never",
  },
  profile: {
    activeSince: "profile.activeSince",
    activeShortly: "profile.activeShortly",
    edit: "profile.edit",
    save: "profile.save",
    cancel: "profile.cancel",
    motivation: "profile.motivation",
    chooseDate: "profile.chooseDate",
    activeMinutes: "profile.activeMinutes",
    selectNewAvatar: "profile.selectNewAvatar",
    loading: "profile.loading",
    points: "profile.points",
    usernameEmpty: "profile.username-empty",
    usernameTooLong: "profile.username-too-long",
    usernameNotAllowed: "profile.username-not-allowed",
  },
  errorPage: {
    err404Text: "error-page.404-text",
    err418Text: "error-page.418-text",
  },
  training: {
    instructions: "training.instructions",
    stats: "training.stats",
    score: "training.score",
    todo: "training.todo",
    tip: "training.tip",
    set: "training.set",
    remainingSets: "training.remaining-sets",
    nextSet: "training.next-set",
    intensity: "training.intensity",
    accuracy: "training.accuracy",
    speed: "training.speed",
    scoreShort: "training.score-short",
    currentSet: "training.current-set",
    backHome: "training.back-home",
    clickToStart: "training.click-to-start",
    mascotText: "training.mascot-text",
  },
  adminFAQs: {
    afaq01: {
      question: "admin-faq.q-01",
      answer: "admin-faq.a-01",
    },
    afaq02: {
      question: "admin-faq.q-02",
      answer: "admin-faq.a-02",
    },
    afaq03: {
      question: "admin-faq.q-03",
      answer: "admin-faq.a-03",
    },
  },
  trainerFAQs: {
    tfaq01: {
      question: "trainer-faq.q-01",
      answer: "trainer-faq.a-01",
    },
    tfaq02: {
      question: "trainer-faq.q-02",
      answer: "trainer-faq.a-02",
    },
    tfaq03: {
      question: "trainer-faq.q-03",
      answer: "trainer-faq.a-03",
    },
    tfaq04: {
      question: "trainer-faq.q-04",
      answer: "trainer-faq.a-04",
    },
    tfaq05: {
      question: "trainer-faq.q-05",
      answer: "trainer-faq.a-05",
    },
    tfaq06: {
      question: "trainer-faq.q-06",
      answer: "trainer-faq.a-06",
    },
  },
};

export default Translations;
