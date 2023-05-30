document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Canvas의 가로 세로 비율 설정
    const widthRatio = 0.8; // 가로 비율 (0~1 사이 값)
    const heightRatio = 0.8; // 세로 비율 (0~1 사이 값)

    // 윈도우의 크기에 따라 Canvas의 너비와 높이 계산
    const canvasWidth = window.innerWidth * widthRatio;
    const canvasHeight = window.innerHeight * heightRatio;

    // Canvas의 너비와 높이 설정
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Canvas 스타일 조정
    canvas.style.backgroundColor = 'black';

    // Canvas를 body에 추가
    document.body.appendChild(canvas);

    // 공 그리기
    const ballX = canvasWidth / 2;
    const ballY = canvasHeight / 2;
    const ballSize = 10;

    context.fillStyle = 'white';
    context.fillRect(ballX, ballY, ballSize, ballSize);


    // score
    const scoreTextSize = canvasHeight * 0.3;
    const scoreMargin = canvasWidth * 0.2;

    context.globalAlpha = 0.5;

    const score1X = canvasWidth / 2 - scoreMargin;
    const score1Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;
    context.font = `${scoreTextSize}px Arial`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('0', score1X, score1Y);

    const score2X = canvasWidth / 2 + scoreMargin;
    const score2Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;
    context.fillText('0', score2X, score2Y);

    context.globalAlpha = 1;

    // paddle
    const paddleWidth = canvasWidth * 0.02;
    const paddleHeight = canvasHeight * 0.2;
    const paddleMargin = canvasWidth * 0.05;

    const paddle1X = paddleMargin;
    const paddle1Y = canvasHeight / 2 - paddleHeight / 2;
    context.fillStyle = 'white';
    context.fillRect(paddle1X, paddle1Y, paddleWidth, paddleHeight);

    const paddle2X = canvasWidth - paddleMargin - paddleWidth;
    const paddle2Y = canvasHeight / 2 - paddleHeight / 2;
    context.fillStyle = 'white';
    context.fillRect(paddle2X, paddle2Y, paddleWidth, paddleHeight);

});

