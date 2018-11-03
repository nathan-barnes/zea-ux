// import * as Visualive from '@visualive/engine';

const up = new Visualive.Vec3(0, 0, 1);
export default class Avatar {

  constructor(appData, userData) {
    this.__appData = appData;
    this.__userData = {userData};

    if(!this.__userData.avatarColor)
      this.__userData.avatarColor = Visualive.Color.random(-0.25);
    this.__pointerColor = this.__userData.avatarColor.clone();
    this.__pointerColor.a = 0.2;
    this.__hilightPointerColor = new Visualive.Color(1.2, 0, 0);

    this.__treeItem = new Visualive.TreeItem(userData.id);

    this.__appData.renderer.getCollector().addTreeItem(this.__treeItem);

    this.__camera = new Visualive.Camera();
    this.__camera.addRef(this);
    this.__cameraBound = false;

    this.__material = new Visualive.Material('user' + userData.id + 'Material', 'SimpleSurfaceShader');
    this.__material.getParameter('BaseColor').setValue(this.__userData.avatarColor);
    this.__material.addRef(this);
  }

  setAudioStream(stream) {
    if(this.__audioItem) {
      return;
    }
    this.__audioItem = new AudioItem('audio', stream);
    const head = this.__treeItem.getChild(0);
    if (head) {
      head.addChild(this.__audioItem);
    }
  }

  getCamera() {
    return this.__camera;
  }

  bindCamera() {
    this.__cameraBound = true;

    const cameraOwner = this.__camera.getOwner();
    if(cameraOwner) {
      cameraOwner.traverse(subTreeItem => {
        if(subTreeItem != this.__camera)
          subTreeItem.setVisible(false)
      })
    }
  }

  unbindCamera() {
    this.__cameraBound = false;

    const cameraOwner = this.__camera.getOwner();
    if(cameraOwner) {
      cameraOwner.traverse(subTreeItem => {
        if(subTreeItem != this.__camera)
          subTreeItem.setVisible(true)
      })
    }
  }



  setCameraAndPointerRepresentation() {
    this.__treeItem.removeAllChildren();
    const sc = 0.02;
    const shape = new Visualive.Cuboid(16*sc, 9*sc, 0.25);// 16:9
    const pinch = new Visualive.Vec3(0.1, 0.1, 1);
    shape.getVertex(0).multiplyInPlace(pinch);
    shape.getVertex(1).multiplyInPlace(pinch);
    shape.getVertex(2).multiplyInPlace(pinch);
    shape.getVertex(3).multiplyInPlace(pinch);
    // const shape = new Visualive.Cone(0.2, 0.6, 4, true);
    shape.computeVertexNormals();
    const geomItem = new Visualive.GeomItem('camera', shape, this.__material);
    const geomXfo = new Visualive.Xfo();
    geomItem.setGeomOffsetXfo(geomXfo);


    const line = new Visualive.Lines();
    line.setNumVertices(2);
    line.setNumSegments(1);
    line.setSegment(0, 0, 1);
    line.getVertex(0).set(0.0, 0.0, 0.0);
    line.getVertex(1).set(0.0, 0.0, 1.0);
    line.setBoundingBoxDirty();
    this.pointerXfo = new Visualive.Xfo();
    this.pointerXfo.sc.set(1, 1, 0);

    this.__pointermat = new Visualive.Material('pointermat', 'LinesShader');
    this.__pointermat.getParameter('Color').setValue(this.__userData.avatarColor);

    this.__pointerItem = new Visualive.GeomItem('Pointer', line, this.__pointermat);
    this.__pointerItem.addRef(this)
    this.__pointerItem.setLocalXfo(this.pointerXfo);

    if (this.__audioItem) {
      geomItem.addChild(this.__audioItem);
    }

    this.__treeItem.addChild(geomItem);
    this.__treeItem.addChild(this.__pointerItem);

    this.__treeItem.addChild(this.__camera);
    if(this.__cameraBound) {
      geomItem.setVisible(false)
    }

    this.__currentViewMode = 'CameraAndPointer';
  }

