// public/app.js
$(document).ready(() => {
  const socket = io();

  let role;

  socket.on('role', (data) => {
    role = data;
    if (role === 'mentor') {
      $('.code-editor').prop('readonly', true);
    }
  });

  socket.on('studentConnected', () => {
    $('.status').text('Student connected');
  });

  socket.on('codeChange', (code) => {
    if (role === 'mentor') {
      $('.code-editor').val(code);
      highlightCode();
    }
  });

  $('.code-editor').on('input', function () {
    const code = $(this).val();
    socket.emit('codeChange', code);
    if (role === 'student') {
      highlightCode();
    }
  });

  function highlightCode() {
    const code = $('.code-editor').val();
    const highlightedCode = hljs.highlight('javascript', code).value;
    $('.code-editor').html(highlightedCode);
  }
});
