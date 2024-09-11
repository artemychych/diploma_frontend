import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface QuestionInterface {
    id: number;
    first: string;
    second: string;
    third: string;
    fourth: string;
    question: string;
    image: string;
    answer: string;
}

interface QuestionProps {
    question: QuestionInterface;
    changeQuestionAnswer: Function;
}

const Question: React.FC<QuestionProps> = ({ question, changeQuestionAnswer }) => {
    const handleClick = (component: string) => {
        changeQuestionAnswer(question.id, component)
    }
    return (
        <div className="flex flex-col justify-center bg-black rounded-xl border-2 border-black border-solid my-6 " style={{width: 800}}>
            <div className="px-16 pt-8 pb-20 w-full bg-white rounded-xl max-md:px-5 max-md:max-w-full">
             <div className="mt-12 max-md:mt-10 text-4xl font-semibold leading-10 text-neutral-800">{question.question}</div>
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                    <div className="flex flex-col w-[50%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col  grow pt-12 text-2xl font-semibold leading-10 text-neutral-800 max-md:mt-10">
                            <div className="flex gap-5 mt-24 max-md:mt-10">
                                <button onClick={() => handleClick('first')}>
                                    <div className="shrink-0 self-start rounded-full bg-zinc-300 h-[25px] w-[25px]" />
                                </button>
                                <div className="flex-auto">{question.first}</div>
                            </div>
                            <div className="flex gap-5 mt-16 max-md:mt-10">
                                <button onClick={() => handleClick('second')}>
                                    <div className="shrink-0 self-start rounded-full bg-zinc-300 h-[25px] w-[25px]" />
                                </button>
                                <div className="flex-auto">{question.second}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col ml-5 w-[50%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow pt-12 text-2xl font-semibold leading-10 text-neutral-800 max-md:mt-10">
                            <div className="flex gap-5 mt-24 max-md:mt-10">
                                <button onClick={() => handleClick('third')}>
                                    <div className="shrink-0 self-start rounded-full bg-zinc-300 h-[25px] w-[25px]" />
                                </button>
                                <div className="flex-auto">{question.third}</div>
                            </div>
                            <div className="flex gap-5 mt-16 max-md:mt-10">
                                <button onClick={() => handleClick('fourth')}>
                                    <div className="shrink-0 self-start rounded-full bg-zinc-300 h-[25px] w-[25px]" />
                                </button>
                                <div className="flex-auto">{question.fourth}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Question;