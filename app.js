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
      // Use .html() for consistent handling of HTML content
      $('.code-editor').html(code);
      highlightCode();
    }
  });

  $('.code-editor').on('input', function () {
    const code = $(this).val();
    socket.emit('codeChange', code);
    if (role === 'student') {
      highlightCode(code); // Pass the specific code to highlight
    }
  });

function highlightCode(code) {
  // Use the passed code to highlight
  const highlightedCode = hljs.highlight('javascript', code).value;
  $('.highlighted-code').html(highlightedCode); // Use a separate class or ID
}


});
