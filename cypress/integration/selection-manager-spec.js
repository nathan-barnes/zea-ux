import { createTouchEvents } from './utils'

describe('Selection Manager', () => {
  beforeEach(() => {
    cy.visit('testing-e2e/selection-manager.html', {
      onBeforeLoad(win) {
        cy.spy(win, 'postMessage').as('postMessage')
      },
    })
  })

  it('Multi Select Geometry - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas').click(400, 250)
    cy.wait(150)
    cy.get('canvas').click(630, 250, { ctrlKey: true })
    cy.get('canvas').percySnapshot('MultiSelectGeometryMouseSelect')
    cy.wait(150)
    cy.get('canvas').click(400, 250)
    cy.get('canvas').percySnapshot('MultiSelectGeometryMouseUnSelect')
  })

  it('Select Geometry - Translate - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas').click(400, 240).percySnapshot('SelectGeometryTranslateMouse')
  })

  it('Select Geometry - Translate Move - Mouse', () => {
    cy.get('#selection-cbx').click()

    cy.get('canvas')
      .click(400, 250)
      .trigger('mousedown', 350, 270)
      .trigger('mousemove', 200, 270)
      .trigger('mouseup', 200, 270)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryTranslateMoveMouse')
  })

  it('Select Geometry - Rotate - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#rotate').click()

    cy.get('canvas').click(400, 250)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryRotateMouse')
  })

  it('Select Geometry - Rotate Move - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#rotate').click()

    cy.get('canvas')
      .click(400, 250)
      .trigger('mousedown', 410, 205)
      .trigger('mousemove', 380, 205)
      .trigger('mouseup', 380, 205)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryRotateMoveMouse')
  })

  it('Select Geometry - Scale - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#scale').click()

    cy.get('canvas').click(400, 250)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryScaleMouse')
  })

  it('Select Geometry - Scale Move - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#scale').click()

    cy.get('canvas')
      .click(400, 250)
      .trigger('mousedown', 370, 270)
      .trigger('mousemove', 300, 270)
      .trigger('mouseup', 300, 270)
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryRotateMoveMouse')
  })

  it('Select Geometry - Translate - Touch', () => {
    cy.get('#selection-cbx').click()

    const eTouch = createTouchEvents([400, 250])
    cy.get('canvas')
      .trigger('touchstart', eTouch)
      .trigger('touchend', { ...eTouch, touches: [] })
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryTranslateTouch')
  })

  it('Select Geometry - Rotate - Touch', () => {
    cy.get('#selection-cbx').click()
    cy.get('#rotate').click()

    const eTouch = createTouchEvents([400, 250])
    cy.get('canvas')
      .trigger('touchstart', eTouch)
      .trigger('touchend', { ...eTouch, touches: [] })
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryRotateTouch')
  })

  it('Select Geometry - Scale - Mouse', () => {
    cy.get('#selection-cbx').click()
    cy.get('#scale').click()

    const eTouch = createTouchEvents([400, 250])
    cy.get('canvas')
      .trigger('touchstart', eTouch)
      .trigger('touchend', { ...eTouch, touches: [] })
    cy.wait(100)
    cy.get('canvas').percySnapshot('SelectGeometryScaleMouse')
  })
})
