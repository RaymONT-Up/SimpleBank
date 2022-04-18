"use strict";

// Test accounts
const account1 = {
  login: "Vlady",
  userName: "Влад Русаков",
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100, 1000, 666.66],
  transactionsDates: [
    "2021-10-02T14:43:31.074Z",
    "2021-10-29T11:24:19.761Z",
    "2021-11-15T10:45:23.907Z",
    "2022-01-22T12:17:46.255Z",
    "2022-04-09T15:14:06.486Z",
    "2022-04-15T11:42:26.371Z",
    "2022-04-16T07:43:59.331Z",
    "2022-04-17T15:21:20.814Z",
    "2022-04-18T22:02:20.814Z",
    "2022-04-18T15:15:20.814Z",
  ],

  loanDebt: 2500,
  pin: 1111,
};

const account2 = {
  login: "Andry",
  userName: "Андрей Русин",
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  transactionsDates: [
    "2020-10-02T14:43:31.074Z",
    "2020-10-29T11:24:19.761Z",
    "2020-11-15T10:45:23.907Z",
    "2021-01-22T12:17:46.255Z",
    "2021-02-12T15:14:06.486Z",
    "2022-03-09T11:42:26.371Z",
    "2022-04-16T07:43:59.331Z",
    "2022-04-18T15:21:20.814Z",
  ],
  loanDebt: 1200,
  pin: 2222,
};

const account3 = {
  login: "Maksy",
  userName: "Максим Алексеев",
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  transactionsDates: [
    "2020-10-02T14:43:31.074Z",
    "2020-10-29T11:24:19.761Z",
    "2020-11-15T10:45:23.907Z",
    "2021-01-22T12:17:46.255Z",
    "2021-02-12T15:14:06.486Z",
    "2022-03-09T11:42:26.371Z",
    "2022-04-15T07:43:59.331Z",
    "2022-04-16T15:21:20.814Z",
  ],
  loanDebt: 100,
  pin: 3333,
};

const account4 = {
  login: "Georgy",
  userName: "Георгий Сапагов",
  transactions: [530, 1300, 500, 40, 190],
  transactionsDates: [
    "2021-10-02T14:43:31.074Z",
    "2021-10-29T11:24:19.761Z",
    "2022-03-15T10:45:23.907Z",
    "2022-04-10T12:17:46.255Z",
    "2022-04-12T15:14:06.486Z",
  ],
  loanDebt: 50,
  pin: 4444,
};

const account5 = {
  login: "Dany",
  userName: "Данил Фамильев",
  transactions: [630, 800, 300, 50, 120],
  transactionsDates: [
    "2021-10-02T14:43:31.074Z",
    "2021-10-29T11:24:19.761Z",
    "2022-03-15T10:45:23.907Z",
    "2022-04-10T12:17:46.255Z",
    "2022-04-12T15:14:06.486Z",
  ],
  loanDebt: 0,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".total__value--in");
const labelSumOut = document.querySelector(".total__value--out");
const labelsumDebt = document.querySelector(".form__label--loan-debt-total");
const labelCommission = document.querySelector(
  ".form__label--amount-with-commission"
);
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnQuit = document.querySelector(".btn--quit-account");
const btnHelp = document.querySelector(".help__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");

const loginWrapper = document.querySelector(".login");
const loginError = document.querySelector(".login__error");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount, currentAccountIndex, currentLogOutTimer;

const formatTransactionDate = date => {
  const getDaysBetween2Dates = (startDate, endDate) =>
    Math.round(Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24)));

  const daysPassed = getDaysBetween2Dates(new Date(), date);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (daysPassed === 0) return `Сегодня в ${hours}:${minutes}`;
  if (daysPassed === 1) return `Вчера в ${hours}:${minutes}`;
  if (daysPassed === 2) return `Позавчера в ${hours}:${minutes}`;
  if (daysPassed === 3) return `${daysPassed} дня назад в ${hours}:${minutes}`;
  if (daysPassed === 4) return `${daysPassed} дня назад в ${hours}:${minutes}`;
  if (daysPassed === 5) return `${daysPassed} дней назад в ${hours}:${minutes}`;
  if (daysPassed === 6) return `${daysPassed} дней назад в ${hours}:${minutes}`;
  if (daysPassed >= 7 && daysPassed < 14) return `Неделю назад`;
  else return `${day}/${month}/${year}`;
};

