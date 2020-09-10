import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { eventBus, getQuestionNumber, getIsBack, setIsBack, data } from '../utils/shared';
import 'jquery-circle-progress';
import { css } from "jquery-circle-progress";

class Video extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    $('#video').on('ended', function(){
      $(eventBus).trigger('activate-quiz');
      $(eventBus).trigger('change-quiz');
    })


    $(eventBus)
      .on('video:activated', function(){
        $($element).addClass('video_active');

        video.play();

        const duration = video.duration * 1000;

        let $circle = $('.video__btn-close');
        $circle.circleProgress({
          size: 100,
          startAngle: Math.PI*1.5,
          value: 1,
          reverse: false,
          animation: false,
          lineCap: "round",
          animation: { duration: duration},
          fill: {color: 'red'},
          emptyFill: "#fff"
        })
        $('.video__btn-close canvas').addClass('video__btn-close_full');
      })
      .on('video:deactivated', function(){
        $($element).removeClass('video_active');
      })
      .on('page-reset', function(){
        video.load();
      });

      $('.video__btn-close', $element).on('click', function(){
        $(eventBus).trigger('activate-quiz');
        $(eventBus).trigger('change-quiz');
      });

  }

}

registerPlugins({
  name: "video",
  Constructor: Video,
  selector: ".video"
});
