import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber, setIsFinished, data,
  isQuizActive, isQuizNopicActive, setQuizNopicActive, setQuizActive } from '../utils/shared';
import { Timer } from '../utils/timer';

const TIME_FADING = 0.4;
const coordFade = 80;

class quiz extends Plugin {

  #isFirst = false;
  #$answer;
  #$logo;
  #$title;

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

    let $answer, $logo, $title;

    const updateLinks = () => {
      $answer = this.#$answer = $('.quiz__answer', $element);
      $logo = this.#$logo = $(".quiz__left", $element);
      $title = this.#$title = $(".quiz__title", $element);
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

      if (isQuizNopicActive) {
        gsap.to($logo,  0, {

        });

        gsap.to($title,  0, {
          onComplete: changeInnerPart
        });
  
        for (let $ans of $answer) {
          gsap.to($ans,  0, {

          });
        }
      }

      else {
        //FadeOut

        gsap.to($title,  TIME_FADING + 1.1, {
          x: coordFade,
          opacity: 0,
          onComplete: changeInnerPart
        });

        gsap.to($logo,  TIME_FADING, {
          x: -coordFade,
          delay: TIME_FADING,
          opacity: 0
        });
        
        let timeAnswer = 0;

        for (let $ans of $answer) {
          gsap.to($ans,  TIME_FADING + 0.2, {
            x: coordFade,
            delay: TIME_FADING + timeAnswer,
            opacity: 0
          });
          timeAnswer += 0.3;
        }
      }
    }

    const changeInnerPart = () => {

      if (this.isLastQuiz()) {
        this.goEndScreen();
        return;
      }

      let num = getQuestionNumber();   

      const questionData = data.questions[num];

      if (!questionData.img) {
        setQuizActive(true);
        $(eventBus).trigger('quiz-deactivated:only');
        $(eventBus).trigger('quiz-nopic:activated');
        $(eventBus).trigger('change:quiz-nopic');
        return;
      }
      setQuizNopicActive(false);

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

        // $(eventBus).trigger('change-quiz');
        setTimeout(() => {
          $(eventBus).trigger('change-quiz');
        }, 250);
      });
  
      // FadeIn

      gsap.from($logo,  TIME_FADING, {
        x: -coordFade,
        opacity: 0
      });

      gsap.from($title,  TIME_FADING, {
        x: -coordFade,
        delay: TIME_FADING,
        opacity: 0
      });
      
      let timeAnswer = 0;

      for (let $ans of $answer) {
        gsap.from($ans,  TIME_FADING + 0.2, {
          x: -coordFade,
          delay: TIME_FADING + timeAnswer,
          opacity: 0
        });
        timeAnswer += 0.3;
      }


    } 
  }

  showAnswers($element, target){
    if (!this.isCorrect($element, target))
      $(target).addClass('quiz__answer_incorrect');
    else 
      $(target).addClass('quiz__answer_correct');
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

  reset($element) {
    $(eventBus).trigger('quiz-deactivated');
  }

}


registerPlugins({
  name: "quiz",
  Constructor: quiz,
  selector: ".quiz"
});
