console.log("script.js loaded");
document.addEventListener("DOMContentLoaded", function () {

    let time = 60 * 60;

    let timer = setInterval(function () {

        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("timer").innerHTML =
            minutes + ":" + seconds;

        if (time <= 0) {

    clearInterval(timer);

    alert("Time is up! Your test will be submitted.");

    finishTest();

    return;

}

        time--;

    }, 1000);

});



// =========================
// Submit Test
// =========================

function finishTest(){

    let result = calculateScore();

    console.log("Score result:", result);

    window.location.href =
        "/result?score=" +
        result.score +
        "&total=" +
        result.total;

}

function submitTest(){

    let confirmSubmit = confirm(
        "Are you sure you want to submit your test?"
    );

    if(confirmSubmit){

        finishTest();

    }

}


// =========================
// Calculate Score
// =========================

function calculateScore(){

    let score = 0;
    let total = 0;


    document.querySelectorAll(".question").forEach(function(question){

        console.log(question.id, question.dataset.marks);

        let marks = Number(question.dataset.marks || 1);

        total += marks;


        let inputs = question.querySelectorAll("input");


        if(inputs.length === 0){
            return;
        }



        // =====================
        // Radio questions
        // Multiple choice
        // T/F/NG
        // Yes/No/NG
        // =====================

        if(inputs[0].type === "radio"){


            let selected =
            question.querySelector(
                "input:checked"
            );


            if(selected &&
               selected.value.trim().toLowerCase()
               ===
               selected.dataset.answer.trim().toLowerCase()
            ){

                score += marks;

            }

        }




// =====================
// Checkbox questions
// Multiple answers
// =====================

else if(inputs[0].type === "checkbox"){


    let correctAnswers =
    inputs[0].dataset.answer
    .split(",")
    .map(x => x.trim().toLowerCase());



    let selectedAnswers =
    Array.from(
        question.querySelectorAll(
            "input:checked"
        )
    )
    .map(x => x.value.trim().toLowerCase());



    if(
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(answer =>
            correctAnswers.includes(answer)
        )
    ){

        score += marks;

    }

}

        // =====================
        // Text answers
        // Sentence completion
        // Summary completion
        // =====================

        else if(inputs[0].type === "text"){



            inputs.forEach(function(input){


                if(
                    input.value.trim().toLowerCase()
                    ===
                    input.dataset.answer.trim().toLowerCase()
                ){

                    score++;

                }


            });


        }



    });



    return {
    score: score,
    total: total
};

}


// =========================
// Turn Question Number Green
// When Answered
// =========================


document.addEventListener(
    "change",
    function(event){

        if(event.target.matches(
            'input[type="radio"], input[type="checkbox"], input[type="text"]'
        )) {

            let question =
            event.target.closest(".question");


            if(question){

                let questionID =
                question.id.replace(
                    "question-",
                    ""
                );


                let button =
                document.getElementById(
                    "nav-" + questionID
                );


                if(button){

                    button.classList.add(
                        "answered"
                    );

                }

            }

        }

    }
);
// =========================
// Question Navigation
// =========================

function goToQuestion(questionNumber, partNumber){


    // Switch to correct part first

    showPart(partNumber);



    // Wait for the part to load

    setTimeout(function(){


        let question = document.getElementById(
            "question-" + questionNumber
        );


        if(question){


            question.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });


        }


    }, 100);


}
// =========================
// Switch Reading Parts
// =========================

function showPart(partNumber){


    // Hide all passages

    let passages = document.querySelectorAll(
        ".passage-content"
    );


    passages.forEach(function(passage){

        passage.style.display = "none";

    });



    // Hide all question sections

    let questions = document.querySelectorAll(
        ".question-content"
    );


    questions.forEach(function(question){

        question.style.display = "none";

    });



    // Show selected passage

    let selectedPassage =
    document.getElementById(
        "passage-" + partNumber
    );


    if(selectedPassage){

        selectedPassage.style.display = "block";

    }



    // Show selected questions

    let selectedQuestions =
    document.getElementById(
        "questions-" + partNumber
    );


    if(selectedQuestions){

        selectedQuestions.style.display = "block";

    }


}
document
.getElementById("submit-test")
.addEventListener(
    "click",
    submitTest
);

