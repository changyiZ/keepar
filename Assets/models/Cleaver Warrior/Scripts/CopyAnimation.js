#pragma strict

//@script ExecuteInEditMode()

//Apply this on body part's bones to automatically find the mecanim rig's pair of the same name and copy the animation.
private var pair : Transform;

private var defaultLocalPosition : Vector3;
private var defaultLocalRotation : Quaternion;
private var defaultLocalScale : Vector3;


private var pairDefaultLocalPosition : Vector3;
private var pairDefaultLocalRotation : Quaternion;
private var pairDefaultLocalScale : Vector3;

function Start () {
	defaultLocalPosition = transform.localPosition;
	defaultLocalRotation = transform.localRotation;
	defaultLocalScale = transform.localScale;
	
	var hierarchyName : String = "";
	var currentTransform : Transform = transform;
	
	while(true){
		hierarchyName = currentTransform.name + hierarchyName;

		if(currentTransform.name == "Bip01"){
			break;
		}
		
		hierarchyName = "/" + hierarchyName;
		
		currentTransform = currentTransform.parent;
	}
	
	pair = transform.root.Find(hierarchyName);
	
	if(pair == null){
		Debug.Log("The bone object " + transform.name + " couldn't find its pair with the CopyAnimation.js script.");
		Destroy(this);
	}
	
	pairDefaultLocalPosition = pair.localPosition;
	pairDefaultLocalRotation = pair.localRotation;
	pairDefaultLocalScale = pair.localScale;
}

function LateUpdate () {
	transform.localPosition = defaultLocalPosition + (pair.localPosition - pairDefaultLocalPosition);
	transform.localRotation = defaultLocalRotation *(Quaternion.Inverse(pairDefaultLocalRotation) * pair.localRotation);
	transform.localScale = defaultLocalScale + (pair.localScale - pairDefaultLocalScale);
}