Template.signUp.rendered = function() {
  $(this.find('input[name="school"]')).typeahead({
    name: "schools",
    valueKey: "SchoolName",
    local: Schools.find().fetch(),
    template: Template.schoolTypeahead
  });
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
    if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(target.val()))
      target.parents(".validate-item").addClass("has-error");
  },
  'blur #password': function(event) {
    var target = $(event.target);
    if (!/^[a-zA-Z0-9`~!@#$%^&*()_+\[\]{}\\|;:'"\/?.,><]+$/.test(target.val()) ||
      !/[a-zA-Z]/.test(target.val()) || !/[0-9]/.test(target.val()))
      target.parents(".validate-item").addClass("has-error");
  },
  'blur #confirmpass': function(event) {
    if ($('#confirmpass').val() !== $('#password').val())
      $('#confirmpass').parents(".validate-item").addClass("has-error");
  }
});