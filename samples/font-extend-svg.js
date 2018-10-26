import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {SVG} from '../mathjax3/output/svg.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';

import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';

RegisterHTMLHandler(browserAdaptor());

const tex = new TeX({packages: ['base', 'ams', 'newcommand', 'boldsymbol']});
const svg = new SVG();

//
//  Modify the normal variant glyphs for the number 1.
//
//  The 0x31 is the charater number (unicode position) of the number 1.
//
//  The data are [height, depth, width, {p: path}]
//
//  The height, depth and width are in ems.
//  The 'p' value is the path without the initial M and final Z.
//    In this case, it is just a thin vertical box.
//    The units of the path are 1000th of an em.
//
//  You can set as many characters as you need in a given variant in one call to defineChars().
//
svg.font.defineChars('normal', {
    0x31: [.666, 0, .5, {p: '220 0L220 666L280 666L280 0'}]
});
           

const html = MathJax.document(document, {InputJax: tex, OutputJax: svg});

MathJax.handleRetriesFor(() => {

    html.findMath()
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();
        
}).catch(err => console.log(err.stack));
