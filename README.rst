Créer un éditeur WYSIWYG en JavaScript
======================================

Créer un éditeur WYSIWYG en JavaScript
--------------------------------------

De plus en plus de personnes souhaitent se faire une place sur le web en
créant leur propre blog ou site. Il existe d’ailleur de nombreux outils
permettant de réaliser cette tache plus ou moins facilement. Il n’est
donc plus nécessaire de connaitre le moindre langage informatique pour
créer un site web.

Partant de ce constat, il a fallu créer des éditeurs de texte riches
permettant de formater un texte pour une personne ne maitrisant pas la
syntaxe HTML, BBCode ou encore Wiki.
 Ces éditeurs permettant de composer visuellement le résultat escompté
sont appelés WYSIWYG de l’acronyme anglais “What You See Is What You
Get” qui littéralement se traduirait “ce que vous voyez est ce que vous
obtenez”.

Pour fournir ce genre d’outils il existe différents moyens technique
tels que les applets Java, Flash ou encore JavaScript.
 Chaque solution a ses avantages et ses inconvénients:

-  Les deux premières méthodes citées sont basées sur des plugins et ont
   donc pour avantage de fonctionner sur la plupart des systèmes et
   indépendamment de ceux-ci, c’est à dire que le code n’aura pas à être
   adapté suivant l’environnement d’exécution. Malheureusement ces
   méthodes deviennent assez complexes à mettre en œuvre si l’on veut
   étendre les fonctions de base pour, par exemple, permettre
   l’insertion d’images.
-  À l’inverse un éditeur en JavaScript est plus dépendant de sa
   plateforme mais permet d’atteindre les fonctionnalités d’un
   traitement de texte tel qu’OpenOffice.org, le tout assez simplement.

Actuellement ces éditeurs ne fonctionnent qu’avec deux types de
navigateurs, ceux basés sur le moteur MSHTML (comme Internet Explorer)
ou ceux basés sur moteur Gecko (tel que Firefox, Mozilla ou SeaMonkey).
 Avec un navigateur comme Opéra ou Konqueror (ainsi que tous ceux basés
sur le moteur KHTML), l’éditeur fonctionnera mais de manière plus
limitée.

Pour la suite de cet article vous aurez besoin de quelques notions de
HTML et de JavaScript.

Définir le navigateur utilisé
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Si j’ai fait la distinction entre les différents types de navigateurs en
introduction c’est parce que la méthode utilisée pour déployer l’éditeur
sera différente suivant le moteur du navigateur.

On va donc commencer par définir quel type de navigateur est utilisé
pour consulter la page en testant une fonction propre à chaque
navigateur.
 Ces variables seront globales car elle nous servirons tout au long de
notre script.

::

        IE  = window.ActiveXObject ? true : false;
        MOZ = window.sidebar       ? true : false; 
        

Une zone de texte éditable
~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour réaliser notre éditeur, il nous faut rendre une zone de texte
éditable. Avec IE rien de plus simple, n’importe quelle balise fera
l’affaire mais avec Gecko les choses se compliquent, seul les IFrames
ont cette particularité là.

Nous allons donc créer une IFrame et rendre son contenu éditable grâce à
la propriété JavaScript designMode.
 Il faut veiller à bien identifier notre IFrame à l’aide d’un ID qui
nous servira dans notre code JavaScript.

::

        function iniEditor()
        {
            // Suivant le navigateur l'acces à la IFRAME est different
            if(IE)  edoc = window.frames['editor'].document;
            if(MOZ) edoc = document.getElementById('editor').contentDocument;
            
            // On peu prévenir l'utilisateur de l'incompatibilité de son navigateur
            if(!IE && !MOZ) {
                    alert("Votre navigateur n'est pas compatible avec ce système d'éditeur WYSIWYG !");
                    return;
            } 

            // Puis on active la propriété qui nous permettra d'éditer le contenu
            if(edoc.designMode != 'On') edoc.designMode = 'On';
        }
        

Notre code HTML pour le moment:

::

        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Éditeur WYSIWYG en ligne</title>
            <script type="text/javascript" src="./editor.js"></script>
        </head>
        <body>
            <iframe id="editor" onload="iniEditor();">
                Votre navigateur ne supporte pas les IFrames. Impossible de charger l'editeur WYSIWYG en ligne.
            </iframe>
        </body>
        </html>
        

