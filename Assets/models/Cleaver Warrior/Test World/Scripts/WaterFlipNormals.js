#pragma strict

var cameraScript : CameraWaterFog;

var underwater : boolean;

var underwater_NeedsUpdate : boolean;

function Start () {

}

function Update () {
	if(cameraScript == null){
		cameraScript = GameObject.FindGameObjectWithTag("MainCamera").GetComponent(CameraWaterFog);
	}
	if(cameraScript != null){
		if(cameraScript.IsUnderwater() && !underwater){
			underwater = true;
			underwater_NeedsUpdate = true;

		}
		if(!cameraScript.IsUnderwater() && underwater){
			underwater = false;
			underwater_NeedsUpdate = true;
		}
	}
	if(underwater_NeedsUpdate){
		if(underwater){
			transform.localScale.y = -1.0;
			underwater_NeedsUpdate = false;
		}
		else{
			transform.localScale.y = 1.0;
			underwater_NeedsUpdate = false;
		}
	}
}