#pragma strict

var showCursor : boolean;
var lockCursor : boolean;

var toggleKey : KeyCode;

function Start () {
	Cursor.visible = showCursor;
	Cursor.lockState = CursorLockMode.Locked;
}

function Update () {
	if(Input.GetKeyDown(toggleKey)){
		showCursor = !showCursor;
		lockCursor = !lockCursor;
	}
	
		
		Cursor.visible = showCursor;
		if(lockCursor)Cursor.lockState = CursorLockMode.Locked;
		else Cursor.lockState = CursorLockMode.None;
}