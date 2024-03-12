const renderAuditPieChart = (totals, auditRatio) => {
    const auditRatioColor = auditRatio > 0.7 ? 'green' : 'crimson';

    const pieChartCanvas = getChartCanvas('pie', ['Audits done', 'Audits received'], [totals.auditsDone, totals.auditsReceived]);
    pieChartCanvas.classList = "pie";

    const pieChartWrapper = document.createElement('div');
    pieChartWrapper.classList = "chart-wrapper";
    
    const pieChartInfo = document.createElement('div');
    pieChartInfo.classList = "pie-chart-info";
    pieChartInfo.innerHTML = `
        <div>Audits done: ${totals.auditsDone} (${bytesToMB(totals.auditsDoneTotal)} MB)</div>
        <div>Audits recieved: ${totals.auditsReceived} (${bytesToMB(totals.auditsReceivedTotal)} MB)</div>
        <div style="font-weight: bold;color:${auditRatioColor}" >Ratio: ${auditRatio}</div>
    `

    pieChartWrapper.appendChild(pieChartCanvas);
    pieChartWrapper.appendChild(pieChartInfo);
    mainElement.appendChild(pieChartWrapper);
}

const renderProjectsBarChart = (totals) => {
    totals.projectAndPoints.sort((a, b) => a.expKb - b.expKb);
    const barCharCanvas = getChartCanvas('bar', totals.projectAndPoints.map(obj => obj.label), totals.projectAndPoints.map(obj => obj.expKb));
    const barChartInfo = document.createElement('div');
    barChartInfo.classList = "bar-chart-info";
    barChartInfo.innerHTML = `<div>Total: ${totals.auditsDone} kB</div>`

    const barChartWrapper = document.createElement('div');
    barChartWrapper.classList = "chart-wrapper flex-col align-center";

    barChartWrapper.appendChild(barChartInfo);
    barChartWrapper.appendChild(barCharCanvas);
    mainElement.appendChild(barChartWrapper);
}

const getChartCanvas = (type, labels, values)  => {
    const chartCanvas = document.createElement('canvas');
    const ctx = chartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: type,
        data: getChartData(labels, values),
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });

    chart.render();

    return chartCanvas;
}

const getChartData = (labels, data) => {
    const colorsArray = labels.map(() => randomRGBValue());
    return {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: colorsArray.map((rgb) => `rgba(${rgb}, 0.4)`),
                borderColor: colorsArray.map((rgb) => `rgba(${rgb}, 1)`),
                borderWidth: 1,
            },
        ],
    };
}

const calculateTotals = (dataArray) => {
    return dataArray.reduce((totals, item) => {
        switch (item.type) {
            case 'up':
                totals.auditsDoneTotal += item.amount;
                totals.auditsDone++;
                break;
            case 'down':
                totals.auditsReceivedTotal += item.amount;
                totals.auditsReceived++;
                break;
            case 'xp':
                totals.xpTotal += item.amount;
                totals.projectAndPoints.push({
                    label: item.object.name,
                    expKb: bytesToKB(item.amount)
                });
                break;
        }
        return totals;
    }, {    
        auditsDoneTotal: 0,
        auditsReceivedTotal: 0,
        xpTotal: 0,
        auditsDone: 0,
        auditsReceived: 0,
        projectAndPoints: []
    });
}