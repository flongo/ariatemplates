/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Test case for aria.utils.Dom
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Caret",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Caret"],
    $constructor : function () {
        /**
         * Dom elements created, to delete them if there was any issue in the test
         * @type Array
         */
        this.domCreated = [];

        aria.utils.Dom.getDocumentScrollElement();

        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        test_setGetPosition : function () {

            this._testOnTag("input", "testString", 1, 5);
            this._testOnTag("textarea", "abcdefg\r\nhil", 2, 5);
            this._testOnTag("textarea", "\r\n\r\nabcdefg\r\nhil", 0, 2);
            this._testOnTag("textarea", "\r\n\r\nabcdefg\r\nhil", 0, 13, true);
        },

        _testOnTag : function (tagName, value, start, end, select) {
            var document = Aria.$window.document;
            var element = document.createElement(tagName);
            var testArea = aria.utils.Dom.getElementById("TESTAREA");
            testArea.appendChild(element);
            element.value = value;


            var caretUtil = aria.utils.Caret;
            if (select) {
                caretUtil.select(element);
            } else {
                caretUtil.setPosition(element, start, end);
            }
            var expected = caretUtil.getPosition(element);
            this.assertJsonEquals(expected, {
                start : start,
                end : end
            }, "Caret not correctly set/read from input.");
            testArea.removeChild(element);
            element = null;
        }

    }
});
