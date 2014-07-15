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
 * @class aria.utils.Caret Utilities for the caret
 * @singleton
 */
Aria.classDefinition({
    $classpath : 'aria.utils.Caret',
    $singleton : true,
    $prototype : {
        /**
         * Return the caret position of the HTML element
         * @param {HTMLElement} element The html element
         * @return {Object} The caret position (start and end)
         */
        getPosition : function (element) {
            var pos = {
                start : 0,
                end : 0
            };

            if ("selectionStart" in element) {
                // w3c standard, available in all but IE<9
                pos.start = element.selectionStart;
                pos.end = element.selectionEnd;
            } else {
                // old IE support
                var document = Aria.$window.document;
                if (document.selection) {
                    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
                    var range = document.selection.createRange();

                    if (range && range.parentElement() == element) {
                        len = element.value.length;
                        normalizedValue = element.value.replace(/\r\n/g, "\n");

                        // Create a working TextRange that lives only in the input
                        textInputRange = element.createTextRange();
                        textInputRange.moveToBookmark(range.getBookmark());

                        // Check if the start and end of the selection are at the very end
                        // of the input, since moveStart/moveEnd doesn't return what we want
                        // in those cases
                        endRange = element.createTextRange();
                        endRange.collapse(false);

                        if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                            start = end = len;
                        } else {
                            start = -textInputRange.moveStart("character", -len);
                            start += normalizedValue.slice(0, start).split("\n").length - 1;

                            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                end = len;
                            } else {
                                end = -textInputRange.moveEnd("character", -len);
                                end += normalizedValue.slice(0, end).split("\n").length - 1;
                            }
                        }
                    }
                    pos.start = start;
                    pos.end = end;
                }
            }

            return pos;
        },

        /**
         * Set the caret position of the HTML element
         * @param {HTMLElement} element The html element
         * @param {Integer} start The starting caret position
         * @param {Integer} end The ending caret position
         */
        setPosition : function (element, start, end) {
            if ("selectionStart" in element) {
                element.selectionStart = start;
                element.selectionEnd = end;
            } else {
                var document = Aria.$window.document;
                if (document.selection) {
                    var range = element.createTextRange();
                    range.moveStart('character', start);
                    range.moveEnd('character', -element.value.length + end);
                    range.select();
                }
            }
        },

        /**
         * Select the element text setting the caret position to the whole input value.
         * @type {HTMLElement} element The html elment
         */
        select : function (element) {
            var start = 0;
            var end = (element.value.length) ? element.value.length : 0;
            if (end) {
                this.setPosition(element, start, end);
            }
        }
    }
});