Dès à présent vous pouvez saisir du texte dans votre IFrame mais pas le
mettre en page. Pour cela il va falloir créer les boutons adéquats.

Boutons de mise en forme
~~~~~~~~~~~~~~~~~~~~~~~~

Nos boutons de mise en forme seront de simples liens, images ou inputs
de type boutons qui appelleront notre fonction JavaScript.
 Cette fonction utilisera pour modifier la mise en forme de notre texte
la méthode execCommand de l’objet document du contenu éditable.

Là encore nous allons être obligé de faire une distinction entre les
navigateurs pour modifier le contenu.

::

        function setContent(action, data)
        {
            if(IE) {
                ewin = window.frames['editor'];
                edoc = ewin.document;
            }
            else {
                ewin = document.getElementById('editor').contentWindow;
                edoc = document.getElementById('editor').contentDocument;
            }

            edoc.execCommand(action, false, data); 
            ewin.focus();
        }

Notre fonction prend deux arguments qui sont l’action à réaliser et une
valeur optionnelle.
 La liste des actions possibles est disponible sur le `site de Microsoft`_ 
mais toutes ne sont pas supportées par le moteur Gecko, le
plus simple est de tester celles qui fonctionnent.

.. _site de Microsoft: http://msdn.microsoft.com/en-us/library/ms533049(VS.85).aspx

Prenons un exemple, si nous souhaitons mettre le texte sélectionné dans
l’éditeur en gras nous invoquerons la fonction setContent avec comme
action bold.

::

        setContent('bold');
        

Ici nous n’avons pas indiqué de valeur en plus de l’action mais si nous
avions voulu changer la taille de la police, l’action nous aurait permis
de définir ce que l’on veut faire (changer la taille du texte) et la
valeur indiquée serait la taille de la police souhaitée.

::

        setContent('fontSize', 5);
        

Nous allons étoffer notre code HTML pour ajouter les différents boutons
qui nous permettrons de modifier notre texte:

::

        <p>
            <input class="editButton" onclick="setContent('bold');" value="Gras" title="Gras" type="button" id="gras" />
            <input class="editButton" onclick="setContent('italic');" value="Italic" title="Italic" type="button" id="italic" />
            <input class="editButton" onclick="setContent('underline');" value="Souligné" title="Souligné" type="button" id="souligne" />
            <input class="editButton" onclick="setContent('unlink');" value="Supprimer un lien" title="Supprimer un lien" type="button" id="unlink" />
            <input class="editButton" onclick="setContent('justifyLeft');" value="Aligner à gauche" title="Aligner à gauche" type="button" id="gauche" />
            <input class="editButton" onclick="setContent('justifyCenter');" value="Centré" title="Centré" type="button" id="centre" />
            <input class="editButton" onclick="setContent('justifyRight');" value="Aligner à droite" title="Alignerà droite" type="button" id="droite" />
            <input class="editButton" onclick="setContent('justifyFull');" value="Justifier" title="Justifier" type="button" id="justifier" />
            <input class="editButton" onclick="setContent('strikeThrough');" value="Barr&eacute;" title="Barré" type="button" id="barre" />
            <input class="editButton" onclick="setContent('insertUnorderedList');" value="Liste à puce" title="Liste à puce" type="button" id="puce" />
            <input class="editButton" onclick="setContent('insertOrderedList')" value="Liste ordonné" title="Liste ordonné" type="button" id="ordre" />

            <select onchange="setContent('foreColor', this.value);this.selectedIndex=0;" name="color" id="color">
                <option value="none">Choisissez une couleur</option>
                <option value="black">Noir</option>
                <option value="white">Blanc</option>
                <option value="red">Rouge</option>
                <option value="blue">Bleu</option>
                <option value="yellow">Jaune</option>
                <option value="green">Vert</option>
            </select>

            <select onchange="setContent('fontSize', this.value);this.selectedIndex=0" name="size" id="size">
                <option value="none">Choisissez une taille</option>
                <option value="1">Minuscule</option>
                <option value="2">Petit</option>
                <option value="3">Normal</option>
                <option value="4">Gros</option>
                <option value="5">Grand</option>
                <option value="6">Tr&egrave;s grand</option>
                <option value="7">Enorme</option>
            </select>
        </p>

        <iframe id="editor" onload="iniEditor();">
            Votre navigateur ne supporte pas les IFrames. Impossible de charger l'editeur WYSIWYG en ligne.
        </iframe>

