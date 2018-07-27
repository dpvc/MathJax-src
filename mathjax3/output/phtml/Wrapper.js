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
 * @fileoverview  Implements the PHTMLWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractWrapper} from '../../core/Tree/Wrapper.js';
import {TextNode, AbstractMmlNode} from '../../core/MmlTree/MmlNode.js';
import {unicodeChars} from '../../util/string.js';
import * as LENGTHS from '../../util/lengths.js';
import {PHTMLWrapperFactory} from './WrapperFactory.js';

/*****************************************************************/
/*
 *  The base PHTMLWrapper class
 */

export class PHTMLWrapper extends AbstractWrapper {

    /*
     * Easy access to the PHTML output jax for this node
     */
    get PHTML() {
        return this.factory.phtml;
    }

    /*
     * Easy access to the DOMAdaptor object
     */
    get adaptor() {
        return this.factory.phtml.adaptor;
    }

    /*
     * Easy access to the metric data for this node
     */
    get metrics() {
        return this.factory.phtml.math.metrics;
    }

    /*******************************************************************/

    constructor(factory, node, parent = null) {
        super(factory, node);
        this.parent = parent;
        this.childNodes = null;  // filled in below
        this.phtml = null;       // the HTML node generated for this wrapper
        this.removedStyles = {}; // Styles that must be handled directly by PHTML (mostly having to do with fonts)
        this.style = null;       // The explicit styles set by the node
        this.variant = '';       // the mathvariant for this node
        this.bbox = {scale: 1, rscale: 1, w: 0, h: 0, d: 0, t: 0, b: 0, l:0, r:0};

        this.getStyles();
        this.getVariant();
        this.getScale();
        this.getSpace();

        this.childNodes = node.childNodes.map(child => this.wrap(child));
    }

    /*
     * Wrap the given node.
     */
    wrap(node, parent = null) {
        const wrapped = this.factory.wrap(node, parent || this);
        if (parent) {
            parent.childNodes.push(wrapped);
        }
        this.PHTML.nodeMap.set(node, wrapped);
        return wrapped;
    }

    /*******************************************************************/
    /*
     * Create the HTML for the wrapped node.
     */

    toPHTML(parent, options = {}) {
        const phtml = this.defaultSpan(parent, options);
    }

    /*
     * The default span for a PreviewHTML node
     */
    defaultSpan(parent, options = {}) {
        const span = this.phtml = this.createSpan(parent);
        this.handleStyle();
        this.handleColor();
        this.handleScale();
        this.handleAttributes();
        if (this.node.isToken) this.handleToken();
        for (const child of this.childNodes) {
            this.addChild(span, child, options);
        }
        return span;
    }

    /*
     * Add a child span
     */
    addChild(parent, child, options) {
        const adaptor = this.adaptor;
        if (child) {
            if (options.childSpans) {
                parent = adaptor.append(parent, this.html('span', {'class': options.className}));
            }
            child.toPHTML(parent);
            if (!options.noBBox) {
                const bbox = this.bbox;
                const cbox = child.bbox;
                bbox.w += cbox.w + cbox.l + cbox.r;
                if (cbox.h > bbox.h) bbox.h = cbox.h;
                if (cbox.d > bbox.d) bbox.d = cbox.d;
                if (cbox.t > bbox.t) bbox.t = cbox.t;
                if (cbox.b > bbox.b) bbox.b = cbox.b;
            }
        } else if (options.forceChild) {
            adaptor.append(parent, this.html('span'));
        }
    }

    /*
     * Create a span with the proper class for PreviewHTML
     */
    createSpan(parent) {
        if (this.node.isInferred) return parent;
        //
        //  ### FIXME:  This is a hack to handle the different spacing of the
        //  ### integral sign in Times compared to CM fonts
        //  ### It should probably be part of the mo wrapper in any case
        //
        if (this.node.isKind('mo') && this.node.getText() === '\u222B') {
            PHTMLWrapper.lastIsInt = true;
        } else if (!this.node.isKind('mspace') || this.node.attributes.get('width') !== 'negativethinmathspace') {
            PHTMLWrapper.lastIsInt = false;
        }
        return this.adaptor.append(parent, this.html('span', {'class': 'MJXp-' + this.node.kind}));
    }

