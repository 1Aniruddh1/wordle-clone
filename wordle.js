var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;

var wordList = [
    "apple", "brave", "crown", "drift", "eagle", "flame", "grape", "hover", "ivory", "jolly",
    "kneel", "lemon", "mango", "noble", "orbit", "piano", "queen", "rival", "shore", "table",
    "umbra", "vivid", "waltz", "xenon", "young", "zebra", "angel", "blend", "crisp", "daisy",
    "ember", "frost", "glove", "haste", "index", "jewel", "karma", "latch", "mirth", "nerve",
    "ocean", "pearl", "quilt", "roast", "spice", "trace", "unify", "vigor", "wound", "yield",
    "abide", "blaze", "coral", "drape", "elite", "forge", "gleam", "haste", "irony", "jaunt",
    "knock", "lunar", "medal", "niche", "oxide", "punch", "quirk", "rhyme", "solar", "trend",
    "ultra", "voter", "wiser", "xylem", "yacht", "zesty", "alien", "boost", "charm", "diver",
    "eject", "flare", "grind", "hoist", "input", "jumps", "knack", "liver", "motel", "nerds",
    "ounce", "prawn", "quest", "rider", "sheep", "timed", "urban", "vowel", "wrist", "yours"
];

var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
console.log(word);

window.onload = function() {
    initialize();
};

function initialize() {
    for (r = 0; r < height; r++) {
        for (c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");
            let key = currRow[j];
            keyTile.innerText = key;

            if (key == "Enter") {
                keyTile.id = "Enter";
            } else if (key == "⌫") {
                keyTile.id = "Backspace";
            } else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }

            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    document.addEventListener("keyup", (e) => {
        processInput(e);
    });
}

function processKey() {
    let e = { code: this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return;

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currentTile = document.getElementById(row.toString() + "-" + col.toString());
            if (currentTile.innerText == "") {
                currentTile.innerText = e.code[3];
                col += 1;
            }
        }
    } else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currentTile = document.getElementById(row.toString() + "-" + col.toString());
        currentTile.innerText = "";
    } else if (e.code == "Enter") {
        if (col < width) return;
        update();
        row += 1;
        col = 0;
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    let correct = 0;
    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: Mark correct
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row + "-" + c);
        let letter = currentTile.innerText;

        if (letter == word[c]) {
            currentTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.remove("absent");
            keyTile.classList.add("correct");

            correct++;
            letterCount[letter]--;
        }
    }

    if (correct == width) {
        gameOver = true;
    }

    // Second pass: Mark present or absent
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row + "-" + c);
        let letter = currentTile.innerText;

        if (!currentTile.classList.contains("correct")) {
            let keyTile = document.getElementById("Key" + letter);

            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("present");

                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.remove("absent");
                    keyTile.classList.add("present");
                }

                letterCount[letter]--;
            } else {
                currentTile.classList.add("absent");

                if (!keyTile.classList.contains("correct") && !keyTile.classList.contains("present")) {
                    keyTile.classList.add("absent");
                }
            }
        }
    }
}
