import { StateSequence } from "./StateMachineBuilder";
import { RaycastControl } from "./RaycastControl";
import { LayerView } from "../view/LayerView";
import { Lifeline } from "../model/Lifeline";
import { LayoutControl } from "./LayoutControl";
import * as Globals from '../globals';
import { LifelineView } from "../view/LifelineView";
import { MessageView } from "../view/MessageView";
import { StoredMessage, MessageKind } from "../model/Message";
import { MessageOccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
import { CommunicationController } from "./CommunicationController";
import { Serializer } from "./Serializer";
import { Layer } from "../model/Layer";
import { Vector3 } from "three";
<<<<<<< HEAD
=======
import { createPopup, savePopup } from "../view/Popup";
>>>>>>> dev
// StateSequence
// .start('CREATE_LIFELINE')
// .button('sideLife')
// .click((e: Event) => {
//     // DETECT RAYCAST ON LIFELINE HERE``
//     return false;
// },(e: Event) => {
//     // DIALOG POPUP
// })
// .dialog((dto: any) => {
//     // CREATE LIFELINE HERE
// })
// .finish();
export function initializeStateTransitions() {
    // StateSequence
    // .start('TEST_SEQUENCE')
    // .button('sideLife')
    // .button('sideMessage')
    // .click((e: MouseEvent, hits: CustomMesh[]) => {
    //     return true;
    // }, (e: MouseEvent, hits: CustomMesh[]) => {
    //     console.log('Hits by raycast:')
    //     console.log(hits);
    // })
    // .finish(() => {
    //     console.log('layer lopata');
    // });
    StateSequence
        .start('CREATE_FRAGMENT')
        .button('sideFragment')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
        // TODO refactor this
        // for (let obj of h) {
        //     if (obj.metadata.parent instanceof LayerView) {
        //         let lifelineNew = new Lifeline('Standard name','',[], obj.metadata.parent.businessElement);
        //         obj.metadata.parent.businessElement.AddLifeline(lifelineNew);
        //         LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
        // for (let child of GLContext.instance.scene.children) {
        //     GLContext.instance.scene.remove(child);
        // }
        // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
        // }
        // }
        console.log("create farag");
    })
        .finish(() => { });
    StateSequence
        .start('CREATE_LIFELINE')
        .button('sideLife')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    }, (e, hits) => {
        // TODO refactor this
        for (let obj of hits) {
            if (obj.metadata.parent instanceof LayerView) {
                let lifelineNew = new Lifeline();
                lifelineNew.name = 'Standard name';
                lifelineNew.diagram = Globals.CURRENTLY_OPENED_DIAGRAM;
                lifelineNew.layer = obj.metadata.parent.businessElement;
                let castResult = RaycastControl.simpleDefaultIntersect(e);
                for (let h of castResult) {
                    if (h.object.parent instanceof LayerView) {
                        let left = lifelineNew.layer.lifelines.filter(e => e.graphicElement.position.x < h.point.x).length;
                        lifelineNew.layer.lifelines.splice(left, 0, lifelineNew);
                        break;
                    }
                }
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                break;
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
        .finish(() => { });
    StateSequence
        .start('DELETE_LIFELINE')
        .button('sideDeleteLife')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
        // TODO refactor this
        for (let obj of h) {
            if (obj.metadata.parent instanceof LifelineView) {
                let lifeline = obj.metadata.parent.businessElement;
                lifeline.layer.lifelines.splice(lifeline.layer.lifelines.indexOf(lifeline), 1);
                lifeline.graphicElement.parent.remove(lifeline.graphicElement);
                let toRemove = [];
                let toRemoveMessages = [];
                for (let occurence of lifeline.occurenceSpecifications) {
                    if (occurence instanceof MessageOccurenceSpecification) {
                        toRemove.push(occurence.message.start, occurence.message.end);
                        toRemoveMessages.push(occurence.message);
                    }
                    else if (occurence instanceof OperandOccurenceSpecification) {
                        // TODO
                    }
                }
                for (let occ of toRemove) {
                    occ.lifeline.occurenceSpecifications.splice(occ.lifeline.occurenceSpecifications.indexOf(occ), 1);
                }
                for (let msg of toRemoveMessages) {
                    msg.layer.messages.splice(msg.layer.messages.indexOf(msg), 1);
                    msg.graphicElement.parent.remove(msg.graphicElement);
                }
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
            }
        }
    })
        .finish(() => { });
    let startLifeline = null;
    let endLifeline = null;
    let newMsg = new StoredMessage();
    newMsg.name = '[Animation]';
    let newMessageView = new MessageView(newMsg);
    let createMessagePreDrag = StateSequence
        .start('CREATE_MESSAGE')
        .button('sideMessage');
    let holdLifelineView = null;
    createMessagePreDrag
        .click((e, h) => {
        for (let obj of h) {
            if (obj.parent instanceof LifelineView) {
                holdLifelineView = obj.parent;
                return true;
            }
        }
        return false;
    }, (e, h) => {
        startLifeline = holdLifelineView.businessElement;
        holdLifelineView.parent.add(newMessageView);
        newMessageView.source.copy(holdLifelineView.position);
    })
        .drag((ev, hits) => {
        for (let obj of hits) {
            if (obj.parent instanceof LifelineView) {
                endLifeline = obj.parent.businessElement;
                return startLifeline != endLifeline;
            }
        }
        return false;
    }, (ev, hits) => {
        //onsuccess                
        let startOcc = new MessageOccurenceSpecification();
        let endOcc = new MessageOccurenceSpecification();
        startOcc.diagram = startLifeline.diagram;
        endOcc.diagram = endLifeline.diagram;
        startOcc.layer = startLifeline.layer;
        endOcc.layer = endLifeline.layer;
        let msg = new StoredMessage();
        msg.diagram = startLifeline.diagram;
        msg.layer = startLifeline.layer;
        msg.name = 'new msg';
        msg.kind = MessageKind.SYNC_CALL;
        msg.start = startOcc;
        msg.end = endOcc;
        startOcc.message = msg;
        endOcc.message = msg;
        startOcc.lifeline = startLifeline;
        endOcc.lifeline = endLifeline;
        startLifeline.occurenceSpecifications.push(startOcc);
        endLifeline.occurenceSpecifications.push(endOcc);
        startLifeline.layer.messages.push(msg);
        // hold my beer
        msg.graphicElement = newMessageView;
        msg.layer.messages.sort((a, b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        msg.start.lifeline.occurenceSpecifications.sort((a, b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        msg.end.lifeline.occurenceSpecifications.sort((a, b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        msg.graphicElement = null;
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    }, (ev, hits) => {
        //onfail
    }, (ev, hits) => {
        //cleanup
        startLifeline = null;
        endLifeline = null;
        holdLifelineView = null;
        newMessageView.position.setY(10000); //advanced programing technique
        newMessageView.parent.remove(newMessageView);
    }, (ev, hits) => {
        //onmouseevent
        let castResult = RaycastControl.simpleDefaultIntersect(ev);
        for (let h of castResult) {
            if (h.object.parent instanceof LayerView) {
                newMessageView.redrawByDestination(new Vector3(h.point.x - newMessageView.parent.position.x, h.point.y - newMessageView.parent.position.y, 0));
                break;
            }
        }
    }, createMessagePreDrag)
        .finish(() => { });
    StateSequence
        .start('DELETE_MESSAGE')
        .button('sideDeleteMessage')
        .click((e, h) => {
        for (let obj of h) {
            if (obj.metadata.parent instanceof MessageView) {
                return true;
            }
        }
        return false;
    }, (e, h) => {
        //console.log(h)
        for (let obj of h) {
            if (obj.metadata.parent instanceof MessageView) {
                let msg = obj.metadata.parent.businessElement;
                for (let occ of [msg.start, msg.end]) {
                    occ.lifeline.occurenceSpecifications.splice(occ.lifeline.occurenceSpecifications.indexOf(occ), 1);
                }
                msg.layer.messages.splice(msg.layer.messages.indexOf(msg), 1);
                msg.graphicElement.parent.remove(msg.graphicElement);
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                // for (let child of GLContext.instance.scene.children) {
                //     GLContext.instance.scene.remove(child);
                // }
                // GLContext.instance.scene.add(Globals.CURRENTLY_OPENED_DIAGRAM.diagramView);
            }
        }
    })
        .finish(() => { });
    StateSequence
        .start("SAVE_DIAGRAM")
        .button('saveDiagram')
        .finish(() => {
        CommunicationController.instance.saveDiagram(Serializer.instance.serialize(Globals.CURRENTLY_OPENED_DIAGRAM), () => { });
        Globals.setDiagramSaved(true);
<<<<<<< HEAD
=======
    });
    StateSequence
        .start('CREATE_LAYER')
        .button('sideLayer')
        .finish(() => {
        let layer = new Layer();
        layer.diagram = Globals.CURRENTLY_OPENED_DIAGRAM;
        Globals.CURRENTLY_OPENED_DIAGRAM.layers.push(layer);
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    });
    StateSequence
        .start('DELETE_LAYER')
        .button('sideDeleteLayer')
        .click((event, hits) => {
        for (let hit of hits) {
            if (hit.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    }, (event, hits) => {
        console.log(hits);
        for (let hit of hits) {
            console.log(hit.metadata.parent);
            if (hit.metadata.parent instanceof LayerView) {
                let lay = hit.metadata.parent.businessElement;
                Globals.CURRENTLY_OPENED_DIAGRAM.layers.splice(Globals.CURRENTLY_OPENED_DIAGRAM.layers.indexOf(lay), 1);
                Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement.remove(lay.graphicElement);
                console.log(Globals.CURRENTLY_OPENED_DIAGRAM);
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                break;
            }
        }
    })
        .finish(() => { });
    let movedLifeline = null;
    let moveLifelineStart = StateSequence
        .start('MOVE_LIFELINE');
    let lastOffsetX = 0;
    moveLifelineStart
        .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof LifelineView;
    }, (event, hits) => {
        movedLifeline = hits[0].metadata.parent.businessElement;
        lastOffsetX = event.offsetX;
    })
        .drag((ev, hits) => true, (ev, hits) => {
        movedLifeline.layer.lifelines.sort((a, b) => {
            return a.graphicElement.position.x - b.graphicElement.position.x;
        });
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    }, (ev, hits) => {
        // empty
    }, (ev, hits) => {
        movedLifeline = null;
        lastOffsetX = 0;
    }, (ev, hits) => {
        movedLifeline.graphicElement.position.x = movedLifeline.graphicElement.position.x + (ev.offsetX - lastOffsetX);
        movedLifeline.graphicElement.updateMessages();
        lastOffsetX = ev.offsetX;
    }, moveLifelineStart)
        .finish(() => { });
    let movedMessage = null;
    let moveMessageStart = StateSequence
        .start('MOVE_MESSAGE');
    let lastOffsetY = 0;
    moveMessageStart
        .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof MessageView;
    }, (event, hits) => {
        movedMessage = hits[0].metadata.parent.businessElement;
        lastOffsetY = event.offsetY;
    })
        .drag((ev, hits) => true, (ev, hits) => {
        movedMessage.layer.messages.sort((a, b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        movedMessage.start.lifeline.occurenceSpecifications.sort((a, b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        movedMessage.end.lifeline.occurenceSpecifications.sort((a, b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    }, (ev, hits) => {
        // empty
    }, (ev, hits) => {
        movedMessage = null;
        lastOffsetY = 0;
    }, (ev, hits) => {
        //movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - (ev.offsetY - lastOffsetY);
        movedMessage.graphicElement.source.y = movedMessage.graphicElement.source.y - (ev.offsetY - lastOffsetY);
        movedMessage.graphicElement.destination.y = movedMessage.graphicElement.destination.y - (ev.offsetY - lastOffsetY);
        lastOffsetY = ev.offsetY;
    }, moveLifelineStart)
        .finish(() => { });
    StateSequence.start('DIALOG_TEST')
        .button('createPopupButton')
        .finish(() => {
        createPopup({ "name": "default", "type": ['1', '2'] });
    });
    StateSequence.start('DIALOG_GET_TEST')
        .button('submitButton')
        .finish(() => {
        savePopup();
>>>>>>> dev
    });
    StateSequence
        .start('CREATE_LAYER')
        .button('sideLayer')
        .finish(() => {
        let layer = new Layer();
        layer.diagram = Globals.CURRENTLY_OPENED_DIAGRAM;
        Globals.CURRENTLY_OPENED_DIAGRAM.layers.push(layer);
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    });
    StateSequence
        .start('DELETE_LAYER')
        .button('sideDeleteLayer')
        .click((event, hits) => {
        for (let hit of hits) {
            if (hit.metadata.parent instanceof LayerView) {
                return true;
            }
        }
        return false;
    }, (event, hits) => {
        console.log(hits);
        for (let hit of hits) {
            console.log(hit.metadata.parent);
            if (hit.metadata.parent instanceof LayerView) {
                let lay = hit.metadata.parent.businessElement;
                Globals.CURRENTLY_OPENED_DIAGRAM.layers.splice(Globals.CURRENTLY_OPENED_DIAGRAM.layers.indexOf(lay), 1);
                Globals.CURRENTLY_OPENED_DIAGRAM.graphicElement.remove(lay.graphicElement);
                console.log(Globals.CURRENTLY_OPENED_DIAGRAM);
                LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
                break;
            }
        }
    })
        .finish(() => { });
    let movedLifeline = null;
    let moveLifelineStart = StateSequence
        .start('MOVE_LIFELINE');
    let lastOffsetX = 0;
    moveLifelineStart
        .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof LifelineView;
    }, (event, hits) => {
        movedLifeline = hits[0].metadata.parent.businessElement;
        lastOffsetX = event.offsetX;
    })
        .drag((ev, hits) => true, (ev, hits) => {
        movedLifeline.layer.lifelines.sort((a, b) => {
            return a.graphicElement.position.x - b.graphicElement.position.x;
        });
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    }, (ev, hits) => {
        // empty
    }, (ev, hits) => {
        movedLifeline = null;
        lastOffsetX = 0;
    }, (ev, hits) => {
        movedLifeline.graphicElement.position.x = movedLifeline.graphicElement.position.x + (ev.offsetX - lastOffsetX);
        lastOffsetX = ev.offsetX;
    }, moveLifelineStart)
        .finish(() => { });
    let movedMessage = null;
    let moveMessageStart = StateSequence
        .start('MOVE_MESSAGE');
    let lastOffsetY = 0;
    moveMessageStart
        .click((event, hits) => {
        return hits.length != 0 && hits[0].metadata.parent instanceof MessageView;
    }, (event, hits) => {
        movedMessage = hits[0].metadata.parent.businessElement;
        lastOffsetY = event.offsetY;
    })
        .drag((ev, hits) => true, (ev, hits) => {
        movedMessage.layer.messages.sort((a, b) => {
            return -(a.graphicElement.position.y - b.graphicElement.position.y);
        });
        movedMessage.start.lifeline.occurenceSpecifications.sort((a, b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        movedMessage.end.lifeline.occurenceSpecifications.sort((a, b) => {
            return -(a.message.graphicElement.position.y - b.message.graphicElement.position.y);
        });
        LayoutControl.magic(Globals.CURRENTLY_OPENED_DIAGRAM);
    }, (ev, hits) => {
        // empty
    }, (ev, hits) => {
        movedMessage = null;
        lastOffsetY = 0;
    }, (ev, hits) => {
        //movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - ((ev as MouseEvent).offsetY - lastOffsetY);
        movedMessage.graphicElement.position.y = movedMessage.graphicElement.position.y - (ev.offsetY - lastOffsetY);
        movedMessage.graphicElement.source.y = movedMessage.graphicElement.source.y - (ev.offsetY - lastOffsetY);
        movedMessage.graphicElement.destination.y = movedMessage.graphicElement.destination.y - (ev.offsetY - lastOffsetY);
        lastOffsetY = ev.offsetY;
    }, moveLifelineStart)
        .finish(() => { });
}
//# sourceMappingURL=StateMachineInitializer.js.map