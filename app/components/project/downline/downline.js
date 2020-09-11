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
    .on('quiz-activated quiz-nopic:activated', function(data) {
      $('.downline__quiz',$element).addClass('downline_active');
      $('.downline__first',$element).removeClass('downline_active');
    })

  }
}

registerPlugins({
  name: "downline",
  Constructor: Downline,
  selector: ".downline"
});
