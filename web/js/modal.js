var $msgbox = $("#msgbox");
var $msg = $("#msg");
var $msgCloseBtn = $("#msgCloseBtn");
var $editBtn = $(".editBtn");
var $formModal = $("#formModal");
var $mform = $("#mform");
var $formConfirm = $("#formConfirm");
var $dialogModal = $("#dialogModal");
var $modalCloseBtn = $(".modalCloseBtn");
var $confirm = $(".confirm");
var $cancel = $(".cancel");
var $addBtn = $("#addBtn");
var $dialog = $("#dialogModal");
var $dialogConfirm = $("#dialogConfirm");
var $deleteBtn = $(".deleteBtn");
var $option = $(".option");
var word;
var $cur_edit_btn;
var $cur_note_content;
var $cur_orm;

var $tags = $("#tags");
var tagify;
//var quill = new Quill('#editor', {theme: 'snow', formats:[]});
var codemirror = CodeMirror.fromTextArea($("#codemirror")[0],{
                mode:"application/json", 
                lineNumbers:true,
                theme: "monokai"
        });

// MSG
function alertmsg(msg){
	$msgbox.removeClass();
	$msgbox.addClass("msgalert");
	$msg.html(msg);
	$msgbox.slideDown();
}

function infomsg(msg){
	$msgbox.removeClass();
	$msgbox.addClass("msginfo");
	$msg.html(msg);
	$msgbox.slideDown();
}

$msgCloseBtn.click(function(){
	$msgbox.slideUp(function(){
		$msgbox.removeClass();
	});
});

// MODAL
$(".modal").hide();

function displayModal($ele){
	$ele.css("display", "flex").hide().fadeIn();
}

$modalCloseBtn.click(function(){
	$(this).closest(".modal").fadeOut();
});

$confirm.click(function(){
	$(this).closest(".modal").fadeOut();
});

$cancel.click(function(){
	$(this).closest(".modal").fadeOut();
});

// Codemirror addBtn
function setCMValue(value){
	codemirror.getDoc().setValue(value);
	setTimeout(function() {codemirror.refresh();},1);
}

function getCMValue(){
	return codemirror.getValue();
}

// Modal Confirm
$formConfirm.click(function(){
	codemirror.save();
	console.log($mform.serialize());
	postForm("/updateJson", $mform, (data)=>{console.log(data);});
});

var confirmCBK;

$dialogConfirm.click(function(event){
	return true;
});

$dialogConfirm.click(function(event){
	if(event.result == true){
		//alert("Confirmed Calling Callback!")
		confirmCBK();
	}
});

// Modal pop up
$addBtn.click(function(){
	$mform.find("#hinput").attr("value", "0");
	setCMValue("");
	removeTags();
	displayModal($formModal);
});

$("body").on("click",".editBtn", function(){
	var $ele = $(this).closest(".aca_template");
	console.log($ele[0]);
	var idx = $ele.attr("data-idx");
	var json = $ele.attr("data-json");
	var tags = JSON.parse($ele.attr("data-tags"));
	var tagids = JSON.parse($ele.attr("data-tagids"));
	$formModal.find("#hinput").attr("value", idx);
	getTags();
	setCMValue(json);
	removeTags();
	setTags(tagids, tags);
	displayModal($formModal)
});

function dialogPop(msg, callback){
	$dialogModal.find(".msg").html(msg);
	displayModal($dialogModal);
	confirmCBK = callback;
}

// TAGS
function removeTags(){
	tagify.removeAllTags();
}

function getTags(){
	getData(getTagsUrl, (data)=>{
        var tags = onGetTags(data["results"]);
        updateWList(tags);
    }, dismsg=false);
}

function setTags(tagids, tags){
	var data = []
	tagids.forEach(function(tagid, idx){
		data.push({"id":tagid,"value":tags[idx]});
	});
	tagify.addTags(data)
}

function updateWList(whitelist){
	tagify.settings.whitelist = whitelist;
}

