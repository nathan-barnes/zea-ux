import { Color, Vec3, Xfo, TreeItem, ColorParameter } from '@zeainc/zea-engine'
import Handle from './Handle'
import LinearMovementHandle from './LinearMovementHandle'
import AxialRotationHandle from './AxialRotationHandle'
import LinearScaleHandle from './LinearScaleHandle'
import SphericalRotationHandle from './SphericalRotationHandle'
import './Shaders/HandleShader'
import XfoPlanarMovementHandle from './XfoPlanarMovementHandle'

/**
 * Class representing a xfo handle. Base transformations for objects in the scene
 *
 * **Parameters**
 * * **HighlightColor(`ColorParameter`):** Specifies the highlight color of the handle.
 *
 * @extends TreeItem
 */
class XfoHandle extends TreeItem {
  /**
   * Create an axial rotation scene widget.
   *
   * @param {number} size - The size value.
   * @param {number} thickness - The thickness value.
   */
  constructor(size = 0.1, thickness = 0.003) {
    super('XfoHandle')

    this.highlightColorParam = this.addParameter(new ColorParameter('HighlightColor', new Color(1, 1, 1)))

    this.highlightColorParam.on('valueChanged', () => {
      const color = this.highlightColorParam.getValue()

      this.traverse((item) => {
        if (item instanceof Handle) item.getParameter('HighlightColor').setValue(color)
      })
    })
    // ////////////////////////////////
    // LinearMovementHandle

    const translationHandles = new TreeItem('Translate')
    translationHandles.setVisible(false)
    this.addChild(translationHandles)

    const red = new Color(1, 0.1, 0.1)
    const green = new Color('#32CD32') // limegreen https://www.rapidtables.com/web/color/green-color.html
    const blue = new Color('#1E90FF') // dodgerblue https://www.rapidtables.com/web/color/blue-color.html
    red.a = 0.8
    green.a = 0.8
    blue.a = 0.8

    {
      const linearXWidget = new LinearMovementHandle('linearX', size, thickness, red)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      linearXWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(linearXWidget)
    }
    {
      const linearYWidget = new LinearMovementHandle('linearY', size, thickness, green)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
      linearYWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(linearYWidget)
    }
    {
      const linearZWidget = new LinearMovementHandle('linearZ', size, thickness, blue)
      translationHandles.addChild(linearZWidget)
    }

    // ////////////////////////////////
    // planarXYWidget
    const planarSize = size * 0.35
    {
      const planarXYWidget = new XfoPlanarMovementHandle(
        'planarXY',
        planarSize,
        new Vec3(planarSize * 0.5, planarSize * 0.5, 0.0),
        blue
      )
      const xfo = new Xfo()
      planarXYWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(planarXYWidget)
    }
    {
      const planarYZWidget = new XfoPlanarMovementHandle(
        'planarYZ',
        planarSize,
        new Vec3(planarSize * -0.5, planarSize * 0.5, 0.0),
        red
      )
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      planarYZWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(planarYZWidget)
    }
    {
      const planarXZWidget = new XfoPlanarMovementHandle(
        'planarXZ',
        planarSize,
        new Vec3(planarSize * 0.5, planarSize * 0.5, 0.0),
        green
      )
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
      planarXZWidget.getParameter('LocalXfo').setValue(xfo)
      translationHandles.addChild(planarXZWidget)
    }

    // ////////////////////////////////
    // Rotation
    const rotationHandles = new TreeItem('Rotate')
    rotationHandles.setVisible(false)
    this.addChild(rotationHandles)
    {
      const rotationWidget = new SphericalRotationHandle('rotation', size - thickness, new Color(1, 1, 1, 0))
      rotationHandles.addChild(rotationWidget)
    }
    {
      const rotationXWidget = new AxialRotationHandle('rotationX', size, thickness, red)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      rotationXWidget.getParameter('LocalXfo').setValue(xfo)
      rotationHandles.addChild(rotationXWidget)
    }
    {
      const rotationYWidget = new AxialRotationHandle('rotationY', size, thickness, green)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * 0.5)
      rotationYWidget.getParameter('LocalXfo').setValue(xfo)
      rotationHandles.addChild(rotationYWidget)
    }
    {
      const rotationZWidget = new AxialRotationHandle('rotationZ', size, thickness, blue)
      rotationHandles.addChild(rotationZWidget)
    }

    // ////////////////////////////////
    // Scale - Not supported
    const scaleHandles = new TreeItem('Scale')
    scaleHandles.setVisible(false)
    this.addChild(scaleHandles)

    const scaleHandleLength = size * 0.95
    {
      const scaleXWidget = new LinearScaleHandle('scaleX', scaleHandleLength, thickness, red)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(0, 1, 0), Math.PI * 0.5)
      scaleXWidget.getParameter('LocalXfo').setValue(xfo)
      scaleHandles.addChild(scaleXWidget)
    }
    {
      const scaleYWidget = new LinearScaleHandle('scaleY', scaleHandleLength, thickness, green)
      const xfo = new Xfo()
      xfo.ori.setFromAxisAndAngle(new Vec3(1, 0, 0), Math.PI * -0.5)
      scaleYWidget.getParameter('LocalXfo').setValue(xfo)
      scaleHandles.addChild(scaleYWidget)
    }
    {
      const scaleZWidget = new LinearScaleHandle('scaleZ', scaleHandleLength, thickness, blue)
      scaleHandles.addChild(scaleZWidget)
    }
  }

  /**
   * Calculate the global Xfo for the handles.
   *
   * @return {Xfo} - The Xfo value
   * @private
   */
  _cleanGlobalXfo() {
    const parentItem = this.getParentItem()
    if (parentItem !== undefined) {
      const parentXfo = parentItem.getParameter('GlobalXfo').getValue().clone()
      parentXfo.sc.set(1, 1, 1)
      return parentXfo.multiply(this.__localXfoParam.getValue())
    } else return this.__localXfoParam.getValue()
  }

  /**
   * Displays handles depending on the specified mode(Move, Rotate, Scale).
   * If nothing is specified, it hides all of them.
   *
   * @param {string} handleManipulationMode - The mode of the Xfo parameter
   */
  showHandles(handleManipulationMode) {
    this.traverse((item) => {
      if (item != this) {
        item.setVisible(false)
        return false
      }
    })

    const child = this.getChildByName(handleManipulationMode)
    if (child) child.setVisible(true)
  }

  /**
   * Sets global xfo target parameter.
   *
   * @param {Parameter} param - The video param.
   */
  setTargetParam(param) {
    this.param = param
    this.traverse((item) => {
      if (item instanceof Handle) item.setTargetParam(param, false)
    })
  }
}

export default XfoHandle
export { XfoHandle }
