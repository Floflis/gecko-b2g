/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var MarionetteController;

#ifdef HAS_KOOST_MODULES
const { MarionetteRunner } = ChromeUtils.import(
  "resource://gre/modules/MarionetteRunner.jsm"
);

MarionetteController = {
  enableRunner() {
    MarionetteRunner.run();
  }
}
#endif

this.EXPORTED_SYMBOLS = ["MarionetteController"];
