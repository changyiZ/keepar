#pragma strict

var relativeCamera : Transform;

private var animator : Animator;

static var stateSwordMovement: int = Animator.StringToHash("Stand.Sword Movement");
static var statePickUpSword: int = Animator.StringToHash("Stand.Pick Up Sword");
static var stateEdgeClimb:   int = Animator.StringToHash("Air.Ledge Climb");

private var standState : AnimatorStateInfo;
private var crouchState : AnimatorStateInfo;
private var airState : AnimatorStateInfo;
private var swimState : AnimatorStateInfo;

private var capsuleCollider : CapsuleCollider;

private var characterHeight : float;
private var characterDepth : float;

private var leftHand : Transform;
private var rightHand : Transform;

//Ground distance values.
private var groundDistanceOffetRayOrigin : float;
static var gDistanceOffetRelativeToCharHeight : float = 2.0;
private var groundDistance : float;

//Rotation values.
private var deltaCameraYAngle : float;

private var currentRotationInput : float;
private var targetRotationInput : float;
private var velocityRotationInput : float;
var rotationSmoothTime : float = .5;

//Speed values.
private var currentSpeedInput : float;
private var targetSpeedInput : float;
private var velocitySpeedInput : float;
var sprintButton : String = "Fire2";
var speedSmoothTime : float = .5;

//Impulse values.
private var currentImpulse : float;
private var targetImpulse : float;
private var velocityImpulse : float;
private var previousSpeedInput : float;
var impulseSmoothTime : float = .1;
private var runImpulseCrouch : float;
var runImpulseCrouchMultiplier : float = .3;

//Strafe values.
private var currentStrafeInput : float;
private var targetStrafeInput : float;
private var velocityStrafeInput : float;
var strafeSmoothTime : float = .5;

//Crouch values.
private var currentCrouchWeight : float;
private var targetCrouchWeight : float;
private var velocityCrouchWeight : float;
var crouchButton : String = "Fire3";
var crouchSmoothTime : float = .05;

//Jump Values.
var jumpVelocity : float = 5.0;
var jumpButton : String = "Jump";
var landingJumpCrouchSmoothTime : float = .1;
var minCrouchWeight : float = .5;
private var jumpImpulseCrouch : float;
private var currentLandingCrouch : float;
private var velocityLandingCrouch : float;
static var landingCrouchGroundDistance : float = .5;
static var landingCrouchVerticalVelocity : float = -3.0;
var landingCrouchSmoothTime : float = .5;
static var maxJumpGroundDistance : float = .1;
static var maxJumpVerticalVelocity : float = .1;
private var lockJump : boolean = false;
private var lastJumpTime : float;
static var lockJumpTime : float = 0.1;

//Air.
private var currentAirWeight : float;
private var targetAirWeight : float;
private var velocityAirWeight : float;
var airSmoothTime : float = .1 ;
static var minAirGroundDistance : float = .4;

//Underwater values.
private var waterObjects : GameObject[];
private var underwater : boolean;
private var waterSurfaceDistance : float;
static var waterJumpOutDistance : float = 1.0;
var waterJumpOutVelocity : float = 3.0;
static var waterJumpOutNoDragTime : float = 1.0;
private var lastWaterJumpOutTime : float;
private var characterWaterLevelHeight : float;
static var characterWaterLevelRelativeToCharHeight : float = .8;
private var currentSwimWeight : float;
private var targetSwimWeight : float;
private var velocitySwimWeight : float;
var swimSmoothTime : float = .5;
var waterDrag : float = 5.0;
private var currentSwimVerticalInput : float;
private var targetSwimVerticalInput : float;
private var velocitySwimVerticalInput : float;
var swimVerticalSmoothTime : float = .5;

//Ledge Climb values.
private var isDangling : float;
private var dangle : boolean;
private var dangleHandPosition : Vector3;
private var dangleBodyRotation : Quaternion;
var danglePositionOffset : Vector3 = Vector3(0.23, -0.13, -0.05);
private var standPositionAfterClimb : Vector3;
private var climbStartTime : float;
static var totalClimbTime = 1.8;
private var climb : boolean;

