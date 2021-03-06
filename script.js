try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }

  var noteTextarea = $('#note-textarea');
  var instructions = $('#recording-instructions');
  var notesList = $('ul#notes');
  
  var noteContent = '';
  
  var notes = getAllNotes();
  renderNotes(notes);
  
  var dict = {
    Systolic: "",
    Diastolic: ""
  };
  
  recognition.continuous = true;
  
  recognition.onresult = function(event) {
  
    var current = event.resultIndex;
  
    var transcript = event.results[current][0].transcript;
  
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  
    if(!mobileRepeatBug) {
      noteContent += transcript;
      noteTextarea.val(noteContent);
    }
  };
  
  recognition.onstart = function() { 
    instructions.text('Say your blood pressure reading into the microphone. Example: \"one hundred and twenty over eighty\"');
  }
  
  recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
  }
  
  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
      instructions.text('No speech was detected. Try again.');  
    }
  }
  
  $('#sign-out').on('click', function(e) {
    window.location.href = "index.html"
  });
  
  $('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
      noteContent += ' ';
    }
    recognition.start();
  });
  
  
  $('#clear-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Your reading has been cleared.');
    noteTextarea.val('');
    noteContent = '';
  });
  
  noteTextarea.on('input', function() {
    noteContent = $(this).val();
  })
  
  $('#save-note-btn').on('click', function(e) {
    recognition.stop();
  
    if(!noteContent.length) {
      instructions.text('Could not save empty reading. Please add a reading and try again.');
    }
    else {
      if (noteContent.indexOf("/") != -1) {
        if(noteContent.indexOf("/") > 1) {
          dict["Systolic"]=noteContent.substring(0, noteContent.indexOf("/"));
        }
        if (noteContent.length-1 > noteContent.indexOf("/")) {
          dict["Diastolic"]=notContent.substring(noteContent.indexOf("/")+ 1);
        }
      }
  
      noteContent = "Systolic: " + dict["Systolic"] + " \| Diastolic: " + dict["Diastolic"];
      saveNote(new Date().toLocaleString(), noteContent);
  
      noteContent = '';
      dict["Systolic"]= "", dict["Diastolic"]="";
      renderNotes(getAllNotes());
      noteTextarea.val('');
      instructions.text('Blood Pressure Reading saved successfully.');
    }
        
  })
  
  
  notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);
  
    if(target.hasClass('delete-note')) {
      var dateTime = target.siblings('.date').text();  
      deleteNote(dateTime);
      target.closest('.note').remove();
    }
  });
  
  function renderNotes(notes) {
    var html = '';
    if(notes.length) {
      notes.forEach(function(note) {
        html+= `<li class="note">
          <p class="header">
            <span class="date">${note.date}</span>
            <a href="#" class="delete-note" title="Delete">Delete</a>
          </p>
          <p class="content">${note.content}</p>
        </li>`;
      });
    }
    else {
      html = '<li><p class="content">You don\'t have any prior patient information.</p></li>';
    }
    notesList.html(html);
  }
  
  
  function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
  }
  
  
  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
  
      if(key.substring(0,5) == 'note-') {
        notes.push({
          date: key.replace('note-',''),
          content: localStorage.getItem(localStorage.key(i))
        });
      } 
    }
    return notes;
  }
  
  
  function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime); 
  }