document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const socket = io();

	socket.on('connect', ( data ) => {
		console.log(data);
	});
	socket.emit('message', "messagebhgg" );

	socket.on("message", ( data )=>{
		console.log(data);

	})

	socket.on('keydown', ( data ) => {
		console.log(data);
	})

	// 패들 위치 업데이트 이벤트 수신

	// key event가 오면
	// 키 다운 이벤트 처리
	window.addEventListener('keydown', (key) => {
		// 키코드를 서버로 전송
		socket.emit('keydown', key.keyCode);
		if (key.keyCode === 38)
			console.log(key.keyCode);
	});

	// // 키 업 이벤트 처리
	// window.addEventListener('keyup', (key) => {
	// 	// 키코드를 서버로 전송
	// 	socket.emit('keyup', key.keyCode);
	// 	if (key.keyCode === 40)
	// 		console.log(key.keyCode);
	// });
	
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
	const ballRadius = Math.min(canvasWidth * 0.02, canvasHeight * 0.02);
	const ballX = canvasWidth / 2;
	const ballY = canvasHeight / 2;
	context.beginPath();
	context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
	context.fillStyle = 'white';
	context.fill();
	context.closePath();

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
