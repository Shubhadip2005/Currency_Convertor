BASE_URL = "https://api.fxratesapi.com/latest?amount=1&"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
window.addEventListener("load", () => {
    updateExchangeRate();
});

for(let select of dropdowns) {
    for(currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode ==="USD") {
            newOption.selected ="selected";
        } else if(select.name === "to" && currCode ==="INR") {
            newOption.selected ="selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

const updateExchangeRate = async() => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal ==="" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    try {
        const URL = `${BASE_URL}base=${fromCurr.value}&symbols=${toCurr.value}`;
        let response = await fetch(URL);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON from response
        let data = await response.json();
        
        // Check if the API returned success
        if (!data.success) {
            throw new Error('API returned an error');
        }
        
        // Get the exchange rate from the rates object
        let rate = data.rates[toCurr.value];
        
        if (!rate) {
            throw new Error('Exchange rate not found');
        }
        
        console.log('Exchange rate:', rate);
        
        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        msg.innerText = 'Error fetching exchange rate. Please try again.';
    }
}