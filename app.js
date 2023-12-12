// public/app.js
$(document).ready(() => {
  const socket = io();

  let isMentor = false;

  // Handle mentor connection
  socket.on('mentor-connected', (codeBlocks) => {
    isMentor = true;
    displayCodeList(codeBlocks);
  });

  // Handle student connection
  socket.on('student-connected', () => {
    isMentor = false;
    $('#lobby').hide();
    $('#codeBlock').show();
  });

  // Handle code updates
  socket.on('update-code', (newCode) => {
    if (!isMentor) {
      $('#code').text(newCode);
      hljs.highlightBlock($('#code')[0]);
    }
  });

  // Handle code list item click
  $('#codeList').on('click', 'li', function() {
    const codeIndex = $(this).index();
    const selectedCode = codeBlocks[codeIndex];
    displayCodeBlock(selectedCode);
  });

  // Handle code changes
  $('#code').on('input', function() {
    if (isMentor) {
      const newCode = $(this).text();
      socket.emit('code-changed', newCode);
    }
  });

  function displayCodeList(codeBlocks) {
    const codeList = $('#codeList');
    codeBlocks.forEach((codeBlock) => {
      codeList.append(`<li>${codeBlock.title}</li>`);
    });
  }

  function displayCodeBlock(codeBlock) {
    $('#codeTitle').text(codeBlock.title);
    $('#code').text(codeBlock.code);
    hljs.highlightBlock($('#code')[0]);
    if (isMentor) {
      $('#lobby').hide();
      $('#codeBlock').show();
    }
  }
});
