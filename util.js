let all_questions = [];
test();

function test()
{
    let example_json = [
        {
            "subject": "Chemistry",
            "questions": ["How much is a mole?", "What is the atomic number of Carbon?"],
            "correct_answers": ["6.022 x 10^23", "6"]
        },
    ];

    let example_json_string = JSON.stringify(example_json);

    read_from_JSON(example_json_string);



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

// Takes a subject and two arrays of questions and answers that the host types in, and writes them to a JSON file.
function write_to_JSON(subject, questions, correct_answers)
{
    let Question_set = {
        "subject": subject,
        "questions": questions,
        "correct_answers": correct_answers
    }

    all_questions.push(Question_set);

    let json_string = JSON.stringify(all_questions);
    console.log(json_string); // write json_string to file here.
}

// Reads questions from JSON file and stores them in an array. Should be called once every time game is launched.
function read_from_JSON(example_json_string)
{
    // read file here, store contents in json_string. will need to use fetch() and make http request.
    all_questions = JSON.parse(example_json_string);
}

// Called when the host chooses which set of questions they want to use. Returns an array containing the questions.
function get_questions(subject_)
{
    for(let i = 0; i < all_questions.length; i++)
    {
        if(all_questions[i].subject == subject_)
        {
            return all_questions[i].questions;
        }
    }
}

// Called when the host chooses which set of questions they want to use. Returns an array containing the correct answers.
function get_answers(subject_)
{
    for(let i = 0; i < all_questions.length; i++)
    {
        if(all_questions[i].subject == subject_)
        {
            return all_questions[i].correct_answers;
        }
    }
}