setup_tagify();
function setup_tagify(){
	tagify = new Tagify($tags[0], {
        //whitelist : ["A# .NET", "A# (Axiom)", "A-0 System", "A+", "A++", "ABAP", "ABC", "ABC ALGOL", "ABSET", "ABSYS", "ACC", "Accent", "Ace DASL", "ACL2", "Avicsoft", "ACT-III", "Action!", "ActionScript", "Ada", "Adenine", "Agda", "Agilent VEE", "Agora", "AIMMS", "Alef", "ALF", "ALGOL 58", "ALGOL 60", "ALGOL 68", "ALGOL W", "Alice", "Alma-0", "AmbientTalk", "Amiga E", "AMOS", "AMPL", "Apex (Salesforce.com)", "APL", "AppleScript", "Arc", "ARexx", "Argus", "AspectJ", "Assembly language", "ATS", "Ateji PX", "AutoHotkey", "Autocoder", "AutoIt", "AutoLISP / Visual LISP", "Averest", "AWK", "Axum", "Active Server Pages", "ASP.NET", "B", "Babbage", "Bash", "BASIC", "bc", "BCPL", "BeanShell", "Batch (Windows/Dos)", "Bertrand", "BETA", "Bigwig", "Bistro", "BitC", "BLISS", "Blockly", "BlooP", "Blue", "Boo", "Boomerang", "Bourne shell (including bash and ksh)", "BREW", "BPEL", "B", "C--", "C++ – ISO/IEC 14882", "C# – ISO/IEC 23270", "C/AL", "Caché ObjectScript", "C Shell", "Caml", "Cayenne", "CDuce", "Cecil", "Cesil", "Céu", "Ceylon", "CFEngine", "CFML", "Cg", "Ch", "Chapel", "Charity", "Charm", "Chef", "CHILL", "CHIP-8", "chomski", "ChucK", "CICS", "Cilk", "Citrine (programming language)", "CL (IBM)", "Claire", "Clarion", "Clean", "Clipper", "CLIPS", "CLIST", "Clojure", "CLU", "CMS-2", "COBOL – ISO/IEC 1989", "CobolScript – COBOL Scripting language", "Cobra", "CODE", "CoffeeScript", "ColdFusion", "COMAL", "Combined Programming Language (CPL)", "COMIT", "Common Intermediate Language (CIL)", "Common Lisp (also known as CL)", "COMPASS", "Component Pascal", "Constraint Handling Rules (CHR)", "COMTRAN", "Converge", "Cool", "Coq", "Coral 66", "Corn", "CorVision", "COWSEL", "CPL", "CPL", "Cryptol", "csh", "Csound", "CSP", "CUDA", "Curl", "Curry", "Cybil", "Cyclone", "Cython", "Java", "Javascript", "M2001", "M4", "M#", "Machine code", "MAD (Michigan Algorithm Decoder)", "MAD/I", "Magik", "Magma", "make", "Maple", "MAPPER now part of BIS", "MARK-IV now VISION:BUILDER", "Mary", "MASM Microsoft Assembly x86", "MATH-MATIC", "Mathematica", "MATLAB", "Maxima (see also Macsyma)", "Max (Max Msp – Graphical Programming Environment)", "Maya (MEL)", "MDL", "Mercury", "Mesa", "Metafont", "Microcode", "MicroScript", "MIIS", "Milk (programming language)", "MIMIC", "Mirah", "Miranda", "MIVA Script", "ML", "Model 204", "Modelica", "Modula", "Modula-2", "Modula-3", "Mohol", "MOO", "Mortran", "Mouse", "MPD", "Mathcad", "MSIL – deprecated name for CIL", "MSL", "MUMPS", "Mystic Programming L"],
        whitelist: [
        	{ value:'Afghanistan', code:'AF' },
      		{ value:'Åland Islands', code:'AX' }
      		],
        dropdown: {
            maxItems: Infinity,
            enabled: 1,
            classname: "customSuggestionsList"
        },
        editTags : false, 
        enforceWhitelist: false
    })

    tagify.on("dropdown:show", onSuggestionsListUpdate)
          .on("dropdown:hide", onSuggestionsListHide)
          .on('dropdown:scroll', onDropdownScroll)

    //renderSuggestionsList()

    // ES2015 argument destructuring
    function onSuggestionsListUpdate({ detail:suggestionsElm }){
        console.log( suggestionsElm )
    }

    function onSuggestionsListHide(){
        console.log("hide dropdown")
    }

    function onDropdownScroll(e){
        console.log(e.detail)
      }

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
    function renderSuggestionsList(){
        tagify.dropdown.show.call(tagify) // load the list
        tagify.DOM.scope.parentNode.appendChild(tagify.DOM.dropdown)
    }
}

var deleteEntryUrl = "/deleteEntry";
// Other
$("body").on("click",".deleteBtn", function(){
	var $ele = $(this).closest(".aca_template");
	var id = $ele.attr("data-idx");
	dialogPop("Are you sure to delete Entry: " + id,()=>{
		getData(deleteEntryUrl+"?id=" + id, ()=>{
			console.log("Entry deleted!");
		});
	});
});