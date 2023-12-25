function IsArray(obj) {
	return obj &&
		typeof obj === 'object' && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
}

function Process(json) {
	if (json == '') { return '' }
	return ProcessObject(json, 0, false, false, false);
}

function ProcessObject(obj, indent, addComma, isArray, isPropertyContent) {
	let html = "";
	let comma = (addComma) ? "<span class='Comma'>,</span> " : "";
	let type = typeof obj;
	if (IsArray(obj)) {
		if (obj.length == 0) {
			html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>" + comma, isPropertyContent);
		} else {
			html += GetRow(indent, "<span class='ArrayBrace sectionTag sectionTagBefore'>[</span><i>", isPropertyContent);
			for (let i = 0; i < obj.length; i++) {
				html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
			}
			html += GetRow(indent, `</i><label>${obj.length}</label><span class='ArrayBrace sectionTag'>]</span>` + comma);
		}
	} else {
		if (type == "object" && obj == null) {
			html += FormatLiteral("null", "", comma, indent, isArray, "Null");
		} else {
			if (type == "object") {
				let numProps = 0;
				for (let prop in obj) {
					numProps++;
				}
				if (numProps == 0) {
					html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>" + comma, isPropertyContent)
				} else {
					html += GetRow(indent, "<span class='ObjectBrace sectionTag sectionTagBefore'>{</span><i>", isPropertyContent);
					let j = 0;
					for (let prop in obj) {
						html += GetRow(indent + 1, '<span class="PropertyName">"' + prop + '"</span>: ' + ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true))
					}
					html += GetRow(indent, "</i><label>...</label><span class='ObjectBrace sectionTag'>}</span>" + comma);
				}
			} else {
				if (type == "number") {
					html += FormatLiteral(obj, "", comma, indent, isArray, "Number");
				} else {
					if (type == "boolean") {
						html += FormatLiteral(obj, "", comma, indent, isArray, "Boolean");
					} else {
						if (type == "function") {
							obj = FormatFunction(indent, obj);
							html += FormatLiteral(obj, "", comma, indent, isArray, "Function");
						} else {
							if (type == "undefined") {
								html += FormatLiteral("undefined", "", comma, indent, isArray, "Null");
							} else {
								html += FormatLiteral(obj, '"', comma, indent, isArray, "String");
							}
						}
					}
				}
			}
		}
	}
	return html;
};

window.TAB = "    ";

function FormatLiteral(literal, quote, comma, indent, isArray, style) {
	if (typeof literal == "string") {
		literal = literal.split("<").join("&lt;").split(">").join("&gt;");
	}
	let str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
	if (isArray) {
		str = GetRow(indent, str);
	}
	return str;
}

function FormatFunction(indent, obj) {
	let tabs = "";
	for (let i = 0; i < indent; i++) {
		tabs += window.TAB;
	}
	let funcStrArray = obj.toString().split("\n");
	let str = "";
	for (let i = 0; i < funcStrArray.length; i++) {
		str += ((i == 0) ? "" : tabs) + funcStrArray[i] + "\n";
	}
	return str;
}

function GetRow(indent, data, isPropertyContent) {
	let tabs = "";
	for (let i = 0; i < indent && !isPropertyContent; i++) {
		tabs += window.TAB;
	}
	if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n") {
		data = data + "\n";
	}
	return tabs + data;
};