import {MathJax} from 'mathjax3/mathjax.js';

import {TeX} from 'mathjax3/input/tex.js';
import {RegisterHTMLHandler} from "mathjax3/handlers/html.js";
import {chooseAdaptor} from "mathjax3/adaptors/chooseAdaptor.js";
import {JsonMmlVisitor} from 'mathjax3/core/MmlTree/JsonMmlVisitor.js';

import {TagsFactory} from 'mathjax3/input/tex/Tags.js';
import {MapHandler} from "mathjax3/input/tex/MapHandler.js";

import {Test} from './tests.js';
import 'mathjax3/input/tex/base/BaseConfiguration.js';
import 'mathjax3/input/tex/ams/AmsConfiguration.js';


RegisterHTMLHandler(chooseAdaptor());

export class ParserTest extends Test {

  
  constructor() {
    super();
    this.packages = ['ams', 'base'];
    this.settings = {};
    this.tags = 'none';
    console.log('\u001B\u005B\u0033\u0034\u006D' +
                'Running tests from ' + this.constructor.name +
                '\u001B\u005B\u0033\u0037\u006D');
  }

  // Tests exclusively the timing of the Translate method.
  runTest(name, tex, expected) {
    this.test(
      name,
      t => {
        MathJax.handleRetriesFor(function() {
          let html = MathJax.document('<html></html>', {
            InputJax: new TeX({packages: this.packages,
                               settings: this.settings,
                               tags: this.tags})
          });
          MapHandler.getInstance().resetExtensions();
          html.TestMath(tex).compile();
          let jv = new JsonMmlVisitor();
          let actual = jv.visitTree(html.math.pop().root);
          t.deepEqual(actual, expected, name);
        }.bind(this)).catch(err => {
          console.log(err.message);
          console.log(err.stack.replace(/\n.*\/system\.js:(.|\n)*/, ''));
        });
      }
    );
  }
  
  ignoreTest(name, tex, expected) {
  }
  
}