//Sword values.
private var sword : boolean;
private var stance : boolean;
private var hasSword : boolean;
private var currentSword : Transform;
static var defaultSwordLocalHandPosition : Vector3 = Vector3(-0.07,0.04,0.3);
static var defaultSwordLocalHandRotation : Quaternion = Quaternion.Euler(0,0,180);
private var pickingUpSword : boolean;
private var pickupSwordPosition : Vector3;
private var pickupSwordRotation : Quaternion;
private var swordMode : boolean;
private var swordButton : String = "Fire1";
private var swordObjects : GameObject[];
static var maxSwordPickupDistance : float = 1.0;
static var maxSwordVerticalDistance : float = .4;
var swordModeTime : float = 3.0;
private var lastSwordActionTime : float;
private var lastAttackTime : float;
var holdAttackTime : float = 1.0;
private var currentHoldSwordWeight : float;
private var targetHoldSwordWeight : float;
private var velocityHoldSwordWeight : float;

function IsUnderwater() : boolean{
	return underwater;
}

function Start () {
	animator = GetComponent(Animator);
	capsuleCollider = GetComponent(CapsuleCollider);
	
	waterObjects = GameObject.FindGameObjectsWithTag("Water");
	
	leftHand = animator.GetBoneTransform(HumanBodyBones.LeftHand);
	rightHand = animator.GetBoneTransform(HumanBodyBones.RightHand);
	
	var skinnedMeshRenderer : SkinnedMeshRenderer = GetComponentInChildren(SkinnedMeshRenderer);
	var skinnedMeshTransform : Transform = skinnedMeshRenderer.transform;
	characterHeight = skinnedMeshRenderer.bounds.size.y;
	characterDepth = skinnedMeshRenderer.bounds.size.z;
	
	//Ground ditance.
	groundDistanceOffetRayOrigin = characterHeight * gDistanceOffetRelativeToCharHeight;
	
	//Underwater.
	characterWaterLevelHeight = characterHeight * characterWaterLevelRelativeToCharHeight;

	//Sword.
	for(var i = 0; i < rightHand.childCount; i++){
		var handChild : Transform = rightHand.GetChild(i);
		if(handChild.tag == "Sword"){
			hasSword = true;
			break;
		}
	}
	
	swordObjects = GameObject.FindGameObjectsWithTag("Sword");
}

function Update () {
	PlaybackTime();
	
	GroundDistance();
	
	BasicMovement();

	Crouch();

	Jump();
	
	Air();

	Underwater();
	
	LedgeClimb();
				
	Sword();
	
	SmoothDampValues();
	
	SetAnimatorValues();
}