La liste d’actions est loins d’être exaustive, à vous de rajouter celles
dont vous avez besoin.

Fonctions avancées
~~~~~~~~~~~~~~~~~~

Vous avez peut être remarqué que dans le code précédent, il n’y avait
pas la possibilité d’ajouter de liens ou d’images ou encore que
l’utilisateur était contraint d’utiliser des couleurs prédéfinies.
 Ces fonctions demandent plus de paramètres, comme l’adresse de l’image
ou du lien à créer.

Pour obtenir toutes les informations manquantes rien de plus simple que
de les demander à l’utilisateur par le biais de la commande JavaScript
prompt().

Par exemple pour demander l’adresse du lien:

::

        var url = prompt('Entrer l\'URL du lien', 'http://');
        

Nous allons maintenant intégrer tout cela à notre commande setContent.
 Pour arriver à notre but, nous allons rajouter des conditions, qui
lorsque l’action envoyée est par exemple ajouter\_lien, le script
demande l’URL à l’utilisateur.

::

        function setContent(action, data)
        {
            // Le début reste le même
            if(IE) {
                ewin = window.frames['editor'];
                edoc = ewin.document;
            }
            else {
                ewin = document.getElementById('editor').contentWindow;
                edoc = document.getElementById('editor').contentDocument;
            }
            
            // On teste l'action avec un switch car 
            // la liste peut vite devenir très longue
            switch (action)
            {
                case 'createLink' :
                    var url = prompt('Entrer l\'URL du lien', 'http://');
                    
                    // On vérifie qu'on a bien tapé quelque chose
                    if (url != null && url != '' && url != 'http://') {
                        edoc.execCommand(action, false, url); 
                        ewin.focus();
                    }
                break;

                case 'insertImage' :
                    var imageUrl = prompt('Entrer l\'URL de l\'image : ', 'http://');
                    
                    if (imageUrl != null && imageUrl != '') {
                        var imageAlt = prompt('Texte alternatif de l\'image : ');
                        
                        // Nous allons directement insérer le code HTML d'une image
                        if (imageAlt != null && imageAlt != '') {
                            edoc.execCommand('insertHTML', false, '<img src="'+imageUrl+'" alt="'+imageAlt+'" />'); 
                            ewin.focus();
                        }
                    }
                break;

                case 'foreColor' :
                    if (data == 'other') {  // Si on choisi une couleur personnalisée
                        var foreColor = prompt('Entrer la couleur Hexadecimal du texte : ', '#');
                        
                        if (foreColor != null && foreColor != '' && foreColor != '#') {
                            edoc.execCommand(action, false, foreColor);
                            ewin.focus();
                        }
                    }

                    edoc.execCommand(action, false, data);
                    ewin.focus();
                break;
                
                // Si ce n'est pas une fonction personnalisée
                // on éxecute la commande par défaut
                default : 
                    edoc.execCommand(action, false, data); 
                    ewin.focus();
            }
        }

Rajoutons les boutons dans notre source HTML:

::

        <input class="editButton" onclick="setContent('insertImage');" value="&eacute;rer une Image" title="Ins&eacute;rer une image" type="button" id="image" />

        <input class="editButton" onclick="setContent('createLink');" value="Cr&eacute;er un lien" title="Cr&eacute;er un lien" type="button" id="lien" />

        <!-- le reste des boutons -->

        <!-- la liste des couleurs devient -->
        <select onchange="setContent('foreColor', this.value);this.selectedIndex=0;" name="color" id="color">
            <option value="none">Choisissez une couleur</option>
            <option value="black">Noir</option>
            <option value="white">Blanc</option>
            <option value="red">Rouge</option>
            <option value="blue">Bleu</option>
            <option value="yellow">Jaune</option>
            <option value="green">Vert</option>
            <option value="other">&gt;Autre couleur&lt;</option> <!-- Choisir une couleur personnalisé -->
        </select>
        

