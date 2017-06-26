#pragma strict

var resetKey : KeyCode = KeyCode.R;

var useInitialPosition : boolean;

var resetPosition : Vector3;

function Start () {
	if(useInitialPosition){
		resetPosition = transform.position;
	}
}

function Update () {
	if(Input.GetKeyDown(resetKey)){
		transform.position = resetPosition;
	}
}