const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let questionID; // Assuming this variable is set earlier in your code
let clients = {};
let answers = {};
let compiledAnswers = [];
let timeout;

// Read predefined questions and answers from a JSON file
const predefinedData = JSON.parse(fs.readFileSync('newQuestions.json', 'utf-8'));

// Map questions to answers
const predefinedAnswers = {};
predefinedData.forEach(entry => {
  predefinedAnswers[entry.question] = entry.answer;
});

function compileMessages(answers) {
  // Combine client answers with predefined answers
  const allAnswers = Object.values(answers).concat(compiledAnswers);

  // Construct the message containing all answers
  const compiledMessage = {
    answers: allAnswers
  };

  return compiledMessage;
}

function sendCompiledMessage() {
  const compiledMessage = compileMessages(answers);
  Object.values(clients).forEach(client => {
    client.emit('compiledMessage', compiledMessage);
  });
}

io.on('connection', (socket) => {
  clients[socket.id] = socket;

  socket.on('promptForSolution', () => {
    // Check if all clients have been prompted
    if (Object.keys(clients).length === Object.keys(answers).length) {
      // Clear previous timeout
      clearTimeout(timeout);

      // Start new timeout
      timeout = setTimeout(() => {
        // Compile and send messages after timeout or when all clients have submitted
        compiledAnswers = Object.values(predefinedAnswers);
        sendCompiledMessage();

        // Start a new timeout for selecting the correct answer
        setTimeout(() => {
          // Emit an event to prompt clients to select the correct answer
          io.emit('promptForCorrectAnswer');
        }, 120000); // 2 minutes timeout

        // Reset answers for the next round
        answers = {};
      }, 120000); // 2 minutes timeout
    }
  });

  socket.on('submitSolution', (data) => {
    // Store client's answer
    answers[socket.id] = data;

    // Check if all clients have submitted their solutions
    if (Object.keys(answers).length === Object.keys(clients).length) {
      // Clear previous timeout
      clearTimeout(timeout);

      // Compile and send messages
      compiledAnswers = Object.values(predefinedAnswers).concat(Object.values(answers));
      sendCompiledMessage();

      // Start a new timeout for selecting the correct answer
      setTimeout(() => {
        // Emit an event to prompt clients to select the correct answer
        io.emit('promptForCorrectAnswer');
      }, 120000); // 2 minutes timeout

      // Reset answers for the next round
      answers = {};
    }
  });

  socket.on('selectCorrectAnswer', (selectedAnswer) => {
    // Determine if the selected answer is correct
    const correctAnswer = predefinedAnswers[questionID];
    const isCorrect = selectedAnswer === correctAnswer;

    // Handle points system (not implemented yet)
    // TODO: Implement points system

    // You can emit an event to update the UI or handle points system here
  });
});
