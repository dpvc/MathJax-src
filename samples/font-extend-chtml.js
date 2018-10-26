import {MathJax} from '../mathjax3/mathjax.js';

import {TeX} from '../mathjax3/input/tex.js';
import {CHTML} from '../mathjax3/output/chtml.js';
import {RegisterHTMLHandler} from '../mathjax3/handlers/html.js';
import {browserAdaptor} from '../mathjax3/adaptors/browserAdaptor.js';

import '../mathjax3/input/tex/base/BaseConfiguration.js';
import '../mathjax3/input/tex/ams/AmsConfiguration.js';
import '../mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '../mathjax3/input/tex/newcommand/NewcommandConfiguration.js';

RegisterHTMLHandler(browserAdaptor());

const tex = new TeX({packages: ['base', 'ams', 'newcommand', 'boldsymbol']});
const chtml = new CHTML();

//
//  Modify the normal variant for the number 1 to come from a custom font.
//
//  The 0x31 is the charater number (unicode position) of the number 1.
//
//  The data are [height, depth, width, {c: string, f: font, css: flags}]
//
//  The height, depth, and width are in em's.
//  The 'c' string is the string in the custom font to use for this character.
//  The 'f' string is the suffix for the font to use (it refer to MJXTEX-CUSTOM in this case).
//  The 'css' value is a set of bit flags indicating what cusomt CSS needs to be
//    set, in this case it is the width (0x01), the height and depth (0x02), and the
//    text string for the character (0x04).  (Some variants may not need to set all of
//    these in the CSS, as they can be inherited from other fonts; e.g., the bold "1"
//    need not set the character string, since it will inherit that from the normal "1".)
//
//  You can set as many characters as you need in a given variant in one call to defineChars().
//
chtml.font.defineChars('normal', {
    0x31: [.82, 0, .569, {c: '1', f: 'CUSTOM', css: 7}]
});

//
// Define the font used for the custom characters
//
chtml.font.constructor.defaultFonts['@font-face /* CUSTOM */'] = {
    'font-family': 'MJXTEX-CUSTOM',
    'src': 'local(\'Arial\')'
};

const html = MathJax.document(document, {InputJax: tex, OutputJax: chtml});

MathJax.handleRetriesFor(() => {

    html.findMath()
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();
        
}).catch(err => console.log(err.stack));
