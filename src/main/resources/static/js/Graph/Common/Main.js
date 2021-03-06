"use strict";

$(document).ready(function() {
    var workspaceObject = new IndyMon.Common.Painter.Workspace({
        el: '#painterWorkspace'
    });
    var menu = new IndyMon.Graph.Common.Menu({
        workspace: workspaceObject
    });
    var reloader = new IndyMon.Common.Painter.Reloader();
    var objects = new IndyMon.Graph.Common.Objects({
        menu: menu,
        reloader: reloader
    });
    var painter = new IndyMon.Graph.Common.Painter({
        workspace: workspaceObject,
        objects: objects,
        menu: menu,
        reloader: reloader
    });

    workspaceObject.addPainter(painter);
    workspaceObject.render();
    workspaceObject.setVisibleRect(0, 0, 100, 100);

    var finder = new IndyMon.Graph.Common.Finder({
        el: '#finderDiv',
        objects: objects,
        workspace: workspaceObject
    });
});
