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
 * @fileoverview  Implements the PHTMLWrapperFactory class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractWrapperFactory} from '../../core/Tree/WrapperFactory.js';
import {PHTMLWrappers} from './Wrappers.js';

/*****************************************************************/
/*
 *  The PHTMLWrapperFactory class for creating PHTMLWrapper nodes
 */

export class PHTMLWrapperFactory extends AbstractWrapperFactory {

    constructor(nodes = null) {
        super(nodes);
        this.phtml = null; // The PHTML output jax associated with this factory
    }

    /*
     * The list of node-creation functions
     */
    get Wrappers() {
        return this.node;
    }

}

PHTMLWrapperFactory.defaultNodes = PHTMLWrappers; //  The default list of wrapper nodes this factory can create
