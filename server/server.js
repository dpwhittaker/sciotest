Meteor.startup(function () {
  // code to run on server at startup
});

Accounts.validateNewUser(function(user) {
  if (user.profile.firstName == "") throw new Meteor.Error("First Name is required.");
  if (user.profile.lastName == "") throw new Meteor.Error("Last Name is required.");
  if (Schools.count({_id: user.profile.school}) == 0) throw new Meteor.Error("Select a school.");
  if (user.profile.userType != 'student' && user.profile.userType  != 'unverified-teacher') throw new Meteor.Error("Invalid user type");
  if (!/^[a-zA-Z0-9`~!@#$%^&*()_+\[\]{}\\|;:'"\/?.,><]+$/.test(user.password) ||
      !/[a-zA-Z]/.test(user.password) || !/[0-9]/.test(user.password) || user.password.length < 8)
    throw new Meteor.Error("Password must contain at least one letter, one number, and be at least 8 characters long.");
});