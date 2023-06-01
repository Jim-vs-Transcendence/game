document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	/*
	* Socket Init
	*/
	const socket = io();


	/*
	* Game variables
	*/

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

	// Ball Location
	const init_ballX = canvasWidth / 2;
	const init_ballY = canvasHeight / 2;

	let ballX = init_ballX;
	let ballY = init_ballY;

	const ballRadius = Math.min(canvasWidth * 0.02, canvasHeight * 0.02);

	// Paddle
	const paddleWidth = canvasWidth * 0.02;
	const paddleHeight = canvasHeight * 0.2;
	const paddleMargin = canvasWidth * 0.05;

	const init_paddle1X = paddleMargin;
	// const init_paddle1X = 200;
	const init_paddle1Y = canvasHeight / 2 - paddleHeight / 2;

	const init_paddle2X = canvasWidth - paddleMargin - paddleWidth;
	// const init_paddle2X = 1000;
	const init_paddle2Y = canvasHeight / 2 - paddleHeight / 2;

	let paddle1Y = init_paddle1Y;
	let paddle2Y = init_paddle2Y;

	// score
	const scoreTextSize = canvasHeight * 0.3;
	const scoreMargin = canvasWidth * 0.2;


	const score1X = canvasWidth / 2 - scoreMargin;
	const score1Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;

	/*
	* Socket Handling
	*/
	socket.on('connect', (data) => {
		console.log(data);
	});
	socket.emit('message', "messagebhgg");

	socket.on("message", (data) => {
		console.log(data);

	})

	socket.on('keydown', (data) => {
		console.log(data);
	})

	// Key handling
	while (true) {
		window.addEventListener('keydown', (key) => {
			socket.emit('keydown', key.keyCode);
			console.log(key.keyCode);
			if (key.keyCode === 38) {
				paddle1Y++;
			}
			else if (key.keyCode === 40) {
				paddle1Y--;
			}
		});
		draw();
	}


	/*
	* drawing
	*/

	function draw() {

		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
		context.fillStyle = 'white';
		context.fill();
		context.closePath();

		context.globalAlpha = 0.5;
		context.font = `${scoreTextSize}px Arial`;
		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.fillText('0', score1X, score1Y);

		const score2X = canvasWidth / 2 + scoreMargin;
		const score2Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;
		context.fillText('0', score2X, score2Y);

		context.globalAlpha = 1;


		context.fillStyle = 'white';
		context.fillRect(paddle1X, paddle1Y, paddleWidth, paddleHeight);

		context.fillStyle = 'white';
		context.fillRect(paddle2X, paddle2Y, paddleWidth, paddleHeight);
	}

	// 공 그리기


});
