// Adam Seid Tahir

//Root of the enitre page
const root = document.getElementById("root"); 

//Create a container for the search-results
const container = document.createElement('div');  
container.setAttribute('class', 'container');
root.appendChild(container)

//Save elements in variables to only make call once, speed optimization
const textField = document.getElementById('word');
const searchButton = document.getElementById('search');
const languageField = document.getElementById('language');

//Set listeners to trigger animations and make API request
searchButton.addEventListener('click', () => {search(); searchAnim();});
textField.addEventListener('click', wordAnim);

//Executes when searchButton is clicked
function search() {

    //Empty the container to prepare for new results
    container.innerHTML = "";

    //Save data inputted by user in variables
    var word = textField.value;
    var language = languageField.value;

    //Create the url for the GET call based on user input
    var url = "https://api.gavagai.se/v3/lexicon/" + language + "/" + word + 
        "?additionalFields=SEMANTICALLY_SIMILAR_WORDS&apiKey=8c79736f393ab6eff4a864fcfa23344c";
    
    //Create new request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    //Modify the received data
    request.onload = function() {

        //Animate the container
        containerAnim();

        //Check if request was succesfull
        if (request.status >= 200 && request.status < 400) {

            //Transform JSON string to object
            var data = JSON.parse(this.response);

            //If there's NO Sematically similar words...
            if (data.semanticallySimilarWords.length == 0){

                errorMessage("Didn't find any words matching your search. Try something else!");

            //If there ARE Sematically similar words...
            } else {
                //Acces each semantically similar word
                data.semanticallySimilarWords.forEach(element => {
                    
                    //Create a "wordTile" div for each word
                    const wordTile = document.createElement('div');
                    wordTile.setAttribute('class', 'tile');

                    //Create an anchor element containing the semantically similar word
                    const a = document.createElement('a');
                    a.textContent = element.word;

                    //Add listener that triggers a modal with word-info
                    a.addEventListener("click", function() {
                        infoWindow(this.text,language)}, true);

                    //Appending the wordTile to the container, and the anchor/word to the wordTile
                    container.appendChild(wordTile);
                    wordTile.appendChild(a);
                });
            }
            
        //If request is not working show error message...
        } else {
            errorMessage("Something wrong with the API request... Sorry for that!")
        }
    }

    request.send();
}


//Open a modal window with info about the word that is clicked
function infoWindow(word, language){

    //Call to findInfo function that sends a request for info about selected word
    findInfo(word, language);

    //Boolean keeping track of whether modal is open or not
    const modalOpen = true;

    // Get the span element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the span (the X), close the modal
    span.onclick = function() {
        modalCloseAnim();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target != modal && modalOpen == true) {
            modalCloseAnim();
            modalOpen = false;
        }
    }
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

        //Make the modal visible
        modalOpenAnim();

        //Check if request was succesfull
        if (request.status >= 200 && request.status < 400) {
            //Transform JSON string to object
            var data = JSON.parse(this.response);

            //If there's NO word-info...
            if (data.resultCode == "NO_DATA"){

                errorMessage("Didn't find any information about this word...");

            //If there IS word-info...
            } else {

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
            }

        //If the request fails for some reason...
        } else {
            errorMessage("Something wrong with the API request... Sorry for that!");
        }
    }

    request.send();
}




//Error message displayed as a tile
function errorMessage(message){

    //Create a "wordTile"
    const wordTile = document.createElement('div');
    wordTile.setAttribute('class', 'tile');

    //Create a paragraph with error message
    const p = document.createElement('p');
    p.setAttribute('class', 'error');
    p.textContent = message;
    
    //Appending the wordTile to the container, and the paragraph to the wordTile
    container.appendChild(wordTile);
    wordTile.appendChild(p);
}


// ANIMATIONS

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
    TweenMax.to('h1', 1, {marginTop: "4vh",delay: 0.5, ease: Power2.easeInOut});
    TweenMax.to('#form', 1, {marginTop: "4vh",delay: 0.5, ease: Power2.easeInOut});
    
}

function containerAnim() {
    TweenMax.from('.container', 2, {marginTop: "-100vh",opacity: 0, delay: 0, ease: Power2.easeInOut});
}

function modalOpenAnim(){
    TweenMax.to('#modal', 0.5, {display: "block", opacity: 1, delay: 0, ease: Power2.easeInOut});
    TweenMax.to('#shadow', 0.5, {display: "block", opacity: 1, delay: 0, ease: Power2.easeInOut});
}

function modalCloseAnim(){
    TweenMax.to('#modal', 0.5, {display: "none", opacity: 0, delay: 0, ease: Power2.easeInOut});
    TweenMax.to('#shadow', 0.5, {display: "none", opacity: 0, delay: 0, ease: Power2.easeInOut});
}
