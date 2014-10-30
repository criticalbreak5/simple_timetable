/*!
 * jQuery SimpleTable Plugin v1.0.1
 * https://github.com/criticalbreak5/simple_table
 *
 * Copyright 2014 criticalbreak5's
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 2014-08-25T00:00Z
 */
(
	function($) {
		$.fn.simple_table = function(options) { // $.fn === $.prototype

			var defaults = {
				"cols":"10", 
				"col-headers":[], 
				"col-headers-id-prefix":"col_headers_id_", 
				"col-headers-text-align":"left", 
				"col-headers-color":"#000000", 
				"col-headers-background-color":"#FFFFFF", 
				"rows":"10", 
				"row-headers":[], 
				"row-headers-id-prefix":"row_headers_id_", 
				"row-headers-text-align":"left", 
				"row-headers-color":"#000000", 
				"row-headers-background-color":"#FFFFFF", 
				"top-left-header":"",
				"top-left-header-id":"top_left_header_id",  
				"top-left-header-text-align":"left", 
				"top-left-header-color":"#000000", 
				"top-left-header-background-color":"#FFFFFF", 
				"cell-data":[],
				"cells-id-prefix":"cells_id_", 
				"cells-text-align":"left", 
				"cells-color":"#000000", 
				"cells-background-color":"#FFFFFF", 
				"ruled-line-border-color":"#000000", 
				"ruled-line-border-style":"solid", 
				"ruled-line-border-width":"1px",
				"ruled-line-width":"100px", 
				"ruled-line-height":"20px"
			};
			options = $.extend(defaults, options);

			return this.each(function() {
				core(this);
			});
			function core(target) {
				var css = {
					"float":"left", 
					"margin":"0px", "margin-left":"-1px", "margin-top":"-1px", 
					"border-color":options["ruled-line-border-color"], "border-style":options["ruled-line-border-style"], "border-width":options["ruled-line-border-width"], 
					"width":options["ruled-line-width"], "height":options["ruled-line-height"], "line-height":options["ruled-line-height"], 
					"overflow":"hidden", "white-space":"nowrap", "text-overflow":"ellipsis"
				};
				var dummy_css = {
					"clear":"left"
				};
				for (var row = 0; row < options["rows"]; row++) {
					if (row == 0) {
						for (var col_header = 0; col_header < options["col-headers"].length; col_header++) {
							if (col_header == 0 && options["row-headers"].length != 0) {
								generateDiv(target, options["top-left-header-id"], options["top-left-header"], [css, { "text-align":options["top-left-header-text-align"], "color":options["top-left-header-color"], "background-color":options["top-left-header-background-color"] }]);
							}
							generateDiv(target, options["col-headers-id-prefix"] + (col_header + 1), options["col-headers"][col_header], [css, { "text-align":options["col-headers-text-align"], "color":options["col-headers-color"], "background-color":options["col-headers-background-color"] }]);
						}
						generateDiv(target, options["col-headers-id-prefix"] + row + "-" + "dummy", "", [dummy_css]);
					}
					for (var col = 0; col < options["cols"]; col++) {
						if (col == 0 && options["row-headers"].length != 0) {
							generateDiv(target, options["row-headers-id-prefix"] + (row + 1), options["row-headers"][row], [css, { "text-align":options["row-headers-text-align"], "color":options["row-headers-color"], "background-color":options["row-headers-background-color"] }]);
						}
						generateDiv(target, options["cells-id-prefix"] + (col + 1) + "-" + (row + 1), findData(options["cell-data"], col, row), [css, { "text-align":options["cells-text-align"], "color":options["cells-color"], "background-color":options["cells-background-color"] }]);
					}
					generateDiv(target, options["cells-id-prefix"] + row + "-" + "dummy", "", [dummy_css]);
				}
			};
			function generateDiv(target, id, text, css) {
				$(target).append("<div id='" + id + "'>" + text + "</div>");
				for (var i = 0; i < css.length; i++) {
					$('#' + id).css(css[i]);
				}
			};
			function findData(cell_data, col, row) {
				if (!cell_data || !cell_data[row] || !cell_data[row][col]) {
					return "";
				}
				return cell_data[row][col];
			};
		};
})(jQuery);
