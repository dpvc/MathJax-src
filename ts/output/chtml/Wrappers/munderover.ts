/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmunderover wrapper for the MmlMunderover object
 *                and the special cases CHTMLmunder and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMunder, CommonMunderClass, CommonMunderMixin,
        CommonMover, CommonMoverClass, CommonMoverMixin,
        CommonMunderover, CommonMunderoverClass, CommonMunderoverMixin} from '../../common/Wrappers/munderover.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {CHTMLMsub, CHTMLMsubClass, CHTMLMsubNTD,
        CHTMLMsup, CHTMLMsupClass, CHTMLMsupNTD,
        CHTMLMsubsup, CHTMLMsubsupClass, CHTMLMsubsupNTD} from './msubsup.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLMunder interface for the CHTML Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMunderNTD<N, T, D> extends CHTMLMsubNTD<N, T, D>, CommonMunder<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMunderClass interface for the CHTML Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMunderClass<N, T, D> extends CHTMLMsubClass<N, T, D>, CommonMunderClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMunderNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMunder wrapper class for the MmlMunder class
 */
export const CHTMLMunder = (function <N, T, D>(): CHTMLMunderClass<N, T, D> {

  const Base = CommonMunderMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMunderClass<N, T, D>
    >(CHTMLMsub);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMunder extends Base implements CHTMLMunderNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMunder.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-over': {
        'text-align': 'left'
      },
      'mjx-munder:not([limits="false"])': {
        display: 'inline-table',
      },
      'mjx-munder > mjx-row': {
        'text-align': 'left'
      },
      'mjx-under': {
        'padding-bottom': '.1em'           // big_op_spacing5
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      if (this.hasMovableLimits()) {
        super.toCHTML(parent);
        this.adaptor.setAttribute(this.dom, 'limits', 'false');
        return;
      }
      this.dom = this.standardCHTMLnode(parent);
      const base = this.adaptor.append(
        this.adaptor.append(this.dom, this.html('mjx-row')) as N,
        this.html('mjx-base')
      ) as N;
      const under = this.adaptor.append(
        this.adaptor.append(this.dom, this.html('mjx-row')) as N,
        this.html('mjx-under')
      ) as N;
      this.baseChild.toCHTML(base);
      this.scriptChild.toCHTML(under);
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.scriptChild.getOuterBBox();
      const k = this.getUnderKV(basebox, underbox)[0];
      const delta = (this.isLineBelow ? 0 : this.getDelta(true));
      this.adaptor.setStyle(under, 'paddingTop', this.em(k));
      this.setDeltaW([base, under], this.getDeltaW([basebox, underbox], [0, -delta]));
      this.adjustUnderDepth(under, underbox);
    }

  };

})<any, any, any>();


/*****************************************************************/
/*****************************************************************/

/**
 * The CHTMLMover interface for the CHTML Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMoverNTD<N, T, D> extends CHTMLMsupNTD<N, T, D>, CommonMover<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMoverClass interface for the CHTML Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMoverClass<N, T, D> extends CHTMLMsupClass<N, T, D>, CommonMoverClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMoverNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMover wrapper class for the MmlMover class
 */
export const CHTMLMover = (function <N, T, D>(): CHTMLMoverClass<N, T, D> {

  const Base = CommonMoverMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMoverClass<N, T, D>
    >(CHTMLMsup);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMover extends Base implements CHTMLMoverNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMover.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-mover:not([limits="false"])': {
        'padding-top': '.1em'        // big_op_spacing5
      },
      'mjx-mover:not([limits="false"]) > *': {
        display: 'block',
        'text-align': 'left'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      if (this.hasMovableLimits()) {
        super.toCHTML(parent);
        this.adaptor.setAttribute(this.dom, 'limits', 'false');
        return;
      }
      this.dom = this.standardCHTMLnode(parent);
      const over = this.adaptor.append(this.dom, this.html('mjx-over')) as N;
      const base = this.adaptor.append(this.dom, this.html('mjx-base')) as N;
      this.scriptChild.toCHTML(over);
      this.baseChild.toCHTML(base);
      const overbox = this.scriptChild.getOuterBBox();
      const basebox = this.baseChild.getOuterBBox();
      this.adjustBaseHeight(base, basebox);
      const k = this.getOverKU(basebox, overbox)[0];
      const delta = (this.isLineAbove ? 0 : this.getDelta());
      this.adaptor.setStyle(over, 'paddingBottom', this.em(k));
      this.setDeltaW([base, over], this.getDeltaW([basebox, overbox], [0, delta]));
      this.adjustOverDepth(over, overbox);
    }

  };

})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The CHTMLMunderover interface for the CHTML Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMunderoverNTD<N, T, D> extends CHTMLMsubsupNTD<N, T, D>, CommonMunderover<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMunderoverClass interface for the CHTML Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMunderoverClass<N, T, D> extends CHTMLMsubsupClass<N, T, D>, CommonMunderoverClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMunderoverNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMunderover wrapper class for the MmlMunderover class
 */
export const CHTMLMunderover = (function <N, T, D>(): CHTMLMunderoverClass<N, T, D> {

  const Base = CommonMunderoverMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMunderoverClass<N, T, D>
    >(CHTMLMsubsup);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMunderover extends Base implements CHTMLMunderoverNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMunderover.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-munderover:not([limits="false"])': {
        'padding-top': '.1em'        // big_op_spacing5
      },
      'mjx-munderover:not([limits="false"]) > *': {
        display: 'block'
      },
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      if (this.hasMovableLimits()) {
        super.toCHTML(parent);
        this.adaptor.setAttribute(this.dom, 'limits', 'false');
        return;
      }
      this.dom = this.standardCHTMLnode(parent);
      const over = this.adaptor.append(this.dom, this.html('mjx-over')) as N;
      const table = this.adaptor.append(
        this.adaptor.append(this.dom, this.html('mjx-box')) as N,
        this.html('mjx-munder')
      ) as N;
      const base = this.adaptor.append(
        this.adaptor.append(table, this.html('mjx-row')) as N,
        this.html('mjx-base')
      ) as N;
      const under = this.adaptor.append(
        this.adaptor.append(table, this.html('mjx-row')) as N,
        this.html('mjx-under')
      ) as N;
      this.overChild.toCHTML(over);
      this.baseChild.toCHTML(base);
      this.underChild.toCHTML(under);
      const overbox = this.overChild.getOuterBBox();
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.underChild.getOuterBBox();
      this.adjustBaseHeight(base, basebox);
      const ok = this.getOverKU(basebox, overbox)[0];
      const uk = this.getUnderKV(basebox, underbox)[0];
      const delta = this.getDelta();
      this.adaptor.setStyle(over, 'paddingBottom', this.em(ok));
      this.adaptor.setStyle(under, 'paddingTop', this.em(uk));
      this.setDeltaW([base, under, over],
                     this.getDeltaW([basebox, underbox, overbox],
                                    [0, this.isLineBelow ? 0 : -delta, this.isLineAbove ? 0 : delta]));
      this.adjustOverDepth(over, overbox);
      this.adjustUnderDepth(under, underbox);
    }

    /**
     * Make sure styles get output when called from munderover with movable limits
     *
     * @override
     */
    public markUsed() {
      super.markUsed();
      this.jax.wrapperUsage.add(CHTMLMsubsup.kind);
    }

  };

})<any, any, any>();
