#pragma strict

private var mesh : Mesh;
private var defaultVertices : Vector3[];


private var relativeCamera : Transform;
var distance : float = 40.0;

//var vertexPerFrame : int = 15;


function Start () {
	mesh = GetComponent(MeshFilter).mesh;
	defaultVertices = mesh.vertices.Clone() as Vector3[];
}

function FixedUpdate () {
	if(relativeCamera == null){
		relativeCamera = GameObject.FindGameObjectWithTag("MainCamera").transform;
	}
	
	var currentDistance : float = Vector3.Distance(transform.position, relativeCamera.position);
	
	if(currentDistance < distance){
	
		var localToWorld : Matrix4x4 = transform.localToWorldMatrix;
		var worldToLocal : Matrix4x4 = transform.worldToLocalMatrix;
		
		var vertices : Vector3[] = defaultVertices.Clone() as Vector3[];
		
		for (var vertex : Vector3 in vertices){
			var vertexWorldPosition : Vector3 = localToWorld.MultiplyPoint3x4(vertex);
			
			vertexWorldPosition += Vector3(0,
			Mathf.Cos(vertexWorldPosition.x * .3 + Time.time * 3.0) * .03 - 
			Mathf.Cos(vertexWorldPosition.z * 1.5 + Time.time * 3.0) * .01 +
			Mathf.Cos(vertexWorldPosition.x * .5 + Time.time * 5.0) * .01 -
			Mathf.Cos(vertexWorldPosition.z * .6 + Time.time * 5.0) * .01 
			,0);
		
			vertex = worldToLocal.MultiplyPoint3x4(vertexWorldPosition);
		}
		
		mesh.vertices = vertices;
		
		mesh.RecalculateNormals();
		mesh.RecalculateBounds();
		
		/*var collider : MeshCollider = GetComponent.<MeshCollider>(); 
		collider.sharedMesh = null;
		collider.sharedMesh = mesh;*/
	}
}