/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Implements a class that marks complex items for collapsing
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MmlNode, AbstractMmlTokenNode, TextNode, AttributeList} from '../../core/MmlTree/MmlNode.js';
import {ComplexityVisitor} from './visitor.js';

/*==========================================================================*/

/**
 * Function for checking if a node should be collapsable
 */
export type CollapseFunction = (node: MmlNode, complexity: number) => number;

/**
 * Map of types to collase functions
 */
export type CollapseFunctionMap = Map<string, CollapseFunction>;

/**
 * A list of values indexed by semantic-type, possibly sub-indexed by semantic-role
 *
 * @template T   The type of the indexed item
 */
export type TypeRole<T> = {[type: string]: T | {[role: string]: T}};

/**
 * The class for determining of a subtree can be collapsed
 */
export class Collapse {

    /**
     * A constant to use to indicate no collapsing
     */
    public static NOCOLLAPSE: number = 10000000; // really big complexity

    /**
     * The complexity object containing this one
     */
    public complexity: ComplexityVisitor;

    /**
     * The cutt-off complexity values for when a structure
     *   of the given type should collapse
     */
    public cutoff: TypeRole<number> = {
        identifier: 3,
        number: 3,
        text: 10,
        infixop: 15,
        relseq: 15,
        multirel: 15,
        fenced: 18,
        bigop: 20,
        integral: 20,
        fraction: 12,
        sqrt: 9,
        root: 12,
        vector: 15,
        matrix: 15,
        cases: 15,
        superscript: 9,
        subscript: 9,
        subsup: 9,
        punctuated: {
            endpunct: Collapse.NOCOLLAPSE,
            startpunct: Collapse.NOCOLLAPSE,
            value: 12
        }
    };

    /**
     *  These are the characters to use for the various collapsed elements
     *  (if an object, then semantic-role is used to get the character
     *  from the object)
     */
    public marker: TypeRole<string> = {
        identifier: 'x',
        number: '#',
        text: '...',
        appl: {
            'limit function': 'lim',
            value: 'f()'
        },
        fraction: '/',
        sqrt: '\u221A',
        root: '\u221A',
        superscript: '\u25FD\u02D9',
        subscript: '\u25FD.',
        subsup:'\u25FD:',
        vector: {
            binomial: '(:)',
            determinant: '|:|',
            value: '\u27E8:\u27E9'
        },
        matrix: {
            squarematrix: '[::]',
            rowvector: '\u27E8\u22EF\u27E9',
            columnvector: '\u27E8\u22EE\u27E9',
            determinant: '|::|',
            value: '(::)'
        },
        cases: '{:',
        infixop: {
            addition: '+',
            subtraction: '\u2212',
            multiplication: '\u22C5',
            implicit: '\u22C5',
            value: '+'
        },
        punctuated: {
            text: '...',
            value: ','
        }
    };

    /**
     * The type-to-function mapping for semantic types
     */
    public collapse: CollapseFunctionMap = new Map([

        //
        //  For fenced elements, if the contents are collapsed,
        //    collapse the fence instead.
        //
        ['fenced', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 1);
            if (complexity > this.cutoff.fenced && node.attributes.get('data-semantic-role') === 'leftright') {
                complexity = this.recordCollapse(
                    node, complexity,
                    this.getText(node.childNodes[0] as MmlNode) +
                        this.getText(node.childNodes[node.childNodes.length - 1] as MmlNode)
                );
            }
            return complexity;
        }],

        //
        //  Collapse function applications if the argument is collapsed
        //    (FIXME: Handle role="limit function" a bit better?)
        //
        ['appl', (node, complexity) => {
            if (this.canUncollapse(node, 2, 2)) {
                complexity = this.complexity.visitNode(node, false);
                const marker = this.marker.appl as {[name: string]: string};
                const text = marker[node.attributes.get('data-semantic-role') as string] || marker.value;
                complexity = this.recordCollapse(node, complexity, text);
            }
            return complexity;
        }],

