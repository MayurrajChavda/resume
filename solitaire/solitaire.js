let pack = document.querySelector('.pack');
let _open = document.querySelector('.open');
let heart = document.querySelector('.heart');
let diamond = document.querySelector('.diamond');
let club = document.querySelector('.club');
let spade = document.querySelector('.spade');
let columns = document.querySelectorAll('.cols');

let packArr = [];
let openArr = [];
let heartArr = [];
let diamondArr = [];
let clubArr = [];
let spadeArr = [];
let tableau = [[], [], [], [], [], [], []];

const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let pickedCard = null;
let pickedFrom = { source: null, column: null, index: null };

function generateDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({
                id: deck.length + 1,
                suit,
                value,
                faceUp: false,
                color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black',
                image: `cards/${suit}_${value}.png`
            });
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function distributeCards(){
    let deck = generateDeck();
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = deck.shift();
            if (j === i) card.faceUp = true;
            tableau[i].push(card);
        }
    }
    packArr = deck;
}

function getCardValue(value) {
    return values.indexOf(value);
}

function isValidDrop(picked, target) {
    if (!target)  return picked.value === 'K';
    const colorsDifferent = picked.color !== target.color;
    const valueOrder = getCardValue(target.value) === getCardValue(picked.value) + 1;
    return colorsDifferent && valueOrder;
}

function checkWin(){
    return 
    heartArr.length===13 &&
    diamondArr.length===13 &&
    clubArr.length===13 &&
    spadeArr.length===13
}

function createCardImage(src, top = 0) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'card';
    img.style.position = 'absolute';
    img.style.top = `${top}px`;
    img.alt = "card";
    return img;
}

function render() {
    [pack, _open, heart, diamond, club, spade].forEach(el => {
        while (el.firstChild) el.removeChild(el.firstChild);
    });
    columns.forEach(column => {
        while (column.firstChild) column.removeChild(column.firstChild);
    });
    if (packArr.length > 0) {
        pack.appendChild(createCardImage('cards/card_back.png'));
    }
    if (openArr.length > 0) _open.appendChild(createCardImage(openArr[0].image));
    if (heartArr.length > 0) heart.appendChild(createCardImage(heartArr[heartArr.length-1].image));
    if (diamondArr.length > 0) diamond.appendChild(createCardImage(diamondArr[diamondArr.length-1].image));
    if (spadeArr.length > 0) spade.appendChild(createCardImage(spadeArr[spadeArr.length-1].image));
    if (clubArr.length > 0) club.appendChild(createCardImage(clubArr[clubArr.length-1].image));
    tableau.forEach((table, tableIndex) => {
        table.forEach((card, cardIndex) => {
            const imagePath = card.faceUp ? card.image : 'cards/card_back.png';
            const img = createCardImage(imagePath, cardIndex * 25);
            if(card.faceUp){
                img.addEventListener("click",()=>{
                    if(!pickedCard){
                        pickedCard = card;
                        pickedFrom.source = "tableau";
                        pickedFrom.column = tableIndex;
                        pickedFrom.index = cardIndex;
                        console.log("Card picked from",pickedFrom.source);
                        console.log(pickedCard);
                    } else {
                        if(pickedFrom.source == "open"){
                            if(isValidDrop(pickedCard,card)){
                                tableau[tableIndex].push(Object.assign(openArr.shift(), { faceUp: true }));
                                pickedCard = null;
                                render();
                            } else {
                                console.log("Invalid move");
                            }
                            pickedCard = null;
                            pickedFrom = { source: null, column: null, index: null };
                        } else if(pickedFrom.source == "tableau"){
                            const targetStack = tableau[tableIndex];
                            const targetCard = targetStack[targetStack.length - 1];
                            if (isValidDrop(pickedCard, targetCard)) {
                                if (pickedFrom.source === 'tableau') {
                                    const movingStack = tableau[pickedFrom.column].splice(pickedFrom.index);
                                    tableau[tableIndex].push(...movingStack);
                                    const fromStack = tableau[pickedFrom.column];
                                    if (fromStack.length > 0 && !fromStack[fromStack.length - 1].faceUp) {
                                        fromStack[fromStack.length - 1].faceUp = true;
                                    }
                                } else if (pickedFrom.source === 'open') {
                                    tableau[tableIndex].push(openArr.shift());
                                }
                            } else {
                                console.log("Invalid")
                            }
                            pickedCard = null;
                            pickedFrom = { source: null, column: null, index: null };
                            render();
                        } else if(pickedFrom.source == "foundation"){
                            if(isValidDrop(pickedCard,card)){
                                let c = null;
                                switch(pickedCard.suit){
                                    case "hearts":{
                                        c = heartArr.pop();
                                        break;
                                    }
                                    case "clubs":{
                                        c = clubArr.pop();
                                        break;
                                    }
                                    case "diamonds":{
                                        c = diamondArr.pop();
                                        break;
                                    }
                                    case "spades":{
                                        c = spadeArr.pop();
                                        break;
                                    }
                                }
                                c.faceUp = true;
                                table.push(c);
                                render();
                            }else{
                                console.log("Invalid move");
                            }
                            pickedCard = null;
                            pickedFrom = { source: null, column: null, index: null };
                        }
                    }
                });
            }
            columns[tableIndex].appendChild(img);
        });
    });
    columns.forEach((col, colIndex) => {
        col.addEventListener('click', () => {
            if (tableau[colIndex].length === 0 && pickedCard && pickedCard.value === 'K') {
                if (pickedFrom.source === 'open') {
                    let c = openArr.shift();
                    c.faceUp = true;
                    tableau[colIndex].push(c);
                } else if (pickedFrom.source === 'tableau') {
                    const movingStack = tableau[pickedFrom.column].splice(pickedFrom.index);
                    tableau[colIndex] = [...tableau[colIndex], ...movingStack];
    
                    const fromStack = tableau[pickedFrom.column];
                    if (fromStack.length > 0 && !fromStack[fromStack.length - 1].faceUp) {
                        fromStack[fromStack.length - 1].faceUp = true;
                    }
                }
                pickedCard = null;
                pickedFrom = { source: null, column: null, index: null };
                render();
            }
        });
    });
}

