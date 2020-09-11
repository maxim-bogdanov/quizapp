import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber } from '../../project/utils/shared';


class FirstScreen extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
    

    // $(window).trigger('activate:downline-first');

    $(eventBus)
      .on('first-screen:activated', function() {
        $element.addClass('first-screen_active');
      });
      $(eventBus).on('first-screen:deactivated', function() {
        $element.removeClass('first-screen_active');
      })
      .on('page-reset', function(){
        $(eventBus).trigger('first-screen:activated');
      })
      
    $('.first-screen__logo', $element).on('click', function(){
      $(eventBus).trigger('activate:video');
    });



  }
}

registerPlugins({
  name: "firstScreen",
  Constructor: FirstScreen,
  selector: ".first-screen"
});
