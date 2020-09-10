import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import {eventBus, setQuestionNumber, getQuestionNumber } from '../utils/shared';

class quizNopic extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "quiz-nopic",
  Constructor: quizNopic,
  selector: ".quiz-nopic"
});
