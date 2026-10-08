/* ==========================================
   ACCOUNT MODAL
========================================== */

const accountCards = document.querySelectorAll(".account-card");
const modal = document.getElementById("accountModal");

if (accountCards.length > 0 && modal) {

    const modalCode = document.getElementById("modalCode");
    const modalTitle = document.getElementById("modalTitle");
    const modalClass = document.getElementById("modalClass");
    const closeModal = document.querySelector(".close-modal");

    accountCards.forEach(card => {

        card.addEventListener("click", () => {

            modalCode.textContent = card.textContent.trim();
            modalTitle.textContent = card.dataset.title;
            modalClass.textContent = card.dataset.class;

            modal.classList.add("show");
        });

    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    modal.addEventListener("click", e => {

        if (e.target === modal) {
            modal.classList.remove("show");
        }

    });
}


/* ==========================================
   LEADERBOARD
========================================== */

function saveLeaderboard(name, score, activity) {

    let leaderboard =
        JSON.parse(localStorage.getItem("accountiLeaderboard")) || [];

    leaderboard.push({
        name: name,
        score: score,
        activity: activity,
        date: new Date().toLocaleDateString()
    });

    leaderboard.sort((a, b) => b.score - a.score);

    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem(
        "accountiLeaderboard",
        JSON.stringify(leaderboard)
    );
}


function displayLeaderboard() {

    const board = document.getElementById("leaderboardHome");

    if (!board) return;

    const leaderboard =
        JSON.parse(localStorage.getItem("accountiLeaderboard")) || [];

    if (leaderboard.length === 0) {
        board.innerHTML =
            `<p class="empty-board">
                No scores yet. Play a game or quiz to appear here!
            </p>`;
        return;
    }

    board.innerHTML = leaderboard.map((item, index) => {

        return `
            <div class="leader-row">
                <strong>#${index + 1}</strong>
                <span>${item.name}</span>
                <span>${item.activity}</span>
                <strong>${item.score}</strong>
            </div>
        `;

    }).join("");
}

displayLeaderboard();


/* ==========================================
   GAMES
========================================== */

let selectedGame = "";
let gamePlayer = "";
let gameQuestionIndex = 0;
let gameScore = 0;


const gameQuestions = {

    symbol: [

        {
            q: "What does AR mean?",
            choices: [
                "Accounts Receivable",
                "Accounts Revenue",
                "Accrued Receivable",
                "Asset Receivable"
            ],
            answer: 0
        },

        {
            q: "What does AP mean?",
            choices: [
                "Asset Payable",
                "Accounts Payable",
                "Accrued Payable",
                "Accounts Purchase"
            ],
            answer: 1
        },

        {
            q: "What does NP mean?",
            choices: [
                "Notes Payable",
                "Net Payable",
                "Notes Purchase",
                "Non-current Payable"
            ],
            answer: 0
        },

        {
            q: "What does PCF mean?",
            choices: [
                "Petty Cash Fund",
                "Personal Cash Fund",
                "Paid Cash Fund",
                "Petty Credit Fund"
            ],
            answer: 0
        },

        {
            q: "What does MAE mean?",
            choices: [
                "Machinery and Equipment",
                "Main Accounting Expense",
                "Machinery Account Expense",
                "Monthly Asset Equipment"
            ],
            answer: 0
        }

    ],


    classification: [

        {
            q: "How is Accounts Receivable classified?",
            choices: [
                "Asset",
                "Liability",
                "Revenue",
                "Expense"
            ],
            answer: 0
        },

        {
            q: "How is Accounts Payable classified?",
            choices: [
                "Asset",
                "Liability",
                "Equity",
                "Revenue"
            ],
            answer: 1
        },

        {
            q: "How is Service Revenue classified?",
            choices: [
                "Asset",
                "Liability",
                "Revenue",
                "Expense"
            ],
            answer: 2
        },

        {
            q: "How is Wages Expense classified?",
            choices: [
                "Asset",
                "Expense",
                "Equity",
                "Revenue"
            ],
            answer: 1
        },

        {
            q: "How is Capital classified?",
            choices: [
                "Asset",
                "Liability",
                "Owner's Equity",
                "Expense"
            ],
            answer: 2
        }

    ],


    equation: [

        {
            q: "If Assets are ₱100,000 and Liabilities are ₱40,000, what is Owner's Equity?",
            choices: [
                "₱40,000",
                "₱60,000",
                "₱100,000",
                "₱140,000"
            ],
            answer: 1
        },

        {
            q: "If Assets are ₱250,000 and Owner's Equity is ₱150,000, what are Liabilities?",
            choices: [
                "₱50,000",
                "₱100,000",
                "₱150,000",
                "₱400,000"
            ],
            answer: 1
        },

        {
            q: "Which equation is correct?",
            choices: [
                "Assets = Liabilities + Owner's Equity",
                "Assets = Revenue + Expenses",
                "Equity = Assets + Liabilities",
                "Liabilities = Assets + Equity"
            ],
            answer: 0
        },

        {
            q: "If Liabilities are ₱80,000 and Equity is ₱120,000, what are Assets?",
            choices: [
                "₱40,000",
                "₱80,000",
                "₱120,000",
                "₱200,000"
            ],
            answer: 3
        },

        {
            q: "A business has Assets of ₱500,000 and Liabilities of ₱200,000. What is Equity?",
            choices: [
                "₱200,000",
                "₱300,000",
                "₱500,000",
                "₱700,000"
            ],
            answer: 1
        }

    ],


    equity: [

        {
            q: "What happens to Owner's Equity when the owner invests additional capital?",
            choices: [
                "Increases",
                "Decreases",
                "No effect",
                "Becomes zero"
            ],
            answer: 0
        },

        {
            q: "What happens to Equity when the owner makes a withdrawal?",
            choices: [
                "Increases",
                "Decreases",
                "Doubles",
                "No effect"
            ],
            answer: 1
        },

        {
            q: "What is the effect of revenue on Equity?",
            choices: [
                "Increases Equity",
                "Decreases Equity",
                "No effect",
                "Eliminates Equity"
            ],
            answer: 0
        },

        {
            q: "What is the effect of expenses on Equity?",
            choices: [
                "Increases Equity",
                "Decreases Equity",
                "No effect",
                "Doubles Equity"
            ],
            answer: 1
        },

        {
            q: "Which account normally decreases Owner's Equity?",
            choices: [
                "Service Revenue",
                "Capital",
                "Withdrawals",
                "Sales Revenue"
            ],
            answer: 2
        }

    ]

};


function selectGame(type) {

    selectedGame = type;

    document.getElementById("gameMenu").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");

    window.scrollTo({
        top: document.getElementById("gameArea").offsetTop - 80,
        behavior: "smooth"
    });
}


function startGame() {

    const input = document.getElementById("gamePlayer");

    if (input.value.trim() === "") {
        alert("Please enter your name first.");
        return;
    }

    gamePlayer = input.value.trim();
    gameQuestionIndex = 0;
    gameScore = 0;

    document.querySelector(".player-box").classList.add("hidden");
    document.getElementById("gamePanel").classList.remove("hidden");

    displayGameQuestion();
}


function displayGameQuestion() {

    const questions = gameQuestions[selectedGame];
    const current = questions[gameQuestionIndex];

    document.getElementById("gameScore").textContent =
        Score: ${gameScore};

    document.getElementById("gameNumber").textContent =
        Question ${gameQuestionIndex + 1} of ${questions.length};

    document.getElementById("gameQuestion").textContent =
        current.q;

    document.getElementById("gameCategory").textContent =
        selectedGame.toUpperCase();

    const answerBox =
        document.getElementById("gameAnswers");

    answerBox.innerHTML = "";

    current.choices.forEach((choice, index) => {

        const button = document.createElement("button");

        button.className = "answer-btn";
        button.textContent = choice;

        button.onclick = () =>
            checkGameAnswer(index);

        answerBox.appendChild(button);
    });

    document.getElementById("gameFeedback").textContent = "";

    document.getElementById("gameNext").classList.add("hidden");
}


function checkGameAnswer(selected) {

    const questions = gameQuestions[selectedGame];
    const current = questions[gameQuestionIndex];

    const buttons =
        document.querySelectorAll("#gameAnswers button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selected === current.answer) {

        gameScore++;

        buttons[selected].classList.add("correct");

        document.getElementById("gameFeedback").textContent =
            "Correct! 🎉";

    } else {

        buttons[selected].classList.add("incorrect");

        buttons[current.answer].classList.add("correct");

        document.getElementById("gameFeedback").textContent =
            "Not quite. Check the highlighted answer.";
    }

    document.getElementById("gameScore").textContent =
        Score: ${gameScore};

    document.getElementById("gameNext").classList.remove("hidden");
}


function nextGameQuestion() {

    gameQuestionIndex++;

    if (gameQuestionIndex >= gameQuestions[selectedGame].length) {
        finishGame();
    } else {
        displayGameQuestion();
    }
}


function finishGame() {

    const total = gameQuestions[selectedGame].length;

    saveLeaderboard(
        gamePlayer,
        gameScore,
        "Game"
    );

    document.getElementById("gamePanel").classList.add("hidden");

    document.getElementById("gameResult").classList.remove("hidden");

    document.getElementById("gameResultText").textContent =
        ${gamePlayer}, you scored ${gameScore}/${total}.;
}


/* ==========================================
   QUIZ
========================================== */

const quizQuestions = [

    {
        q: "Which account is classified as a current asset?",
        choices: [
            "Accounts Receivable",
            "Mortgage Payable",
            "Capital",
            "Service Revenue"
        ],
        answer: 0
    },

    {
        q: "A business purchases equipment for cash. What happens to total assets?",
        choices: [
            "They increase",
            "They decrease",
            "They remain unchanged",
            "They become liabilities"
        ],
        answer: 2
    },

    {
        q: "A business earns service revenue in cash. What is the effect?",
        choices: [
            "Cash increases and Equity increases",
            "Cash decreases and Equity decreases",
            "Liabilities increase",
            "Assets decrease"
        ],
        answer: 0
    },

    {
        q: "Assets are ₱180,000 and Liabilities are ₱70,000. What is Equity?",
        choices: [
            "₱90,000",
            "₱100,000",
            "₱110,000",
            "₱250,000"
        ],
        answer: 2
    },

    {
        q: "Which account represents an amount owed to suppliers?",
        choices: [
            "Accounts Receivable",
            "Accounts Payable",
            "Sales Revenue",
            "Office Supplies"
        ],
        answer: 1
    },

    {
        q: "Which transaction decreases Owner's Equity?",
        choices: [
            "Owner investment",
            "Revenue earned",
            "Owner withdrawal",
            "Collection of receivable"
        ],
        answer: 2
    },

    {
        q: "What does NP represent in the Accounti-Table?",
        choices: [
            "Notes Payable",
            "Net Profit",
            "Notes Purchase",
            "Non-current Property"
        ],
        answer: 0
    },

    {
        q: "If Assets are ₱300,000 and Equity is ₱120,000, how much are Liabilities?",
        choices: [
            "₱120,000",
            "₱180,000",
            "₱300,000",
            "₱420,000"
        ],
        answer: 1
    },

    {
        q: "Which pair normally increases Owner's Equity?",
        choices: [
            "Expenses and Withdrawals",
            "Revenue and Capital",
            "Liabilities and Expenses",
            "Withdrawals and Liabilities"
        ],
        answer: 1
    },

    {
        q: "A business receives cash from a customer for services already performed. Which accounts are affected?",
        choices: [
            "Cash and Service Revenue",
            "Accounts Payable and Cash",
            "Equipment and Capital",
            "Withdrawals and Cash"
        ],
        answer: 0
    }

];


let quizPlayer = "";
let quizIndex = 0;
let quizScore = 0;


function startQuiz() {

    const input =
        document.getElementById("quizPlayer");

    if (input.value.trim() === "") {
        alert("Please enter your name first.");
        return;
    }

    quizPlayer = input.value.trim();
    quizIndex = 0;
    quizScore = 0;

    document.getElementById("quizStart")
        .classList.add("hidden");

    document.getElementById("quizPanel")
        .classList.remove("hidden");

    displayQuizQuestion();
}


function displayQuizQuestion() {

    const current = quizQuestions[quizIndex];

    document.getElementById("quizProgress").textContent =
        Question ${quizIndex + 1} of ${quizQuestions.length};

    document.getElementById("quizScore").textContent =
        Score: ${quizScore};

    document.getElementById("progressFill").style.width =
        ${((quizIndex + 1) / quizQuestions.length) * 100}%;

    document.getElementById("quizQuestion").textContent =
        current.q;

    const answerBox =
        document.getElementById("quizAnswers");

    answerBox.innerHTML = "";

    current.choices.forEach((choice, index) => {

        const button = document.createElement("button");

        button.className = "answer-btn";
        button.textContent = choice;

        button.onclick = () =>
            checkQuizAnswer(index);

        answerBox.appendChild(button);
    });

    document.getElementById("quizFeedback").textContent = "";

    document.getElementById("quizNext")
        .classList.add("hidden");
}


function checkQuizAnswer(selected) {

    const current = quizQuestions[quizIndex];

    const buttons =
        document.querySelectorAll("#quizAnswers button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selected === current.answer) {

        quizScore++;

        buttons[selected].classList.add("correct");

        document.getElementById("quizFeedback").textContent =
            "Correct! 🎉";

    } else {

        buttons[selected].classList.add("incorrect");

        buttons[current.answer].classList.add("correct");

        document.getElementById("quizFeedback").textContent =
            "Incorrect. Review the highlighted answer.";
    }

    document.getElementById("quizScore").textContent =
        Score: ${quizScore};

    document.getElementById("quizNext")
        .classList.remove("hidden");
}


function nextQuizQuestion() {

    quizIndex++;

    if (quizIndex >= quizQuestions.length) {
        finishQuiz();
    } else {
        displayQuizQuestion();
    }
}


function finishQuiz() {

    saveLeaderboard(
        quizPlayer,
        quizScore,
        "Quiz"
    );

    document.getElementById("quizPanel")
        .classList.add("hidden");

    document.getElementById("quizResult")
        .classList.remove("hidden");

    document.getElementById("quizResultText").textContent =
        ${quizPlayer}, you scored ${quizScore}/${quizQuestions.length}.;
}