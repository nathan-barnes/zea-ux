import { BaseLinearMovementHandle } from './BaseLinearMovementHandle.js';
import ParameterValueChange from '../undoredo/ParameterValueChange.js';

/** Class representing a linear movement scene widget.
 * @extends BaseLinearMovementHandle
 */
class LinearMovementHandle extends BaseLinearMovementHandle {
  /**
   * Create a linear movement scene widget.
   * @param {any} name - The name value.
   * @param {any} length - The length value.
   * @param {any} thickness - The thickness value.
   * @param {any} color - The color value.
   */
  constructor(name, length, thickness, color) {
    super(name);

    this.__color = color;
    this.__hilightedColor = new ZeaEngine.Color(1, 1, 1);
    this.colorParam = this.addParameter(
      new ZeaEngine.ColorParameter('BaseColor', color)
    );

    const handleMat = new ZeaEngine.Material('handle', 'HandleShader');
    handleMat.replaceParameter(this.colorParam);
    const handleGeom = new ZeaEngine.Cylinder(thickness, length, 64);
    handleGeom.getParameter('baseZAtZero').setValue(true);
    const tipGeom = new ZeaEngine.Cone(thickness * 4, thickness * 10, 64, true);
    const handle = new ZeaEngine.GeomItem('handle', handleGeom, handleMat);

    const tip = new ZeaEngine.GeomItem('tip', tipGeom, handleMat);
    const tipXfo = new ZeaEngine.Xfo();
    tipXfo.tr.set(0, 0, length);
    tipGeom.transformVertices(tipXfo);

    // this.radiusParam.valueChanged.connect(()=>{
    //   radius = this.radiusParam.getValue();
    //   handleGeom.getParameter('radius').setValue(radius);
    //   handleGeom.getParameter('height').setValue(radius * 0.02);
    // })

    this.addChild(handle);
    this.addChild(tip);
  }

  /**
   * The highlight method.
   */
  highlight() {
    this.colorParam.setValue(this.__hilightedColor);
  }

  /**
   * The unhighlight method.
   */
  unhighlight() {
    this.colorParam.setValue(this.__color);
  }

  /**
   * The setTargetParam method.
   * @param {any} param - The video param.
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
    this.baseXfo = this.param.getValue();
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
      this.param.setValue(newXfo);
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

export { LinearMovementHandle };