/*
 * Copyright 2014 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.splitter.skin.border.BorderAndSizesTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.$constructor.call(this);

        this._sclasses = ["sclassOne"];

        this._currentScenario = 0;

        this._data = {
            border : true,
            height : 500,
            width : 500,
            size1 : 100,
            sclass : this._sclasses[this._currentScenario],
            orientation : "horizontal"
        };

        this.setTestEnv({
            data : this._data
        });

    },
    $prototype : {

        borders : {
            "sclassOne" : {
                container : {
                    width : 0,
                    top : 1,
                    bottom : 2,
                    left : 2,
                    right : 1
                },
                separator : {
                    height : 10,
                    width : 10,
                    top : 1,
                    bottom : 2,
                    left : 2,
                    right : 1
                },
                panel : {
                    top : 1,
                    bottom : 2,
                    left : 2,
                    right : 1
                }
            }

        },

        setUp : function () {
            var splitterSkin = aria.widgets.AriaSkin.skinObject.Splitter, newSkin;
            for (var sclass in this.borders) {
                var values = this.borders[sclass];
                newSkin = splitterSkin[sclass] = aria.utils.Json.copy(splitterSkin.std);
                newSkin.separatorBorder = this.getBorders(values.separator);
                newSkin.panelBorder = this.getBorders(values.separator);
                newSkin.separatorWidth = values.separator.width;
                newSkin.separatorHeight = values.separator.height;
                newSkin.borderColor = "black";
                newSkin.borderTopWidth = values.container.top;
                newSkin.borderBottomWidth = values.container.bottom;
                newSkin.borderLeftWidth = values.container.left;
                newSkin.borderRightWidth = values.container.right;
                if (values.container.width || values.container.width == 0) {
                    newSkin.borderWidth = values.container.width;
                } else {
                    delete newSkin.borderWidth
                }
            }
        },
        getBorders : function (values) {
            return {
                color : "grey",
                style : "solid",
                topWidth : values.top,
                bottomWidth : values.bottom,
                leftWidth : values.left,
                rightWidth : values.right
            };
        },

        runTemplateTest : function () {

            this._performScenario();

            for (var i = 1; i < this._sclasses.length; i++) {
                this._data.sclass = this._sclasses[i];
                this._currentScenario = i;
                this._performScenario();
            }
            this.end()
        },

        _performScenario : function () {
            this._data.orientation = "horizontal";
            aria.utils.Json.setValue(this._data, "size1", 100);
            this._performTest();
            aria.utils.Json.setValue(this._data, "size1", 200);
            this._performTest();
            this._data.orientation = "vertical";
            aria.utils.Json.setValue(this._data, "size1", 100);
            this.templateCtxt.$refresh();
            this._performTest();
            aria.utils.Json.setValue(this._data, "size1", 200);
            this._performTest();
        },

        _performTest : function () {
            var actual = this._getRealMeasures();
            var expected = this._getExpectedMeasures();
        },

        _getRealMeasures : function () {
            var instance = this.getWidgetInstance("splitter");
            var fullSplitter = instance._domElt;
            var splitBar = instance._splitBar;
            var splitBarProxy = instance._splitBarProxy;
            var panel1 = instance._splitPanel1;
            var panel2 = instance._splitPanel2;
            var output = {
                container : this._getStyleProperties(fullSplitter),
                panel1 : this._getStyleProperties(panel1),
                panel2 : this._getStyleProperties(panel2),
                separator : this._getStyleProperties(splitBar),
                separatorProxy : this._getStyleProperties(splitBarProxy)
            };
            output.separator.top = aria.utils.Dom.getStylePx(splitBar, "top", 0);
            output.separator.left = aria.utils.Dom.getStylePx(splitBar, "left", 0);
            output.separatorProxy.top = aria.utils.Dom.getStylePx(splitBarProxy, "top", 0);
            output.separatorProxy.left = aria.utils.Dom.getStylePx(splitBarProxy, "left", 0);
        },

        _getStyleProperties : function (element) {
            var dom = aria.utils.Dom;
            return {
                width : dom.getStylePx(element, "width"),
                height : dom.getStylePx(element, "height"),
                border : {
                    top : dom.getStylePx(element, "borderTopWidth", 0),
                    bottom : dom.getStylePx(element, "borderBottomWidth", 0),
                    left : dom.getStylePx(element, "borderLeftWidth", 0),
                    right : dom.getStylePx(element, "borderRightWidth", 0)
                }
            };

        },
        _getExpectedMeasures : function () {
            var borders = this.borders[this._sclasses[this._currentScenario]], data = this._data;
            var output = {};

            var borderWidth = borders.container.width || borders.container.width == 0;
            output.container = {
                width : data.width,
                height : data.height,
                border : {
                    top : borderWidth ? borders.container.width : borders.container.top,
                    bottom : borderWidth ? borders.container.width : borders.container.bottom,
                    left : borderWidth ? borders.container.width : borders.container.left,
                    right : borderWidth ? borders.container.width : borders.container.right
                }
            };

            output.panel1 = {
                border : {
                    top : borders.panel.top,
                    bottom : borders.panel.bottom,
                    left : borders.panel.left,
                    right : borders.panel.right
                }
            };
            output.panel2 = {
                border : output.panel1.border
            };
            output.separator = {
                border : {
                    top : borders.separator.top,
                    bottom : borders.separator.bottom,
                    left : borders.separator.left,
                    right : borders.separator.right
                }
            };

            var container = output.container;
            var panel1 = output.panel1;
            var panel2 = output.panel2;
            if (data.orientation == "vertical") {
                panel1.height = container.height - container.border.top - container.border.bottom - panel1.border.top
                        - panel1.border.bottom;
                panel2.height = panel1.height;
            }
            // Many things missing
        }

    }
});