try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch (e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesTable = $('table#notes');

var noteContent = '';
var noteMeaning = '';

var notes = getAllNotes();
renderNotes(notes);

var dict = {
  Systolic: "",
  Diastolic: ""
};

recognition.continuous = true;

recognition.lang = 'en-US';

document.getElementById('language-picker-select').addEventListener("change", () => {
  var e = document.getElementById("language-picker-select");
  var text = e.options[e.selectedIndex].lang
  recognition.lang = document.getElementById(text);
  console.log(text);
});

recognition.onresult = function (event) {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if (!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function () {
  instructions.text('Recording.');
}

recognition.onspeechend = function () {
  instructions.text('Voice recognition has been paused.');
}

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');
  }
}

$('#sign-out').on('click', function (e) {
  window.location.href = "login.html"
});

$('#start-record-btn').on('click', function (e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});

$('#pause-record-btn').on('click', function (e) {
  recognition.stop();
  instructions.text('Voice recognition has been paused.');
});

$('#clear-record-btn').on('click', function (e) {
  recognition.stop();
  instructions.text('Your reading has been cleared.');
  noteTextarea.val('');
  noteContent = '';
});

noteTextarea.on('input', function () {
  noteContent = $(this).val();
})

$('#save-note-btn').on('click', function (e) {
  recognition.stop();
  const regex = /[0-9]\d*/g;
  const matches = noteContent.match(regex);

  if (!noteContent.length) {
    instructions.text('Could not save empty reading. Please add a reading and try again.');
  } else if (!matches) {
    instructions.text('Invalid reading. Please click "Record" again.');
  } else {
    dict["Systolic"] = matches[0];
    dict["Diastolic"] = matches[1];
  }

  noteMeaning = getMeaning(dict["Systolic"], dict["Diastolic"]);
  noteContent = "Systolic: " + dict["Systolic"] + " \| Diastolic: " + dict["Diastolic"] + "*" + noteMeaning;
  saveNote(new Date().toLocaleString(), noteContent);

  noteContent = '';
  noteMeaning = '';
  dict["Systolic"] = "";
  dict["Diastolic"] = "";
  renderNotes(getAllNotes());
  noteTextarea.val('');
  instructions.text('Blood Pressure Reading saved successfully.');

})

notesTable.on('click', function (e) {
  e.preventDefault();
  var target = $(e.target);

  if (target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});

function renderNotes(notes) {
  var html =
    `<tr>
    <td>Date</td>
    <td>Reading</td>
    <td>Meaning</td>
  </tr>`;
  if (notes.length) {
    notes.forEach(function (note) {
      html += `<tr class="note">
      <td class="header">
        <span class="date">${note.date}</span>
        <a href="#" class="delete-note" title="Delete">Delete</a>
      </td>
      <td class="content">${note.content}</td>
      <td class="meaning">${note.meaning}</td>
    </tr>`;
    });
  }
  notesTable.html(html);
}

function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}

function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);
    if (key.substring(0, 5) == 'note-') {
      notes.push({
        date: key.replace('note-', ''),
        content: localStorage.getItem(localStorage.key(i)).substring(0, localStorage.getItem(localStorage.key(i)).indexOf("*")),
        meaning: localStorage.getItem(localStorage.key(i)).substring(localStorage.getItem(localStorage.key(i)).indexOf("*") + 1)
      });
    }
  }
  notes.sort(function (a, b) {
    return b.date.localeCompare(a.date);
  });
  return notes;
}

function getMeaning(systole, diastole) {
  if (systole < 90 && diastole < 60)
    return "Medium to High Risk";
  else if (systole >= 140 || diastole >= 90)
    return "❗️High Risk❗️";
  else if ((systole > 120 && systole < 140) || (diastole > 80 && diastole < 90))
    return "Medium Risk❗️";
  else if ((systole >= 90 && systole <= 120) || (diastole >= 50 && diastole <= 80))
    return "Low Risk";
  else
    return "Faulty reading. Try BP test again.";
}

function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime);
}