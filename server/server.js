Meteor.startup(function () {
  Accounts.config({sendVerificationEmail: true});
});

Accounts.validateNewUser(function(user) {
  if (user.profile.firstName == "") throw new Meteor.Error("First Name is required.");
  if (user.profile.lastName == "") throw new Meteor.Error("Last Name is required.");
  if (Schools.find({_id: user.profile.school}).count() == 0) throw new Meteor.Error("Select a school.");
  if (user.profile.userType != 'student' && user.profile.userType  != 'unverified-teacher') throw new Meteor.Error("Invalid user type");
  return true;
});