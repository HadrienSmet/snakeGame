import { useEffect, useRef, useState } from "react";
import imageBg from "../assets/snake-bg.jpg";
import imageFood from "../assets/snake-food-perf-squ.png";

type ElementPosition = {
    x: number;
    y: number;
};

const bestScore = localStorage.getItem("best score");
const unit = 40;
const background = new Image();
const foodEl = new Image();

background.src = imageBg;
foodEl.src = imageFood;

let score = 0;
let direction = "";
let interval: number | undefined;
let snake: ElementPosition[] = [];

snake[0] = {
    x: unit * 7,
    y: unit * 7,
};

const useSnakeDirection = () => {
    useEffect(() => {
        const handleDirection = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && direction !== "R") {
                direction = "L";
            } else if (e.key === "ArrowRight" && direction !== "L") {
                direction = "R";
            } else if (e.key === "ArrowUp" && direction !== "D") {
                direction = "U";
            } else if (e.key === "ArrowDown" && direction !== "U") {
                direction = "D";
            }
        };
        document.addEventListener("keydown", (e) => handleDirection(e));
        return () => {
            document.removeEventListener("keydown", (e) => handleDirection(e));
        };
    }, [direction]);
};

const useSnakeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const scoreRef = useRef<HTMLSpanElement | null>(null);

    const [food, setFood] = useState({
        x: Math.floor(Math.random() * 15) * unit,
        y: Math.floor(Math.random() * 15) * unit,
    });

    const collisionBody = (head: ElementPosition, snake: ElementPosition[]) => {
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    };

    const emptySpaceForFood = (
        food: ElementPosition,
        head: ElementPosition,
        snake: ElementPosition[]
    ) => {
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) return true;
            if (food.x === head.x && food.y === head.y) return true;
        }
        return false;
    };

    const unitHandler = () => {
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === "L") snakeX -= unit;
        if (direction === "R") snakeX += unit;
        if (direction === "U") snakeY -= unit;
        if (direction === "D") snakeY += unit;

        const newHead = {
            x: snakeX,
            y: snakeY,
        };

        return newHead;
    };

    const gameHandler = (newHead: ElementPosition) => {
        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            const potentialPos = {
                x: Math.floor(Math.random() * 15) * unit,
                y: Math.floor(Math.random() * 15) * unit,
            };
            if (emptySpaceForFood(potentialPos, newHead, snake) === false) {
                setFood({
                    x: potentialPos.x,
                    y: potentialPos.y,
                });
            }
        } else {
            snake.pop();
        }
    };

    const losingHandler = (
        newHead: ElementPosition,
        canvas: HTMLCanvasElement
    ) => {
        if (
            newHead.x === -unit ||
            newHead.x === canvas.width ||
            newHead.y === -unit ||
            newHead.y === canvas.height ||
            collisionBody(newHead, snake) === true
        ) {
            if (bestScore !== null) {
                if (parseInt(bestScore) < score) {
                    localStorage.setItem("best score", `${score}`);
                }
            } else {
                localStorage.setItem("best score", `${score}`);
            }
            snake = [];
            snake[0] = {
                x: unit * 7,
                y: unit * 7,
            };
            clearInterval(interval);
        }
    };
    const snakeHandler = (context: CanvasRenderingContext2D) => {
        for (let i = 0; i < snake.length; i++) {
            if (i === 0) {
                context.fillStyle = "white";
            } else {
                context.fillStyle = "red";
            }
            context.fillRect(snake[i].x, snake[i].y, unit, unit);
            context.strokeStyle = "yellow";
            context.strokeRect(snake[i].x, snake[i].y, unit, unit);
        }
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(background, 0, 0);
                context.drawImage(foodEl, food.x, food.y);
                const newHead = unitHandler();
                gameHandler(newHead);
                losingHandler(newHead, canvas);
                snake.unshift(newHead);
                snakeHandler(context);
            }
        }
    };

    useEffect(() => {
        interval = setInterval(() => {
            draw();
        }, 350);

        return () => {
            clearInterval(interval);
        };
    });

    return {
        canvasRef,
        scoreRef,
    };
};

const GameSide = () => {
    useSnakeDirection();
    const { scoreRef, canvasRef } = useSnakeGame();
    return (
        <div className="game-side">
            <div className="score-row">
                <h1>
                    Score :{" "}
                    <span ref={scoreRef} className="score">
                        {score}
                    </span>
                </h1>
                <h2>
                    Meilleur score :<span>{bestScore ? bestScore : "0"}</span>
                </h2>
            </div>
            <canvas
                ref={canvasRef}
                id="canvas"
                width="600px"
                height="600px"
            ></canvas>
        </div>
    );
};

export default GameSide;
