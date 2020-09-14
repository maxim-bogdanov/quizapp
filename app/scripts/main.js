import '../components/project/project';
import '../components/project/circles/circles';
import { eventBus, setQuestionNumber, setScore,
   getScore, setData } from '../components/project/utils/shared';
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
  const TIME_AFK = 60;

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
    $(eventBus).trigger('video:deactivated');
    $(eventBus).trigger('quiz-activated');
    timer = new Timer(TIME_AFK);
  });

  $(eventBus).on('change-quiz', function () {
    $(eventBus).trigger('quiz-changed');
  });

  $(eventBus).on('start-timer', function() {
    timer.start();
  })

  $(eventBus).on('stop-timer', function() {
    timer.stop();
    timer = new Timer(TIME_AFK);
  })

  $(eventBus).on('change:quiz-nopic', function () {
    $(eventBus).trigger('quiz-nopic:changed');
  });

  $(eventBus).on('activate:end-screen', function () {
    $(eventBus).trigger('quiz-deactivated');
    $(eventBus).trigger('quiz-nopic:deactivated');
    $(eventBus).trigger('end-screen:activated');
  });

  $(eventBus).on('reset-page', function(){
    setScore();
    timer.stop();
    $(eventBus).trigger('page-reset');
  });
}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(() => def.resolve());
  return def.promise();
}
