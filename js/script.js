"use strict";

// Test accounts
const account1 = {
  login: "Vlady",
  userName: "Влад Русаков",
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  creditBalance: 0,
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  login: "Andry",
  userName: "Андрей Русин",
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  creditBalance: 0,
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  login: "Maksy",
  userName: "Максим Алексеев",
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  creditBalance: 0,
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  login: "Georgy",
  userName: "Георгий Сапагов",
  transactions: [530, 1300, 500, 40, 190],
  creditBalance: 0,
  interest: 1,
  pin: 4444,
};

const account5 = {
  login: "Dany",
  userName: "Данил Фамильев",
  transactions: [630, 800, 300, 50, 120],
  creditBalance: 0,
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".total__value--in");
const labelSumOut = document.querySelector(".total__value--out");
const labelSumInterest = document.querySelector(".total__value--interest");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnQuit = document.querySelector(".quit-account");
const btnHelp = document.querySelector(".help__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const loginWrapper = document.querySelector(".login");
const loginError = document.querySelector(".login__error");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;
let currentAccountIndex;
// display transactions
const displayTransactions = function (transactions) {
  // clear container
  containerTransactions.innerHTML = "";

  // added a transactions in container
  transactions.forEach((transaction, index) => {
    const transactionType = transaction > 0 ? "deposit" : "withdrawal";

    const transactionRow = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${transactionType}">
        ${index + 1} ${transactionType}
      </div>
      <div class="transactions__value">${transaction}$</div>
    </div>
    `;

    containerTransactions.insertAdjacentHTML("afterbegin", transactionRow);
  });
};

// display balance
const displayBalance = function (account) {
  // balance = sum the transactions
  const balance = account.transactions.reduce((acc, trans) => acc + trans, 0);
  account.balance = balance;
  // display balance in HTML
  labelBalance.textContent = `${balance}$`;
};

// display total
const displayTotalTransactions = function (account) {
  // sum a deposit
  const totalDeposit = account.transactions
    .filter(transaction => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0);

  labelSumIn.textContent = `${totalDeposit}$`;

  // sum a withdrawals
  const totalWithdrawals = account.transactions
    .filter(transaction => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);

  labelSumOut.textContent = `${Math.abs(totalWithdrawals)}$`;

  // sum Interest
  const interestTotal = account.transactions
    .filter(transaction => transaction > 0)
    .map(deposit => (deposit * account.interest) / 100)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interestTotal.toFixed(2)}$`;
};

// Update Ui
const updateUi = function (account) {
  // display transactions
  displayTransactions(account.transactions);

  // display balance
  displayBalance(account);

  // display total
  displayTotalTransactions(account);
};

// Quit Account
const quitAccount = () => {
  currentAccount = undefined;
  currentAccountIndex = undefined;
  loginWrapper.style.display = "flex";
  containerApp.style.display = "none";
};

// Login account
btnLogin.addEventListener("click", e => {
  e.preventDefault();

  currentAccount = accounts.find(
    account =>
      account.login === inputLoginUsername.value &&
      account.pin === Number(inputLoginPin.value)
  );
  currentAccountIndex = accounts.findIndex(
    account =>
      account.login === inputLoginUsername.value &&
      account.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    // Clear login inputs
    inputLoginUsername.value = "";
    inputLoginPin.value = "";

    // display UI
    loginWrapper.style.display = "none";
    loginError.style.opacity = 0;
    containerApp.style.display = "grid";

    updateUi(currentAccount);
  } else {
    loginError.style.opacity = 1;
  }
});

// Quit account
btnQuit.addEventListener("click", quitAccount);

// Transfer
btnTransfer.addEventListener("click", e => {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const recipientLogin = inputTransferTo.value;
  const recipientAccount = accounts.find(
    account =>
      account.login === recipientLogin && account.login !== currentAccount.login
  );

  // If have work account and transfer money > 0
  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    recipientAccount &&
    recipientAccount?.login !== currentAccount.login
  ) {
    currentAccount.transactions.push(-transferAmount);
    recipientAccount.transactions.push(transferAmount);

    updateUi(currentAccount);

    inputTransferAmount.value = "";
    inputTransferTo.value = "";

    inputTransferAmount.classList.remove("inputErrorAnimate");
    inputTransferTo.classList.remove("inputErrorAnimate");
  }
});

// Loan
btnLoan.addEventListener("click", e => {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  /* 
  if one of the deposits is more than 70% of the loan amount then we give a loan, else we not give a loan
  */
  if (
    loanAmount > 0 &&
    currentAccount.transactions.some(trans => trans >= (loanAmount * 70) / 100)
  ) {
    currentAccount.creditBalance += loanAmount;
    currentAccount.transactions.push(loanAmount);
    updateUi(currentAccount);
    console.log(currentAccount.creditBalance, currentAccount.balance);
  } else {
    console.log(
      "not take",
      currentAccount.creditBalance,
      currentAccount.balance
    );
  }

  inputLoanAmount.value = "";
});

// Delete account
btnClose.addEventListener("click", e => {
  e.preventDefault();

  const userLogin = inputCloseUsername.value;
  const userPin = Number(inputClosePin.value);
  if (userLogin === currentAccount?.login && userPin === currentAccount?.pin) {
    accounts.splice(currentAccountIndex, 1);
    quitAccount();
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
});

// Modal Window
const modalWindow = document.querySelector(".modal-window"),
  overlay = document.querySelector(".overlay"),
  btnCloseModalWindow = document.querySelector(".close-modal-window"),
  btnShowModalWindow = document.querySelector(".show-modal-window");

function openModalWindow() {
  modalWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
}
function closeModalWindow() {
  modalWindow.classList.add("hidden");
  overlay.classList.add("hidden");
}

btnShowModalWindow.addEventListener("click", openModalWindow);
btnCloseModalWindow.addEventListener("click", closeModalWindow);
overlay.addEventListener("click", closeModalWindow);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modalWindow.classList.contains("hidden"))
    closeModalWindow();
});
