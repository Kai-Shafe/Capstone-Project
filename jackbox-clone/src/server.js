const io = require('socket.io')(server);
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Read predefined answers from a JSON file
const predefinedAnswers = JSON.parse(fs.readFileSync('predefined_answers.json', 'utf-8'));

let questionID; // Assuming this variable is set earlier in your code
let clients = {};
let answers = {};

function compileMessages(answers) {  

  // Extract predefined answers for the current questionID
  const predefinedAnswerSet = predefinedAnswers[questionID];

  // Combine client answers with predefined answers
  const allAnswers = Object.values(answers).concat(predefinedAnswerSet);

  // Construct the message containing all answers
  const compiledMessage = {
    answers: allAnswers
  };

  return compiledMessage;
}

io.on('connection', (socket) => {
  clients[socket.id] = socket;

  socket.on('answer', (data) => {
    // Store client's answer
    answers[socket.id] = data;

    // Check if all clients have submitted their answers
    if (Object.keys(answers).length === Object.keys(clients).length) {
      // Compile messages
      const compiledMessage = compileMessages(answers);

      // Send compiled message back to all clients
      Object.values(clients).forEach(client => {
        client.emit('compiledMessage', compiledMessage);
      });

      // Reset answers for the next round
      answers = {};
    }
  });
});
