console.log("listening.js loaded");


const listeningAudio =
document.getElementById("listening-audio");


const listeningForm =
document.getElementById("listening-form");


const startButton =
document.getElementById("start-audio-btn");


const audioStatus =
document.getElementById("audio-status");



function startAudio(){


    if(!listeningAudio){

        console.log("Audio element not found");
        return;

    }


    listeningAudio.volume = 1;


    listeningAudio.play()

    .then(function(){

        console.log("Listening audio started");


        if(startButton){

            startButton.style.display="none";

        }


        if(audioStatus){

            audioStatus.innerHTML =
            "Listening test started";

        }


    })


    .catch(function(error){

        console.log(
            "Audio failed:",
            error
        );


        if(audioStatus){

            audioStatus.innerHTML =
            "Unable to play audio";

        }


    });


}




if(listeningAudio){


    listeningAudio.addEventListener(
        "ended",
        function(){

            if(listeningForm){

                listeningForm.submit();

            }

        }
    );


}
document.addEventListener(
"DOMContentLoaded",
function(){


let draggedOption = null;



// Start dragging

document.querySelectorAll(
".drag-option"
)
.forEach(option => {


    option.addEventListener(
    "dragstart",
    function(){


        draggedOption = this;


    });


});





// Allow dropping

document.querySelectorAll(
".drop-zone"
)
.forEach(zone => {



    zone.addEventListener(
    "dragover",
    function(e){

        e.preventDefault();

        this.classList.add("active");

    });




    zone.addEventListener(
    "dragleave",
    function(){

        this.classList.remove("active");

    });






    zone.addEventListener(
    "drop",
    function(e){


        e.preventDefault();


        this.classList.remove("active");



        if(!draggedOption)
            return;



        let answer =
        draggedOption.dataset.answer;



        let questionNumber =
        this.dataset.question;



        // Save answer for Flask

        document.getElementById(
            "answer-" + questionNumber
        ).value = answer;




        // Display answer but keep hidden input

        this.querySelector(
            ".answer-display"
        ).innerHTML =
        "<strong>"
        + answer +
        "</strong>";





        // Remove option from right side

        draggedOption.remove();



        draggedOption = null;


    });



});



});
// ===============================
// QUESTION NAVIGATION
// ===============================


function goToQuestion(questionNumber, partNumber){


    console.log(
        "Going to:",
        questionNumber,
        "Part:",
        partNumber
    );



    // Hide all parts

    document
    .querySelectorAll(".part-section")
    .forEach(function(section){


        section.style.display = "none";


    });



    // Show selected part

    const part = document.getElementById(
        "part-" + partNumber
    );


    if(part){

        part.style.display = "block";

    }



    // Scroll to question

    setTimeout(function(){


        const question = document.getElementById(
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

// Change question button color after answering

const answers = document.querySelectorAll(
    'input[type="radio"], input[type="checkbox"], input[type="text"]'
);


answers.forEach(function(answer){


    answer.addEventListener(
        "change",
        function(){


            let questionNumber = this.name.replace(
                "question_",
                ""
            );


            let button = document.getElementById(
                "nav-" + questionNumber
            );


            if(button){

                button.classList.add(
                    "answered"
                );

            }


        }
    );


});
