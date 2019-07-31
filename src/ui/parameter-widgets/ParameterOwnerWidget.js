// import * as Visualive from '@visualive/engine';

import BaseWidget from './BaseWidget.js';
import StringWidget from './StringWidget.js';

import uxFactory from '../UxFactory.js';
import ParameterContainer from '../parameter-container.js';  

class NameParam {
  constructor(treeItem) {
    this._treeItem = treeItem;
    this.valueChanged = treeItem.nameChanged;
  }

  getName() {
    return "Name"
  }

  getValue() {
    return this._treeItem.getName();
  }

  setValue(name) {
    return this._treeItem.setName(name);
  }
}

export default class ParameterOwnerWidget extends BaseWidget {
  constructor(parameter, parentDomElem, appData) {
    super(parameter);

    const parameteOwner = parameter.getValue();

    const ul = document.createElement('ul');
    ul.className = 'list pa0'
    const linameWidget = document.createElement('li');
    const liparameterContainer = document.createElement('li');
    parentDomElem.appendChild(ul);
    ul.appendChild(linameWidget);
    ul.appendChild(liparameterContainer);
    if(parameteOwner instanceof Visualive.BaseItem)
      this.nameWidget = new StringWidget(new NameParam(parameteOwner), linameWidget, appData);
    this.parameterContainer = new ParameterContainer(parameteOwner, liparameterContainer, appData);

    parameter.valueChanged.connect(() => {
      this.parameterContainer.setParameterOwner(parameter.getValue());
    });
  }
}

uxFactory.registerWidget(
  ParameterOwnerWidget,
  p => p.getValue() instanceof Visualive.ParameterOwner
);
