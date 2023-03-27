const inputField = document.getElementById("searchInput");
const searchBtn = document.getElementById("search");
const dictionaryContainer = document.getElementById("dicContainer");

const fetchDicData = async () => {

    try {
        dictionaryContainer.innerHTML = "";
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputField.value.toLowerCase()}`;
        const res = await fetch(url);
        if (res.status === 404) {
            dictionaryContainer.innerText = "No Valid Word Found According To Your Search";
            return;
        }
        const data = await res.json();
        // console.log(data);
        displayData(data);
    }
    catch (error) {
        console.log(error);
    }
}

const displayData = (data) => {
    const dicData = data[0];
    // console.log(dicData);
    const { word, sourceUrls, phonetics, meanings } = dicData;
    // console.log(word, sourceUrls, phonetics, meanings);

    if (phonetics.length === 0) phonetics.push({ text: "no phonetics available" });

    const whichPartsOfSpeech = [];
    const nounDescArr = [];
    const verbDescArr = [];

    meanings.forEach(obj => {
        if (obj["partOfSpeech"] === "noun" && obj["definitions"] !== null) {
            whichPartsOfSpeech.push(obj["partOfSpeech"]);
            obj["definitions"].forEach(obj => nounDescArr.push(obj["definition"]));
        }
        if (obj["partOfSpeech"] === "verb" && obj["definitions"] !== null) {
            whichPartsOfSpeech.push(obj["partOfSpeech"]);
            obj["definitions"].forEach(obj => verbDescArr.push(obj["definition"]));
        }
    });


    const article = document.createElement("article");

    article.innerHTML = `
        <header>
            <h1>${word}</h1>
            <p>${phonetics[0]["text"] === undefined ? phonetics[1]["text"] : phonetics[0]["text"]}</p>
            <p>${meanings[0]["partOfSpeech"]}</p>
        </header>
        <article>
            <h2>Meaning</h2>
            <ul id="nounDescContainer">
            </ul>
            <h2></h2>
        </article>
        <article>
            <h2 id="synonym">Synonym: ${meanings[0]["synonyms"][0] === undefined ? "not found" : meanings[0]["synonyms"][0]}</h2>
            <p>${meanings[1] === undefined ? "" : meanings[1]["partOfSpeech"]}</p>
            <h2>${whichPartsOfSpeech.includes("verb") ? "Meaning" : ""}</h2>
            <ul id="verbDescContainer">
                
            </ul>
        </article>
        <footer><a target="_blank" href="${sourceUrls}">${sourceUrls}</a></footer>
        <button class="mt-3" id="btn" onclick="playAudio('${phonetics[0]['audio']}')">Play Audio</button>
    `;

    dictionaryContainer.appendChild(article); //verbDescContainer

    if (nounDescArr.length !== 0) {
        nounDescArr.forEach(str => {
            const li = document.createElement("li");
            li.innerText = str;

            document.getElementById("nounDescContainer").appendChild(li);
        });
    }

    if (verbDescArr.length !== 0) {
        verbDescArr.forEach(str => {
            const li = document.createElement("li");
            li.innerText = str;

            document.getElementById("verbDescContainer").appendChild(li);
        });
    }


}

const playAudio = (url) => {
    const beat = new Audio(url);
    beat.play();
}

searchBtn.addEventListener("click", fetchDicData);