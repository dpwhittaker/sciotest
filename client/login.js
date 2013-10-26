Template.loggedIn.events({
  "click .signOut": function(event) {
    Meteor.logout();
  }
});
Template.loggedOut.events({
  "click .signIn, submit form": function(event) {
    event.stopPropagation();
    event.preventDefault();
    var self = this;
    Meteor.loginWithPassword(this.$(".username").val(), this.$(".password").val(), function(err) {
      if (!err) return;
      if (/user/i.test(err.reason)) self.$(".username").parent().addClass("has-error");
      if (/pass/i.test(err.reason)) self.$(".password").parent().addClass("has-error");
      console.log(err);
    });
  },
  "click .forgotPassword": function(event) {
    event.stopPropagation();
    event.preventDefault();
    try {
      Accounts.forgotPassword({email: this.$(".username").val()}, function(err) {
        if (!err) {
          this.$(".forgotPassword").text("Email Sent!").attr("disabled", "disabled");
          return;
        }
        this.$(".username").parent().addClass("has-error");
        console.log(e);
      });
    } catch (e) {
      this.$(".username").parent().addClass("has-error");
      console.log(e);
    }
  },
  "keydown input": function(event) {
    $(event.target).parent().removeClass("has-error");
  }
});