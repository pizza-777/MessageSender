const { client } = require("./client/webClient");

//every 5 seconds new block
function makeQuery(interval) {
    let query = '{';
    let lt = Math.round(Date.now() / 1000) - 15;//becouse of 15 seconds delay for database saving
    let gt = lt - interval;
    query += `
           aggregateTransactions(
                filter: {
                  now: { ge: ${gt}, lt: ${lt} }                  
                }
                fields: [{ field: "id", fn: COUNT }]
              )
          `;
    query += '}';
    return query;
}
var data = [];
var labels = [];
var transactionsArray = [];

const netTransactions = async (interval) => {

    try {
        let response = (await client.net.query({ "query": makeQuery(interval) })).result.data;
        let transactions = response.aggregateTransactions[0];
        transactionsArray.push(Number(transactions));
        //get last 5 elements of array of data
        let transactions5 = transactionsArray.slice(transactionsArray.length - 5);
        //sum array
        let sum = transactions5.reduce((a, b) => a + b, 0);
        let speed = sum / (interval * 5);
        data.push(Number(speed.toFixed(4)));
        let dt = String(new Date(Date.now() - 15 * 1000).getMinutes()) + ":" + String(new Date(Date.now() - 15 * 1000).getSeconds());

        labels = labels.filter(label => label != '');
        labels.push(dt);
        if (data.length > 50) {
            data.shift();
        }
        if (labels.length > 50) {
            labels.shift();
        }
        for (let i = labels.length; i < 10; i++) {
            labels.push('');
        }
        return {
            labels,
            datasets: [
                {
                    label: "Average transactions per second",
                    backgroundColor: "gray",
                    data,
                    borderColor: "brown",
                    fill: false,
                    responsive: false
                },
            ],
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    netTransactions
}

// setInterval(() => {
//     netTransactions(5).then(() => {
//         console.log(data);
//     })
// }, 5000);