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

let savedRange = null;

const toolbar = document.getElementById("annotation-toolbar");


document.addEventListener("mouseup", function (e) {


    // Ignore clicks on the toolbar itself
    if (toolbar.contains(e.target)) {
        return;
    }


    const selection = window.getSelection();


    if (selection.toString().trim().length > 0) {


        savedRange = selection.getRangeAt(0).cloneRange();


        const rect = savedRange.getBoundingClientRect();


        toolbar.style.display = "flex";


        toolbar.style.left =
        window.scrollX + rect.left + "px";


        toolbar.style.top =
        window.scrollY + rect.top - 55 + "px";


    }

});
document.addEventListener("mousedown", function(e){

    if(
        !toolbar.contains(e.target)
        &&
        window.getSelection().toString().trim().length === 0
    ){

        toolbar.style.display="none";

    }

});
document.querySelectorAll(".highlight-btn").forEach(button => {

    button.addEventListener("click", function(){

        if(!savedRange) return;

        const color = this.dataset.color;

        const span = document.createElement("span");

        span.className = "highlight-" + color;

        try{

            savedRange.surroundContents(span);

        }catch(err){

            alert("Please select text inside one paragraph.");

            return;

        }

        window.getSelection().removeAllRanges();

        toolbar.style.display="none";

        savedRange=null;

    });

});

document.getElementById("remove-highlight-btn").addEventListener("click", function(){

    const selection = window.getSelection();

    if(selection.rangeCount === 0) return;

    let node = selection.anchorNode;

    if(node.nodeType === 3){
        node = node.parentNode;
    }

    if(
        node.classList &&
        (
            node.classList.contains("highlight-yellow") ||
            node.classList.contains("highlight-green") ||
            node.classList.contains("highlight-pink") ||
            node.classList.contains("highlight-blue")
        )
    ){

        const parent = node.parentNode;

        while(node.firstChild){
            parent.insertBefore(node.firstChild,node);
        }

        parent.removeChild(node);

    }

    toolbar.style.display="none";

});

const canvas = document.getElementById("drawing-layer");

const ctx = canvas.getContext("2d");


const container = document.getElementById("reading-container");


function resizeCanvas(){

    canvas.width = container.offsetWidth;

    canvas.height = container.offsetHeight;

}


resizeCanvas();


let drawing = false;
let drawMode = false;

let erasing = false;


let history = [];

let redoHistory = [];


// Save current canvas state

function saveState(){

    history.push(
        canvas.toDataURL()
    );

    redoHistory=[];

}


// Load canvas state

function restoreState(image){

    let img = new Image();

    img.src=image;

    img.onload=function(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(img,0,0);

    }

}


// Start drawing mode

document.getElementById("draw-btn")
.addEventListener("click",function(){

    drawMode = true;

    canvas.style.pointerEvents="auto";

    erasing=false;

    ctx.lineWidth=3;

});
canvas.addEventListener("mouseleave", function(){

    drawing=false;

});

document.getElementById("done-drawing")
.addEventListener("click", function(){

    drawMode = false;

    drawing = false;

    canvas.style.pointerEvents="none";

});

// Eraser

document.getElementById("eraser-btn")
.addEventListener("click",function(){

    canvas.style.pointerEvents="auto";

    erasing=true;

    ctx.lineWidth=20;

});


// Mouse down

canvas.addEventListener("mousedown", function(e){

    if(!drawMode) return;


    saveState();


    drawing = true;


    const rect = canvas.getBoundingClientRect();


    ctx.beginPath();


    ctx.moveTo(
        e.clientX - rect.left,
        e.clientY - rect.top
    );


});


// Draw

canvas.addEventListener("mousemove", function(e){

    if(!drawMode || !drawing) return;


    const rect = canvas.getBoundingClientRect();


    ctx.lineTo(
        e.clientX - rect.left,
        e.clientY - rect.top
    );


    ctx.stroke();


});


// Stop drawing

canvas.addEventListener(
"mouseup",
function(){

    drawing=false;

});

document.getElementById("undo-btn")
.addEventListener("click",function(){

    if(history.length===0)
        return;


    redoHistory.push(
        canvas.toDataURL()
    );


    let previous =
    history.pop();


    restoreState(previous);

});

document.getElementById("redo-btn")
.addEventListener("click",function(){

    if(redoHistory.length===0)
        return;


    history.push(
        canvas.toDataURL()
    );


    let next =
    redoHistory.pop();


    restoreState(next);

});

document.getElementById("clear-btn")
.addEventListener("click",function(){

    saveState();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

});
