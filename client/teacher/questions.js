function renderText() {
  var question = Session.get("question");
  question.text = $('#text').val();
  Session.set("question", question);
}

Template.questions.helpers({
	questions: function() {
		return Questions.find({});
	},
	isActive: function() {
		return !!Session.get("question") && this._id == Session.get("question")._id ? "active" : "";
	},
	activeQuestion: function() {
	  return Session.get("question");
	},
	questionPreview: function() {
	  if (!Session.get("question")) return "";
	  return new Handlebars.SafeString(marked(Session.get("question").text, {gfm:true, breaks:true}));
	}
});

Template.questions.events({
	'click #myQuestionList .list-group-item': function(event) {
		event.preventDefault();
		Session.set("question", this);
	},
	'click #newQuestion': function(event) {
		event.preventDefault();
		Questions.insert({
			title: 'Untitled Question',
			text: '',
			explanation: '',
			images: [],
			tags: []
		}, function(err, res) {
			if (err) console.log(err);
			else Session.set("question", Questions.findOne({_id: res}));
		});
	},
	'click #save, submit #questionForm': function(event) {
	  event.preventDefault();
	  Questions.update({_id: Session.get("question")._id}, {
	    title: $('#title').val(),
	    text: $('#text').val()
	  }, function(err) {
	    if (err) console.log(err);
	    renderText();
	  })
	},
  'keyup #text': function(event) {
    renderText();
  },
  'click #bold': function(event) {
    event.preventDefault();
    $('#text').surroundSelectedText("**", "**");
    renderText();
  },
  'click #italic': function(event) {
    event.preventDefault();
    $('#text').surroundSelectedText("_", "_");
    renderText();
  },
  'click #bullet': function(event) {
    event.preventDefault();
    $('#text').prependSelectedLines("* ");
    renderText();
  },
  'click #number': function(event) {
    event.preventDefault();
    $('#text').prependSelectedLines("1. ");
    renderText();
  },
  'click #quote': function(event) {
    event.preventDefault();
    $('#text').prependSelectedLines("> ");
    renderText();
  },
  'click #table': function(event) {
    event.preventDefault();
    $('#text').selectLines();
    var sel = $('#text').getSelection();
    var match = sel.text.match(/\n/g);
    if (!match || match.length < 2) {
      $('#text').setSelection(sel.end, sel.end);
			var table = "\nColumn 1 | Column 2 | Column 3\n-:|:-:|:-\na | b | c\n1 | 2 | 3\n\n";
			if (sel.text.length > 0 && !sel.text.match(/\n$/)) table += "\n";
      $('#text').replaceSelectedText(table);
    } else {
      sel.text = "\n|" + sel.text.replace(/\r?\n(?!$)/g, "|$&|").replace(/\r?\n$/, "|$&$&").replace(/(?!\n)$/, "|").replace(/\r?\n/, "$&|:-:|$&")
      $('#text').replaceSelectedText(sel.text, "select");
    }
    renderText();
  },
	'click #link': function(event) {
		event.preventDefault();
		var sel = $('#text').getSelection();
		if (sel.start == sel.end) {
			$('#text').replaceSelectedText("[Google](http://www.google.com)");
		} else if (sel.text.match("/^http")) {
			$('#text').replaceSelectedText("[" + sel.text + "](" + sel.text + ")");
		} else {
			$('#text').replaceSelectedText("[" + sel.text + "](http://www.google.com)");
		}
		renderText();
	}
});