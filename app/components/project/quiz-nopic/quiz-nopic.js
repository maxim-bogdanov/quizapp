import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber, data,
  isQuizActive, setQuizNopicActive, setQuizActive } from '../utils/shared';
import { Timer } from '../utils/timer';

const TIME_FADING = 0.75;  
const coordFade = 80;

class quizNopic extends Plugin {

  #isFirst = false;
  #$answer;
  #$title;

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

    let $answer, $title;

    const updateLinks = () => {
      $answer = this.#$answer = $('.quiz-nopic__answer', $element);
      $title = this.#$title = $(".quiz-nopic__title", $element);
    }

    const tpl = Handlebars.compile($('.__tpl',$element).text());

    let isFirst;
    
    function fadeOutContent()  {
      isFirst = this.#isFirst = getQuestionNumber() ? false : true;

      if( isFirst ) {
          changeInnerPart();
          isFirst = false;
          return;
      }
    
      updateLinks();
  
      //FadeOut
      if (isQuizActive) {
        gsap.to($title,  0, {
          onComplete: changeInnerPart
        });
  
        for (let $ans of $answer) {
          gsap.to($ans,  0, {});
        }
      }
      else {
        gsap.to($title,  TIME_FADING + 0.3 * data.questions.length, {
          x: coordFade,
          delay: TIME_FADING,
          opacity: 0,
          onComplete: changeInnerPart
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

      $('.quiz-nopic__content-inner', $element).empty().append(tpl(questionData));

      if (questionData.img) {
        this.goQuiz();
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
  
        setTimeout(() => {
          $(eventBus).trigger('change:quiz-nopic');
        }, 250);
      });
  
      // FadeIn
      gsap.from($title,  TIME_FADING, {
        x: -coordFade,
        opacity: 0
      });
      
      let timeAnswer = 0;

      for (let $ans of $answer) {
        gsap.from($ans,  TIME_FADING + 0.2, {
          x: -coordFade,
          delay: timeAnswer,
          opacity: 0
        });
        timeAnswer += 0.3;
      }
  
    } 
  }


  goQuiz() {
    setQuizNopicActive(true);
    $(eventBus).trigger('quiz-activated:only');
    $(eventBus).trigger('quiz-nopic:deactivated');
    $(eventBus).trigger('change-quiz');
  }

  showAnswers($element, target){
    if (!this.isCorrect($element, target))
      $(target).addClass('quiz-nopic__answer_incorrect');
    else 
      $(target).addClass('quiz-nopic__answer_correct');
  }

  isCorrect($element, target) {
    return $(target, $element).data('iscorrect');
  }

  isLastQuiz() {
    return getQuestionNumber() === data.questions.length;
  }

  goEndScreen() {
    $(eventBus).trigger('activate:end-screen');
  }

}


registerPlugins({
  name: "quiz-nopic",
  Constructor: quizNopic,
  selector: ".quiz-nopic"
});
