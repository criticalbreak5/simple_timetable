/*!
 * jQuery SimpleChoices Plugin v1.0.2
 * https://github.com/criticalbreak5/simple_choices
 *
 * Copyright 2014 criticalbreak5's
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 2014-11-10T00:00Z
 */
(
	function($) {
		$.fn.simple_choices = function(options) { // $.fn === $.prototype

			var defaults = {
				"control-type":"", 
				"control-id":"control_id", 
				"choices":{}, 
				"value":[], 
				"read-only":"false", 
				"option-html":""
			};
			options = $.extend(defaults, options);

			return this.each(function() {
				main(this);
			});
			function main(target) {
				var value = {};
				for (var i = 0; i < options["value"].length; i++) {
					value[options["value"][i]] = "true";
				}
				if (options["control-type"] == "select") {
					generateSelect(target, options["control-id"], options["choices"], value, parseReadOnly(options["read-only"]));
				} else if (options["control-type"] == "checkbox") {
					generateCheckboxOrRadio(true,  target, options["control-id"], options["choices"], value, parseReadOnly(options["read-only"]));
				} else if (options["control-type"] == "radio") {
					generateCheckboxOrRadio(false, target, options["control-id"], options["choices"], value, parseReadOnly(options["read-only"]));
				}
			};
			function parseReadOnly(read_only) {
				return read_only == "true" ? true : false;
			};
			function generateSelect(target, selectId, choices, value, isReadOnly) {
				var css = {
					"color":"#808080"
				};
				var html = [];
				html.push("<select id='" + selectId + "' name='" + selectId + "'");
				html.push(">");
				for (var choice in choices) {
					html.push("<option id='" + selectId + "-" + choice + "' value='" + choice + "'");
					if (value[choice] && value[choice] == "true") {
						html.push(" selected='selected'");
					}
					if (isReadOnly) {
						html.push(" disabled='disabled'");
					}
					html.push(">" + choices[choice] + "</option>");
				}
				html.push("</select>");
				$(target).html(html.join(""));
			};
			function generateCheckboxOrRadio(isCheckbox, target, checkboxOrRadioId, choices, value, isReadOnly) {
				var css = {
					"color":"#808080"
				};
				var html = [];
				var control_type;
				if (isCheckbox) {
					control_type = "checkbox";
				} else {
					control_type = "radio";
				}
				for (var choice in choices) {
					html.push("<input type='" + control_type + "' id='" + checkboxOrRadioId + "-" + choice + "' name='" + checkboxOrRadioId + "' value='" + choice + "'");
					if (value[choice] && value[choice] == "true") {
						html.push(" checked='checked'");
					}
					if (isReadOnly) {
						html.push(" disabled='disabled'");
					}
					html.push("></input>");
					html.push("<label id='" + checkboxOrRadioId + "-" + choice + "-label' for='" + checkboxOrRadioId + "-" + choice + "'>" + choices[choice] + "</label>");
					html.push(options["option-html"]);
				}
				$(target).html(html.join(""));
				for (var choice in choices) {
					if (isReadOnly) {
						$('#' + checkboxOrRadioId + "-" + choice + "-label").css(css);
					}
				}
			};
		};
})(jQuery);
