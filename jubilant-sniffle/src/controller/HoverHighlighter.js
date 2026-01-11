export class HoverHighlighter {
  constructor(hitTest, highlightMaterial) {
    this.hitTest = hitTest;
    this.highlightMaterial = highlightMaterial;

    this.hovered = null;
    this.originalMaterial = null;

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.mouse = { x: 0, y: 0 };
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  update() {
    const target = this.hitTest(this.mouse.x, this.mouse.y);

    if (target !== this.hovered) {
      this.restore();

      if (target) {
        this.hovered = target;
        this.originalMaterial = target.material;
        target.material = this.highlightMaterial;
      }
    }
  }

  restore() {
    if (!this.hovered) return;

    this.hovered.material = this.originalMaterial;
    this.hovered = null;
    this.originalMaterial = null;
  }
}
