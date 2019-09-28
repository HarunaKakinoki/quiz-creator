//Number of answers for one question.
const NUM_OF_ANSWERS = 4;
//Array which holds all quizzes.
const QUIZ_ARR = retreiveQuiz();

//Display all strings on user.html.(strings come from strings.js file)
function displayStrings() {
    //Header.
    $("#pageTitle").html(PAGE_TITLE);

    //Explanation of highlight colors.
    $("#explanation-a").html(COLOR_EXPLANATION_1);
    $("#explanation-b").html(COLOR_EXPLANATION_2);

    //Submit button.
    $("#submitBtn").html(SUBMIT_BTN);
    
    //Page link.
    $("#adminLink").html(ADMIN_PAGE_LINK);

    //Modal alert window.
    $("#exampleModalLabel").html(MODAL_MESSAGE_1);
    $("#modalInner").html(MODAL_MESSAGE_2);
    $("#modalInnerLink").html(MODAL_MESSAGE_3);
    $("#closeBtn").html(CLOSE_BTN);  
}

//Make sure storage is empty or not.
//If so, show modal with alert message.
function checkStorageIsNotEmpty() {

    //Check local storage is empty or not.
    if(localStorage.length == 0) {
        
        //Show modal window.
        $('#alertModal').modal('show');
    
    } 
}

//Access local storage & extract all quizzes, store them into an array
// and return the array.
function retreiveQuiz() {
    let dataArr = [];
    
    checkStorageIsNotEmpty();
    
    for(let i = 0; i < localStorage.length; ++i) {
        //Get a quiz from local storage.
        let question = JSON.parse(localStorage.getItem(i));
        dataArr.push(question);
    }

    return dataArr;
}

//Display all quizzes on student.html.
function displayQuiz() {
    
    //Process all quizzes.
    for(let i = 0; i < QUIZ_ARR.length; ++i) {
        
        //Create a field which holds question & answers.
        let questionField = document.createElement("div");
        $(questionField).attr({
            class : "col-6 questionField"
        });
    
        //Create a question label. (Eg : Q1: What is the~~ ?)
        let questionLabel = document.createElement("label");
        $(questionLabel).attr({
            class : "questionLabels"
        });
        questionLabel.textContent = "Q" + (i + 1) + " : " + QUIZ_ARR[i].question;

        //Add the label to a field.
        $(questionField).append(questionLabel);

        //Create a filed which holds radios & 4 answers.
        let answerArea = document.createElement("div");
        $(answerArea).attr({
            class : "col-6 answerSections"
        });

        //Create 4 radio buttons & answers section.
        for(let j = 0; j < NUM_OF_ANSWERS; ++j) {
            
            //Field which holds a radio button & 1 answer.
            let section = document.createElement("div");
            $(section).attr({
                class : "col-12",
                id : "q" + (i + 1) + "a" +  (j + 1) /*Eg : q1a1*/
            });
    
            //Radio button.
            let radio = document.createElement("input");
            $(radio).attr({
                type : "radio",
                class : "answer-radios",
                id : "q" + (i + 1) + "r" + (j + 1), /*Eg : q1r1*/
                name : "q" + (i + 1),
                value : (j + 1)
            });
    
            //Answer.
            let answerLabel = document.createElement("label");
            $(answerLabel).attr({
                class : "answerLabels",
                for : "q" + (i + 1) + "r" + (j + 1) /*Eg : q1r1*/
            });
            answerLabel.textContent = QUIZ_ARR[i].answers[j];

            //Add a filed to a radio & an answer.
            $(section).append(radio, answerLabel);
            //Add the above field to answerArea.
            $(answerArea).append(section);
        }

        $(questionField).append(answerArea);
        //Add the question field to user.html.
        $("#questionsField").append(questionField);
    }
   
}

//Get all answers input by user.
function getUserAnswer() {
    let userAnswerArr = [];
    
    for(let i = 0; i < QUIZ_ARR.length; ++i) {
        let userAnswer;
        
        for(let j = 0; j < NUM_OF_ANSWERS; j++) {
            
            //Check the radio button is checked or not.
            if(document.getElementsByName("q" + (i + 1))[j].checked) {
                
                //If checked, get the value.
                userAnswer = document.getElementsByName("q" + (i + 1))[j].value;
                
                //Store user's answer value to an array.
                userAnswerArr.push(userAnswer);  
            }
        }
    }
    return userAnswerArr;
}

//Compare correct answer & user answer, calculate the result.
function markQuizzes() {
    const userAnswerArr = getUserAnswer();
    let correctAnswerArr = [];
    
    //Create an array which holds correct answers.
    for(let i = 0; i < QUIZ_ARR.length; ++i) {
        correctAnswerArr.push(QUIZ_ARR[i].correctAnswer);
    }

    //Highlight each answer. (User one & Correct one)
    for(let j = 0; j < QUIZ_ARR.length; ++j) {
        
        //Get each answer to highlight.
        let user = document.getElementById("q" + (j + 1) + "a" + userAnswerArr[j]);
        let correct = document.getElementById("q" + (j + 1) + "a" + correctAnswerArr[j]);
        
        //When user typed correct answer. (Highlighted with orange color)
        if (userAnswerArr[j] === correctAnswerArr[j]) {

            //Highlight an answer.
            $(correct).css('background-color', 'orange');

        } else {

            //Highlight each answer. (User: blue, Correct Answer: Red)
            $(correct).css('background-color', 'red');
            $(user).css('background-color', 'blue');
        
        }
    }
    //Clear current quizzes.
    localStorage.clear();

    //Disable submit button. (To avoid re-submit)
    $("#submitBtn").html('Done');
    $("#submitBtn").attr("disabled","disabled");
} 

//When the page is loaded.
$(document).ready(function() {
    displayStrings();
    retreiveQuiz();
    displayQuiz();
});