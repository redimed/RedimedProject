var isoNode={
	inheritPermission:function(child,parent)
	{
		if(parent)
		{
			if(parent.ACCESSIBLE_USER_ID)
				child.ACCESSIBLE_USER_ID=parent.ACCESSIBLE_USER_ID;
			if(parent.ACCESSIBLE_USER_ID)
				child.IS_READ=parent.IS_READ;
			if(parent.IS_CREATE)
				child.IS_CREATE=parent.IS_CREATE;
			if(parent.IS_UPDATE)
				child.IS_UPDATE=parent.IS_UPDATE;
			if(parent.IS_DELETE)
				child.IS_DELETE=parent.IS_DELETE;
			if(parent.IS_GRANT_PERMISSION)
				child.IS_GRANT_PERMISSION=parent.IS_GRANT_PERMISSION;
		}
	}
}

var isoFolder={
	inheritPermission:function(child,parent)
	{
		if(parent)
		{
			child.ACCESSIBLE_USER_ID=parent.ACCESSIBLE_USER_ID;
			child.IS_READ=parent.IS_READ;
			child.IS_CREATE=parent.IS_CREATE;
			child.IS_UPDATE=parent.IS_UPDATE;
			child.IS_DELETE=parent.IS_DELETE;
			child.IS_GRANT_PERMISSION=parent.IS_GRANT_PERMISSION;
		}
		
	}
}

var isoDocument={
	inheritPermission:function(child,parent)
	{
		if(parent)
		{
			child.ACCESSIBLE_USER_ID=parent.ACCESSIBLE_USER_ID;
			child.IS_READ=parent.IS_READ;
			child.IS_CREATE=parent.IS_CREATE;
			child.IS_UPDATE=parent.IS_UPDATE;
			child.IS_DELETE=parent.IS_DELETE;
			child.IS_GRANT_PERMISSION=parent.IS_GRANT_PERMISSION;
		}
	}
}