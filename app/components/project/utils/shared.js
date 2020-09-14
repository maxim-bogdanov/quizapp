import $ from 'jquery';
global.$ = $;

import Handlebars from 'handlebars';
global.Handlebars = Handlebars;

import gsap from 'gsap';
global.gsap = gsap;

export let data;

export function setData(_data) {
    data = _data;
}

//
export const eventBus = window;
export const $eventBus = $(eventBus);

//
export const $window = $(window);

let num;
export function setQuestionNumber(_num){
    num = _num || 0;
}

//
export function getQuestionNumber(){
    return num;
}

let score = 0;
export function setScore(_score){
    score = _score || 0;
}

//
export function getScore(){
    return score;
}

let isFinished = false;
export function setIsFinished(_isFinished){
    isFinished = _isFinished || false;
}

//
export function getIsFinished(){
    return isFinished;
}

let isBack = false;
export function setIsBack(_isBack){
    isBack = _isBack || false;
}

//
export function getIsBack(){
    return isBack;
}

export let isQuizActive = false;

export function setQuizActive(_isQuizActive){
    isQuizActive = _isQuizActive || false;
}

//

export let isQuizNopicActive = false;

export function setQuizNopicActive(_isQuizNopicActive){
    isQuizNopicActive = _isQuizNopicActive || false;
}