  updateCameraAndPointerPose(data) {
    if(data.viewXfo){
      this.__treeItem.getChild(0).setLocalXfo(data.viewXfo);
      this.pointerXfo.sc.z = 0;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
    else if(data.movePointer){
      this.pointerXfo.tr = data.movePointer.start;
      this.pointerXfo.ori.setFromDirectionAndUpvector(data.movePointer.dir, up);
      this.pointerXfo.sc.z = data.movePointer.length;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
    else if(data.hilightPointer){
      this.__pointermat.getParameter('Color').setValue(this.__hilightPointerColor);
    }
    else if(data.unhilightPointer){
      this.__pointermat.getParameter('Color').setValue(this.__userData.avatarColor);
    }
    else if(data.pointerOff){
      this.pointerXfo.sc.z = 0;
      this.__treeItem.getChild(1).setLocalXfo(this.pointerXfo);
    }
  }

  setViveRepresentation() {
    this.__treeItem.removeAllChildren();
    const hmdHolder = new Visualive.TreeItem("hmdHolder");
    if (this.__audioItem) {
      hmdHolder.addChild(this.__audioItem);
    }
    this.__treeItem.addChild(hmdHolder);

    hmdHolder.addChild(this.__camera, false);

    if(this.__hmdGeomItem) {
      hmdHolder.addChild(this.__hmdGeomItem, false);
      if(this.__cameraBound) {
        this.__hmdGeomItem.setVisible(false)
      }
    }
    else {
      const resourceLoader = this.__appData.scene.getResourceLoader();
      if (!Visualive.SystemDesc.isMobileDevice && !this.__viveAsset && resourceLoader.resourceAvailable("VisualiveEngine/Vive.vla")) {
        this.__viveAsset = this.__appData.scene.loadCommonAssetResource("VisualiveEngine/Vive.vla");
        this.__viveAsset.geomsLoaded.connect(()=>{
          const materialLibrary = this.__viveAsset.getMaterialLibrary();
          const materialNames = materialLibrary.getMaterialNames();
          for(let name of materialNames) {
            const material = materialLibrary.getMaterial(name, false);
            if(material)
              material.setShaderName('SimpleSurfaceShader');
          }


          const sharedGeomItem = this.__viveAsset.getChildByName('HTC_Vive_HMD');
          const hmdGeomItem = sharedGeomItem.clone();
          const xfo = hmdGeomItem.getLocalXfo();
          xfo.tr.set(0, -0.03, -0.03);
          xfo.ori.setFromAxisAndAngle(new Visualive.Vec3(0, 1, 0), Math.PI);
          hmdGeomItem.setLocalXfo(xfo);

          // hmdGeomItem.setMaterial(this.__material);
          this.__hmdGeomItem = hmdGeomItem;
          this.__hmdGeomItem.addRef(this);

          if(this.__cameraBound) {
            this.__hmdGeomItem.setVisible(false)
          }
          hmdHolder.addChild(this.__hmdGeomItem, false);
        });
      }
    }

    this.__currentViewMode = 'Vive';
    this.__controllerTrees = [];
  }

  updateVivePose(data) {

    const setupController = (i)=>{
      if(this.__controllerTrees[i]) {
        this.__treeItem.addChild(this.__controllerTrees[i], false);
      }
      else {
        const treeItem = new Visualive.TreeItem("handleHolder" + i);
        const setupControllerGeom = (sharedControllerTree)=>{
          const controllerTree = sharedControllerTree.clone();

          const filter = ['TriggerMaterial', 'Touchpad Material', 'Metal']
          // controllerTree.traverse((subTreeItem)=>{
          //   if(subTreeItem instanceof Visualive.GeomItem){
          //     if(filter.indexOf(subTreeItem.getMaterial().getName()) == -1)
          //       subTreeItem.setMaterial(this.__material)
          //   }
          // })
          const xfo = new Visualive.Xfo(
            new Visualive.Vec3(0, -0.035, 0.01), 
            new Visualive.Quat({ 
              setFromAxisAndAngle: [
                new Visualive.Vec3(0, 1, 0), 
                Math.PI
              ] 
            }));
          controllerTree.setLocalXfo(xfo);
          treeItem.addChild(controllerTree, false);
        }

        this.__viveAsset.geomsLoaded.connect(() => {
          const sharedControllerTree = this.__viveAsset.getChildByName('HTC_Vive_Controller').clone();
          setupControllerGeom(sharedControllerTree);
        });

        treeItem.addRef(this)
        this.__controllerTrees[i] = treeItem;
        this.__treeItem.addChild(this.__controllerTrees[i], false);
      }
    }


    this.__treeItem.getChild(0).setGlobalXfo(data.viewXfo);
    if (data.controllers) {
      for (let i = 0; i < data.controllers.length; i++) {
        if (data.controllers[i] && !this.__controllerTrees[i]) {
          setupController(i)
        }
        this.__controllerTrees[i].setGlobalXfo(data.controllers[i].xfo);
      }
    }
  }

  updatePose(data) {
    switch (data.interfaceType) {
      case 'CameraAndPointer':
        if (this.__currentViewMode !== 'CameraAndPointer') {
          this.setCameraAndPointerRepresentation();
        }
        this.updateCameraAndPointerPose(data)
        break;
        // case 'TabletAndFinger':
        //     if (this.__currentViewMode !== 'CameraAndPointer') {

        //     }
        break;
      case 'Vive':
        if (this.__currentViewMode !== 'Vive') {
          this.setViveRepresentation();
        }
        this.updateVivePose(data);
        break;
      case 'Daydream':
        break;
      case 'Occulus':
        break;
    }

    //this.__treeItem.requestRedraw();
  };

  destroy() {
    this.__appData.renderer.getCollector().removeTreeItem(this.__treeItem);
  }
};
