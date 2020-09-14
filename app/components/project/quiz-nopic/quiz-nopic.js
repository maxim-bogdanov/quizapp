import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber, setIsFinished, data,
  isQuizActive, isQuizNopicActive, setQuizNopicActive, setQuizActive } from '../utils/shared';
import { Timer } from '../utils/timer';

const TIME_FADING = 1.5;  
const coordFade = 80;

class quizNopic extends Plugin {

  #isFirst = false;
  #$answer;
  #$logo;
  #$question;
  #$gradient;

  constructor($element) {

    super($element);

    $(eventBus)
      .on('quiz-nopic:activated', function() {
        $element.addClass('quiz-nopic_active');
      })
      .on('quiz-nopic:deactivated', function() {
        $element.removeClass('quiz-nopic_active');
      })
      .on('quiz-nopic:changed', fadeOutContent.bind(this) )
      .on('page-reset', function(){
        $(eventBus).trigger('quiz-nopic:deactivated');
        $('.quiz-nopic__content-inner', $element).empty();
      });

    let $answer, $logoRight, $logoLeft, $question, $gradient;

    const updateLinks = () => {
      $answer = this.#$answer = $('.quiz-nopic__answer', $element);
      // $logoLeft = this.#$logo = $(".quiz-nopic__left", $element);
      // $logoRight = this.#$logo = $(".quiz-nopic__right", $element);
      // $gradient = this.#$gradient = $(".quiz-nopic__content-gradient", $element);
      $question = this.#$question = $(".quiz-nopic__question", $element);
    }

    const tpl = Handlebars.compile($('.__tpl',$element).text());

    let isFirst;
    let timer;

    
    function fadeOutContent()  {
      isFirst = this.#isFirst = getQuestionNumber() ? false : true;

      if( isFirst ) {
          changeInnerPart();
          isFirst = false;
          return;
      }

      console.log( isFirst );
    
      updateLinks();
  
      //FadeOut
      // gsap.to($logoLeft,  0.2, { opacity: 0 });
      // gsap.to($logoRight,  0.2, { opacity: 0 });
      // gsap.to($gradient,  0.2, { opacity: 0 });
      // gsap.to($question,  0.3, {
      //     opacity: 0,
      //     delay: 0.2,
      //     onComplete: changeInnerPart
      // })
      let fade_time = isQuizActive ? 0 : TIME_FADING;
      gsap.to($question,  fade_time, {
        x: coordFade,
        opacity: 0,
        // delay: 2,
        onComplete: changeInnerPart
      })
    }

    const changeInnerPart = () => {

      if (this.isLastQuiz()) {
        this.goEndScreen();
        return;
      }

      let num = getQuestionNumber();
      
      const questionData = data.questions[num];
      // $element.empty().append(tpl(questionData));

      $('.quiz-nopic__content-inner', $element).empty().append(tpl(questionData));
      // $('.quiz-nopic__content', $element).append('<img class="quiz-nopic__content-gradient"src="images/water/gradient-first.png">');
      // $('.quiz-nopic__content-gradient', $element).attr('style','');

      if (questionData.img) {
        setQuizNopicActive(true);
        $(eventBus).trigger('quiz-activated:only');
        $(eventBus).trigger('quiz-nopic:deactivated');
        $(eventBus).trigger('change-quiz');
        return;
      }

      setQuizActive(false);

      $(eventBus).trigger('circle-quiz');
      $(eventBus).trigger('start-timer'); 
      updateLinks();
      
      $answer.on('click', (e)=> { 
        $answer.addClass('quiz-nopic__answer_disable');

        if (this.isCorrect($element, e.target))
          $(eventBus).trigger('change-score');
        
        $(eventBus).trigger('stop-timer');

        this.showAnswers($element, e.target);
  
        $(eventBus).trigger('close-circleAnimation');

        setQuestionNumber(getQuestionNumber() + 1);
  
        // $(eventBus).trigger('change:quiz-nopic');
        setTimeout(() => {
          $(eventBus).trigger('change:quiz-nopic');
        }, 1000);
      });
  
      // FadeIn
      // gsap.from($logoLeft, .5, { x: 0, opacity: 0, scale: 0.8});
      // gsap.from($logoRight, .5, { x: 0, opacity: 0, scale: 0.8});
      // gsap.from($gradient, .7, {y: 50, opacity: 0, delay: .5});
      // gsap.from($question, .7, {y: 50, opacity: 0, delay: .5});
      gsap.from($question,  TIME_FADING, {
        x: -coordFade,
        opacity: 0
      })
  
    } 
  }

  showAnswers($element, target){
    if (!this.isCorrect($element, target))
      $(target).addClass('quiz-nopic__answer_incorrect');
      
    $('.quiz-nopic__answer[data-iscorrect="true"]', $element).addClass('quiz-nopic__answer_correct');
  }

  isCorrect($element, target) {
    return $(target, $element).data('iscorrect');
  }

  isLastQuiz() {
    return getQuestionNumber() === data.questions.length;
  }

  goEndScreen() {
    setIsFinished(true);
    $(eventBus).trigger('activate:end-screen');
  }

}


registerPlugins({
  name: "quiz-nopic",
  Constructor: quizNopic,
  selector: ".quiz-nopic"
});
