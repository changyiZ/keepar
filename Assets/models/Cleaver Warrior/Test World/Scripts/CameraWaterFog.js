#pragma strict

var waterObjects : GameObject[];

var outSideState : CameraFogState;
var underwaterState : CameraFogState;

private var underwater : boolean;

private var underwater_NeedsUpdate : boolean;

function IsUnderwater():boolean{
	return underwater;
}

class CameraFogState{
	var fogcolor : Color;
	//var fogDensity : float;
	var ambientLight : Color;
	var fogStartDistance : float;
	var fogEndDistance : float;
}


function Start () {
	underwater_NeedsUpdate = true;
}

function Update () {

	if(waterObjects.Length == 0){
		waterObjects = GameObject.FindGameObjectsWithTag("Water");
	}
	
	var wasUnderwater : boolean = underwater;
	
	underwater = false;

	var ray : Ray;
	var hit : RaycastHit;	
			
	for(var waterObject : GameObject in waterObjects){
		if(transform.position.x < waterObject.GetComponent.<Collider>().bounds.max.x
		&& transform.position.x > waterObject.GetComponent.<Collider>().bounds.min.x
		&& transform.position.z < waterObject.GetComponent.<Collider>().bounds.max.z
		&& transform.position.z > waterObject.GetComponent.<Collider>().bounds.min.z){
			ray = Ray(transform.position, Vector3.up);
			if(waterObject.GetComponent.<Collider>().Raycast(ray, hit, Mathf.Infinity)){
				underwater = true;
				underwater_NeedsUpdate = true;	
			}
		}
	}
	
	if(wasUnderwater && !underwater) underwater_NeedsUpdate = true;
	
	if(underwater_NeedsUpdate){
		if(underwater){
			RenderSettings.ambientLight = underwaterState.ambientLight;
			RenderSettings.fogColor = underwaterState.fogcolor;
			RenderSettings.fogStartDistance = underwaterState.fogStartDistance;
			RenderSettings.fogEndDistance = underwaterState.fogEndDistance;
		}
		else{
			RenderSettings.ambientLight = outSideState.ambientLight;
			RenderSettings.fogColor = outSideState.fogcolor;
			RenderSettings.fogStartDistance = outSideState.fogStartDistance;
			RenderSettings.fogEndDistance = outSideState.fogEndDistance;
	
		}
		underwater_NeedsUpdate = false;
	}
}

