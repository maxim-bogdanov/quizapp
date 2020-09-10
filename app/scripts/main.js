import '../components/project/project';
import '../components/project/circles/circles';
import { eventBus, setQuestionNumber, getQuestionNumber, setScore,
   getScore, setIsFinished, getIsFinished, setData } from '../components/project/utils/shared';

global.jQuery = global.$ = $;
global.eventBus = window;

$.when(isDocumentReady())
  .done(onDocumentReady);
function onDocumentReady() {
  if ($.fn.initPlugins) {
    $(document.body).initPlugins();
  }
  console.log('json');

  $.getJSON('data/data.json', function (data) {
    setQuestionNumber();
    console.log('json');
    // $(eventBus).trigger('document:ready', data);
  });

  // $(eventBus).on('activate:downline-first', function (e, data) {
  //   $(eventBus).trigger('downline-first:activated', data);
  // });

  // $(eventBus).on('activate:downline-quiz', function (e, data) {
  //   $(eventBus).trigger('downline-quiz:activated', data);
  // });


  $(eventBus).on('open-video', function () {
    $(eventBus).trigger('video-opened');
  });

  // $(eventBus).on('activate:first-screen', function () {
  //   $(eventBus).trigger('first-screen:activated');
  // });

  $(eventBus).on('change-score', function () {
    setScore(getScore() + 1);
    $(eventBus).trigger('score-change');
  });

  $(eventBus).on('activate-quiz', function () {
    setQuestionNumber(0);
    setIsFinished();
    // $(eventBus).trigger('activate:downline');
    $(eventBus).trigger('first-screen:deactivated');
    $(eventBus).trigger('quiz-activated');
  });

  $(eventBus).on('change-quiz', function () {
    $(eventBus).trigger('quiz-changed');
    setQuestionNumber(getQuestionNumber() + 1);
  });

  $(eventBus).on('activate:end-screen', function () {
    // $(eventBus).trigger('activate:downline');
    $(eventBus).trigger('quiz-deactivated');
    $(eventBus).trigger('end-screen:activated');
  });

  $(eventBus).on('reset-page', function(){
    setScore();

    $(eventBus).trigger('page-reset');
  });

  // $(eventBus).on('go:first-screen', function(){
  //   setScore();

  //   if (getIsFinished()) {
  //     $(eventBus).trigger('end-screen:activated');
  //     $(eventBus).trigger('activate:first-screen');
  //   }
  //   else {
  //     $(eventBus).trigger('activate-quiz');
  //   }
  //   $(eventBus).trigger('first-screen:went');
  //   $(eventBus).trigger('score-change');

  // });

}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(() => def.resolve());
  return def.promise();
}