        //
        //  For sqrt elements, if the contents are collapsed,
        //    collapse the sqrt instead.
        //
        ['sqrt', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0);
            if (complexity > this.cutoff.sqrt) {
                complexity = this.recordCollapse(node, complexity, this.marker.sqrt as string);
            }
            return complexity;
        }],
        ['root', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 2);
            if (complexity > this.cutoff.sqrt) {
                complexity = this.recordCollapse(node, complexity, this.marker.sqrt as string);
            }
            return complexity;
        }],

        //
        //  For enclose, include enclosure in collapse
        //
        ['enclose', (node, complexity) => {
            if (this.splitAttribute(node, 'children').length === 1) {
                const child = this.canUncollapse(node, 1);
                if (child) {
                    const marker = child.getProperty('collapse-marker') as string;
                    this.unrecordCollapse(child);
                    complexity = this.recordCollapse(node, this.complexity.visitNode(node, false), marker);
                }
            }
            return complexity;
        }],

        //
        //  For bigops, get the character to use from the largeop at its core.
        //
        ['bigop', (node, complexity) => {
            if (complexity > this.cutoff.bigop || !node.isKind('mo')) {
                const id = this.splitAttribute(node, 'content').pop();
                const op = this.findChildText(node, id);
                complexity = this.recordCollapse(node, complexity, op);
            }
            return complexity;
        }],
        ['integral', (node, complexity) => {
            if (complexity > this.cutoff.integral || !node.isKind('mo')) {
                const id = this.splitAttribute(node, 'content').pop();
                const op = this.findChildText(node, id);
                complexity = this.recordCollapse(node, complexity, op);
            }
            return complexity;
        }],

        //
        //  For relseq and multirel, use proper symbol
        //
        ['relseq', (node, complexity) => {
            if (complexity > this.cutoff.relseq) {
                const id = this.splitAttribute(node, 'content')[0];
                const text = this.findChildText(node, id);
                complexity = this.recordCollapse(node, complexity, text);
            }
            return complexity;
        }],
        ['multirel', (node, complexity) => {
            if (complexity > this.cutoff.relseq) {
                const id = this.splitAttribute(node, 'content')[0];
                const text = this.findChildText(node, id) + '\u22EF';
                complexity = this.recordCollapse(node, complexity, text);
            }
            return complexity;
        }],

        //
        //  Include super- and subscripts into a collapsed base
        //
        ['superscript', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 2);
            if (complexity > this.cutoff.superscript) {
                complexity = this.recordCollapse(node, complexity, this.marker.superscript as string);
            }
            return complexity;
        }],
        ['subscript', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 2);
            if (complexity > this.cutoff.subscript) {
                complexity = this.recordCollapse(node, complexity, this.marker.subscript as string);
            }
            return complexity;
        }],
        ['subsup', (node, complexity) => {
            complexity = this.uncollapseChild(complexity, node, 0, 3);
            if (complexity > this.cutoff.subsup) {
                complexity = this.recordCollapse(node, complexity, this.marker.subsup as string);
            }
            return complexity;
        }]

    ] as [string, CollapseFunction][]);

    /**
     * @param {ComplexityVisitor} visitor  The visitor for computing complexities
     */
    constructor(visitor: ComplexityVisitor) {
        this.complexity = visitor;
    }

    public check(node: MmlNode, complexity: number) {
        const type = node.attributes.get('data-semantic-type') as string;
        if (this.collapse.has(type)) {
            return this.collapse.get(type).call(this, node, complexity);
        }
        if (this.cutoff.hasOwnProperty(type)) {
            return this.defaultCheck(node, complexity, type);
        }
        return complexity;
    }

    protected defaultCheck(node: MmlNode, complexity: number, type: string) {
        const role = node.attributes.get('data-semantic-role') as string;
        const check = this.cutoff[type];
        const cutoff = (typeof check === 'number' ? check : check[role] || check.value);
        if (complexity > cutoff) {
            const marker = this.marker[type] || '??';
            const text = (typeof marker === 'string' ? marker : marker[role] || marker.value);
            complexity = this.recordCollapse(node, complexity, text)
        }
        return complexity;
    }

    protected recordCollapse(node: MmlNode, complexity: number, text: string) {
        text = '\u25C2' + text + '\u25B8';
        node.setProperty('collapse-marker', text);
        node.setProperty('collapse-complexity', complexity);
        return text.length * this.complexity.complexity.text;
    }

    protected unrecordCollapse(node: MmlNode) {
        const complexity = node.getProperty('collapse-complexity');
        if (complexity != null) {
            node.attributes.set('data-semantic-complexity', complexity);
            node.removeProperty('collapse-complexity');
            node.removeProperty('collapse-marker');
        }
    }

    protected canUncollapse(node: MmlNode, n: number, m: number = 1) {
        if (this.splitAttribute(node, 'children').length === m) {
            const mml = (node.childNodes.length === 1 &&
                         (node.childNodes[0] as MmlNode).isInferred ? node.childNodes[0] as MmlNode : node);
            if (mml && mml.childNodes[n]) {
                const child = mml.childNodes[n] as MmlNode;
                if (child.getProperty('collapse-marker')) {
                    return child;
                }
            }
        }
        return null;
    }

    protected uncollapseChild(complexity: number, node: MmlNode, n: number, m:number = 1) {
        const child = this.canUncollapse(node, n, m);
        if (child) {
            this.unrecordCollapse(child);
            if (child.parent !== node) {
                child.parent.attributes.set('data-semantic-complexity', undefined);
            }
            complexity = this.complexity.visitNode(node, false) as number;
        }
        return complexity;
    }

    protected splitAttribute(node: MmlNode, id: string) {
        return (node.attributes.get('data-semantic-' + id) as string || '').split(/,/);
    }

    protected getText(node: MmlNode): string {
        if (node.isToken) return (node as AbstractMmlTokenNode).getText();
        return node.childNodes.map((n: MmlNode) => this.getText(n)).join('');
    }

    protected findChildText(node: MmlNode, id: string) {
        const child = this.findChild(node, id);
        return this.getText(child.coreMO() || child);
    }

    protected findChild(node: MmlNode, id: string): MmlNode | null {
        if (!node || node.attributes.get('data-semantic-id') === id) return node;
        if (!node.isToken) {
            for (const mml of node.childNodes) {
                const child = this.findChild(mml as MmlNode, id);
                if (child) return child;
            }
        }
        return null;
    }

    public makeCollapse(node: MmlNode) {
        const nodes: MmlNode[] = [];
        node.walkTree((child: MmlNode) => {
            if (child.getProperty('collapse-marker')) {
                nodes.push(child);
            }
        });
        this.makeActions(nodes);
    }

    public makeActions(nodes: MmlNode[]) {
        for (const node of nodes) {
            this.makeAction(node);
        }
    }

    public makeAction(node: MmlNode) {
        if (node.isKind('math')) {
            node = this.addMrow(node);
        }
        const factory = this.complexity.factory;
        const marker = node.getProperty('collapse-marker') as string;
        const parent = node.parent;
        var maction = factory.create('maction', {
            actiontype: 'toggle',
            selection: 2,
            'data-collapsible': true,
            'data-semantic-complexity': node.attributes.get('data-semantic-complexity')
        }, [
            factory.create('mtext', {mathcolor: 'blue'}, [
                (factory.create('text') as TextNode).setText(marker)
            ])
        ]);
        maction.inheritAttributesFrom(node);
        node.attributes.set('data-semantic-complexity', node.getProperty('collapse-complexity'));
        node.removeProperty('collapse-marker');
        node.removeProperty('collapse-complexity');
        parent.replaceChild(maction, node);
        maction.appendChild(node);
    }

    public addMrow(node: MmlNode) {
        const mrow = this.complexity.factory.create('mrow', null, node.childNodes[0].childNodes as MmlNode[]);
        node.childNodes[0].setChildren([mrow]);

        const attributes = node.attributes.getAllAttributes();
        for (const name of Object.keys(attributes)) {
            if (name.substr(0, 14) === 'data-semantic-') {
                mrow.attributes.set(name, attributes[name]);
                delete attributes[name];
            }
        }

        mrow.setProperty('collapse-marker', node.getProperty('collapse-marker'));
        mrow.setProperty('collapse-complexity', node.getProperty('collapse-complexity'));
        node.removeProperty('collapse-marker');
        node.removeProperty('collapse-complexity');
        return mrow;
    }
}
