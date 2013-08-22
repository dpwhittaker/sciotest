function renderText() {
  $('#text-output').html(marked($('#text').val(), {gfm:true, breaks:true}));
}
Template.questions.events({
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
  }
});