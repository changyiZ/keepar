#pragma strict

@script ExecuteInEditMode()

var bounds : Bounds;
var drawBounds: boolean;

function Update () {
	bounds.center = transform.position;
	bounds.size = transform.localScale;
}

function OnDrawGizmos(){
	if(drawBounds){
		Gizmos.color = Color.white;
		Gizmos.DrawWireCube(bounds.center, bounds.size);
		#if UNITY_EDITOR
		Handles.Label(transform.position, "Delete Triangles");
		#endif
	}
}