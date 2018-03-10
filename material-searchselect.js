/**
 * Material design searchable multiselect component
 * @version v1.0.0
 * @copyright 2018 Peter Kuti
 */

(() => {
    "use strict";

    let Searchselect = function(element, options){
        if (!(this instanceof Searchselect)) {
            return new Searchselect(element, options);
        }

        this.configuration = Object.assign(this.defaults, options);
        this.configuration.isMultiselect = this.checkMultiselect(element);

        this.initialize(element);
    }

    Searchselect.prototype = {
        defaults: {
            separator: ",",
            showCheckboxes: false
        },

        initialize: function(element) {
            this.applySearchselect(element);
        },

        checkMultiselect: function (element) {
            return Boolean($(element).find("select").attr("multiple"));
        },

        applySearchselect: function(selectElement) {
            let container = this.initializeDisplay(selectElement);

            helpers.setOptionsHeight(container);
            this.setSelectWidth(selectElement, container);
            this.handleVisibility(container);

            this.subscribeOptionSelected(selectElement);
            this.subscribeForSearch(container);
        },

        initializeDisplay: function(selectElement) {
            let container =
                $("<div class='searchselect-container'>" +
                    "<div class='searchselect-input'>" +
                    "<div>" +
                    "<label class='searchselect-label'></label>" +
                    "</div>" +
                    "<div class='searchselect-labelcontainer'>" +
                    "<label class='searchselect-datalabel searchselect-inner-input'>" +
                    "<input type='text' class='searchselect-search' />" +
                    "<i class='searchselect-dropdown-icon material-icons'>keyboard_arrow_down</i>" +
                    "</label>" +
                    "</div>" +
                    "</div>" +
                    "</div>");

            let optionsList = $("<ul class='searchselect-options'></ul>");
            let originalOptions = $(selectElement).find("option");
            let hasCheckbox = this.configuration.showCheckboxes
                ? "has-checkbox"
                : "";

            $.each(originalOptions,
                function(optionIndex, option) {
                    optionsList
                        .append($(
                            `<li class='searchselect-option ${hasCheckbox}' data-val='${option.value}'>${option.text}
                             </li>`));
                });

            container.find(".searchselect-input").append(optionsList);
            let originalLabel = $(selectElement).children(".searchselect-label");
            originalLabel.hide();
            container.find(".searchselect-label").text(originalLabel.text());

            $(selectElement).find("select").hide();
            $(selectElement).append(container);

            return container;
        },

        setSelectWidth: function(selectElement, container) {
            if ($(selectElement).width()) {
                container.width($(selectElement).width());
                container.find(".searchselect-input").width($(selectElement).width());
            } else {
                container.width(300);
            }
        },

        handleVisibility: function(container) {
            let searchField = container.find(".searchselect-input .searchselect-search");
            searchField.focus(function() {
                $(this).closest(".searchselect-container").addClass("is-focused");
                $(this).closest(".searchselect-container").find(".searchselect-options").addClass("is-visible");
            });
            searchField.blur(function() {
                $(this).closest(".searchselect-container").removeClass("is-focused");
                $(this).closest(".searchselect-container").find(".searchselect-options").removeClass("is-visible");
            });
            searchField.keyup(function() {
                helpers.handleInputIsDirty(this);
            });

            container.find(".searchselect-input").on("click",
                function() {
                    $(this).find(".searchselect-search").focus();
                });
            container.find(".searchselect-dropdown-icon").on("click",
                function(event) {
                    if ($(this).hasClass("is-open")) {
                        $(this).removeClass("is-open");
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    } else {
                        $(this).addClass("is-open");
                    }
                });
        },
        
        subscribeOptionSelected: function (selectElement) {
            let separator = this.configuration.separator;
            let isMultiselect = this.configuration.isMultiselect;

            $(".searchselect-option").on("mousedown",
                function () {
                    if (isMultiselect) {
                        onSelectMultiple($(this));
                    } else {
                        onSelectSingle($(this));
                    }
                    alignDisplay($(this));
                    clearInput();
                });

            function onSelectMultiple(currentOption) {
                if (currentOption.hasClass("selected")) {
                    onDeselection(currentOption);
                } else {
                    onSelection(currentOption);
                }
                helpers.handleInputIsDirty(selectElement);
            }

            function onSelectSingle(currentOption) {
                let inputContainer = currentOption.closest(".searchselect-input");
                let labelContainer = inputContainer.find(".searchselect-labelcontainer");
                let prevSelectedOptions = inputContainer.find(".searchselect-option.selected");

                $.each(prevSelectedOptions,
                    function (optInd, option) {
                        onDeselection($(option));
                    });

                currentOption.addClass("selected");
                $(selectElement).find(`select > option[value=${$(currentOption).data("val")}]`)
                    .attr("selected", "selected");

                labelContainer
                    .prepend($(
                        `<label class="searchselect-selected searchselect-datalabel" data-val="${
                        currentOption.data("val")}">${currentOption.text()}</label>`));
            }

            function onDeselection(currentOption) {
                currentOption.removeClass("selected");
                $(selectElement).find(`select > option[value=${$(currentOption).data("val")}]`).removeAttr("selected");

                let relatedLabel = currentOption.closest(".searchselect-input")
                    .find(".searchselect-labelcontainer .searchselect-selected").filter(function(optIndex, option) {
                        return $(option).data("val") === currentOption.data("val");
                    });
                relatedLabel.remove();
            }

            function onSelection(currentOption) {
                currentOption.addClass("selected");
                $(selectElement).find(`select > option[value=${$(currentOption).data("val")}]`)
                    .attr("selected", "selected");

                placeOrRemoveLabel(currentOption);
            }

            function placeOrRemoveLabel(currentOption) {
                let previousOptions = $(currentOption.prevAll());
                if (previousOptions.length) {
                    $.each(previousOptions,
                        function(optionIndex, prevOption) {
                            if ($(selectElement).find("select").val().includes($(prevOption).data("val"))) {
                                insertAfterPrevious(prevOption);
                                return false;
                            } else if (optionIndex === previousOptions.length - 1) {
                                insertToFirstPosition();
                                return false;
                            }
                            return true;
                        });
                } else {
                    insertToFirstPosition();
                }

                function insertAfterPrevious(prevOption) {
                    currentOption.closest(".searchselect-input")
                        .find(".searchselect-labelcontainer .searchselect-selected")
                        .filter(function(labelIndex, label) {
                            return $(label).data("val") === $(prevOption).data("val");
                        })
                        .after($(
                            `<label class="searchselect-selected searchselect-datalabel" data-val="${
                            currentOption.data("val")}">${currentOption.text()}</label>`));
                }

                function insertToFirstPosition() {
                    currentOption.closest(".searchselect-input")
                        .find(".searchselect-labelcontainer")
                        .prepend($(
                            `<label class="searchselect-selected searchselect-datalabel" data-val="${
                            currentOption.data("val")}">${currentOption.text()}</label>`));
                }
            }

            function alignDisplay(currentOption) {
                let inputDiv = currentOption.closest(".searchselect-input");
                let selectedLabels = inputDiv.find(".searchselect-labelcontainer .searchselect-selected");
                let searchInput = inputDiv.find(".searchselect-inner-input");
                let lastOptInPrevLine = -1;
                let currentLineWidth = 0;

                // calculate input size and which labels are not last line (no border for them)
                $.each(selectedLabels,
                    function(labelIndex, label) {
                        if (labelIndex < selectedLabels.length - 1) {
                            helpers.insertSeparator(label, separator);
                        }
                        currentLineWidth += $(label).outerWidth();
                        if (currentLineWidth > inputDiv.outerWidth()) {
                            // new line created
                            currentLineWidth = $(label).outerWidth();
                            lastOptInPrevLine = labelIndex - 1;
                        }
                    });

                resizeInput();
                setPreviousRows();
                relocateOptionsDropdown();

                function resizeInput() {
                    // input has minimal width to consider
                    if (inputDiv.outerWidth() - currentLineWidth < parseInt(searchInput.css("min-width"), 10)) {
                        searchInput.width(inputDiv.outerWidth());
                        lastOptInPrevLine = selectedLabels.length - 1;
                    } else {
                        searchInput.width(inputDiv.outerWidth() - currentLineWidth);
                    }
                }

                function setPreviousRows() {
                    $.each(selectedLabels,
                        function(labelIndex, label) {
                            if (labelIndex <= lastOptInPrevLine) {
                                $(label).addClass("searchselect-previous-row");
                            } else {
                                $(label).removeClass("searchselect-previous-row");
                            }
                        });
                }

                function relocateOptionsDropdown() {
                    let optionsUl = inputDiv.find(".searchselect-options");
                    optionsUl.css("top", inputDiv.outerHeight() - parseInt(inputDiv.css("padding-bottom"), 10) + "px");
                }
            }

            function clearInput() {
                let inputField = $(selectElement).find(".searchselect-search");
                inputField.val("");
                inputField.trigger("keyup");
            }
        },

        subscribeForSearch: function(container) {
            container.find(".searchselect-search").keyup(function() {
                let inputField = $(this);
                let exp = $(this).val().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                var rex = new RegExp(exp, "i");
                inputField.closest(".searchselect-input").find(".searchselect-option").hide();
                inputField.closest(".searchselect-input").find(".searchselect-option").filter(
                    function(optionIndex, option) {
                        return rex.test($(option).text());
                    }).show();
                helpers.setOptionsHeight(container);
            });
        }
    }
    
    class helpers {
        static handleInputIsDirty(element) {
            let selectElement = $(element).closest(".searchselect");
            let isDirty = $(selectElement).find("select").val().length ||
                $(selectElement).find(".searchselect-search").val();

            if (isDirty) {
                $(selectElement).find(".searchselect-container").addClass("is-dirty");
            } else {
                $(selectElement).find(".searchselect-container").removeClass("is-dirty");
            }
        }

        static setOptionsHeight(container) {
            container.find(".searchselect-options").height((container.find(".searchselect-option:visible").length * 48));
        }

        static insertSeparator(label, separator) {
            let exp = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            let regEx = new RegExp(exp, "i");

            $(label).text(`${$(label).text().trim().replace(regEx, "")}${separator}`);
        }
    }
    
    // NPM, AMD, and wndow support
    if ("undefined" !== typeof module && !!module && !!module.exports) {
        module.exports = Searchselect;
    } else if (typeof define === "function" && define.amd) {
        define([], function () {
            return Searchselect;
        });
    } else {
        window.searchselect = Searchselect;
    }

    var jQuery = window.jQuery;
    // Support jQuery
    if (jQuery !== undefined) {
        jQuery.fn.searchselect = function () {
            var args = Array.prototype.slice.call(arguments);
            return jQuery(this).each(function () {
                if (!args[0] || typeof args[0] === "object") {
                    new Searchselect(this, args[0] || {});
                } else if (typeof args[0] === "string") {
                    Searchselect.prototype[args[0]].apply(new Searchselect(this), args.slice(1));
                }
            });
        };
    }
})();