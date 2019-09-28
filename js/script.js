//Number of answers for one question.
const NUM_OF_ANSWERS = 4;

//Total number of questions.
let total = 0;

//Display all strings on user.html.(strings come from strings.js file)
function displayStrings() {
    //Header.
    $("#pageTitle").html(PAGE_TITLE);

    //Buttons.
    $("#deleteBtn").html(DLETE_BTN);
    $("#addBtn").html(ADD_BTN);
    $("#saveBtn").html(SAVE_BTN);
    
    //Page link.
    $("#userLink").html(USER_PAGE_LINK);
}


//Create a question form.
function createQuestionForm() {
    let questionForm = document.createElement('div');
    $(questionForm).attr({
        class : "col-lg-6 col-md-12  questionForms",
        id : "qform" + (total + 1) /*Eg : qform1*/
    });

    let questionArea = document.createElement('div');
    $(questionArea).attr({
        class : "col-12  questionArea"
    });

    let label = document.createElement("label");
    $(label).attr({
        class : "labels",
        for : "q" + (total + 1)
    });
    
    //Set the text which will be displayed on the label.
    label.textContent = "Question" + (total + 1); /*Eg : Question1*/ 

    let questionInput = document.createElement("input");
    $(questionInput).attr({
        type : "text",
        placeholder : "Type Question Here", 
        class : "questionInputs",
        id : "q" + (total + 1),
        required : "true"
    });

    $(questionArea).append(label, questionInput);
    $(questionForm).append(questionArea);

    let answerArea = document.createElement('div');
    $(answerArea).attr({
        class : "col-12  answerArea"
    });

    //Create elements which belongs to an answer area.
    for (let i = 0; i < NUM_OF_ANSWERS; ++i) {
        let section = document.createElement('div');
        $(section).attr({
            class : "answers"
        });

        let radio = document.createElement("input");
        $(radio).attr({
            type : "radio",
            class : "radios",
            id : "q" + (total + 1) + "r" + (i + 1) /*Eg : q1r1*/,
            name : "q" + (total + 1),
            value : (i + 1)
        });

        let answerInput = document.createElement("input");
        $(answerInput).attr({
            type : "text",
            placeholder : "Answer" + (i + 1),
            class : "answerInputs",
            name : "q" + (total + 1) + "answers"
        });

        $(section).append(radio, answerInput);
        $(answerArea).append(section);
    }
    
    $(questionForm).append(answerArea);
    $("#questionsField").append(questionForm);
    
    total++;
}

//Delete a question form.
function deleteQuestionForm() {
    //Get the newest question form & remove it.
    document.getElementById("qform" + (total)).remove();
    total--;
}

//Get user input values.
function getQuiz() {
    let question;
    let correctAnswer;
    let answerArr = [];
    let dataArr = [];
    
    //Iterate through all questions.
    for(let i = 0; i < total; ++i) {
        
        //Get a question.
        question = document.getElementsByClassName("questionInputs")[i].value;

        //Find & Get a checked answer.( = correct answer of the question)
        for(let j = 0; j < NUM_OF_ANSWERS; ++j) {

            //When "checked", get value.
            if(document.getElementsByName("q" + (i + 1))[j].checked) {
                correctAnswer = document.getElementsByName("q" + (i + 1))[j].value;
            } 
        }

        //Get 4 answers.
        for(let k = 0; k < NUM_OF_ANSWERS; ++k) {
            let answer = document.getElementsByName("q" + (i + 1) + "answers")[k].value
            answerArr.push(answer);
        }

        //Create an object based on data extracted above.
        let questionObj = 
        {
            "question" : question, 
            "answers" : answerArr,
            "correctAnswer" : correctAnswer
        };

        //Varidate Inputs.
        if(validateInputValues(questionObj) == false) {
            showInputAlert();
            return false;
        } else {
            //Change the display of save button.
            $('#saveBtn').text('SAVED');
        }

        //Convert questionObj into JSON.
        questionObj = JSON.stringify(questionObj);
        
        //Push into the array which holds questionObjs.
        dataArr.push(questionObj);
        
        //Reset answer array (for next loop)
        answerArr = [];
    }   
   
    return dataArr;
}

//Store user input data to local storage.
function storeQuiz() {
    //Get user input & store the data into an array.
    const DATA_ARR = getQuiz();
    
    //Store all questions(objects) to Local sotrage.
    for(let i = 0; i < DATA_ARR.length; ++i) {
        localStorage.setItem(i, DATA_ARR[i]);
    }
}

function validateInputValues(quizObj) {
    let flag = true;

    //Check question.
    if(quizObj.question.length == 0) {
        $('#questionAlert').text(INPUT_ALERT_1);
        flag = false;    
    }

    //Check all answers for a question.
    for(let i = 0; i < NUM_OF_ANSWERS; ++i) {
        if(quizObj.answers[i].length == 0) {
            $('#answerAlert').text(INPUT_ALERT_2);
            flag = false;
        }
    }

    //Check correct answer was chosen or not.
    if(quizObj.correctAnswer == null) {
        $('#correctAnswerAlert').text(INPUT_ALERT_3);
        flag = false;
    }

    return flag;
}

function showInputAlert() {
    $('.alerts').css('display', 'block');
}

//When the page is loaded.
$( document ).ready(function() {
    displayStrings();
    createQuestionForm();
});