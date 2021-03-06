import { Diagram } from "../model/Diagram";
import { Lifeline } from "../model/Lifeline";
import { Layer } from "../model/Layer";
import { MessageOccurenceSpecification, OperandOccurenceSpecification } from "../model/OccurenceSpecification";
import { StoredMessage, MessageKind, RefMessage } from "../model/Message";
import { InteractionOperand } from "../model/InteractionOperand";
import { CombinedFragment, InteractionOperator } from "../model/CombinedFragment";
export class Serializer {
    constructor() { }
    static get instance() {
        return Serializer._instance;
    }
    serialize(diagram) {
        return JSON.stringify(diagram, (key, value) => {
            if (key.startsWith('__')) {
                return undefined;
            }
            return value;
        });
    }
    deserialize(jsonDiagram) {
        let rawDiagram = JSON.parse(jsonDiagram);
        let diagram = new Diagram();
        diagram.id = rawDiagram._id;
        let queuedOccurences = [];
        diagram.layers = rawDiagram._layers.map((rawLayer) => {
            let layer = new Layer();
            layer.diagram = diagram;
            layer.lifelines = rawLayer._lifelines.map((rawLifeline) => {
                let lifeline = new Lifeline();
                lifeline.diagram = diagram;
                lifeline.layer = layer;
                lifeline.name = rawLifeline._name;
                return lifeline;
            });
            layer.messages = rawLayer._messages.map((rawMessage) => {
                let message = new StoredMessage();
                message.name = rawMessage._name;
                message.kind = rawMessage._kind;
                message.diagram = diagram;
                message.layer = layer;
                message.start = new MessageOccurenceSpecification();
                message.end = new MessageOccurenceSpecification();
                message.start.message = message;
                message.end.message = message;
                queuedOccurences.push({ occ: message.start, rawOcc: rawMessage._start }, { occ: message.end, rawOcc: rawMessage._end });
                return message;
            });
            return layer;
        });
        for (let queuedOcc of queuedOccurences) {
            let layer = diagram.layers[queuedOcc.rawOcc.layer];
            let lifeline = layer.lifelines[queuedOcc.rawOcc.lifeline];
            lifeline.occurenceSpecifications[queuedOcc.rawOcc.index] = queuedOcc.occ;
            queuedOcc.occ.diagram = diagram;
            queuedOcc.occ.layer = layer;
            queuedOcc.occ.lifeline = lifeline;
        }
        return diagram;
    }
    createTestDiagram() {
        // diagram
        var diag = new Diagram();
        diag.id = 0;
        // layer
        var l1 = new Layer();
        l1.diagram = diag;
        diag.layers.push(l1);
        // lifelines
        var ll1 = new Lifeline();
        var ll2 = new Lifeline();
        var ll3 = new Lifeline();
        ll1.name = "Lifeline 1";
        ll2.name = "Lifeline 2";
        ll3.name = "Lifeline 3";
        ll1.diagram = diag;
        ll2.diagram = diag;
        ll3.diagram = diag;
        ll1.layer = l1;
        ll2.layer = l1;
        ll3.layer = l1;
        l1.lifelines.push(ll1, ll2, ll3);
        // message 1
        let oc1_1 = new MessageOccurenceSpecification();
        let oc2_1 = new MessageOccurenceSpecification();
        oc1_1.diagram = diag;
        oc2_1.diagram = diag;
        oc1_1.layer = l1;
        oc2_1.layer = l1;
        oc1_1.lifeline = ll1;
        oc2_1.lifeline = ll2;
        ll1.occurenceSpecifications.push(oc1_1);
        ll2.occurenceSpecifications.push(oc2_1);
        var m1 = new StoredMessage();
        m1.name = 'Msg1';
        m1.kind = MessageKind.SYNC_CALL;
        m1.diagram = diag;
        m1.layer = l1;
        m1.start = oc1_1;
        m1.end = oc2_1;
        oc1_1.message = m1;
        oc2_1.message = m1;
        l1.messages.push(m1);
        // message 2
        let oc1_2 = new MessageOccurenceSpecification();
        let oc2_2 = new MessageOccurenceSpecification();
        oc1_2.diagram = diag;
        oc2_2.diagram = diag;
        oc1_2.layer = l1;
        oc2_2.layer = l1;
        oc1_2.lifeline = ll2;
        oc2_2.lifeline = ll3;
        ll2.occurenceSpecifications.push(oc1_2);
        ll3.occurenceSpecifications.push(oc2_2);
        var m2 = new StoredMessage();
        m2.name = 'Msg2';
        m2.kind = MessageKind.SYNC_CALL;
        m2.diagram = diag;
        m2.layer = l1;
        m2.start = oc1_2;
        m2.end = oc2_2;
        oc1_2.message = m2;
        oc2_2.message = m2;
        l1.messages.push(m2);
        // message 3
        let oc1_3 = new MessageOccurenceSpecification();
        let oc2_3 = new MessageOccurenceSpecification();
        oc1_3.diagram = diag;
        oc2_3.diagram = diag;
        oc1_3.layer = l1;
        oc2_3.layer = l1;
        oc1_3.lifeline = ll2;
        oc2_3.lifeline = ll3;
        ll2.occurenceSpecifications.push(oc1_3);
        ll3.occurenceSpecifications.push(oc2_3);
        var m3 = new StoredMessage();
        m3.name = 'Msg3';
        m3.kind = MessageKind.RETURN;
        m3.diagram = diag;
        m3.layer = l1;
        m3.start = oc2_3;
        m3.end = oc1_3;
        oc1_3.message = m3;
        oc2_3.message = m3;
        l1.messages.push(m3);
        // message 4
        let oc1_4 = new MessageOccurenceSpecification();
        let oc2_4 = new MessageOccurenceSpecification();
        oc1_4.diagram = diag;
        oc2_4.diagram = diag;
        oc1_4.layer = l1;
        oc2_4.layer = l1;
        oc1_4.lifeline = ll1;
        oc2_4.lifeline = ll2;
        ll1.occurenceSpecifications.push(oc1_4);
        ll2.occurenceSpecifications.push(oc2_4);
        var m4 = new StoredMessage();
        m4.name = 'Msg4';
        m4.kind = MessageKind.RETURN;
        m4.diagram = diag;
        m4.layer = l1;
        m4.start = oc2_4;
        m4.end = oc1_4;
        oc1_4.message = m4;
        oc2_4.message = m4;
        l1.messages.push(m4);
        // fragment
        let oc1s_6 = new OperandOccurenceSpecification();
        let oc1e_6 = new OperandOccurenceSpecification();
        let oc2s_6 = new OperandOccurenceSpecification();
        let oc2e_6 = new OperandOccurenceSpecification();
        // let oc3s_6 = new OperandOccurenceSpecification();
        // let oc3e_6 = new OperandOccurenceSpecification();
        oc1s_6.diagram = diag;
        oc1e_6.diagram = diag;
        oc2s_6.diagram = diag;
        oc2e_6.diagram = diag;
        // oc3s_6.diagram = diag;
        // oc3e_6.diagram = diag;
        oc1s_6.layer = l1;
        oc1e_6.layer = l1;
        oc2s_6.layer = l1;
        oc2e_6.layer = l1;
        // oc3s_6.layer = l1;
        // oc3e_6.layer = l1;
        oc1s_6.lifeline = ll1;
        oc1e_6.lifeline = ll1;
        oc2s_6.lifeline = ll2;
        oc2e_6.lifeline = ll2;
        // oc3s_6.lifeline = ll2;
        // oc3e_6.lifeline = ll2;
        ll1.occurenceSpecifications.push(oc1s_6);
        ll1.occurenceSpecifications.push(oc1e_6);
        ll2.occurenceSpecifications.push(oc2s_6);
        ll2.occurenceSpecifications.push(oc2e_6);
        // ll3.occurenceSpecifications.push(oc3s_6);
        // ll3.occurenceSpecifications.push(oc3e_6);
        var comb1 = new CombinedFragment();
        var inter1 = new InteractionOperand();
        comb1.diagram = diag;
        comb1.layer = l1;
        comb1.parent = null;
        comb1.children = [inter1];
        comb1.interactionOperator = InteractionOperator.OPT;
        inter1.parent = comb1;
        inter1.children = [];
        inter1.startingOccurences = [oc1s_6, oc2s_6];
        inter1.endingOccurences = [oc1e_6, oc2e_6];
        // inter1.startingOccurences = [oc1s_6, oc2s_6, oc3s_6];
        // inter1.endingOccurences = [oc1e_6, oc2e_6, oc3e_6];
        inter1.diagram = diag;
        inter1.layer = l1;
        inter1.interactionConstraint = "x < 2";
        inter1.messages = [new RefMessage()];
        inter1.messages[0].message = m4;
        l1.fragments.push(comb1);
        // message 5
        let oc1_5 = new MessageOccurenceSpecification();
        let oc2_5 = new MessageOccurenceSpecification();
        oc1_5.diagram = diag;
        oc2_5.diagram = diag;
        oc1_5.layer = l1;
        oc2_5.layer = l1;
        oc1_5.lifeline = ll1;
        oc2_5.lifeline = ll2;
        ll1.occurenceSpecifications.push(oc1_5);
        ll2.occurenceSpecifications.push(oc2_5);
        var m5 = new StoredMessage();
        m5.name = 'Msg5';
        m5.kind = MessageKind.SYNC_CALL;
        m5.diagram = diag;
        m5.layer = l1;
        m5.start = oc1_5;
        m5.end = oc2_5;
        oc1_5.message = m5;
        oc2_5.message = m5;
        l1.messages.push(m5);
        return diag;
    }
}
Serializer._instance = new Serializer();
//# sourceMappingURL=Serializer.js.map