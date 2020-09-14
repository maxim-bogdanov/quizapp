import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber, getScore, data } from '../../project/utils/shared';

class EndScreen extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    let $logo, $title, $text;
    $(eventBus)
      .on('end-screen:activated', function() {
        $(eventBus).trigger('start-timer');

        let boy = getScore() < 3 ? 'bad' : 'good';

        $logo = $('.end-screen__logo', $element);
        $title = $('.end-screen__title', $element);
        $text = $('.end-screen__text', $element);
    
        $logo.attr('src', data.end[boy].img);
        $title.html(data.end[boy].title);
        $text.html(data.end[boy].text);

        //FadeIn
        gsap.fromTo($logo,  1.5, {
          opacity: 0
        }, {
          opacity: 1
        });
        gsap.fromTo($title,  1.5, {
          opacity: 0
        }, {
          opacity: 1
        });
        gsap.fromTo($text,  1.5, {
          opacity: 0
        }, {
          opacity: 1
        });
  
        $element.addClass('end-screen_active');
      })
      .on('end-screen:deactivated', function() { 
        //FadeOut
        gsap.to($logo,  1.5, {
          opacity: 0
        })
        gsap.to($title,  1.5, {
          opacity: 0
        })
        gsap.to($text,  1.5, {
          opacity: 0
        })

        $(eventBus).trigger('stop-timer');

        setTimeout(() => {
          $element.removeClass('end-screen_active');
        }, 1500);
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
