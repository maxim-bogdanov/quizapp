import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { eventBus, getScore, getQuestionNumber, getIsFinished, setIsBack } from "../utils/shared";
import { get, data } from "jquery";

class Header extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
    $(eventBus)
    .on('quiz-activated end-screen:activated', function(){
      $('.header__back', $element).addClass('header__back_active');
      $('.header__score', $element).addClass('header__score_active');
    })
    .on('quiz-deactivated end-screen:deactivated', function(){
      $('.header__back', $element).removeClass('header__back_active');
      $('.header__score', $element).removeClass('header__score_active');
    })
    .on('score-change', function() {
      let score = getScore();
      $('.header__score-num', $element).html( score );
    })
    .on('end-screen:activated', function() {
      $('.header__score-inner', $element).addClass('header__score-inner_end');
    })
    .on('end-screen:deactivated', function() {
      $('.header__score-inner', $element).removeClass('header__score-inner_end');
    })
    .on('page-reset',function(){
      // $(eventBus).trigger('score-change');
      // $(eventBus).trigger('first-screen:activated');
      // $(eventBus).trigger('quiz-deactivated');
      // $(eventBus).trigger('end-screen:deactivated');
      // $(eventBus).trigger('downline-first:activated');
      $(eventBus).trigger('score-change');
    });

    $('.header__back', $element).on('click', function(e, data){
      setIsBack(true);
      $(eventBus).trigger('reset-page');
    });

  }
}

registerPlugins({
  name: "header",
  Constructor: Header,
  selector: ".header"
});
