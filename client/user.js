function validate(target, isValid) {
  var validateItem = target.closest(".validate-item");
  var form = target.closest("form");
  $('.alert-info', form).hide();
  if (isValid) {
    target.closest(".validate-item").removeClass("has-error");
    if ($('.has-error', form).length == 0) $('button', form).prop("disabled", false);
  } else {
    validateItem.addClass("has-error");
    $("button", form).prop("disabled", true);
  }  
}

var defaultEvents = {
  'click .close': function(event) {
    $(event.target).parent().hide();
  },
  'keyup input.non-empty': function(event) {
    var target = $(event.target);
    validate(target, target.val() !== "");
  },
  'keyup #userName': function(event) {
    var target = $(event.target);
    validate(target, /^[a-zA-Z0-9_]*$/.test(target.val()));
  },
  'keyup #email': function(event) {
    var target = $(event.target);
    validate(target, /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(target.val()));
  },
  'keyup #password, keyup #oldPassword': function(event) {
    var target = $(event.target);
    validate(target, /^[a-zA-Z0-9`~!@#$%^&*()_+\[\]{}\\|;:'"\/?.,><]+$/.test(target.val()) &&
      /[a-zA-Z]/.test(target.val()) && /[0-9]/.test(target.val()) && target.val().length >= 8);
  },
  'keyup #confirmpass': function(event) {
    validate($('#confirmpass'), $('#confirmpass').val() === $('#password').val());
  },
  'change input[type=radio]': function(event) {
    validate($(event.target), true);
  }
};

Template.signUp.events(defaultEvents);
Template.profile.events(defaultEvents);

Template.signUp.events({
  'click #signUp, submit form': function(event) {
    event.stopPropagation();
    event.preventDefault();
    $('#signUp').prop("disabled", true);
    Accounts.createUser({
      username: $('#userName').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        school: Template.schoolRow.selectedSchool._id,
        userType: $('input[name=userType]:checked').val()
      }
    }, function(err) {
      if (err) {
        $('#errorMessage').parent().show();
        $('#errorMessage').html(err.message);
      }
      else
        Meteor.Router.to('/');
    });
  }
});

Template.profile.events({
  'click #update, submit #profileForm': function(event) {
    event.stopPropagation();
    event.preventDefault();
    $('#update').prop("disabled", true);
    if ($('#updateForm .has-error').length > 0) return;
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: {
        profile: {
          firstName: $('#firstName').val(),
          lastName: $('#lastName').val(),
          school: Template.schoolRow.selectedSchool._id,
          userType: $('input[name=userType]:checked').val()
        }
      }
    }, function (err) {
      if (err) {
        $('#profileForm .alert').removeClass('alert-info').addClass('alert-danger').show().find('strong').text('Error!');
        $('#profileForm .alert span').text(err.message);
      } else {
        $('#profileForm .alert').removeClass('alert-danger').addClass('alert-info').show().find('strong').text('Success!');
        $('#profileForm .alert span').text("Profile updated!");
      }
    });
  },
  'click #changePassword, submit #changePasswordForm': function(event) {
    event.stopPropagation();
    event.preventDefault();
    $('#changePassword').prop("disabled", true);
    if ($('#changePasswordForm .has-error').length > 0) return;
    Accounts.changePassword($('#oldPassword').val(), $('#password').val(), function(err) {
      if (err) {
        $('#changePasswordForm .alert').removeClass('alert-info').addClass('alert-danger').show().find('strong').text('Error!');
        $('#changePasswordForm .alert span').text(err.message);
      } else {
        $('#changePasswordForm .alert').removeClass('alert-danger').addClass('alert-info').show().find('strong').text('Success!');
        $('#changePasswordForm .alert span').text("Password changed!");
      }
    });
  }
});

Template.schoolRow.rendered = function() {
  var schoolTypeahead = $(this.find('input[name="school"]')).typeahead({
    name: "schools",
    valueKey: "SchoolName",
    local: Schools.find({},{State:1, SchoolName:1, SystemName:1}).fetch(),
    template: Template.schoolTypeahead
  });
  $(this.find('.twitter-typeahead')).css({display: "block"});
  
  schoolTypeahead.on('typeahead:selected typeahead:autocompleted', function(obj, datum) {
    Template.schoolRow.selectedSchool = datum;
    validate(schoolTypeahead, true);
  });
  schoolTypeahead.on('keyup', function(event) {
    if (!Template.schoolRow.selectedSchool || Template.schoolRow.selectedSchool.SchoolName != schoolTypeahead.val()) {
      Template.schoolRow.selectedSchool = null;
      validate(schoolTypeahead, false);
    }
  });

  if (Meteor.user()) {
    Template.schoolRow.selectedSchool = Schools.findOne({_id: Meteor.user().profile.school});
    schoolTypeahead.typeahead('setQuery', Template.schoolRow.selectedSchool.SchoolName);
  }
};

Template.schoolRow.helpers({
  isStudent: function() {
    return Meteor.user().profile.userType === "student";
  },
  isTeacher: function() {
    return /teacher/.test(Meteor.user().profile.userType);
  },
  isUnverified: function() {
    return Meteor.user().profile.userType !== "teacher";
  }
})