import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from './data';


const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Quiz = () => {
    const [shuffledData, setShuffledData] = useState([]);
    const [index, setIndex] = useState(0);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [time, setTime] = useState(10);  
    const [quizStarted, setQuizStarted] = useState(false); 

    const opt1 = useRef(null);
    const opt2 = useRef(null);
    const opt3 = useRef(null);
    const opt4 = useRef(null);
    const optarray = [opt1, opt2, opt3, opt4];

    useEffect(() => {
        const shuffled = shuffleArray(data);
        setShuffledData(shuffled);
    }, []);

    useEffect(() => {
        if (quizStarted && time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime === 1) {
                        clearInterval(timer);
                        setResult(true);
                        // reset();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizStarted, time]);

    const startQuiz = () => {
        console.log("Quiz Started!"); 
        setQuizStarted(true);  
    };

    const checkAns = (e, ans) => {
        if (!lock) {
            if (ans === shuffledData[index].ans) {
                console.log('right');
                e.target.classList.add('correct');
                setScore((prevScore) => prevScore + 1);
            } else {
                console.log('wrong');
                e.target.classList.add('incorrect');
                optarray[shuffledData[index].ans - 1].current.classList.add('correct');
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock) {
            if (index < shuffledData.length - 1) {
                setIndex((prevIndex) => prevIndex + 1);
                setLock(false);
                optarray.forEach((opt) => opt.current.classList.remove('incorrect', 'correct'));
            } else {
                setResult(true);
            }
        }
    };

    const reset = () => {
        setIndex(0);
        setScore(0);
        setShuffledData(shuffleArray(data));
        setLock(false);
        setResult(false);
        setTime(10); 
        setQuizStarted(false); 
        optarray.forEach((opt) => opt.current.classList.remove('incorrect', 'correct'));
    };

    return (
        <div className="container">
            {result? (
                <div>
                    <h1>Yay! You completed the Quiz</h1>
                    <p>Your score is {score}</p>
                    <button className="reset" onClick={reset}>Reset</button>
                </div>
            ) : shuffledData.length > 0 ? (
                <>
                    {!quizStarted ? (
                        <button onClick={startQuiz}>Start Quiz</button>
                    ) : (
                        <>
                            <h1>Quiz</h1>
                            <div className="timer">
                                Time Left: {time}s
                            </div>
                            <h2>
                                {index + 1}. {shuffledData[index].question}
                            </h2>
                            <hr />
                            <ul>
                                <li ref={opt1} onClick={(e) => checkAns(e, 1)}>
                                    {shuffledData[index].option1}
                                </li>
                                <li ref={opt2} onClick={(e) => checkAns(e, 2)}>
                                    {shuffledData[index].option2}
                                </li>
                                <li ref={opt3} onClick={(e) => checkAns(e, 3)}>
                                    {shuffledData[index].option3}
                                </li>
                                <li ref={opt4} onClick={(e) => checkAns(e, 4)}>
                                    {shuffledData[index].option4}
                                </li>
                            </ul>
                            <button onClick={next}>Next</button>
                            <div className="number">
                                {index + 1} out of {shuffledData.length} questions
                            </div>
                            
                        </>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Quiz;
