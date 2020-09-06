var aca = {};

aca.tags = [];
aca.jsonUrl = "res.json";
aca.queryUrl = "http://localhost:9200/query";
aca.cstUrl = "http://localhost:9000/json/cst.json"
aca.jsonData;
aca.$acaListContainer = $("#acaListContainer");
aca.$acaForm = $("#acaForm");
aca.$tags_select = $("#tags_select");

aca.$sspan_template = $(".sspan_template").clone();
$(".sspan_template").remove();
aca.$sent_template = $(".sent_template").clone();
$(".sent_template").remove();
aca.$tag_template = $(".tag_template").clone();
$(".tag_template").remove();
aca.$aca_template = $(".aca_template").css("display", "").clone();
$(".aca_template").remove();

aca.$acaListContainer.height(window.innerHeight-100);
aca.simpleBar = new SimpleBar(aca.$acaListContainer[0]);
aca.simpleBar.recalculate();
aca.$acaContainer = aca.$acaListContainer.find(".simplebar-content");

aca.genDiv = function(data){
		aca.clearDiv();
		data.forEach(function(item, idx){
		var tags = item["tags"];
		var tagids = item["tagids"];
		var json = item["json"];
		var idx  = item["id"];
		var $aca = aca.$aca_template.clone();
		$aca.find(".idx").text(idx);
		$aca.attr("data-idx", idx);
		$aca.attr("data-json", JSON.stringify(json));
		$aca.attr("data-tags", JSON.stringify(tags));
		$aca.attr("data-tagids", JSON.stringify(tagids));
		aca.genTags($aca.find(".tags"), tags);
		aca.genSent($aca.find(".sent"), json);
		aca.$acaContainer.prepend($aca);
		anime({
		  targets: $aca[0],
		  backgroundColor: "#a3a3ff",
		  direction: 'alternate',
		});
	});
	/*
	anime({
	  targets: $voc[0],
	  backgroundColor: "#a3a3ff",
	  direction: 'alternate',
	});*/
}

aca.expandJson = function(jsondata){
	var res = [[]];
	jsondata.forEach(function(item){
		if(typeof item == "string"){
			res.forEach((part,idx)=>{part.push([item, false])});
		}else{
			var new_res = [];
			var cp_res = res.slice();
			res.forEach(function(part){
				item.forEach((ele)=>{
					var cp_part = part.slice(); 
					cp_part.push([ele, true]);
					new_res.push(cp_part);
				})
			});
			res = new_res;
		}
		console.log(res);
	});
	return res;
}

aca.clearDiv = function(){
	aca.$acaContainer.children().remove();
}

aca.genTags = function ($span, data){
	data.forEach(function(item, idx){
		var $tag = aca.$tag_template.clone();
		$tag.text(item).css("color", aca.getColor(item)).css("border-color", aca.getColor(item));
		$span.append($tag);
	});
}

aca.genSent = function($ul, jsondata){
	console.log(jsondata);
	var data = aca.expandJson(jsondata);
	console.log(data);
	data.forEach(function(item, idx){
		var $sent = aca.$sent_template.clone();
		aca.genSpan($sent, item);
		$ul.append($sent);
	});
}

aca.genSpan = function($li, data){
	data.forEach(function(item, idx){
		var $sspan = aca.$sspan_template.clone();
		var shouldcolor = item[1];
		var text = item[0];
		$sspan.text(text);
		if(shouldcolor){
			$sspan.css("background-color", aca.getColor(text)).css("color", "#ffffff");
		}
		$li.append($sspan);
	});
}

aca.getColor = function(text) {
	console.log(text);
    var COLORS = [
        'green', 'red', 'blue', 'purple',
        'chocolate', 'pink', 'orange', 'salmon',
        'olive', 'turquoise', 'wheat', 'lime'
    ];
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}

function postForm(url, $form, cbk){
	$.ajax({
       type: "POST",
       url: url,
       data: $form.serialize(), // serializes the form's elements.
       success: function(data)
       {
       		console.log(data);
       		if(data["res"]){
           		cbk(data["res"]); // show response from the php script.
       			infomsg(data["msg"]);
       		}else{
       			alertmsg(data["msg"]);
       		}
       },
       error: function(){
       		alertmsg("Ajax Post Form Failed!");
       }
    });
}

function getData(url, cbk, dismsg=true){
	$.ajax({
        url: url,
        success: function(data)
        {
        	console.log(data);
        	if(data["res"]){
        		cbk(data["res"]);
        		if(dismsg)
        			infomsg(data["msg"]);
        	}else{
        		alertmsg(data["msg"]);
        	}
        },
        error:function(){
        	alertmsg("Ajax Post Form Failed!");
        }
    });
}

aca.submitform = function(e){
	postForm(aca.queryUrl, aca.$acaForm, aca.genDiv);
	return false;
}


function onGetTags(tags){
	aca.tags = tags.map((item)=>{return {"id":item["id"], "value":item["text"]}});
	updateWList(aca.tags);
	return aca.tags;
	//updateConMenu(aca.tags);
}

function genSelect2(){
	$("#tags_select").select2({
		ajax:{
			url: "/getTags",
			processResults: function(data){
				console.log(data);
				if(data["res"] != null){
					var res = data["res"];
					onGetTags(res["results"]);
					res["results"] = [{"id":0, "text":"(ALL)"}].concat(res["results"]);
					console.log(res);
					return res;
				}
				else
					console.log(data["msg"]);
			},
		},
		placeholder: "Search by Tags",
	});
	$("body").on("click",".tagDD", function(e){
		e.preventdefault();
		console.log("HELLO!!");
	});
}

$(function(){
	aca.$acaForm.on("submit", aca.submitform);
	genSelect2();
});