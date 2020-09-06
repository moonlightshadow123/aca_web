var deleteTagUrl = "/deleteTag";
var getTagsUrl = "/getTags";

function buildItems(tags){
    var items = {};
    tags.forEach(function(tag){
        items[tag["value"]] = {"name": tag["value"], 
                        "icon":"delete", 
                        "id":tag["id"],
                        "callback":itemCBK}
    });
    items["sep1"] = "---------";
    items["quit"] = {name: "Quit", 
                    icon: function(){return 'context-menu-icon context-menu-icon-quit';},
                    callback: (key, opt, e)=>{console.log("Q!");}}
    return items;
}

function itemCBK(key, opt, e){
    console.log("Clicked conmenu key = " + key + ", id = " + opt.items[key]["id"]);
    var id =  opt.items[key]["id"];
    var name = opt.items[key]["name"];
    dialogPop('Are you sure to delete tag: "' + name + '"?',()=>{
        var url = deleteTagUrl+"?tagid="+id;
        getData(url, (data)=>{console.log("delete Tag!")});
    });
}

$.contextMenu({
    selector: '#acaHeader', 
    build: function ($trigger, e)
    {
        // check if the menu-items have been saved in the previous call
        if ($trigger.data("contextMenuItems") != null)
        {
            // get options from $trigger
            var options = $trigger.data("contextMenuItems");

            // clear $trigger.data("contextMenuItems"),
            // so that menuitems are gotten next time user does a rightclick 
            // from the server again.
            $trigger.data("contextMenuItems", null);
            return options;
        }
        else
        {
            var options = {items: {}};
            var position = {x: e.pageX, y: e.pageY};
            getData(getTagsUrl, (data)=>{
                var tags = onGetTags(data["results"]);
                options.items = buildItems(tags);
                // save the options on the table-row;
                $trigger.data("contextMenuItems", options);
                // open the context-menu (reopen)
                $trigger.contextMenu(position);
            }, dismsg=false);           
            return false;
        }
    }
});