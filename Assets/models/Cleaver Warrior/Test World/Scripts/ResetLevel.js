#pragma strict

var resetKey : KeyCode;

function Start () {

}

function Update () {
	if(Input.GetKeyDown(resetKey)){
		Application.LoadLevel(0);
	}
}