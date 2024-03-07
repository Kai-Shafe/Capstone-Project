let all_questions = require('./questions.json');
const fs = require('fs');
test();

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

// Takes a subject and two arrays of questions and answers that the host types in, and writes them to a JSON file in the form of a dictionary
function write_to_JSON(subject, questions, correct_answers)
{
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
}

// Called when the host chooses which set of questions they want to use. Returns an array containing the questions.
function get_questions(chosen_subject)
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
}

// Called when the host chooses which set of questions they want to use. Returns an array containing the correct answers.
function get_answers(chosen_subject)
{
    for(let i = 0; i < all_questions.length; i++)
    {
        if(all_questions[i].subject == chosen_subject)
        {
            let answers = Object.values(all_questions[i]);
            answers.shift();
            return answers;
        }
    }
}