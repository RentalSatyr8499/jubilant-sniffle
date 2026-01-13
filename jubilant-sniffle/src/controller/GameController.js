import { HoverSelectionController } from "./HoverSelectionController";
import { HighlightView } from "../view/HighlightView";

export class GameController {
  constructor(hitTest) {
    this.highlightView = new HighlightView();

    this.hoverController = new HoverSelectionController(
      hitTest,
      (prev, next) => this.highlightView.setHighlighted(next)
    );
  }

  update() {
    this.hoverController.update();
  }
}
