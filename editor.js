/*
    WYSIWYG on-line editor in JavaScript
    Copyright (C) 2007  Alexandre Joseph <http://www.alexandrejoseph.com/>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

IE  = window.ActiveXObject ? true : false;

function iniEditor() {
	if(IE)  edoc = window.frames['editor'].document;
	else edoc = document.getElementById('editor').contentDocument;
  
	if(edoc.designMode != 'On') edoc.designMode = 'On';
  	
	if(!edoc.body)
		setTimeout('iniEditor()',20);
	else
		edoc.body.innerHTML = document.getElementById('editorTextarea').value;
}


function setContent(action, data) {
	if(IE) {
		ewin = window.frames['editor'];
		edoc = ewin.document;
	}
	else {
		ewin = document.getElementById('editor').contentWindow;
		edoc = document.getElementById('editor').contentDocument;
  	}
	
	switch (action) {
		case 'createLink' :
			var url = prompt('Entrer l\'URL du lien', 'http://');
			
			if (url != null && url != '' && url != 'http://') {
				edoc.execCommand(action, false, url); 
				ewin.focus();
			}
		break;

		case 'insertImage' :
			var imageUrl = prompt('Entrer l\'URL de l\'image : ', 'http://');
			
			if (imageUrl != null && imageUrl != '') {
				var imageAlt = prompt('Texte alternatif de l\'image : ');
				
				if (imageAlt != null && imageAlt != '') {
					edoc.execCommand('insertHTML', false, '<img src="'+imageUrl+'" alt="'+imageAlt+'" />'); 
					ewin.focus();
				}
			}
		break;

		case 'foreColor' :
			if (data == 'other') {	
				var foreColor = prompt('Entrer la couleur Hexadecimal du texte : ', '#');
				
				if (foreColor != null && foreColor != '' && foreColor != '#') {
					edoc.execCommand(action, false, foreColor);
					ewin.focus();
				}
			}

			edoc.execCommand(action, false, data);
			ewin.focus();
		break;
		
		default : 
			edoc.execCommand(action, false, data); 
			ewin.focus();
	}
}

function getEditorContent() {
	if(IE)  edoc = window.frames['editor'].document;
  	else edoc = document.getElementById('editor').contentDocument;

	document.getElementById('editorTextarea').value = edoc.body.innerHTML;
  	//alert(document.getElementById('editorTextarea').value);
}

