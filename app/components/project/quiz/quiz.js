import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber, setIsFinished, data } from '../utils/shared';
import { Timer } from '../utils/timer';

const TIME_FADING = 300;
const coordFade = 230;

class quiz extends Plugin {

  #isFirst = false;
  #$answer;
  #$logo;
  #$question;

  constructor($element) {

    super($element);

    $(eventBus)
      .on('quiz-activated quiz-activated:only', function() {
        $element.addClass('quiz_active');
      })
      .on('quiz-deactivated quiz-deactivated:only', function() {
        $element.removeClass('quiz_active');
      })
      .on('quiz-changed', fadeOutContent.bind(this) )
      .on('page-reset', this.reset);

    let $answer, $logo, $question;

    const updateLinks = () => {
      $answer = this.#$answer = $('.quiz__answer', $element);
      $logo = this.#$logo = $(".quiz__left", $element);
      $question = this.#$question = $(".quiz__question", $element);
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
    
      updateLinks();
  
      //FadeOut
      gsap.to($question,  1.5, {
        x: coordFade,
        opacity: 0
      })
      gsap.to($logo,  1.5, {
        x: -coordFade,
        opacity: 0,
        onComplete: changeInnerPart
      })
    }

    const changeInnerPart = () => {
      let num = getQuestionNumber();
      

      const questionData = data.questions[num];

      if (!questionData.img) {
        $(eventBus).trigger('quiz-deactivated:only');
        $(eventBus).trigger('quiz-nopic:activated');
        $(eventBus).trigger('change:quiz-nopic');
        return;
      }
      $(eventBus).trigger('circle-quiz');
      $(eventBus).trigger('start-timer');
      $element.empty().append(tpl(questionData));
  
      updateLinks();
      
      $answer.on('click', (e)=> { 
        $answer.addClass('quiz__answer_disable');

        if (this.isCorrect($element, e.target))
          $(eventBus).trigger('change-score');

        $(eventBus).trigger('stop-timer');
        
        this.showAnswers($element, e.target);
  
        $(eventBus).trigger('close-circleAnimation');
  
        setQuestionNumber(getQuestionNumber() + 1);

        setTimeout(this.changePage, 1200);
      });
  
      // FadeIn
      // gsap.from($logo, .5, { x: 0, opacity: 0, scale: 0.8});
      // gsap.from($question, .7, {y: 50, opacity: 0, delay: .5});
      gsap.from($question,  1.5, {
        x: -coordFade,
        opacity: 0
      })
      gsap.from($logo,  1.5, {
        x: -coordFade
      })
    } 
  }

  showAnswers($element, target){
    if (!this.isCorrect($element, target))
      $(target).addClass('quiz__answer_incorrect');
      
    $('.quiz__answer[data-iscorrect="true"]', $element).addClass('quiz__answer_correct');
  }

  isCorrect($element, target) {
    return $(target, $element).data('iscorrect');
  }

  changePage() {
    if (getQuestionNumber() !== data.questions.length) {
      $(eventBus).trigger('change-quiz');
    }
    else {
      setIsFinished(true);
      $(eventBus).trigger('activate:end-screen');
    }
  }

  reset($element) {
    $(eventBus).trigger('quiz-deactivated');
  }

}


registerPlugins({
  name: "quiz",
  Constructor: quiz,
  selector: ".quiz"
});
