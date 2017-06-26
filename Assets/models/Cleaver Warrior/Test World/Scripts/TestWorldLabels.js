#pragma strict

var sword : Transform;
var warrior : Transform;
var relativeCamera : Transform;

private var warriorHasLabel : boolean = false;
private var warriorLabel : LabelTransform;
private var leftClickTime : float;
private var performedFirstClick : boolean = false;

static var warriorLabelDurationAfterClick : float = 2.0;

function Start () {

}

function Update () {
	if(sword.parent != null){
		var swordLabel : LabelTransform = sword.GetComponent(LabelTransform);
		if(swordLabel != null)Destroy(swordLabel);
		
		if(!warriorHasLabel){
			warriorLabel = warrior.gameObject.AddComponent(LabelTransform);
			warriorLabel.text = "Click and hold left mouse button to perform a continuous attack.";
			warriorLabel.offsetWorld = Vector3(0,1.8,0);
			warriorLabel.relativeCamera = relativeCamera;
			warriorLabel.offsetScreen.x = -150;
			warriorHasLabel = true;
		}
		else{
			if(Input.GetMouseButtonDown(0) && !performedFirstClick){
				leftClickTime = Time.time;
				performedFirstClick = true;
			}
			if(performedFirstClick && Time.time > leftClickTime + warriorLabelDurationAfterClick && warriorLabel != null){
				Destroy(warriorLabel);
			}
		}
	}
}