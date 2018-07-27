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
 * @fileoverview  An object listing all the PHTMLWrapper classes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PHTMLWrapper} from './Wrapper.js';
/*
import {PHTMLmath} from './Wrappers/math.js';
import {PHTMLmi} from './Wrappers/mi.js';
import {PHTMLmo} from './Wrappers/mo.js';
import {PHTMLmn} from './Wrappers/mn.js';
import {PHTMLms} from './Wrappers/ms.js';
import {PHTMLmspace} from './Wrappers/mspace.js';
import {PHTMLmpadded} from './Wrappers/mpadded.js';
import {PHTMLmenclose} from './Wrappers/menclose.js';
import {PHTMLmrow, PHTMLinferredMrow} from './Wrappers/mrow.js';
import {PHTMLmfenced} from './Wrappers/mfenced.js';
import {PHTMLmfrac} from './Wrappers/mfrac.js';
import {PHTMLmsqrt} from './Wrappers/msqrt.js';
import {PHTMLmroot} from './Wrappers/mroot.js';
import {PHTMLmsub, PHTMLmsup, PHTMLmsubsup} from './Wrappers/msubsup.js';
import {PHTMLmover, PHTMLmunder, PHTMLmunderover} from './Wrappers/munderover.js';
import {PHTMLmmultiscripts} from './Wrappers/mmultiscripts.js';
import {PHTMLmtable} from './Wrappers/mtable.js';
import {PHTMLmtr, PHTMLmlabeledtr} from './Wrappers/mtr.js';
import {PHTMLmtd} from './Wrappers/mtd.js';
import {PHTMLmaction} from './Wrappers/maction.js';
import {PHTMLmglyph} from './Wrappers/mglyph.js';
import {PHTMLsemantics, PHTMLannotation, PHTMLannotationXML, PHTMLxml} from './Wrappers/semantics.js';
import {PHTMLTeXAtom} from './Wrappers/TeXAtom.js';
*/
import {PHTMLTextNode} from './Wrappers/TextNode.js';

export const PHTMLWrappers  = {
/*
    [PHTMLmath.kind]: PHTMLmath,
    [PHTMLmrow.kind]: PHTMLmrow,
    [PHTMLinferredMrow.kind]: PHTMLinferredMrow,
    [PHTMLmi.kind]: PHTMLmi,
    [PHTMLmo.kind]: PHTMLmo,
    [PHTMLmn.kind]: PHTMLmn,
    [PHTMLms.kind]: PHTMLms,
    [PHTMLmspace.kind]: PHTMLmspace,
    [PHTMLmpadded.kind]: PHTMLmpadded,
    [PHTMLmenclose.kind]: PHTMLmenclose,
    [PHTMLmfrac.kind]: PHTMLmfrac,
    [PHTMLmsqrt.kind]: PHTMLmsqrt,
    [PHTMLmroot.kind]: PHTMLmroot,
    [PHTMLmsub.kind]: PHTMLmsub,
    [PHTMLmsup.kind]: PHTMLmsup,
    [PHTMLmsubsup.kind]: PHTMLmsubsup,
    [PHTMLmunder.kind]: PHTMLmunder,
    [PHTMLmover.kind]: PHTMLmover,
    [PHTMLmunderover.kind]: PHTMLmunderover,
    [PHTMLmmultiscripts.kind]: PHTMLmmultiscripts,
    [PHTMLmfenced.kind]: PHTMLmfenced,
    [PHTMLmtable.kind]: PHTMLmtable,
    [PHTMLmtr.kind]: PHTMLmtr,
    [PHTMLmlabeledtr.kind]: PHTMLmlabeledtr,
    [PHTMLmtd.kind]: PHTMLmtd,
    [PHTMLmaction.kind]: PHTMLmaction,
    [PHTMLmglyph.kind]: PHTMLmglyph,
    [PHTMLsemantics.kind]: PHTMLsemantics,
    [PHTMLannotation.kind]: PHTMLannotation,
    [PHTMLannotationXML.kind]: PHTMLannotationXML,
    [PHTMLxml.kind]: PHTMLxml,
    [PHTMLTeXAtom.kind]: PHTMLTeXAtom,
*/
    [PHTMLTextNode.kind]: PHTMLTextNode,
    [PHTMLWrapper.kind]: PHTMLWrapper
};