    /*******************************************************************/

    /*
     * Add the style attribute, but remove any font-related styles
     *   (since these are handled separately by the variant)
     */
    getStyles() {
        const styleString = this.node.attributes.getExplicit('style');
        if (!styleString) return;
        const style = this.styles = new Styles(styleString);
        for (let i = 0, m = PHTMLWrapper.removeStyles.length; i < m; i++) {
            const id = PHTMLWrapper.removeStyles[i];
            if (style.get(id)) {
                if (!this.removedStyles) this.removedStyles = {};
                this.removedStyles[id] = style.get(id);
                style.set(id, '');
            }
        }
    }

    /*
     * Get the mathvariant (or construct one, if needed).
     */
    getVariant() {
        if (!this.node.isToken) return;
        const attributes = this.node.attributes;
        let variant = attributes.get('mathvariant');
        if (!attributes.getExplicit('mathvariant')) {
            const values = attributes.getList('fontfamily', 'fontweight', 'fontstyle');
            if (this.removedStyles) {
                const style = this.removedStyles;
                if (style.fontFamily) values.family = style.fontFamily;
                if (style.fontWeight) values.weight = style.fontWeight;
                if (style.fontStyle)  values.style  = style.fontStyle;
            }
            if (values.fontfamily) values.family = values.fontfamily;
            if (values.fontweight) values.weight = values.fontweight;
            if (values.fontstyle)  values.style  = values.fontstyle;
            if (values.weight && values.weight.match(/^\d+$/)) {
                values.weight = (parseInt(values.weight) > 600 ? 'bold' : 'normal');
            }
            if (values.family) {
                    variant = this.explicitVariant(values.family, values.weight, values.style);
            } else {
                if (this.node.getProperty('variantForm')) variant = '-TeX-variant';
                variant = (PHTMLWrapper.BOLDVARIANTS[values.weight] || {})[variant] || variant;
                variant = (PHTMLWrapper.ITALICVARIANTS[values.style] || {})[variant] || variant;
            }
        }
        this.variant = variant;
    }

    /*
     * Set the CSS for a token element having an explicit font (rather than regular mathvariant).
     */
    explicitVariant(fontFamily, fontWeight, fontStyle) {
        let style = this.styles;
        if (!style) style = this.styles = new Styles();
        style.set('fontFamily', fontFamily);
        if (fontWeight) style.set('fontWeight', fontWeight);
        if (fontStyle)  style.set('fontStyle', fontStyle);
        return '-explicitFont';
    }

    /*
     * Determine the scaling factor to use for this wrapped node, and set the styles for it.
     */
    getScale() {
        let scale = 1, parent = this.parent;
        let pscale = (parent ? parent.bbox.scale : 1);
        let attributes = this.node.attributes;
        let scriptlevel = Math.min(attributes.get('scriptlevel'), 2);
        let fontsize = attributes.get('fontsize');
        let mathsize = (this.node.isToken || this.node.isKind('mstyle') ?
                        attributes.get('mathsize') : attributes.getInherited('mathsize'));
        //
        // If scriptsize is non-zero, set scale based on scriptsizemultiplier
        //
        if (scriptlevel !== 0) {
            scale = Math.pow(attributes.get('scriptsizemultiplier'), scriptlevel);
            let scriptminsize = this.length2em(attributes.get('scriptminsize'), .8, 1);
            if (scale < scriptminsize) scale = scriptminsize;
        }
        //
        // If there is style="font-size:...", and not fontsize attribute, use that as fontsize
        //
        if (this.removedStyles && this.removedStyles.fontSize && !fontsize) {
            fontsize = this.removedStyles.fontSize;
        }
        //
        // If there is a fontsize and no mathsize attribute, is that
        //
        if (fontsize && !mathsize) {
            mathsize = fontsize;
        }
        //
        //  Incorporate the mathsize, if any
        //
        if (mathsize !== '1') {
            scale *= this.length2em(mathsize, 1, 1);
        }
        //
        // For explicit font family, go back to the scaing of the surrounding text
        //
        if (this.variant === '-explicitFont') {
           scale /= this.metrics.scale;
        }
        //
        // Record the scaling factors and set the element's CSS
        //
        this.bbox.scale = scale;
        this.bbox.rscale = scale / pscale;
    }

