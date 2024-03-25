/*
test(); // Use for testing

function test()
{
    let example_questions = ["Solve for x: 5x + 3 = 13", "Solve for x: 7x + 2 = 5x + 10"];
    let example_answers = ["2", "4"];

    write_to_JSON("Math Questions", example_questions, example_answers);

    example_questions = ["What year did the US gain independence?", "What year was the first moon landing?"];
    example_answers = ["1776", "1969"];

    write_to_JSON("History Questions", example_questions, example_answers);

    let math_questions = get_questions("Math Questions");
    console.log(math_questions);

    let math_answers = get_answers("Math Questions");
    console.log(math_answers);
}
*/

module.exports = {
    // Takes a subject and two arrays of questions and answers that the host types in, and writes them to a JSON file in the form of a dictionary
    write_to_JSON: function(all_questions, subject, questions, correct_answers)
    {
        const fs = require('fs');

        let dict = {
            "subject": subject
        };

        for(let i = 0; i < questions.length; i++)
        {
            dict[questions[i]] = correct_answers[i];
        }

        all_questions.push(dict);

        let json_string = JSON.stringify(all_questions);
        fs.writeFile("./questions.json", json_string, err => {
            if(err) {
            console.error(err);
            }
        });
    },

    // Called when the host chooses which set of questions they want to use. Returns an array containing the questions.
    get_questions: function(all_questions, chosen_subject)
    {
        for(let i = 0; i < all_questions.length; i++)
        {
            if(all_questions[i].subject == chosen_subject)
            {
                let questions = Object.keys(all_questions[i]);
                questions.shift();
                return questions;
            }
        }
    },

    // Called when the host chooses which set of questions they want to use. Returns an array containing the correct answers.
    get_correct_answers: function(all_questions, chosen_subject)
    {
        for(let i = 0; i < all_questions.length; i++)
        {
            if(all_questions[i].subject == chosen_subject)
            {
                let correct_answers = Object.values(all_questions[i]);
                correct_answers.shift();
                return correct_answers;
            }
        }
    }
};