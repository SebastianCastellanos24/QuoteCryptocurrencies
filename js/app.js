const currencySelect = document.querySelector("#currency");
const cryptocurrencieSelect = document.querySelector("#cryptocurrencies");
const form = document.querySelector("#form");
const result = document.querySelector("#result");

const objSearch = {
    currency: "",
    cryptocurrencies: "",
}

document.addEventListener("DOMContentLoaded", () => {
    consultCryptocurrencies();
    form.addEventListener("submit", submitForm);
    cryptocurrencieSelect.addEventListener("change", readValue);
    currencySelect.addEventListener("change", readValue);
})

//Promise
const getCryptocurrencies = cryptocurrencies => new Promise( resolve => {
    resolve(cryptocurrencies);
});

function consultCryptocurrencies() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD`;
    
    fetch(url)
        .then( response => response.json() )
        .then( result => getCryptocurrencies(result.Data) )
        .then( cryptocurrencies => selectCryptocurrencies(cryptocurrencies) )

}

function selectCryptocurrencies( cryptocurrencies ) {
    cryptocurrencies.map( crypto => {
        const { FullName, Name } = crypto.CoinInfo;

        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        cryptocurrencieSelect.appendChild(option)
    })
}

function readValue(e) {
    objSearch[e.target.name] = e.target.value;
}

function submitForm (e) {
    e.preventDefault();

    const { currency, cryptocurrencies } = objSearch;
    if( currency === "" || cryptocurrencies === "" ) {
        showAlert("All files are required");
        return;
    }

    //get Api
    getApi();

}

function showAlert(msg) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        showConfirmButton: false,
        timer: 2000,
    })
}

function getApi() {
    const { currency, cryptocurrencies } = objSearch;
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrencies}&tsyms=${currency}`;

    showSpinner();

    fetch(url)
        .then( response => response.json() )
        .then( quote => {
            showQuote(quote.DISPLAY[cryptocurrencies][currency]);
        })
}

function showQuote ( quote ) {
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE,  MARKET, LASTMARKET } = quote
    result.classList.add("bg", "px-3", "py-6", "rounded")
    result.innerHTML = `
        <p class="text-white text-3xl font-bold text-center">The price is: <span>${PRICE}</span></p>
        <div class="text-white font-medium text-xl mt-1 text-center">
            <p>Highest price: <span class="font-light">${HIGHDAY}</span></p>
            <p>Lowest price: <span class="font-light">${LOWDAY}</span></p>
            <p>Last 24 hours: <span class="font-light">${CHANGEPCT24HOUR}</span></p>
            <p>Last Update: <span class="font-light">${LASTUPDATE}</span></p>
            <p>Market: <span class="font-light">${MARKET}</span></p>
            <p>Last Market: <span class="font-light">${LASTMARKET}</span></p>
        </div>
    `;
}

function cleanHtml () {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    cleanHtml();
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    result.appendChild(spinner);
}