function LedgeClimb(){
	var ray : Ray;
	var hits : RaycastHit[];

	var surfaceHit : RaycastHit;
	var hasSurface : boolean;
	
	if(underwater){
		
		ray = new Ray(transform.TransformPoint(0,3.3,.7), Vector3.down);
		hits = Physics.RaycastAll(ray);
		for(var hit : RaycastHit in hits){
			if(hit.collider.isTrigger) continue;
			if(hit.point.y < transform.position.y + 1.0) continue;
			surfaceHit = hit;
			hasSurface = true;
			break;
		}
	}
	
	if(hasSurface){
		if(!dangle && Input.GetButton(jumpButton)){
			dangle = true;
			dangleHandPosition = surfaceHit.point;
			ray = new Ray(Vector3(transform.position.x, surfaceHit.point.y-.1, transform.position.z) 
			+ transform.TransformDirection(0,0,-1), transform.forward);
			hits = Physics.RaycastAll(ray);
			var closestHit : RaycastHit;
			for(var hit : RaycastHit in hits){
				if(hit.collider == GetComponent.<Collider>()) continue;
				if(closestHit == null) closestHit = hit;
				var distanceToSurfacePoint : float = Vector3.Distance(surfaceHit.point, hit.point);
				if(closestHit != null && distanceToSurfacePoint < Vector3.Distance(closestHit.point, surfaceHit.point)){
					closestHit = hit;
				}

			}
			if(closestHit != null){
				dangleHandPosition.x = closestHit.point.x;
				dangleHandPosition.z = closestHit.point.z;
				dangleBodyRotation = Quaternion.LookRotation(-Vector3(closestHit.normal.x, 0, closestHit.normal.z));
			}
			currentSwimWeight = 0.0;
		}
	}

	if(dangle){
		if(Vector3.Distance(dangleHandPosition, transform.position) > 3.0){
			dangle = false;
			currentSwimWeight = 1.0;
		}
		else{
			transform.position = Vector3.Lerp(transform.position, SetBonePosition(rightHand, dangleHandPosition 
			+ transform.TransformDirection(danglePositionOffset)), Time.deltaTime * 8.0);
			
			transform.rotation = Quaternion.Lerp(transform.rotation, dangleBodyRotation, Time.deltaTime * 10.0);
			
			targetSwimWeight = 0.0;
			targetAirWeight = 1.0;
			targetRotationInput = 0.0;
			targetSpeedInput = 0.0;
			targetStrafeInput = 0.0;
			targetSwimVerticalInput = 0.0;
			GetComponent.<Rigidbody>().velocity = Vector3.zero; 
		}
		
		if(!Input.GetButton(jumpButton)){
			dangle = false;
			targetSwimWeight = 1.0;
			targetAirWeight = 0.0;
		}

		if(Input.GetAxis("Vertical") > .5 && !climb){
			ray = new Ray(transform.TransformPoint(0,3,1), Vector3.down);
			hits = Physics.RaycastAll(ray);
			var closestEdgeHit : RaycastHit;//Closest to hand dangling position. 
			var foundStandPoint : boolean = false;
			for(var hit : RaycastHit in hits){
				if(hit.collider == GetComponent.<Collider>()) continue;
				if(hit.collider.isTrigger) continue;
				var distanceToLedge : float = Vector3.Distance(hit.point, dangleHandPosition);
				if(distanceToLedge > 1.5) continue;
				if(distanceToLedge < Vector3.Distance(closestEdgeHit.point, dangleHandPosition)){
					closestEdgeHit = hit;
					foundStandPoint = true;
				}
			}
			if(foundStandPoint){ 
				climb = true;
				dangle = false;
				animator.SetBool("Climb", true);
				climbStartTime = Time.time;
				standPositionAfterClimb = closestEdgeHit.point;
			}			
		}
	}
	
	if(climb && Time.time > climbStartTime + totalClimbTime *.4){
		//Debug.DrawRay(standPositionAfterClimb, Vector3.up);
		transform.position = Vector3.Lerp(transform.position, standPositionAfterClimb, Time.deltaTime *6);
		
		if(Time.time < climbStartTime + totalClimbTime *.5){
			transform.position.y += 0.3 * Time.deltaTime;
		}
		
		if(Time.time > climbStartTime + totalClimbTime){
			animator.SetBool("Climb", false);
			climb = false;
		}
	}
	
}


function SetBonePosition(boneTransform : Transform, target : Vector3) : Vector3{
	return target - boneTransform.position + transform.position;
}

function PlaybackTime(){
	standState = animator.GetCurrentAnimatorStateInfo(0);
	crouchState = animator.GetCurrentAnimatorStateInfo(1);
	airState = animator.GetCurrentAnimatorStateInfo(2);
	swimState = animator.GetCurrentAnimatorStateInfo(3);
}

function GroundDistance(){
	var ray : Ray;
	var hits : RaycastHit[];
	
	ray = new Ray(transform.TransformPoint(0,groundDistanceOffetRayOrigin,0), Vector3.down);
	hits = Physics.RaycastAll(ray);
	groundDistance = Mathf.Infinity;
	for(var groundHit : RaycastHit in hits){
		var thisDistance : float = groundHit.distance - groundDistanceOffetRayOrigin;
		if(!groundHit.collider.isTrigger 
		&& groundHit.collider != GetComponent.<Collider>()
		&& thisDistance < groundDistance){
			groundDistance = thisDistance;
		}
	}
}

function BasicMovement(){
	//Rotation.
	deltaCameraYAngle = Mathf.DeltaAngle(Quaternion.LookRotation(transform.forward).eulerAngles.y, 
										 Quaternion.LookRotation(relativeCamera.forward).eulerAngles.y);
										 
	targetRotationInput = deltaCameraYAngle / 45;

	//Speed.
	targetSpeedInput = Input.GetAxis("Vertical");
	if(Input.GetButton(sprintButton)) targetSpeedInput *= 2;

	//Strafe.
	targetStrafeInput = Input.GetAxis("Horizontal");
	if(Input.GetButton(sprintButton)) targetStrafeInput *= 2;
}

function Crouch(){
	if(Input.GetButtonDown(crouchButton)){
		if(targetCrouchWeight == 1.0) targetCrouchWeight = 0.0;
		else targetCrouchWeight = 1.0;
	}
	
	if(swordMode) targetCrouchWeight = 0.0;
}

