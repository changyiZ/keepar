#pragma strict

var otherMesh : MeshFilter;

private var thisMesh : Mesh;

function Start () {
	thisMesh = GetComponent(MeshFilter).mesh;
}

function Update () {
	thisMesh = otherMesh.mesh;
	
	var collider : MeshCollider = GetComponent.<MeshCollider>(); 
	/*collider.sharedMesh = null;
	collider.sharedMesh = thisMesh;*/

}