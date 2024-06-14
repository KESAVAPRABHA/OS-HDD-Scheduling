document.getElementById('simulate').addEventListener('click', function() {
    const inputSequence = document.getElementById('request-sequence').value;
    const startPosition = parseInt(document.getElementById('start-position').value, 10);
    const algorithm = document.getElementById('algorithm').value;
    const requests = inputSequence.split(',').map(Number).filter(n => !isNaN(n));
    if (isNaN(startPosition)) {
        alert("Please enter a valid starting position.");
        return;
    }

    switch (algorithm) {
        case 'fcfs':
            simulateFCFS(requests, startPosition);
            break;
        case 'sstf':
            simulateSSTF(requests, startPosition);
            break;
        case 'scan':
            simulateSCAN(requests, startPosition);
            break;
        case 'cscan':
            simulateCSCAN(requests, startPosition);
            break;
        case 'look':
            simulateLOOK(requests, startPosition);
            break;
        case 'clook':
            simulateCLOOK(requests, startPosition);
            break;
    }
});

function drawGraph(ctx, points, margin, width, height) {
    const stepY = height / (points.length + 1);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(margin + (width * points[0].position) / 200, margin + stepY);
    ctx.arc(margin + (width * points[0].position) / 200, margin + stepY, 5, 0, 2 * Math.PI); // Increased arc size
    ctx.fill();
    ctx.fillText(points[0].position, margin + (width * points[0].position) / 200 + 10, margin + stepY - 5); // Adjusted text position

    points.forEach((point, index) => {
        if (index > 0) {
            const x = margin + (width * point.position) / 200;
            const y = margin + (index + 1) * stepY;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI); // Increased arc size
            ctx.fill();
            ctx.moveTo(x, y);
            ctx.fillText(point.position, x + 10, y - 15); // Adjusted text position
        }
    });
}

function simulateFCFS(requests, startPosition) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    let currentPosition = startPosition;
    let totalSeekTime = 0;
    const points = [{ position: currentPosition }];

    requests.forEach(request => {
        const seekTime = Math.abs(request - currentPosition);
        totalSeekTime += seekTime;
        currentPosition = request;
        points.push({ position: request });
    });

    drawGraph(ctx, points, margin, width, height);
    alert(`Total seek time: ${totalSeekTime}`);
}

function simulateSSTF(requests, startPosition) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    let currentPosition = startPosition;
    let totalSeekTime = 0;
    const points = [{ position: currentPosition }];
    const remainingRequests = [...requests];

    while (remainingRequests.length > 0) {
        let closestRequest = remainingRequests.reduce((prev, curr) => 
            Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev
        );
        const seekTime = Math.abs(closestRequest - currentPosition);
        totalSeekTime += seekTime;
        currentPosition = closestRequest;
        points.push({ position: closestRequest });
        remainingRequests.splice(remainingRequests.indexOf(closestRequest), 1);
    }

    drawGraph(ctx, points, margin, width, height);
    alert(`Total seek time: ${totalSeekTime}`);
}

function simulateSCAN(requests, startPosition) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    let currentPosition = startPosition;
    let totalSeekTime = 0;
    const points = [{ position: currentPosition }];
    const direction = 'up';

    const sortedRequests = [...requests].sort((a, b) => a - b);
    let upRequests = sortedRequests.filter(request => request >= currentPosition);
    let downRequests = sortedRequests.filter(request => request < currentPosition).reverse();

    if (direction === 'up') {
        upRequests.forEach(request => {
            const seekTime = Math.abs(request - currentPosition);
            totalSeekTime += seekTime;
            currentPosition = request;
            points.push({ position: request });
        });
        downRequests.forEach(request => {
            const seekTime = Math.abs(request - currentPosition);
            totalSeekTime += seekTime;
            currentPosition = request;
            points.push({ position: request });
        });
    }

    drawGraph(ctx, points, margin, width, height);
    alert(`Total seek time: ${totalSeekTime}`);
}

function simulateCSCAN(requests, startPosition) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    let currentPosition = startPosition;
    let totalSeekTime = 0;
    const points = [{ position: currentPosition }];

    const sortedRequests = [...requests].sort((a, b) => a - b);
    let upRequests = sortedRequests.filter(request => request >= currentPosition);
    let downRequests = sortedRequests.filter(request => request < currentPosition);

    upRequests.forEach(request => {
        const seekTime = Math.abs(request - currentPosition);
        totalSeekTime += seekTime;
        currentPosition = request;
        points.push({ position: request });
    });
    downRequests.forEach(request => {
        const seekTime = Math.abs(request - currentPosition);
        totalSeekTime += seekTime;
        currentPosition = request;
        points.push({ position: request });
    });

    drawGraph(ctx, points, margin, width, height);
    alert(`Total seek time: ${totalSeekTime}`);
}

function simulateLOOK(requests, startPosition) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    let currentPosition = startPosition;
    let totalSeekTime = 0;
    const points = [{ position: currentPosition }];
    const direction = 'up';

    const sortedRequests = [...requests].sort((a, b) => a - b);
    let upRequests = sortedRequests.filter(request => request >= currentPosition);
    let downRequests = sortedRequests.filter(request => request < currentPosition).reverse();

    if (direction === 'up') {
        upRequests.forEach(request => {
            const seekTime = Math.abs(request - currentPosition);
            totalSeekTime += seekTime;
            currentPosition = request;
            points.push({ position: request });
        });
        downRequests.forEach(request => {
            const seekTime = Math.abs(request - currentPosition);
            totalSeekTime += seekTime;
            currentPosition = request;
            points.push({ position: request });
        });
    }

    drawGraph(ctx, points, margin, width, height);
    alert(`Total seek time: ${totalSeekTime}`);
}

function simulateCLOOK(requests, startPosition) {
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const margin = 50;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    let currentPosition = startPosition;
    let totalSeekTime = 0;
    const points = [{ position: currentPosition }];

    const sortedRequests = [...requests].sort((a, b) => a - b);
    let upRequests = sortedRequests.filter(request => request >= currentPosition);
    let downRequests = sortedRequests.filter(request => request < currentPosition);

    upRequests.forEach(request => {
        const seekTime = Math.abs(request - currentPosition);
        totalSeekTime += seekTime;
        currentPosition = request;
        points.push({ position: request });
    });
    downRequests.forEach(request => {
        const seekTime = Math.abs(request - currentPosition);
        totalSeekTime += seekTime;
        currentPosition = request;
        points.push({ position: request });
    });

    drawGraph(ctx, points, margin, width, height);
    alert(`Total seek time: ${totalSeekTime}`);
}
