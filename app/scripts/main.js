import '../components/project/project';
import '../components/project/circles/circles';
import { eventBus, setQuestionNumber, getQuestionNumber, setScore,
   getScore, setIsFinished, getIsFinished, setData } from '../components/project/utils/shared';
import { Timer } from '../components/project/utils/timer';

global.jQuery = global.$ = $;
global.eventBus = window;

$.when(isDocumentReady())
  .done(onDocumentReady);
function onDocumentReady() {
  if ($.fn.initPlugins) {
    $(document.body).initPlugins();
  }

  let timer;
  const TIME_AFK = 30;

  $.getJSON('data/data.json', function (data) {
    setQuestionNumber();
    setData(data);
  });


  $(eventBus).on('activate:video', function () {
    $(eventBus).trigger('first-screen:deactivated');
    $(eventBus).trigger('video:activated');
  });

  $(eventBus).on('change-score', function () {
    setScore(getScore() + 1);
    $(eventBus).trigger('score-change');
  });

  $(eventBus).on('activate-quiz', function () {
    setQuestionNumber();
    setIsFinished();
    $(eventBus).trigger('video:deactivated');
    $(eventBus).trigger('quiz-activated');
    timer = new Timer(TIME_AFK);
  });

  $(eventBus).on('change-quiz', function () {
    timer.restart();
    $(eventBus).trigger('quiz-changed');
    setQuestionNumber(getQuestionNumber() + 1);
    timer = new Timer(TIME_AFK);
  });

  $(eventBus).on('activate:end-screen', function () {
    timer.restart();
    $(eventBus).trigger('quiz-deactivated');
    $(eventBus).trigger('end-screen:activated');
    timer = new Timer(TIME_AFK);
  });

  $(eventBus).on('reset-page', function(){
    setScore();
    timer.restart();
    $(eventBus).trigger('page-reset');
  });
}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(() => def.resolve());
  return def.promise();
}
