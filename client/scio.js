Template.navbar.navbarItems = function() {
  var user = Meteor.user();
  if (!user)
    return [{route: "/signUp", template: "signUp", title: "Sign Up!"}]
  else if (user.profile.userType === "teacher")
    return [
      {route: "/classes", template: "teacherClasses", title: "Classes"},
      {route: "/assignments", template: "teacherAssignments", title: "Assignments"},
      {route: "/questions", template: "teacherQuestions", title: "Questions"},
      {route: "/profile", template: "profile", title: "Profile"}
    ];
  else //student
    return [
      {route: "/classes", template: "studentClasses", title: "Classes"},
      {route: "/assignments", template: "studentAssignments", title: "Assignments"},
      {route: "/profile", template: "profile", title: "Profile"}
    ];
};

Template.navbar.isActive = function() {
  if (Meteor.Router.page() == this.template) return "active";
  return "";
};

Meteor.Router.add({
  "/signUp": "signUp",
  "/profile": "profile",
  "/classes": {as: "classes", to: function() {
    if (/teacher/.test(Meteor.user().profile.userType))
      return "teacherClasses";
    else
      return "studentClasses";
  }},
  "/assignments": {as: "assignments", to: function() {
    if (/teacher/.test(Meteor.user().profile.userType))
      return "teacherAssignments";
    else
      return "studentAssignments";
  }},
  "/questions": "questions",
  "/": "home"
});

Meteor.Router.filters({
  'checkLoggedIn': function(page) {
    if (Meteor.loggingIn()) return 'loading';
    else if (Meteor.user()) return page;
    else return 'home';
  },
  'checkTeacher': function(page) {
    if (Meteor.loggingIn() || !Meteor.user() || Meteor.user().profile.userType == "student")
      return "home";
    else
      return page;
  }
});

Meteor.Router.filter('checkLoggedIn', {except: ['home', 'signUp'] });
Meteor.Router.filter('checkTeacher', {only: ['questions']});
