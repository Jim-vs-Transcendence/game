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
	const canvasWidth = 1600 * widthRatio;
	const canvasHeight = 800 * heightRatio;

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

	let ball_moveX = false;
	let ball_moveY = false;

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

	let left_score = 0;
	let right_score = 0;

	/*
	* Socket Handling
	*/

	function mainLogic() {
		window.requestAnimationFrame(animate);
		window.addEventListener('keydown', (key) => {
			const data = {
				clientId: socket.id,
				key: key.keyCode
			};
			socket.emit('keydown', data)
			console.log(data.clientId);

			console.log(key.keyCode);
			// let Player = {
			// 	socket,
			// 	score,
			// 	P1paddleY,
			// 	P2paddleY
			// }
		});
		socket.on('message', (player) => {
			// const { socket, score, P1paddleY, P2paddleY } = player;
			/*
			if (key.keyCode === 40) {
				if (paddle1Y >= canvasHeight - paddleHeight)
				paddle1Y = canvasHeight - paddleHeight;
				paddle1Y += 30;
			}
			else if (key.keyCode === 38) {
				if (paddle1Y <= 0)
				paddle1Y = 0;
				paddle1Y -= 30;
			}
			if (key.keyCode === 83) {
				if (paddle2Y >= canvasHeight - paddleHeight)
				paddle2Y = canvasHeight - paddleHeight;
				paddle2Y += 30;
			}
			else if (key.keyCode === 87) {
				if (paddle2Y <= 0)
				paddle2Y = 0;
				paddle2Y -= 30;
			}
			
			=> 서버측 로직이 된다.
			*/
			console.log(player);
			// console.log(player.P2paddleY);
			paddle1Y += player.P1paddleY;
			paddle2Y += player.P2paddleY;
		});
	}

	socket.on('connect', (data) => {
		console.log();
		mainLogic();
	});

	// socket.emit('message', "messagebhgg");

	// socket.on("message", (data) => {
	// 	console.log(data);

	// })

	// Key handling
	function animate() {
		// console.log(paddle1Y, ' ', paddle2Y);
		ball_move();
		draw();
		requestAnimationFrame(animate);
	}

	/*
	* drawing
	*/
	function reset_game() {
		if (left_score === 3 || right_score === 3)
			context.fillText('someone win', 0, 0);;
		ballX = init_ballX;
		ballY = init_ballY;
		paddle1Y = init_paddle1Y;
		paddle2Y = init_paddle2Y;
		// add ball movement
	}

	function ball_move() {
		// X false : left
		// Y false : down

		if (ballX <= 0) {
			reset_game();
			right_score++;
		}
		if (ballX >= canvasWidth - ballRadius * 2) {
			reset_game();
			left_score++;
		}

		if (ballY <= 0)
			ball_moveY = false;
		if (ballY >= canvasHeight - ballRadius * 2)
			ball_moveY = true;

		if (ball_moveY === true)
			ballY -= 5; // check
		else if (ball_moveY === false)
			ballY += 5;
		if (ball_moveX === false)
			ballX -= 5;
		else if (ball_moveX === true)
			ballX += 5;

		if (ballX - ballRadius * 2 <= init_paddle1X && ballX >= init_paddle1X - paddleWidth) {
			if (ballY <= paddle1Y + paddleHeight && ballY >= paddle1Y) {
				ballX = init_paddle1X + ballRadius * 2;
				ball_moveX = true;
			}
		}

		if (ballX - ballRadius * 2 <= init_paddle2X && ballX >= init_paddle2X - paddleWidth) {
			if (ballY <= paddle2Y + paddleHeight && ballY >= paddle2Y) {
				ballX = init_paddle2X - ballRadius * 2;
				ball_moveX = false;
			}
		}
	}

	function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
		context.fillStyle = 'white';
		context.fill();
		context.closePath();

		context.globalAlpha = 0.5;
		context.font = `${scoreTextSize}px Arial`;
		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.fillText(left_score, score1X, score1Y);

		const score2X = canvasWidth / 2 + scoreMargin;
		const score2Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;
		context.fillText(right_score, score2X, score2Y);

		context.globalAlpha = 1;

		let paddle1X = init_paddle1X;
		let paddle2X = init_paddle2X;

		context.fillStyle = 'white';
		context.fillRect(paddle1X, paddle1Y, paddleWidth, paddleHeight);

		context.fillStyle = 'white';
		context.fillRect(paddle2X, paddle2Y, paddleWidth, paddleHeight);
	}

	// 공 그리기


});
