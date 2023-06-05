document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    /*
    * Socket Variable
    */
    const playerSocket = io();

    /*
    * Game variables
    */

    // Game init
    let gameStarted = false;

    let isEnd = true;

    let myPosition = false;

    // Canvas Ratio
    const widthRatio = 0.8; // 가로 비율 (0~1 사이 값)
    const heightRatio = 0.8; // 세로 비율 (0~1 사이 값)

    // 윈도우의 크기에 따라 Canvas의 너비와 높이 계산
    const canvasWidth = 800 * widthRatio;
    const canvasHeight = 400 * heightRatio;

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

    let ballMoveX = false;
    let ballMoveY = false;

    const ballSpeed = 1;

    // Paddle
    const paddleWidth = canvasWidth * 0.02;
    const paddleHeight = canvasHeight * 0.2;
    const paddleMargin = canvasWidth * 0.05;

    const init_paddle1X = paddleMargin;
    const init_paddle1Y = canvasHeight / 2 - paddleHeight / 2;

    const init_paddle2X = canvasWidth - paddleMargin - paddleWidth;
    const init_paddle2Y = canvasHeight / 2 - paddleHeight / 2;

    let paddle1Y = init_paddle1Y;
    let paddle2Y = init_paddle2Y;

    // score
    const scoreTextSize = canvasHeight * 0.3;
    const scoreMargin = canvasWidth * 0.2;

    const score1X = canvasWidth / 2 - scoreMargin;
    const score1Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;

    const score2X = canvasWidth / 2 + scoreMargin;
    const score2Y = canvasHeight / 2 + (scoreTextSize * 3) / 8;

    let left_score = 0;
    let right_score = 0;

    /*
    * Socket Handling
    */
    playerSocket.on('connect', () => {
        setGame();
    });




    /*
     * Main Game Logic
     */
    function setGame() {
        playerSocket.on('start', (setPosition) => {
            myPosition = setPosition;
        })
        const waitForStart = setInterval(() => {
            if (!gameStarted) {
                console.log('game not started')
                return;
            }
            clearInterval(waitForStart);
            window.requestAnimationFrame(gameLoop);
        }, 100)
        playerSocket.on('ready', (setStart) => {
            if (setStart) {
                isEnd = false;
                gameStarted = true;
            }
        })
        // window.addEventListener('keypress', function (event) {
        //     if (event.key === 'ArrowDown') {
        //         console.log('key down!')
        //         const data = {
        //             clientId: playerSocket.id,
        //             key: 38
        //         };
        //         playerSocket.emit('keypress', data);
        //     }
        //     else if (event.key === 'ArrowUp') {
        //         console.log('key up!')
        //         const data = {
        //             clientId: playerSocket.id,
        //             key: 40
        //         };
        //         playerSocket.emit('keypress', data);
        //     }
        // });
        window.addEventListener('keydown', (key) => {
            const data = {
                clientId: playerSocket.id,
                key: key.keyCode,
                startFlag: false,
            };
            if (key.keyCode === 38) {
                console.log('key down!')
                playerSocket.emit('keydown', data);
            }
            else if (key.keyCode === 13) {
                data.startFlag = true;
                playerSocket.emit('keydown', data);
            }
        });
        window.addEventListener('keyup', (key) => {
            if (key.keyCode === 40) {
                console.log('key up!')
                const data = {
                    clientId: playerSocket.id,
                    key: key.keyCode
                };
                playerSocket.emit('keyup', data);
            }
        });
        playerSocket.on('message', (paddleData) => {
            console.log(paddle1Y, ' ', paddle2Y);
            console.log(paddleData);
            paddle1Y += paddleData.p1Paddle;
            paddle2Y += paddleData.p2Paddle;
            console.log('paddleY from server');
            console.log(paddle1Y, ' ', paddle2Y);
            console.log(init_paddle1Y, ' ', init_paddle2Y);
        });
    }


    /*
    * drawing
    */

    function gameLoop() {
        console.log('gameLoop called');
        ballMove();
        draw();

        if (!isEnd) {
            requestAnimationFrame(gameLoop);
        }
    }

    function ballMove() {
        // X false : left
        // Y false : down
        if (myPosition) {
            // Right positio전
            if (ballX <= 0) {
                right_score++;
                reset_game();
            }
            if (ballX >= canvasWidth - ballRadius * 2) {
                left_score++;
                reset_game();
            }

            if (ballY <= ballRadius)
                ballMoveY = false;
            if (ballY >= canvasHeight - ballRadius)
                ballMoveY = true;

            if (ballMoveY === true)
                ballY -= ballSpeed; // check
            else if (ballMoveY === false)
                ballY += ballSpeed;
            if (ballMoveX === true)
                ballX -= ballSpeed;
            else if (ballMoveX === false)
                ballX += ballSpeed;

            if (ballX - (ballRadius * 2) <= init_paddle1X && ballX >= init_paddle1X - paddleWidth) {
                if (ballY <= paddle1Y + paddleHeight && ballY >= paddle1Y) {
                    ballX = init_paddle1X + ballRadius * 2;
                    ballMoveX = false;
                }
            }

            if (ballX - ballRadius <= init_paddle2X && ballX >= init_paddle2X - paddleWidth) {
                if (ballY <= paddle2Y + paddleHeight && ballY >= paddle2Y) {
                    ballX = init_paddle2X - ballRadius * 2;
                    ballMoveX = true;
                }
            }
        }
        else {
            if (ballX <= 0) {
                right_score++;
                reset_game();
            }
            if (ballX >= canvasWidth - ballRadius * 2) {
                left_score++;
                reset_game();
            }

            if (ballY <= ballRadius)
                ballMoveY = false;
            if (ballY >= canvasHeight - ballRadius)
                ballMoveY = true;

            if (ballMoveY === true)
                ballY -= ballSpeed; // check
            else if (ballMoveY === false)
                ballY += ballSpeed;
            if (ballMoveX === false)
                ballX -= ballSpeed;
            else if (ballMoveX === true)
                ballX += ballSpeed;

            if (ballX - (ballRadius * 2) <= init_paddle1X && ballX >= init_paddle1X - paddleWidth) {
                if (ballY <= paddle1Y + paddleHeight && ballY >= paddle1Y) {
                    ballX = init_paddle1X + ballRadius * 2;
                    ballMoveX = true;
                }
            }

            if (ballX - ballRadius <= init_paddle2X && ballX >= init_paddle2X - paddleWidth) {
                if (ballY <= paddle2Y + paddleHeight && ballY >= paddle2Y) {
                    ballX = init_paddle2X - ballRadius * 2;
                    ballMoveX = false;
                }
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

        context.fillText(right_score, score2X, score2Y);

        context.globalAlpha = 1;

        let paddle1X = init_paddle1X;
        let paddle2X = init_paddle2X;

        if (paddle1Y >= canvasHeight - paddleHeight) {
            paddle1Y = canvasHeight - paddleHeight;
        }
        if (paddle1Y <= 0) {
            paddle1Y = 0;
        }

        if (paddle2Y >= canvasHeight - paddleHeight) {
            paddle2Y = canvasHeight - paddleHeight;
        }
        if (paddle2Y <= 0) {
            paddle2Y = 0;
        }

        context.fillStyle = 'white';
        context.fillRect(paddle1X, paddle1Y, paddleWidth, paddleHeight);

        context.fillStyle = 'white';
        context.fillRect(paddle2X, paddle2Y, paddleWidth, paddleHeight);

    }

    function endGame() {
        // 게임이 끝나면 home버튼과 retry 버튼이 생기고 해당 문구가 출력되게
        // 캔버스가 requestAnimationFrame 계속 그려질 필요 없이 해당 화면에서 멈추게
        context.globalAlpha = 0.5;
        context.font = '30px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        const textX = canvasWidth / 2;
        const textY = canvasHeight / 2;
        context.fillText('someone win', textX, textY);
        cancelAnimationFrame(frameAnimationId);
    }

    function reset_game() {
        if (left_score === 3 || right_score === 3) {
            endGame();
        }
        ballX = init_ballX;
        ballY = init_ballY;
        paddle1Y = init_paddle1Y;
        paddle2Y = init_paddle2Y;
        // add ball movement
    }


    // endGameMenu: function (text) {
    // 	// Change the canvas font size and color
    // 	Pong.context.font = '50px Courier New';
    // 	Pong.context.fillStyle = this.color;

    // 	// Draw the rectangle behind the 'Press any key to begin' text.
    // 	Pong.context.fillRect(
    // 		Pong.canvas.width / 2 - 350,
    // 		Pong.canvas.height / 2 - 48,
    // 		700,
    // 		100
    // 	);

    // 	// Change the canvas color;
    // 	Pong.context.fillStyle = '#ffffff';

    // 	// Draw the end game menu text ('Game Over' and 'Winner')
    // 	Pong.context.fillText(text,
    // 		Pong.canvas.width / 2,
    // 		Pong.canvas.height / 2 + 15
    // 	);

    // 	setTimeout(function () {
    // 		Pong = Object.assign({}, Game);
    // 		Pong.initialize();
    // 	}, 3000);
    // },

    // const waitForStart = setInterval(() => {
    // 	if (!gameStarted) return
    // 	clearInterval(waitForStart)
    // 	Pong.running = true
    // 	window.requestAnimationFrame(Pong.loop)
    // }, 100)

    // _turnDelayIsOver: function () {
    // 	return ((new Date()).getTime() - this.timer >= 1000);
    // },

    // setTimeout(function () {
    // 	Pong = Object.assign({}, Game);
    // 	Pong.initialize();
    // }, 3000);

});