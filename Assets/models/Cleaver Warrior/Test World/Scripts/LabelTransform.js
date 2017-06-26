#pragma strict

var relativeCamera : Transform;
var offsetWorld : Vector3;
var offsetScreen : Vector2;
var text : String;

private var position : Rect;
private var worldToViewportPoint : Vector3;

private var relativeCamComponent : Camera;

function Start () {
	relativeCamComponent = relativeCamera.GetComponent(Camera);
}

function OnGUI(){
	worldToViewportPoint = relativeCamComponent.WorldToViewportPoint(transform.position + offsetWorld);
	position.x = worldToViewportPoint.x * Screen.width + offsetScreen.x;
	position.y = (1-worldToViewportPoint.y) * Screen.height + offsetScreen.y;
	position.width = 300;
	position.height = 100;
	GUI.Label(position, text);
}