function Jump(){
	jumpImpulseCrouch = 0.0;
	var applyJump : boolean = false;
	if(Input.GetButton(jumpButton)){
		if(groundDistance < maxJumpGroundDistance && GetComponent.<Rigidbody>().velocity.y < maxJumpVerticalVelocity){
			if(currentCrouchWeight > minCrouchWeight){
				applyJump = true;
			}
			else{
				jumpImpulseCrouch = 1.0;
			}
		}
	}
	if(Input.GetButtonUp(jumpButton) && groundDistance < maxJumpGroundDistance && GetComponent.<Rigidbody>().velocity.y < maxJumpVerticalVelocity){
		applyJump = true;
	}
	
	if(dangle) applyJump = false;
	
	if(applyJump && !lockJump){
		GetComponent.<Rigidbody>().velocity.y = jumpVelocity;
		lockJump = true;
		lastJumpTime = Time.time;
	}
	
	if(Time.time > lastJumpTime + lockJumpTime){
		lockJump = false;
	}
	
	if(groundDistance < landingCrouchGroundDistance && GetComponent.<Rigidbody>().velocity.y < landingCrouchVerticalVelocity){
		currentLandingCrouch = 1.0;
		currentCrouchWeight = 1.0;
	}
	else{
		currentLandingCrouch = Mathf.SmoothDamp(currentLandingCrouch, 0.0, velocityLandingCrouch, landingCrouchSmoothTime);
	}
}

function Air(){
	if(groundDistance > minAirGroundDistance){
		targetAirWeight = 1.0;
	}
	else{
		targetAirWeight = 0.0;
	}
}

function Underwater(){
	var ray : Ray;
	
	ray = Ray(transform.TransformPoint(0, characterWaterLevelHeight,0), Vector3.up);
	underwater = false;
	var waterHit : RaycastHit;
	for(var waterObject : GameObject in waterObjects){
		
		if(transform.position.x < waterObject.GetComponent.<Collider>().bounds.max.x
		&& transform.position.x > waterObject.GetComponent.<Collider>().bounds.min.x
		&& transform.position.z < waterObject.GetComponent.<Collider>().bounds.max.z
		&& transform.position.z > waterObject.GetComponent.<Collider>().bounds.min.z){
			
			if(waterObject.GetComponent.<Collider>().Raycast(ray, waterHit, Mathf.Infinity)){
				underwater = true;
				
				waterSurfaceDistance = waterHit.distance;
			}
		}
	}
	
	if(underwater){
		if(Time.time > lastWaterJumpOutTime + waterJumpOutNoDragTime) targetSwimWeight = 1.0;
		GetComponent.<Rigidbody>().drag = waterDrag;
		GetComponent.<Rigidbody>().useGravity = false;
	}
	else{
		targetSwimWeight = 0.0;
		GetComponent.<Rigidbody>().drag = 0;
		GetComponent.<Rigidbody>().useGravity = true;
	}

	targetSwimVerticalInput = 0.0;
	if(Input.GetButton(jumpButton  )) targetSwimVerticalInput += 1.0;
	if(Input.GetButton(crouchButton)) targetSwimVerticalInput -= 1.0;
	
	if(underwater && waterSurfaceDistance < waterJumpOutDistance && Input.GetButton(jumpButton)){
		GetComponent.<Rigidbody>().drag = 0.0;
		GetComponent.<Rigidbody>().velocity.y = waterJumpOutVelocity;
		lastWaterJumpOutTime = Time.time;
	}
}


