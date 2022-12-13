let inputQuantity = document.getElementById("inputQuantity");
const typeOfCurrency = document.getElementById("typeOfCurrency");
const btnCurrency = document.getElementById("btnCurrency");
const exchange = document.getElementById("exchange");
const error = document.getElementById("error");
const chartDOM = document.getElementById("myChart");
let myChart;

async function getCurrency() {
  try {
    const response = await fetch("https://mindicador.cl/api/");
    const arrayCurrency = await response.json();
    return arrayCurrency;
  } catch (e) {
    error.innerHTML = e.message;
  }
}

async function conversor(currency) {
  const data = await getCurrency();
  let quantity = Number(inputQuantity.value);
  let multiplication = (quantity / data[currency].valor).toFixed(2);
  exchange.innerHTML = `<p class="finalresult">Resultado: $ ${multiplication}</p>`;
}

async function getDailyCurrency(chooseCurrency) {
  try {
    const response = await fetch("https://mindicador.cl/api/" + chooseCurrency);
    const arrayCurrency = await response.json();
    const lastDays = arrayCurrency.serie.slice(0, 20).reverse();
    const labels = lastDays.map((day) => {
      return day.fecha;
    });
    const data = lastDays.map((day) => {
      return day.valor;
    });
    const datasets = [
      {
        label: chooseCurrency,
        borderColor: "rgb(255, 99, 132)",
        data,
      },
    ];

    return { labels, datasets };
  } catch (e) {
    error.innerHTML = e.message;
    console.log(e)
  }
}

async function renderGraphic(chooseCurrency) {
  const data = await getDailyCurrency(chooseCurrency);
  const config = {
    type: "line",
    data,
  };
  chartDOM.style.backgroundColor = "white";
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(chartDOM, config);
}

btnCurrency.addEventListener("click", function () {
  if (inputQuantity.value == "") {
    exchange.textContent = "Ingresa un dato válido";
    return;
  }
  if (inputQuantity.value < 0) {
    exchange.textContent = "Sólo puedes ingresar números positivos";
    return;
  }
  let final = conversor(
    typeOfCurrency.options[typeOfCurrency.selectedIndex].value
  );
  renderGraphic(typeOfCurrency.options[typeOfCurrency.selectedIndex].value);
});
