"use strict";

$(document).ready(function() {
    console.log("x");

    var workspaceObject = new IndyMon.Common.Painter.Workspace({
        el: '#painterWorkspace'
    });
    var menu = new IndyMon.Graph.Common.Menu({
        workspace: workspaceObject
    });
    var objects = new IndyMon.Graph.Common.Objects({
        menu: menu
    });
    var reloader = new IndyMon.Common.Painter.Reloader();
    var painter = new IndyMon.Graph.Common.Painter({
        workspace: workspaceObject,
        objects: objects,
        menu: menu,
        reloader: reloader
    });

    workspaceObject.addPainter(painter);
    workspaceObject.render();
    workspaceObject.setVisibleRect(-830, 3640, -65, 2010);

    var finder = new IndyMon.Graph.Common.Finder({
        el: '#finderDiv',
        objects: objects,
        workspace: workspaceObject
    });
});
