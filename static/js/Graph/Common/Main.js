"use strict";

$(document).ready(function() {
    var workspaceObject = new IndyMon.Common.Painter.Workspace({
        el: '#painterWorkspace'
    });

    var objects = new IndyMon.Graph.Common.Objects();

    var painter = new IndyMon.Graph.Common.Painter({
        workspace: workspaceObject,
        objects: objects
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
