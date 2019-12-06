import Handle from './Handle.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/** Class representing a planar movement scene widget.
 * @extends Handle
 */
class PlanarMovementHandle extends Handle {
  /**
   * Create a planar movement scene widget.
   * @param {any} name - The name value.
   */
  constructor(name) {
    super(name);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The param param.
   * @param {boolean} track - The track param.
   */
  setTargetParam(param, track = true) {
    this.param = param;
    if (track) {
      const __updateGizmo = () => {
        this.setGlobalXfo(param.getValue());
      };
      __updateGizmo();
      param.valueChanged.connect(__updateGizmo);
    }
  }

  /**
   * The onDragStart method.
   * @param {any} event - The event param.
   */
  onDragStart(event) {
    this.grabPos = event.grabPos;
    this.baseXfo = this.param ? this.param.getValue() : this.getGlobalXfo();
    if (event.undoRedoManager) {
      this.change = new ParameterValueChange(this.param);
      event.undoRedoManager.addChange(this.change);
    }
  }

  /**
   * The onDrag method.
   * @param {any} event - The event param.
   */
  onDrag(event) {
    const dragVec = event.holdPos.subtract(this.grabPos);

    const newXfo = this.baseXfo.clone();
    newXfo.tr.addInPlace(dragVec);

    if (this.change) {
      this.change.update({
        value: newXfo,
      });
    } else {
      if (this.param)
           this.param.setValue(newXfo) 
      else this.setGlobalXfo(newXfo);
    }
  }

  /**
   * The onDragEnd method.
   * @param {any} event - The event param.
   */
  onDragEnd(event) {
    this.change = null;
  }
}
export { PlanarMovementHandle };
