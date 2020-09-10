import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber, getScore, data } from '../../project/utils/shared';

class EndScreen extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);


      $(eventBus)
        .on('end-screen:activated', function() {
          let boy = getScore() < 3 ? 'bad' : 'good';
      
          $('.end-screen__logo', $element).attr('src', data.end[boy].img);
          $('.end-screen__title', $element).html(data.end[boy].title);
          $('.end-screen__text', $element).html(data.end[boy].text);
    
          $element.addClass('end-screen_active');
        })
        .on('end-screen:deactivated', function() { 
          $element.removeClass('end-screen_active');
        })
        .on('page-reset', function(){
          $(eventBus).trigger('end-screen:deactivated');
        })

  }
}

registerPlugins({
  name: "endScreen",
  Constructor: EndScreen,
  selector: ".end-screen"
});
