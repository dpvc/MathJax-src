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
 * @fileoverview  Implements the PHTMLTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PHTMLWrapper} from '../Wrapper.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/*
 *  The PHTMLTextNode wrapper for the TextNode object
 */

export class PHTMLTextNode extends PHTMLWrapper {

    toPHTML(parent) {
        const text = this.node.getText();
        this.adaptor.append(parent, this.text(text));
    }

    /******************************************************/
    /*
     * TextNodes don't need these, since these properties
     *   are inherited from the parent nodes
     */

    getStyles() {}
    getVariant() {}
    getScale() {}
    getSpace() {}
}

PHTMLTextNode.kind = TextNode.prototype.kind;
PHTMLTextNode.autoStyle = false;

