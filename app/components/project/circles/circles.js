import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { eventBus, getQuestionNumber, getIsBack, setIsBack } from '../utils/shared';
import 'jquery-circle-progress';
import { css } from "jquery-circle-progress";



class Circles extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    let circle;
    let $circle = $('.circle', $element);
  
    $(eventBus).on('quiz-activated', function() {
      $($element).addClass('circles_active');
    });

    $(eventBus).on('quiz-deactivated', function() {
      $($element).removeClass('circles_active');
    });

    $(eventBus).on('page-reset', function(){
      $('.circle__line-full', $circle).removeClass('circle__line-full_active');
      // $('.circle__full', $element).remove();

      $('.circle__full', $circle).attr('width', 0).attr('height', 0);
      $circle = $('.circle', $element);
      // circle = $('.circle', $element).eq( getQuestionNumber() );
      // $circle.circleProgress({
      //   size: 0
      // });
      // var canvas = document.getElementsByClassName("circle__full")[0];
      // var ctx = canvas.getContext("2d");
      // ctx.clearRect(10, 10, 100, 100);
    });


    $(eventBus).on('quiz-changed quiz-nopic:changed', function() {
      circle = $circle.eq( getQuestionNumber() );
      circle.circleProgress({
        size: 40,
        startAngle: -Math.PI / 2,
        value: 0.75,
        reverse: true,
        animation: false,
        lineCap: "round",
        animation: { duration: 1200},
        fill: {color: '#fff'}
      })

      $('.circle canvas').addClass('circle__full');
      
    });


    $(eventBus).on('close-circleAnimation', function(){
      const num = getQuestionNumber();
      circle
        .circleProgress('value', 0.75)
        .circleProgress('value', 1.0)
        setTimeout(()=>{
          console.log('draw the line');
          $('.circle__line-full').eq( num ).addClass('circle__line-full_active');
        }, 1000 );
    });

  
  }


}


registerPlugins({
  name: "circles",
  Constructor: Circles,
  selector: ".circles"
});