    /*
     * Sets the spacing based on TeX or MathML algorithm
     */
    getSpace() {
    }

    /*******************************************************************/

    /*
     * Add the variant class to a token node
     */
    handleToken() {
        const variant = this.variant;
        if (variant !== 'normal' && variant !== '-explicitFont') {
            const adaptor = this.adaptor;
            adaptor.addClass(this.phtml, PHTMLWrapper.VARIANT[variant]);
        }
    }

    /*
     * Add any styles to the span
     */
    handleStyle() {
        if (this.styles) {
            const style = this.styles.cssText;
            if (style) {
                this.adaptor.setAttribute(this.phtml, 'style', style);
            }
        }
    }

    /*
     * Set the (relative) scaling factor for the node
     */
    handleScale() {
        const rscale = this.bbox.rscale;
        const scale = (Math.abs(rscale - 1) < .001 ? 1 : rscale);
        if (this.phtml && scale !== 1) {
            const size = this.percent(scale);
            this.adaptor.setStyle(this.phtml, 'fontSize', size);
        }
    }

    /*
     * Set the foreground and background colors
     */
    handleColor() {
        const attributes = this.node.attributes;
        const mathcolor = attributes.getExplicit('mathcolor');
        const color = attributes.getExplicit('color');
        const mathbackground = attributes.getExplicit('mathbackground');
        const background = attributes.getExplicit('background');
        if (mathcolor || color) {
            this.adaptor.setStyle(this.phtml, 'color', mathcolor || color);
        }
        if (mathbackground || background) {
            this.adaptor.setStyle(this.phtml, 'backgroundColor', mathbackground || background);
        }
    }

    /*
     * Copy RDFa, aria, and other tags from the MathML to the PHTML output nodes.
     * Don't copy those in the skipAttributes list, or anything that already exists
     * as a property of the node (e.g., no "onlick", etc.).  If a name in the
     * skipAttributes object is set to false, then the attribute WILL be copied.
     * Add the class to anhy other classes already in use.
     */
    handleAttributes() {
        const attributes = this.node.attributes;
        const defaults = attributes.getAllDefaults();
        const skip = PHTMLWrapper.skipAttributes;
        for (const name of attributes.getExplicitNames()) {
            if (skip[name] === false || (!(name in defaults) && !skip[name] &&
                                         !this.adaptor.hasAttribute(this.phtml, name))) {
                this.adaptor.setAttribute(this.phtml, name, attributes.getExplicit(name));
            }
        }
        if (attributes.get('class')) {
            this.adaptor.addClass(this.phtml, attributes.get('class'));
        }
    }

    /*******************************************************************/

    /*
     * The wrapper for this node's core node
     */
    core() {
        return this.PHTML.nodeMap.get(this.node.core());
    }

    /*
     * The wrapper for this node's core <mo> node
     */
    coreMO() {
        return this.PHTML.nodeMap.get(this.node.coreMO());
    }

    /*
     * For a token node, the combined text content of the node's children
     */
    getText() {
        let text = '';
        if (this.node.isToken) {
            for (const child of this.node.childNodes) {
                if (child instanceof TextNode) {
                    text += child.getText();
                }
            }
        }
        return text;
    }

    /*******************************************************************/
    /*
     * Easy access to some utility routines
     */

    percent(m) {
        return LENGTHS.percent(m);
    }

    em(m) {
        return LENGTHS.em(m);
    }

    /*
     * Convert a length to ems
     */
    length2em(length, size = 1, scale = null) {
        if (scale === null) {
            scale = this.bbox.scale;
        }
        return LENGTHS.length2em(length, size, scale, this.metrics.em);
    }

