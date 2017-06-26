#pragma strict

var relativeCamera : Transform;
var distance : float;

//private var particleSystem : ParticleSystem;

private var play : boolean;
 
function Start () {
	//particleSystem = GetComponent(ParticleSystem);
}

function Update () {
	if(relativeCamera == null){
		relativeCamera = GameObject.FindGameObjectWithTag("MainCamera").transform ;
	}
	var currentDistance : float = Vector3.Distance(transform.position, relativeCamera.position);
	if(currentDistance < distance && !play){
		GetComponent.<ParticleSystem>().Play();
		play = true;
	}
	else{
		GetComponent.<ParticleSystem>().Stop();
		play = false;
	}
}