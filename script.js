// Variable global que almacenará la instancia del gráfico. Esto es útil para destruirlo y recrearlo si es necesario.
let myChart;

async function convertCurrency() {
    const amount = document.querySelector('#amount').value; // Captura valor Input
    const currency = document.querySelector('#currency').value; // Captura valor Select

    // Llamada API
    const response = await fetch(`https://mindicador.cl/api/${currency}`);
    const data = await response.json();
    const convertedAmount = (amount / data.serie[0].valor).toFixed(2);
    document.querySelector('#convertedAmount').innerText = `${amount} pesos chilenos son aproximadamente ${convertedAmount} ${data.nombre}`;
    displayChart(currency);
}

//    Grafico
async function displayChart(currencyCode) {
    const historicalData = await getHistoricalData(currencyCode);
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('currencyChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line', // Tipo de gráfico
        data: {
            labels: historicalData.dates, // Eje X: fechas
            datasets: [{
                label: `Valor de ${currencyCode} en los últimos 10 días`,
                data: historicalData.values, // Eje Y: valores de la moneda
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

// datos Historicos
async function getHistoricalData(currencyCode) {
    const response = await fetch(`https://mindicador.cl/api/${currencyCode}`);
    const data = await response.json();
    const dates = data.serie.map(entry => entry.fecha.slice(0, 10));
    const values = data.serie.map(entry => entry.valor);

    return {
        dates: dates.reverse(), // orden ascendente de fecha
        values: values.reverse()
    };
}