    /*
     * Turns a string into an array of unicode code points
     */
    unicodeChars(text) {
        return unicodeChars(text);
    }

    /*
     * Create an HTML node of the given type, with the given attributes nd children
     */
    html(type, def = {}, content = []) {
        return this.factory.phtml.html(type, def, content);
    }

    /*
     * Create a text node with the given text
     */
    text(text) {
        return this.factory.phtml.text(text);
    }

}

PHTMLWrapper.kind = 'unknown';

PHTMLWrapper.FONTS = '"Times New Roman", Times, STIXGeneral, serif';

/*
 *  The default styles for PreviewHTML
 */
PHTMLWrapper.styles = {
    '.MJXp-bold':   {'font-weight': 'bold'},
    '.MJXp-italic': {'font-style': 'italic'},
    '.MJXp-scr':    {'font-family': 'MathJax_Script, ' + PHTMLWrapper.FONTS},
    '.MJXp-frak':   {'font-family': 'MathJax_Fraktur, ' + PHTMLWrapper.FONTS},
    '.MJXp-sf':     {'font-family': 'MathJax_SansSerif, ' + PHTMLWrapper.FONTS},
    '.MJXp-cal':    {'font-family': 'MathJax_Calligraphic, ' + PHTMLWrapper.FONTS},
    '.MJXp-mono':   {'font-family': 'MathJax_Typewriter, ' + PHTMLWrapper.FONTS},

    //
    //  These don't have Wrapper subclasses (add them if needed), so add their styles here
    //
    '.MJXp-merror': {
        color: 'red',
        'background-color': 'yellow'
    },
    '.MJXp-mphantom': {
        visibility: 'hidden'
    }

};

/*
 * Non-MathML attributes on MathML elements NOT to be copied to the
 * corresponding PHTML elements.  If set to false, then the attribute
 * WILL be copied.  Most of these (like the font attributes) are handled
 * in other ways.
 */
PHTMLWrapper.skipAttributes = {
    fontfamily: true, fontsize: true, fontweight: true, fontstyle: true,
    color: true, background: true,
    'class': true, href: true, style: true,
    xmlns: true
};

/*
 * The class to use for each varaint
 */
PHTMLWrapper.VARIANT = {
    "bold": "MJXp-bold",
    "italic": "MJXp-italic",
    "bold-italic": "MJXp-bold MJXp-italic",
    "script": "MJXp-scr",
    "bold-script": "MJXp-scr MJXp-bold",
    "fraktur": "MJXp-frak",
    "bold-fraktur": "MJXp-frak MJXp-bold",
    "monospace": "MJXp-mono",
    "sans-serif": "MJXp-sf",
    "-tex-calligraphic": "MJXp-cal"
};

/*
 * The translation of mathvariant to bold or italic styles, or to remove
 * bold or italic from a mathvariant.
 */
PHTMLWrapper.BOLDVARIANTS =  {
    bold: {
        normal: 'bold',
        italic: 'bold-italic',
        fraktur: 'bold-fraktur',
        script: 'bold-script',
        'sans-serif': 'bold-sans-serif',
        'sans-serif-italic': 'sans-serif-bold-italic'
    },
    normal: {
        bold: 'normal',
        'bold-italic': 'italic',
        'bold-fraktur': 'fraktur',
        'bold-script': 'script',
        'bold-sans-serif': 'sans-serif',
        'sans-serif-bold-italic': 'sans-serif-italic'
    }
};
PHTMLWrapper.ITALICVARIANTS = {
    italic: {
        normal: 'italic',
        bold: 'bold-italic',
        'sans-serif': 'sans-serif-italic',
        'bold-sans-serif': 'sans-serif-bold-italic'
    },
    normal: {
        italic: 'normal',
        'bold-italic': 'bold',
        'sans-serif-italic': 'sans-serif',
        'sans-serif-bold-italic': 'bold-sans-serif'
    }
};

PHTMLWrapper.lastIsInt = false;
