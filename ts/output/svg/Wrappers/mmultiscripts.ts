/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the SVGmmultiscripts wrapper for the MmlMmultiscripts object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMmultiscripts, CommonMmultiscriptsClass,
        CommonMmultiscriptsMixin} from '../../common/Wrappers/mmultiscripts.js';
import {SVGMsubsup, SVGMsubsupNTD, SVGMsubsupClass} from './msubsup.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMmultiscripts} from '../../../core/MmlTree/MmlNodes/mmultiscripts.js';
import {split} from '../../../util/string.js';

/*****************************************************************/

/**
 * A function taking two widths and returning an offset of the first in the second
 */
export type AlignFunction = (w: number, W: number) => number;

/**
 * Get the function for aligning scripts horizontally (left, center, right)
 */
export function AlignX(align: string) {
  return ({
    left: (_w, _W) => 0,
    center: (w, W) => (W - w) / 2,
    right: (w, W) => W - w
  } as {[name: string]: AlignFunction})[align] || ((_w, _W) => 0) as AlignFunction;
}

/*****************************************************************/
/**
 * The SVGMmultiscripts interface for the SVG Mmultiscripts wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMmultiscriptsNTD<N, T, D> extends SVGMsubsupNTD<N, T, D>, CommonMmultiscripts<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMmultiscriptsClass interface for the SVG Mmultiscripts wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMmultiscriptsClass<N, T, D> extends SVGMsubsupClass<N, T, D>, CommonMmultiscriptsClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMmultiscriptsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMmultiscripts wrapper class for the MmlMmultiscripts class
 */
export const SVGMmultiscripts = (function <N, T, D>(): SVGMmultiscriptsClass<N, T, D> {


  const Base = CommonMmultiscriptsMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMmultiscriptsClass<N, T, D>
    >(SVGMsubsup);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMmultiscripts extends Base implements SVGMmultiscriptsNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMmultiscripts.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      const data = this.scriptData;
      //
      //  Get the alignment for the scripts
      //
      const scriptalign = this.node.getProperty('scriptalign') || 'right left';
      const [preAlign, postAlign] = split(scriptalign + ' ' + scriptalign);
      //
      //  Combine the bounding boxes of the pre- and post-scripts,
      //  and get the resulting baseline offsets
      //
      const sub = this.combinePrePost(data.sub, data.psub);
      const sup = this.combinePrePost(data.sup, data.psup);
      const [u, v] = this.getUVQ(sub, sup);
      //
      //  Place the pre-scripts, then the base, then the post-scripts
      //
      let x = 0;  // scriptspace
      if (data.numPrescripts) {
        x = this.addScripts(.05, u, v, this.firstPrescript, data.numPrescripts, preAlign);
      }
      const base = this.baseChild;
      base.toSVG(svg);
      base.place(x, 0);
      x += base.getOuterBBox().w;
      if (data.numScripts) {
        this.addScripts(x, u, v, 1, data.numScripts, postAlign);
      }
    }

    /**
     * Create a table with the super and subscripts properly separated and aligned.
     *
     * @param {number} x       The x offset of the scripts
     * @param {number} u       The baseline offset for the superscripts
     * @param {number} v       The baseline offset for the subscripts
     * @param {number} i       The starting index for the scripts
     * @param {number} n       The number of sub/super-scripts
     * @param {string} align   The alignment for the scripts
     * @return {number}        The right-hand offset of the scripts
     */
    protected addScripts(x: number, u: number, v: number, i: number, n: number, align: string): number {
      const adaptor = this.adaptor;
      const alignX = AlignX(align);
      const supRow = adaptor.append(this.dom, this.svg('g')) as N;
      const subRow = adaptor.append(this.dom, this.svg('g')) as N;
      this.place(x, u, supRow);
      this.place(x, v, subRow);
      let m = i + 2 * n;
      let dx = 0;
      while (i < m) {
        const [sub, sup] = [this.childNodes[i++], this.childNodes[i++]];
        const [subbox, supbox] = [sub.getOuterBBox(), sup.getOuterBBox()];
        const [subr, supr] = [subbox.rscale, supbox.rscale];
        const w = Math.max(subbox.w * subr, supbox.w * supr);
        sub.toSVG(subRow);
        sup.toSVG(supRow);
        sub.place(dx + alignX(subbox.w * subr, w), 0);
        sup.place(dx + alignX(supbox.w * supr, w), 0);
        dx += w;
      }
      return x + dx;
    }

  };

})<any, any, any>();
