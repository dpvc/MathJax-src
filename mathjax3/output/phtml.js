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
 * @fileoverview  Implements the PHTML OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractOutputJax} from '../core/OutputJax.js';
import {PHTMLWrapperFactory} from './phtml/WrapperFactory.js';
import {percent} from '../util/lengths.js';


/*****************************************************************/
/*
 *  Implements the PHTML class (extends AbstractOutputJax)
 */

export class PHTML extends AbstractOutputJax {

    /*
     * Get the WrapperFactory and connect it to this output jax
     */
    constructor(options = null) {
        super(options);
        this.document = null;
        this.math = null;
        //
        // A map from the nodes in the expression currently being processed to the
        // wrapper nodes for them (used by functions like core() to locate the wrappers
        // from the core nodes)
        //
        this.nodeMap = null;
        //
        //  The factory for wrapper nodes
        //
        this.factory = this.options.PHTMLWrapperFactory || new PHTMLWrapperFactory();
        this.factory.phtml = this;
    }

    /*
     * Save the math document and the math item
     * Set the document where HTML nodes will be created via the adaptor
     * // Recursively set the TeX classes for the nodes
     * Create the container mjx-phtml node
     * Create the PHTML output for the root MathML node in the container
     */
    typeset(math, html) {
        this.document = html;
        this.math = math;
        this.adaptor.document = html.document;
//        math.root.setTeXclass(null);
        let node = this.html('span', {'class': 'MathJax_PHTML'});
        const scale = math.metrics.scale * this.options.scale;
        if (scale !== 1) {
            this.adaptor.setStyle(node, 'fontSize', percent(scale));
        }
        this.nodeMap = new Map();
        this.toPHTML(math.root, node);
        this.nodeMap = null;
        return this.executeFilters(this.postFilters, math, node);
    }

    /*
     * Create a span containing the escaped delimiter
     */
    escaped(math, html) {
        this.adaptor.document = html.document;
        return this.html('span', {}, [this.text(math.math)]);
    }

    /*
     * For now, just set constant values for the metrics
     */
    getMetrics(html) {
        const adaptor = this.adaptor;
        adaptor.document = html.document;
        const em = 16;
        const ex = em * this.options.exFactor;
        for (const math of html.math) {
            math.setMetrics(em, ex, 120 * em, 1000000, 1);
        }
    }

    /*
     * Crete a stylesheet with the styles from the various MathML classes
     */
    styleSheet(html) {
        this.adaptor.document = html.document;
        //
        // Gather the CSS from the classes
        //
        for (const kind of this.factory.getKinds()) {
            const CLASS = this.factory.getNodeClass(kind);
            this.cssStyles.addStyles(CLASS.styles);
        }
        //
        // Create the stylesheet for the CSS
        //
        const sheet = this.html('style', {id: 'PHTML-styles'},
                                [this.text('\n' + this.cssStyles.cssText + '\n')]);
        return sheet;
    }

    /*
     * Wrap the node and typeset it in the parent element
     */
    toPHTML(node, parent) {
        return this.factory.wrap(node).toPHTML(parent);
    }

    /*
     * Create an html element with the given type, attributes, and content nodes
     */
    html(type, def = {}, content = []) {
        return this.adaptor.node(type, def, content);
    }

    /*
     * Create a text node with the given text
     */
    text(text) {
        return this.adaptor.text(text);
    }

}

/*
 * The name and options for the output jax
 */
PHTML.NAME = 'PHTML';
PHTML.OPTIONS = {
    ...AbstractOutputJax.OPTIONS,
    scale: 1,                      // Global scaling factor for all expressions
    skipAttributes: {},            // RFDa and other attributes NOT to copy to PHTML output
    exFactor: .5,                  // default size of ex in em units
    PHTMLWrapperFactory: null      // The PHTMLWrapper factory to use
};

