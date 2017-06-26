#pragma strict
var bodyRenderer : SkinnedMeshRenderer;
private var bodyMesh : Mesh;

private var defaultBodyVertices : Vector3[];
private var defaultBodyTriangles : int[];

private var deleteTriangles : boolean[]; // Length is mesh triangle's length divided by 3.

function Start () {
	var restoreTriangles : RestoreTriangles = gameObject.AddComponent(RestoreTriangles);
	restoreTriangles.meshRenderer = bodyRenderer;
	restoreTriangles.originalMesh = bodyRenderer.sharedMesh;
	
	bodyMesh = bodyRenderer.sharedMesh;
	if(!CheckClone(bodyMesh)){ //Use instantiated mesh.
		bodyMesh = Instantiate(bodyRenderer.sharedMesh);
		bodyRenderer.sharedMesh = bodyMesh;
	}
	
	
	
	////Delete triangles.
	var trianglesDeleteBounds : TrianglesDeleteBounds[];
	trianglesDeleteBounds = GetComponentsInChildren.<TrianglesDeleteBounds>(true);	
	
	if(trianglesDeleteBounds.Length > 0){
		//Store default vertices.
		defaultBodyVertices = new Vector3[bodyMesh.vertices.Length];
		defaultBodyTriangles = new int[bodyMesh.triangles.Length];
		
		deleteTriangles = new boolean[bodyMesh.triangles.Length / 3]; 
		
		for(var i = 0; i < bodyMesh.vertices.Length ; i++){
			defaultBodyVertices[i] = bodyMesh.vertices[i];
			
		}
		
		for(i = 0; i < bodyMesh.triangles.Length; i += 3){
			defaultBodyTriangles[i] = bodyMesh.triangles[i];
			var trianglePosition : Vector3;
			trianglePosition = 
			(bodyRenderer.transform.TransformPoint(bodyMesh.vertices[bodyMesh.triangles[i]]) +
			bodyRenderer.transform.TransformPoint(bodyMesh.vertices[bodyMesh.triangles[i+1]]) +
			bodyRenderer.transform.TransformPoint(bodyMesh.vertices[bodyMesh.triangles[i+2]])) / 3;
			
			var deleteThisTriangle : boolean = false;
			
			for(var thisTriangleDeleteBound : TrianglesDeleteBounds in trianglesDeleteBounds){
				if(thisTriangleDeleteBound.bounds.Contains(trianglePosition)) deleteThisTriangle = true;
			}
			
			deleteTriangles[i/3] = deleteThisTriangle;
		}
	}
	
	DeleteBodyTriangles();
	
	restoreTriangles.modifiedMesh = bodyMesh;
	
	for(var thisTriangleDeleteBound : TrianglesDeleteBounds in trianglesDeleteBounds){
		Destroy(thisTriangleDeleteBound);
	} 
		
	Destroy(this);
}

function CheckClone(checkMesh : Mesh) : boolean{
	var cloneCheck : boolean;
	
	var meshName : String = checkMesh.name;
	var cloneTag : String;
	
	if(meshName.Length > 7){
		cloneTag = meshName.Substring(meshName.Length - 7);
	}
	
	if(cloneTag == "(Clone)"){
		cloneCheck = true;	
	}
	else{
		cloneCheck = false;
	}
		
	return cloneCheck;
}

function DeleteBodyTriangles(){
	var remainingTriangles : Array = new Array();
	for(var i = 0; i < bodyMesh.triangles.Length ; i+= 3){
		if(!deleteTriangles[Mathf.FloorToInt( i / 3 )]){
			remainingTriangles.Push(bodyMesh.triangles[i]);
			remainingTriangles.Push(bodyMesh.triangles[i+1]);
			remainingTriangles.Push(bodyMesh.triangles[i+2]);
		}
	}
	
	bodyMesh.triangles = remainingTriangles.ToBuiltin(int) as int[];
}