import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { eventBus, getQuestionNumber, getIsBack, setIsBack, data } from '../utils/shared';
import 'jquery-circle-progress';
import { css } from "jquery-circle-progress";

const FADING_VIDEO = 2;

class Video extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    $(eventBus)
      .on('video:activated', function(){
        $('.video-media',$element).addClass('video-media_active');
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
        $('.video__btn-close canvas', $element).addClass('video__btn-close_full');

        setTimeout( () => {
          $('.video__btn-close', $element).addClass('video__btn-close_active');
        }, FADING_VIDEO * 1000);

      }.bind(this))
      .on('video:deactivated', function(){
        $($element).removeClass('video_active');
        $('.video-media',$element).removeClass('video-media_active');
        $('.video__btn-close', $element).removeClass('video__btn-close_active');
      })
      .on('page-reset', function(){
        video.load();
      });

      $('#video').on('ended', this.closeVideo);
      $('.video__btn-close', $element).on('click', this.closeVideo);

  }

  closeVideo() {
    video.pause();
    $(eventBus).trigger('activate-quiz');
    $(eventBus).trigger('first-screen:deactivated');
    $(eventBus).trigger('circle-quiz');
    $(eventBus).trigger('change-quiz');
  }

}

registerPlugins({
  name: "video",
  Constructor: Video,
  selector: ".video"
});