// display transactions
const displayTransactions = function (account) {
  // clear container
  containerTransactions.innerHTML = "";

  // added a transactions in container
  account.transactions.forEach((transaction, index) => {
    const transactionType = transaction > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.transactionsDates[index]);
    const transDate = formatTransactionDate(date);

    const transactionRow = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${transactionType}">
         ${transactionType === "deposit" ? "Пополнение" : "Вывод"}
      </div>
      <div class="transactions__date">${transDate}</div>
      <div class="transactions__value">${transaction.toFixed(2)}$</div>
    </div>
    `;

    containerTransactions.insertAdjacentHTML("afterbegin", transactionRow);
  });
};

// display balance
const displayBalance = function (account) {
  // balance = sum the transactions
  const balance = account.transactions
    .reduce((acc, trans) => acc + trans, 0)
    .toFixed(2);
  account.balance = balance;
  // display balance in HTML
  labelBalance.textContent = `${balance}$`;

  // display name account in HTML
  document.querySelector(
    ".balance__label"
  ).textContent = `Добрый день ${currentAccount.userName.slice(
    0,
    currentAccount.userName.indexOf(" ")
  )}!`;
};

// display total
const displayTotalTransactions = function (account) {
  // sum a deposit
  const totalDeposit = account.transactions
    .filter(transaction => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0)
    .toFixed(2);

  labelSumIn.textContent = `${totalDeposit}$`;

  // sum a withdrawals
  const totalWithdrawals = account.transactions
    .filter(transaction => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0)
    .toFixed(2);

  labelSumOut.textContent = `${totalWithdrawals.replace("-", "")}$`;
};
// display loan Debt
const displayLoanDebt = function (account) {
  account.loanDebt < 100
    ? (labelsumDebt.style.color = "#76ff76")
    : (labelsumDebt.style.color = "#ff8888");

  labelsumDebt.textContent = `${account.loanDebt.toFixed(2)}$`;
};

// Update Ui
const updateUi = function (account) {
  // display transactions
  displayTransactions(account);

  // display balance
  displayBalance(account);

  // display total
  displayTotalTransactions(account);

  // display loan debt
  displayLoanDebt(account);

  // display now date
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  labelDate.textContent = ` 
  ${day}/${month}/${year}`;
};

const quitAccount = () => {
  currentAccount = undefined;
  currentAccountIndex = undefined;
  loginWrapper.style.display = "flex";
  containerApp.style.display = "none";
  // Cheack if the timer exist
  clearInterval(currentLogOutTimer);
  currentLogOutTimer = undefined;
};

const startLogoutTimer = function () {
  const logOutTimerCallback = () => {
    const minutes = String(Math.trunc(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    //  In each call, show the remaining time in the UI
    labelTimer.textContent = `${minutes}:${seconds}`;

    //  if the time is up we exit the app
    if (time === 0) {
      quitAccount();
    }
    time--;
  };

  //  Set application exit time
  let time = 210;

  // Call the timer every second
  logOutTimerCallback();
  const logOutTimer = setInterval(logOutTimerCallback, 1000);
  return logOutTimer;
};

// *********** Events
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

    // Cheack if the timer exist
    if (currentLogOutTimer) clearInterval(currentLogOutTimer);
    currentLogOutTimer = startLogoutTimer();

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
    // Add transaction
    currentAccount.transactions.push(
      -(transferAmount - (transferAmount * 3) / 100)
    );
    recipientAccount.transactions.push(
      transferAmount - (transferAmount * 3) / 100
    );
    // Add transaction date
    currentAccount.transactionsDates.push(new Date().toISOString());
    recipientAccount.transactionsDates.push(new Date().toISOString());

    updateUi(currentAccount);

    inputTransferAmount.value = "";
    inputTransferTo.value = "";
    labelCommission.textContent = "";
  }

  // Reset the timer
  clearInterval(currentLogOutTimer);
  currentLogOutTimer = startLogoutTimer();
});
inputTransferAmount.addEventListener("input", function () {
  labelCommission.textContent = `Сумма с комиссией: ${
    this.value - (this.value * 3) / 100
  }$`;
});

// Loan
btnLoan.addEventListener("click", e => {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (loanAmount > 0 && currentAccount.balance > loanAmount * 3) {
    currentAccount.loanDebt += loanAmount;

    // Add transction and transaction date
    currentAccount.transactions.push(loanAmount);
    currentAccount.transactionsDates.push(new Date().toISOString());

    updateUi(currentAccount);
    inputLoanAmount.value = "";
  }

  // Reset the timer
  clearInterval(currentLogOutTimer);
  currentLogOutTimer = startLogoutTimer();
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
  } else {
    // Reset the timer
    clearInterval(currentLogOutTimer);
    currentLogOutTimer = startLogoutTimer();
  }
});

//
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
