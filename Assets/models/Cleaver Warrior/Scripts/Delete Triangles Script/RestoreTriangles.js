#pragma strict

var originalMesh : Mesh;
var modifiedMesh : Mesh;
var meshRenderer : SkinnedMeshRenderer;

var restore : boolean;

function Start () {

}

function Update () {
	if(restore){
		if(meshRenderer.sharedMesh != originalMesh) meshRenderer.sharedMesh = originalMesh;
	}
	else{
		if(meshRenderer.sharedMesh != modifiedMesh) meshRenderer.sharedMesh = modifiedMesh;
	}
}

