#pragma strict

var relativeCamera : Transform;

private var initialOffset : Vector3;

function Start () {
	initialOffset = transform.position - relativeCamera.position;
}

function Update () {
	transform.position = relativeCamera.position + initialOffset;
}