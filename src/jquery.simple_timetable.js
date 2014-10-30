/*!
 * jQuery SimpleTimetable Plugin v1.0.0
 * https://github.com/criticalbreak5/simple_timetable
 *
 * Includes jquery.simple_table.js
 * https://github.com/criticalbreak5/simple_table
 *
 * Includes jquery.simple_dateformat.js
 * https://github.com/criticalbreak5/simple_dateformat
 *
 * Copyright 2014 criticalbreak5's
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 2014-10-31T00:00Z
 */
(
	function($) {
		$.fn.simple_timetable = function(options) { // $.fn === $.prototype

			var currentDate = new Date();
			var defaults = {
				"col-headers-override-height":"40px", 
				"row-headers-override-width" :"100px", 
				"start-date"                 :currentDate, 
				"interval"                   :"d", // w/d/H/m/s
				"data"                       :[]
			};
			options = $.extend(defaults, options);
			options["ruled-line-border-style"] = "solid";
			options["ruled-line-border-width"] = "1px";

			switch(options["interval"]) {
				case 's':
					options["start-date"] = resetTime(options["start-date"], "yyyyMMddHHmmss", "000");
					break;
				case 'm':
					options["start-date"] = resetTime(options["start-date"], "yyyyMMddHHmm", "00000");
					break;
				case 'H':
					options["start-date"] = resetTime(options["start-date"], "yyyyMMddHH", "0000000");
					break;
				case 'd':
					options["start-date"] = resetTime(options["start-date"], "yyyyMMdd", "000000000");
					break;
				default:
					options["start-date"] = resetTime(options["start-date"], "yyyyMMdd", "000000000");
			}

			if (!(options["end-date"])) {
				options["end-date"] = new Date(options["start-date"].getTime());
				switch(options["interval"]) {
					case 's':
						options["end-date"].setSeconds(options["end-date"].getSeconds() + 30);   // +30seconds
						break;
					case 'm':
						options["end-date"].setMinutes(options["end-date"].getMinutes() + 30);   // +30minutes
						break;
					case 'H':
						options["end-date"].setHours(options["end-date"].getHours() + 30);       // +30hours
						break;
					case 'd':
						options["end-date"].setDate(options["end-date"].getDate() + 30);         // +30days
						break;
					default:
						options["end-date"].setDate(options["end-date"].getDate() + 210);        // +210days
				}
			}

			if (!(options["col-headers-format"])) {
				switch(options["interval"]) {
					case 's':
						options["col-headers-format"] = "yyyy/MM/dd<br />HH:mm:ss";
						break;
					case 'm':
						options["col-headers-format"] = "yyyy/MM/dd<br />HH:mm:00";
						break;
					case 'H':
						options["col-headers-format"] = "yyyy/MM/dd<br />HH:00:00";
						break;
					case 'd':
						options["col-headers-format"] = "<br />yyyy/MM/dd";
						break;
					default:
						options["col-headers-format"] = "<br />yyyy/MM/dd";
				}
			}

			return this.each(function() {
				main(this);
			});

			function main(target) {

				$(target).empty();

				var col_headers = [];
				var buffer_date = new Date(options["start-date"].getTime());
				var end_date    = options["end-date"];
				while (buffer_date.getTime() < end_date.getTime()) {
					var col_header = $.simple_dateformat(buffer_date, options["col-headers-format"]);
					col_headers.push(col_header);
					switch(options["interval"]) {
						case 's':
							buffer_date.setSeconds(buffer_date.getSeconds() + 1);
							break;
						case 'm':
							buffer_date.setMinutes(buffer_date.getMinutes() + 1);
							break;
						case 'H':
							buffer_date.setHours(buffer_date.getHours() + 1);
							break;
						case 'd':
							buffer_date.setDate(buffer_date.getDate() + 1);
							break;
						default:
							buffer_date.setDate(buffer_date.getDate() + 7);
					}
				}
				options["cols"] = col_headers.length;
				options["col-headers"] = col_headers;

				//$(target).css({ "position":"relative" });
				$(target).simple_table(options);
				$("#" + options["top-left-header-id"]).css({ "height":options["col-headers-override-height"] });
				var i = 1;
				while ($("#" + options["col-headers-id-prefix"] + String(i)).size() != 0) {
					$("#" + options["col-headers-id-prefix"] + String(i)).css({ "height":options["col-headers-override-height"] });
					i++;
				}
				$("#" + options["top-left-header-id"]).css({ "width":options["row-headers-override-width"] });
				i = 1;
				while ($("#" + options["row-headers-id-prefix"] + String(i)).size() != 0) {
					$("#" + options["row-headers-id-prefix"] + String(i)).css({ "width":options["row-headers-override-width"] });
					i++;
				}

				var css = {
					"position"     :"absolute",
					"height"       :options["ruled-line-height"],
					"overflow"     :"hidden",
					"white-space"  :"nowrap",
					"text-overflow":"ellipsis",
					"border-style" :options["ruled-line-border-style"],
					"border-width" :options["ruled-line-border-width"]
				};
				var first_date    = new Date(options["start-date"].getTime());
				var last_date     = new Date(buffer_date.getTime());
				var base_top      = extractionNumber(options["col-headers-override-height"]);
				var base_left     = extractionNumber(options["row-headers-override-width"]);
				var col_px        = extractionNumber(options["ruled-line-width"]);
				var col_border_px = extractionNumber(options["ruled-line-border-width"]);
				var row_border_px = extractionNumber(options["ruled-line-border-width"]);
				var px_per_row    = extractionNumber(options["ruled-line-height"]);
				var total_second  = (last_date.getTime() - first_date.getTime()) / 1000;
				var total_px      = col_px * options["cols"];
				var second_per_px = total_second / total_px;
				var data = options["data"];
				var sequential_number = 0;
				for (var i = 0; i < data.length; i++) { // layer
					for (var ii = 0; ii < data[i].length; ii++) { // row
						for (var iii = 0; iii < data[i][ii].length; iii++) { // data
							sequential_number++;
							if (data[i][ii][iii]["end-date"].getTime() <= first_date.getTime() || last_date.getTime() <= data[i][ii][iii]["start-date"].getTime()) {
								continue;
							}
							var data_options = {};
							data_options = $.extend(data[i][ii][iii], data_options);
							var data_defaults = {
								"id"              :"data_id_" + String(sequential_number),
								"title"           :"",
								"color"           :"#000000",
								"background-color":"#FFFFFF",
								"border-color"    :"#000000",
								"box-shadow"      :"0px 0px 0px 0px rgba(0, 0, 0, 0)"
							};
							var adjust_start_time = adjustStartTime(data_options["start-date"], first_date);
							var adjust_end_time   = adjustEndTime(data_options["end-date"], last_date);
							var width             = ((adjust_end_time.getTime() - adjust_start_time.getTime()) / 1000 / second_per_px);
							width                 = Math.ceil(width + (width / col_px * col_border_px - col_border_px));
							var top               = (base_top + (px_per_row * ii) + (row_border_px * ii));
							var left              = (base_left + ((adjust_start_time.getTime() - first_date.getTime()) / 1000 / second_per_px));
							left                  = Math.floor(left + (left / col_px * col_border_px - col_border_px));
							var extra_css = {
								"width":width + "px",
								"top"  :top   + "px",
								"left" :left  + "px"
							}
							data_options = $.extend(data_defaults, data_options);
							generateDiv(target, data_options["id"], data_options["title"], [ css, extra_css, { "color" : data_options["color"], "background-color" : data_options["background-color"], "border-color" : data_options["border-color"], "box-shadow" : data_options["box-shadow"] } ]);
						}
					}
				}
			};

			function resetTime(date, leave_format, reset_time) {
				return $.simple_dateparse($.simple_dateformat(date, leave_format) + reset_time, "yyyyMMddHHmmssSSS");
			};
			function extractionNumber(org) {
				return Number(org.split("px").join(""));
			};
			function adjustStartTime(start_date, first_date) {
				if (start_date.getTime() < first_date.getTime()) {
					return first_date;
				} else {
					return start_date;
				}
			}
			function adjustEndTime(end_date, last_date) {
				if (last_date.getTime() < end_date.getTime()) {
					return last_date;
				} else {
					return end_date;
				}
			}
			function generateDiv(target, id, title, css) {
				$(target).append("<div id='" + id + "' title='" + title + "'>" + title + "</div>");
				for (var i = 0; i < css.length; i++) {
					$('#' + id).css(css[i]);
				}
			};
		};
})(jQuery);