function Sword(){
	var ray : Ray;
	var hits : RaycastHit[];

	if(Input.GetButton(swordButton)){
		if(hasSword){
			if(swordMode){
				//Sword boolean attacks.
				sword = true;;
				lastSwordActionTime = Time.time;
				lastAttackTime = Time.time;
			}
			else{
				stance = true;
				swordMode = true;
				lastSwordActionTime = Time.time;
			}
		}
		else{
			//Sword boolean picks up sword.
			for(var swordObject : GameObject in swordObjects){
				var thisSwordDistance : float = Vector3.Distance(swordObject.transform.position, transform.position);
				if(thisSwordDistance < maxSwordPickupDistance &&
				Mathf.Abs(swordObject.transform.position.y - transform.position.y) < maxSwordVerticalDistance){
					sword = true;
					pickingUpSword = true;
					currentSword = swordObject.transform;
					Destroy(currentSword.GetComponent.<Rigidbody>());
					currentSword.GetComponent.<Collider>().enabled = false;
					stance = true;
										
					//Find the corret place to stand in order to pick up the sword.
					ray = Ray(Vector3(swordObject.transform.position.x, transform.position.y + 1.0, swordObject.transform.position.z),
					Vector3.down);
					hits = Physics.RaycastAll(ray);
					for(var groundHit : RaycastHit in hits){
						pickupSwordPosition = groundHit.point;
					}				
				}
			}
		}
	}
	else{
		sword = false;
	}

	
	if(pickingUpSword){
		var playBackTime : float = standState.normalizedTime % 1;
		if(standState.fullPathHash == statePickUpSword){
			if(playBackTime < .3){
				transform.position = Vector3.Lerp(transform.position, SetBonePosition(rightHand, pickupSwordPosition), Time.deltaTime * 5.0);
			}
			else{
				currentSword.parent = rightHand;
				currentSword.localPosition = Vector3.Lerp(currentSword.localPosition, defaultSwordLocalHandPosition, Time.deltaTime * 5.0);
				currentSword.localRotation = Quaternion.Lerp(currentSword.localRotation, defaultSwordLocalHandRotation, Time.deltaTime * 5.0);			
			}
		}
		if(standState.fullPathHash == stateSwordMovement){
			pickingUpSword = false;
			swordMode = true;
			hasSword = true;
			stance = true;
			lastSwordActionTime = Time.time;
		}
	}

	if(hasSword){
		if(swordMode){
			targetHoldSwordWeight = 0.0;
			transform.Rotate(0,deltaCameraYAngle * Time.deltaTime,0);
			
			if(Time.time > lastSwordActionTime + swordModeTime){
				swordMode = false;
				stance = false;
			}
			
			//Hold Attack.
			if(Time.time < lastAttackTime + holdAttackTime){
				sword = true;
			}
			
		}
		else{
			targetHoldSwordWeight = .6;
		}
	}
	else{
		targetHoldSwordWeight = 0.0;
		stance = false;
	}
	
	if(dangle) targetHoldSwordWeight = 0.0;	
}

function SmoothDampValues(){
	currentRotationInput = Mathf.SmoothDamp(currentRotationInput, targetRotationInput, velocityRotationInput, rotationSmoothTime);
	currentSpeedInput = Mathf.SmoothDamp(currentSpeedInput, targetSpeedInput, velocitySpeedInput, speedSmoothTime);
	currentStrafeInput = Mathf.SmoothDamp(currentStrafeInput, targetStrafeInput, velocityStrafeInput, strafeSmoothTime);

	currentCrouchWeight = Mathf.SmoothDamp(currentCrouchWeight, 
	Mathf.Clamp01(targetCrouchWeight + jumpImpulseCrouch + currentLandingCrouch + runImpulseCrouch),
	velocityCrouchWeight, crouchSmoothTime);
	
	currentAirWeight = Mathf.SmoothDamp(currentAirWeight, targetAirWeight, velocityAirWeight, airSmoothTime);
	currentSwimWeight = Mathf.SmoothDamp(currentSwimWeight, targetSwimWeight, velocitySwimWeight, swimSmoothTime);
	
	currentSwimVerticalInput = 
	Mathf.SmoothDamp(currentSwimVerticalInput, targetSwimVerticalInput, velocitySwimVerticalInput, swimVerticalSmoothTime);

	currentHoldSwordWeight = Mathf.SmoothDamp(currentHoldSwordWeight, targetHoldSwordWeight, velocityHoldSwordWeight, .2);
	animator.SetLayerWeight(4, currentHoldSwordWeight);	
}

function SetAnimatorValues(){
	//Floats.
	animator.SetFloat("Rotation Input", currentRotationInput);
	animator.SetFloat("Speed Input", currentSpeedInput);
	animator.SetFloat("Strafe Input", currentStrafeInput);
	animator.SetFloat("Swim Vertical Input", currentSwimVerticalInput);
	
	//Booleans.
	animator.SetBool("Sword", sword);
	animator.SetBool("Stance", stance);
	animator.SetBool("Dangle", dangle);
	
	//Layers.
	animator.SetLayerWeight(1,currentCrouchWeight);
	animator.SetLayerWeight(2,currentAirWeight);
	animator.SetLayerWeight(3, currentSwimWeight);
	
	//Velocity.
	animator.SetFloat("Vertical Velocity", GetComponent.<Rigidbody>().velocity.y);
}