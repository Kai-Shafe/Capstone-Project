module.exports = {
    // Takes a subject and two arrays of questions and answers that the host types in, and writes them to a JSON file
    write_to_JSON: function(json_object, subject, questions, correct_answers)
    {
        const fs = require('fs');

        for(let i = 0; i < questions.length; i++)
        {
            let question = {
                "type": "fill_in_the_blank",
                "case_sensitive": false,
                "text": questions[i],
                "correct_answer": correct_answers[i],
                "subject": subject
            }
            json_object.questions.push(question);
        }

        let json_string = JSON.stringify(json_object);
        fs.writeFile("./questions.json", json_string, err => {
            if(err) {
            console.error(err);
            }
        });
    },

    // Called when the host chooses which set of questions they want to use. Returns an array containing the questions.
    get_questions: function(json_object, chosen_subject)
    {
        let questions = [];

        for(let i = 0; i < json_object.questions.length; i++)
        {
            if(json_object.questions[i].subject == chosen_subject)
            {
                questions.push(json_object.questions[i].text);
            }
        }

        return questions;
    },

    // Called when the host chooses which set of questions they want to use. Returns an array containing the correct answers.
    get_correct_answers: function(json_object, chosen_subject)
    {
        let answers = [];

        for(let i = 0; i < json_object.questions.length; i++)
        {
            if(json_object.questions[i].subject == chosen_subject)
            {
                answers.push(json_object.questions[i].correct_answer);
            }
        }

        return answers;
    }
};