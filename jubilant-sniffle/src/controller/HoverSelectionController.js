export class HoverSelectionController {
  constructor(hitTest, onHoverChanged) {
    this.hitTest = hitTest;
    this.onHoverChanged = onHoverChanged;

    this.hovered = null;
    this.mouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  update() {
    const target = this.hitTest(this.mouse.x, this.mouse.y);

    if (target !== this.hovered) {
      const previous = this.hovered;
      this.hovered = target;

      this.onHoverChanged(previous, target);
    }
  }
}
