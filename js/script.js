//Root of the enitre page
const app = document.getElementById("root"); 

//Create a container for the results
const container = document.createElement('div');  
container.setAttribute('class', 'container');
app.appendChild(container)

//Set a listener on the "Go" button
document.getElementById('search').addEventListener('click', () => {updater(); searchAnim();});

//Set a listener on the text-field button
document.getElementById('word').addEventListener('click', wordAnim);

//Make enter key presses "search" button
document.getElementById('word').addEventListener('keyup', function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("search").click();
    }
  });

//Executes when the "Go" button is clicked
function updater () {

    

    //Empty the container to prepare for new results
    container.innerHTML = "";

    //Save data inputted by user in variables
    var word = document.getElementById('word').value;
    var language = document.getElementById('language').value;

    //Create the url for the GET call based on user input
    var url = "https://api.gavagai.se/v3/lexicon/" + language + "/" + word + 
        "?additionalFields=SEMANTICALLY_SIMILAR_WORDS&apiKey=8c79736f393ab6eff4a864fcfa23344c";
    
    //Create new request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    //Modify the received data
    request.onload = function() {

        containerAnim();

        //Check if request was succesfull
        if (request.status >= 200 && request.status < 400) {

            //Transform JSON string to object
            var data = JSON.parse(this.response);

            //Acces each semantically similar word
            data.semanticallySimilarWords.forEach(element => {
                
                //Create a "wordTile" div for each word
                const wordTile = document.createElement('div');
                wordTile.setAttribute('class', 'tile');

                //Create an anchor element containing the semantically similar word
                const a = document.createElement('a');

                a.textContent = element.word;

                //Clicking on the link sends the id (word) to the infoWindow function
                a.addEventListener("click", function() {
                            infoWindow(this.text,language)
                        }, true);


                //Appending the wordTile to the container, and the paragraph to the wordTile
                container.appendChild(wordTile);
                wordTile.appendChild(a);
            });
        //If it's not working show error message
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Something went wrong...`;
            container.appendChild(errorMessage);
        }
    }

    request.send();
}


//Open a modal window with info about the word that is clicked
function infoWindow(word, language){

    //Get the modal and shadow element
    const modal = document.getElementById("modal");
    const shadow = document.getElementById("shadow");

    //Call to findInfo function that sends a request for info about selected word
    findInfo(word, language);

    //Make the modal visible
    


    // Get the span element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the span (the X), close the modal
    span.onclick = function() {
        modalCloseAnim();
    }

    // // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //         shadow.style.display = "none";
    //     }
    // }
}

//Function that retrieves information about selected word and outputs it as HTML in a list
function findInfo(word, language){

    //Get the modText container that will hold the text
    const modText = document.getElementById("modText");

    //Empty element from potential previous text
    modText.innerHTML = "";

    //Create the url for the GET call based on user input
    var url = "https://api.gavagai.se/v3/lexicon/" + language + "/" + word + 
        "/info?apiKey=8c79736f393ab6eff4a864fcfa23344c";
    
    //Create new request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    //Modify the received data
    request.onload = function() {

        modalOpenAnim();

        //Check if request was succesfull
        if (request.status >= 200 && request.status < 400) {
            //Transform JSON string to object
            var data = JSON.parse(this.response);

            //Set chosen word as header
            const h1 = document.createElement("h1");
            h1.textContent = data.word;
            modText.appendChild(h1);

            //Create list and list items
            const list = document.createElement("ul");
            const freq = document.createElement("li");
            const docFreq = document.createElement("li");
            const absRank = document.createElement("li");
            const relRank = document.createElement("li");
            const vocSize = document.createElement("li");

            //Add content to the listitems
            freq.textContent = "frequency: " + data.frequency;
            docFreq.textContent = "Document frequency: " + data.documentFrequency;
            absRank.textContent = "Absolute rank: " + data.absoluteRank;
            relRank.textContent = "Relative rank: " + data.relativeRank;
            vocSize.textContent = "Vocabulary size: " + data.vocabularySize;

            //Append all elements to the modText container
            modText.appendChild(list);
            list.appendChild(freq);
            list.appendChild(docFreq);
            list.appendChild(absRank);
            list.appendChild(relRank);
            list.appendChild(vocSize);

        //If there's no word info to display, show error message
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Something went wrong...`;
            modText.appendChild(errorMessage);
        }
    }
    request.send();
}

function wordAnim(){
    if (screen.width > 500){
        TweenMax.to('#word', 0.5, {width: "30vw", ease: Power2.easeInOut});
    }
}

function searchAnim() {
    //Move search bar to top of page
    if (screen.width > 500){
        TweenMax.to('#word', 0.5, {width: "15vw", ease: Power2.easeInOut});
    }
    
    TweenMax.to('#form', 1, {marginTop: "4vh",delay: 0.5, ease: Power2.easeInOut});
    
}

function containerAnim() {
    TweenMax.from('.container', 2, {marginTop: "-100vh",opacity: 0, delay: 0, ease: Power2.easeInOut});
}

function modalOpenAnim(){
    TweenMax.to('#modal', 1, {display: "block", opacity: 1, delay: 0, ease: Power2.easeInOut});
    TweenMax.to('#shadow', 1, {display: "block", opacity: 1, delay: 0, ease: Power2.easeInOut});
}

function modalCloseAnim(){
    TweenMax.to('#modal', 0.5, {display: "none", opacity: 0, delay: 0, ease: Power2.easeInOut});
    TweenMax.to('#shadow', 0.5, {display: "none", opacity: 0, delay: 0, ease: Power2.easeInOut});
}
