"use strict";
!function (g) {

	var parent = document.getElementsByClassName('result');

	if (!parent.length) return;

	function test(obj) {
		var s = "";

		for (var o in obj) {
			s += "<td>" + o + "</td>";
			if (typeof obj[o] !== 'undefined') {
				s += '<td class="true">support</td>';
			} else {
				s += '<td class="false">not support</td>';
			}
		}

		return s;
	}

	var items = [
		{ 'localStorage': g.localStorage },
		{ 'sessionStorage': g.sessionStorage },
		{ 'Array.prototype.forEach': Array.prototype.forEach },
		{ 'Array.prototype.some': Array.prototype.some },
	];

	for (var i = 0; i < items.length; i++) {
		var div = document.createElement('tr');
		div.innerHTML = test(items[i]);
		parent.item(0).appendChild(div);
	}
	console.log('OK');

} (this);