import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { eventBus } from "../utils/shared";

class Downline extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
    $(eventBus)
    .on('first-screen:activated end-screen:activated', function(data) {
      $('.downline__first',$element).addClass('downline_active');
      $('.downline__quiz',$element).removeClass('downline_active');
    })
    .on('quiz:activated', function(data) {
      $('.downline__quiz',$element).addClass('downline_active');
      $('.downline__first',$element).removeClass('downline_active');
    })
      // .on('downline-first:activated', function(data) {
      //   $('.downline__first',$element).addClass('downline_active');
      //   $('.downline__quiz',$element).remove('downline_active');
      // })
      // .on('downline-quiz:activated', function(data) {
      //   $('.downline__quiz',$element).addClass('downline_active');
      //   $('.downline__first',$element).removeClass('downline_active');
      // })
      // .on('page-reset', function() {
      //   $(eventBus).on('downline-first:activated');
      // });


  }
}

registerPlugins({
  name: "downline",
  Constructor: Downline,
  selector: ".downline"
});
