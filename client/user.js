Template.signUp.rendered = function() {
  $(this.find('input[name="school"]')).typeahead({
    name: "schools",
    valueKey: "SchoolName",
    local: Schools.find().fetch(),
    template: Template.schoolTypeahead
  }).on('typeahead:selected typeahead:autocompleted', function(obj, datum) {
    Template.signUp.selectedSchool = datum._id;
  })  ;
  $(this.find('.twitter-typeahead')).css({display: "block"});
};

Template.signUp.events({
  'blur input': function(event) {
    var target = $(event.target);
    if (target.val() == "") target.parents(".validate-item").addClass("has-error");
  },
  'focus input': function(event) {
    $(event.target).parents(".validate-item").removeClass("has-error");
  },
  'blur #userName': function(event) {
    var target = $(event.target);
    if (!/^[a-zA-Z0-9_]*$/.test(target.val()))
      target.parents(".validate-item").addClass("has-error");
  },
  'blur #email': function(event) {
    var target = $(event.target);
    if (!/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(target.val()))
      target.parents(".validate-item").addClass("has-error");
  },
  'blur #password': function(event) {
    var target = $(event.target);
    if (!/^[a-zA-Z0-9`~!@#$%^&*()_+\[\]{}\\|;:'"\/?.,><]+$/.test(target.val()) ||
      !/[a-zA-Z]/.test(target.val()) || !/[0-9]/.test(target.val()) || target.val().length < 8)
      target.parents(".validate-item").addClass("has-error");
  },
  'blur #confirmpass': function(event) {
    if ($('#confirmpass').val() !== $('#password').val())
      $('#confirmpass').parents(".validate-item").addClass("has-error");
  },
  'click #signUp, submit form': function(event) {
    Accounts.createUser({
      username: $('#userName').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        school: Template.signUp.selectedSchool,
        userType: $('#userType').val()
      }
    }, function(err) {
      if (err)
        $('#errorMessage').html(err);
      else
        Meteor.router.to('/');
    });
  }
});