Les différents cas se présentant pour la création d’une action on été
traités, à savoir, si nous avons juste besoin de demander une
information supplémentaire à l’utilisateur, si c’est à nous d’insérer du
code HTML directement ou encore si l’option ne concerne qu’un certain
type de valeur.
 À vous après de créer vos actions en fonction de vos besoins.

Récupérer notre texte formaté
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Une fois le texte formaté il serait bien de pouvoir le récupérer, il
serait plus simple pour cela que nous passions par un champs texte afin
de pouvoir optenir le contenu de la même maniere qu’un formulaire normal
par exemple grace à une variable de type $\_POST en PHP.

Nous ajoutons donc au code HTML quelques éléments tel qu’un textarea que
nous allons dissimulé.

::

        <form action="wysiwyg.html" method="post">

            <!-- Ici les differents boutons de mise en page -->
            <iframe id="editor" onload="iniEditor();">
                Votre navigateur ne supporte pas les IFrames. Impossible de charger l'editeur WYSIWYG en ligne.
            </iframe>
            <textarea name="editorTextarea" id="editorTextarea" style="display: none;" cols="0" rows="0">
            
            </textarea>
            <input onclick="getEditorContent();" id="submit" name="submit" value="Envoyer" type="submit" />
        </form>
        

Notre fonction JavaScript nous servant à récupérer le contenu va
simplement prendre tout ce qu’il y a dans la IFrame pour le mettre dans
la zone de texte.

::

        function getEditorContent()
        {
            // La manière de faire entre les navigateurs 
            // est encore une fois différente
            if(IE)  edoc = window.frames['editor'].document;
            if(MOZ) edoc = document.getElementById('editor').contentDocument;

            document.getElementById('editorTextarea').value = edoc.body.innerHTML;
        }

Ici aussi faite bien attention au nom que vous donnez à votre textarea
pour qu’il y ai correspondance entre la fonction JavaScript et le code
HTML.

Pré-afficher du texte dans l’éditeur
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Si nous avons été capable de récupérer le contenu de notre IFrame pour
le mettre dans notre zone de texte nous allons bien pouvoir faire
l’inverse. C’est le raisonnement que nous allons suivre pour générer un
contenu de depart dans notre éditeur.

::

        <textarea name="editorTextarea" id="editorTextarea" style="display: none;" cols="0" rows="0">
            Ici le contenu de depart
        </textarea>
        

Malheureusement les éditeurs de ce type comporte un petit défaut. Entre
le moment où l‘éditeur est initialisé (designMode = ’On’) et celui où
l’element body est disponible, il peut s’écouler un petit temps. Ce
temps imperceptible par nous humain mais qui l’est pour la machine va
empêcher le contenu de départ d’être affiché dans notre éditeur.

Pour palier à ce defaut nous allons appeler la fonction d’initialisation
récursivement (sans pour autant réinitialiser l’éditeur) jusqu’à ce que
le contenu soit bien insérer.
 Les appelles réccursifs de iniEditor() seront espacés d’un temps que
nous aurons défini au moyen de la fonctions setTimeout.

::


        function iniEditor()
        {
            if(IE)  edoc = window.frames['editor'].document;
            if(MOZ) edoc = document.getElementById('editor').contentDocument;

            if(!IE && !MOZ) {
                    alert("Votre navigateur n'est pas compatible avec ce systeme d'editeur WYSIWYG !");
                    return;
            }
          
            if(edoc.designMode != 'On') edoc.designMode = 'On';
            
            // Tant que l'on accede pas à l'element body on
            // ré-initialise l'editeur
            if(!edoc.body) 
                setTimeout('iniEditor()',20);
            else // On place le contenu de depart dans notre éditeur
                edoc.body.innerHTML = document.getElementById('editorTextarea').value;
        }
        

Conclusion
~~~~~~~~~~

Créer un éditeur WYSIWYG de base en JavaScript est donc quelque chose
d’assez simple.

 Les fonctions développées ici restent élémentaires, à vous de les
developper suivant vos besoins.
 N’hésitez pas non plus à utiliser le CSS pour rendre votre nouvel
outils plus attrayant.

À noter que suivant le navigateur utilisé, le code HTML généré par
l’éditeur sera différent. De plus, ce code n’est souvent pas très
propre, il peut être bien de rajouter une fonction qui au moment de la
restitution du contenu nettoie le code source pour être sur que celui-ci
soit valide.