distributeCards();
render();

pack.addEventListener("click",()=>{
    if(packArr.length>0){
        let pickCard = packArr.pop();
        openArr.unshift(pickCard);
    }else{
        packArr = openArr;
        openArr = [];
    }
    pickedCard = null;
    pickedFrom = { column: null, index: null };
    render();
});

_open.addEventListener("click",()=>{
    if(openArr.length>0) {
        if(pickedCard && pickedFrom.source != "open"){
            pickedCard = null;
            pickedFrom = { source: null, column: null, index: null };
            console.log("Invalid move");
        } else {
            pickedCard = openArr[0];
            pickedFrom.source = "open";
            console.log("Card picked from",pickedFrom.source);
            console.log(pickedCard);
        }
    }
});

heart.addEventListener("click", () => {handleFoundationClick(heartArr, 'hearts');});
diamond.addEventListener("click", () => {handleFoundationClick(diamondArr, 'diamonds');});
club.addEventListener("click", () => {handleFoundationClick(clubArr, 'clubs');});
spade.addEventListener("click", () => {handleFoundationClick(spadeArr, 'spades');});

function handleFoundationClick(foundationArr, suit) {
    if (!pickedCard) {
        pickedCard = foundationArr[foundationArr.length-1];
        pickedFrom.source = 'foundation';
        console.log("Card picked from",pickedFrom.source);
        console.log(pickedCard);
        return;
    }
    const topCard = foundationArr[foundationArr.length - 1];
    const isCorrectSuit = pickedCard.suit === suit;
    const isCorrectValue =
        (!topCard && pickedCard.value === 'A') ||
        (topCard && getCardValue(pickedCard.value) === getCardValue(topCard.value) + 1);
    if (isCorrectSuit && isCorrectValue) {
        foundationArr.push(pickedCard);
        if (pickedFrom.source === 'open') {
            openArr.shift();
        } else if (pickedFrom.source === 'tableau') {
            tableau[pickedFrom.column].splice(pickedFrom.index);
            const fromStack = tableau[pickedFrom.column];
            if (fromStack.length > 0 && !fromStack[fromStack.length - 1].faceUp) {
                fromStack[fromStack.length - 1].faceUp = true;
            }
        }
        pickedCard = null;
        pickedFrom = { source: null, column: null, index: null };
        render();
    } else {
        console.log("Invalid foundation move");
        pickedCard = null;
        pickedFrom = { source: null, column: null, index: null };
    }
}