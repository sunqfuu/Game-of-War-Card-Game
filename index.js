
let deckId
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")

async function handleClick() {
    try {
        const res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        const data = await res.json()

        remainingText.textContent = `Remaining cards: ${data.remaining}`
        deckId = data.deck_id
        drawCardBtn.disabled = false
        computerScore = 0
        myScore = 0
        computerScoreEl.textContent = `Computer: 0`
        myScoreEl.textContent = `You: 0`
        header.textContent = "Game of War"
        cardsContainer.children[0].innerHTML = ""
        cardsContainer.children[1].innerHTML = ""
    } catch (err) {
        console.error("Error fetching new deck:", err)
        header.textContent = "Error! Could not start a new game."
    }
}

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)

    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `Computer: ${computerScore}`
        return "Computer wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++
        myScoreEl.textContent = `You: ${myScore}`
        return "You win!"
    } else {
        return "War!"
    }
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", async () => {
    // Check if a deck exists before drawing
    if (!deckId) {
        header.textContent = "Please start a new game first!"
        return
    }

    try {
        const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        const data = await res.json()

        if (data.success) {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `<img src=${data.cards[0].image} class="card" />`
            cardsContainer.children[1].innerHTML = `<img src=${data.cards[1].image} class="card" />`

            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText

            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                if (computerScore > myScore) {
                    header.textContent = "The computer won the game!"
                } else if (myScore > computerScore) {
                    header.textContent = "You won the game!"
                } else {
                    header.textContent = "It's a tie game!"
                }
            }
        } else {
            // Handle API errors, e.g., drawing from an exhausted deck
            header.textContent = "No cards left to draw!"
            drawCardBtn.disabled = true
        }
    } catch (err) {
        console.error("Error drawing cards:", err)
        header.textContent = "Error! Could not draw cards."
    }
})

// Initialize with a disabled draw button
drawCardBtn.disabled = true

