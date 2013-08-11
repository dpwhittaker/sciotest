Template.navbar.navbarItems = function() {
  var user = Meteor.user();
  if (user === null) {
    return [{
      route: "/signUp",
      template: "signUp",
      title: "Sign Up!"
    }]
  } else {
    return [{
      route: "/profile",
      template: "profile",
      title: "Profile"
    },{
      route: "/classes",
      template: "classes",
      title: "Classes"
    }]
  }
};

Template.navbar.isActive = function() {
  if (Meteor.Router.page() == this.template) return "active";
  return "";
};

Meteor.Router.add({
  "/signUp": "signUp",
  "/profile": "profile",
  "/classes": "classes",
  "/": "home"
});

