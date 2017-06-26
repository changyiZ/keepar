#pragma strict


var character : Transform;

var lookAtOffset : Vector3 = Vector3(0,1,0);

var currentDistance : float = 2.0;
private var velocityDistance : float;
private var targetDistance : float;
var height : float = 2.0;

private var heightVelocity : float;

private var angle : float;

var mouseSensitivity : float = 2.0; 

static var buffer : float = 1.0;

private var smoothLookAtCenter : Vector3;
private var smoothLookAtCenterTarget : Vector3;
private var smoothLookAtCenterVelocity : Vector3;

function Start () {
	targetDistance = currentDistance;
}

function LateUpdate () {
	angle = Mathf.DeltaAngle(0, angle);
	
	height -= Input.GetAxis("Mouse Y") * Input.GetAxis("Mouse Y") * Mathf.Sign(Input.GetAxis("Mouse Y")) * mouseSensitivity * .05; 
	
	var minHeight :float= -5.0;
	var maxHeight :float = 12.0;
	
	if(height < minHeight + buffer){
		height = Mathf.SmoothDamp(height, minHeight + buffer, heightVelocity, .1);
	}
	
	targetDistance -= Input.GetAxis("Mouse ScrollWheel") * mouseSensitivity;
	targetDistance = Mathf.Clamp(targetDistance, 3.0, 10.0);
	currentDistance = Mathf.SmoothDamp(currentDistance, targetDistance, velocityDistance, .2);
	
	if(height > maxHeight - buffer){
		height = Mathf.SmoothDamp(height, maxHeight - buffer , heightVelocity, .1);
	}
	height = Mathf.Clamp(height, minHeight, maxHeight);
	
	var distanceAfterHeight : float = Mathf.Max(0.1, currentDistance - height * .2);
	
	transform.position  = 
	character.position + Vector3(distanceAfterHeight * Mathf.Cos(angle * Mathf.Deg2Rad), 
	height, distanceAfterHeight * Mathf.Sin(angle * Mathf.Deg2Rad));
		
	var lookTarget : Vector3 = character.TransformPoint(lookAtOffset);
	
	smoothLookAtCenterTarget = character.GetComponent(Animator).bodyPosition - character.position; 
	
	smoothLookAtCenter = Vector3.SmoothDamp(smoothLookAtCenter, smoothLookAtCenterTarget, smoothLookAtCenterVelocity, .3);
	
	transform.LookAt(lookTarget + smoothLookAtCenter);
	
	angle -= Input.GetAxis("Mouse X") * Input.GetAxis("Mouse X") * Mathf.Sign(Input.GetAxis("Mouse X")) * mouseSensitivity;
	
	
	//Collision.
	var hit : RaycastHit;
	
	if(Physics.Raycast(lookTarget, transform.position - lookTarget, hit, Vector3.Distance(lookTarget, transform.position))){
		if(!hit.transform.gameObject.CompareTag("Water") && hit.transform != character){
			transform.position = hit.point;
			transform.position += transform.forward * .1;
		}
	}
}