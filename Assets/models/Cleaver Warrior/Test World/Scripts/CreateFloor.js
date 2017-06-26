#pragma strict

var duplicates : Vector2 = Vector2(5 ,10);

var water : Vector2[];

var hasWater : boolean [,];

var waterPrefab : Transform;

function Start () {
	var meshFilter : MeshFilter = GetComponent.<MeshFilter>();
	var size : Vector2 = Vector2(meshFilter.mesh.bounds.extents.x * 2, 
	meshFilter.mesh.bounds.extents.z * 2);
	
	hasWater = new boolean[duplicates.x, duplicates.y];
	
	for(var waterSpot : Vector2 in water){
		hasWater[waterSpot.x, waterSpot.y] = true;
	}
	
	for(var y = 0; y < duplicates.y; y++){
		for(var x = 0; x < duplicates.x; x++){
			var newFloor : GameObject = Instantiate(gameObject, Vector3(x * size.x - duplicates.x * .5 * size.x, 0, 
			y * size.y - duplicates.y *.5 * size.y), Quaternion.identity);
			
			Destroy(newFloor.GetComponent.<CreateFloor>());
			
			newFloor.transform.parent = transform.parent;
		
			//Water.
			if(hasWater[x,y]){
				var newWaterPrefab : Transform = Instantiate(waterPrefab, newFloor.transform.position, newFloor.transform.rotation);
				newWaterPrefab.parent = transform.parent;
				
				newFloor.transform.position.y -= size.x;
				
				if(y < duplicates.y-1 && !hasWater[x,y+1]){
					var frontWall : GameObject = Instantiate(newFloor, newFloor.transform.position, newFloor.transform.rotation);
					frontWall.transform.Rotate(-90,0,0);
					frontWall.transform.position += Vector3(0,size.x * .5, size.x *.5);
					DisplaceVertices(frontWall);
					frontWall.transform. parent = transform.parent;
				}
				
				if(y > 0 && !hasWater[x,y-1]){
					var backWall : GameObject = Instantiate(newFloor, newFloor.transform.position, newFloor.transform.rotation);
					backWall.transform.Rotate(90,0,0);
					backWall.transform.position += Vector3(0,size.x * .5, -size.x *.5);
					DisplaceVertices(backWall);
					backWall.transform.parent = transform.parent;
				}
				
				if(x > 0 && !hasWater[x-1,y]){
					var leftWall : GameObject = Instantiate(newFloor, newFloor.transform.position, newFloor.transform.rotation);
					leftWall.transform.Rotate(90,90,0);
					leftWall.transform.position += Vector3(-size.x *.5, size.x * .5, 0);
					DisplaceVertices(leftWall);
					leftWall.transform.parent = transform.parent;
				}
			
				if(x < duplicates.x -1 && !hasWater[x+1,y]){
					var rightWall : GameObject = Instantiate(newFloor, newFloor.transform.position, newFloor.transform.rotation);
					rightWall.transform.Rotate(90,-90,0);
					rightWall.transform.position += Vector3(size.x *.5, size.x * .5, 0);
					DisplaceVertices(rightWall);
					rightWall.transform.parent = transform.parent;
				}
			}
			
			DisplaceVertices(newFloor);
		}
	}
	
	Destroy(gameObject);
}

function DisplaceVertices(plane : GameObject){
	var thisMeshFilter : MeshFilter = plane.GetComponent(MeshFilter);
	var vertices : Vector3[] = thisMeshFilter.mesh.vertices;
	
	var localToWorld : Matrix4x4 = plane.transform.localToWorldMatrix;
	var worldToLocal : Matrix4x4 = plane.transform.worldToLocalMatrix;
	
	for(var vertex in vertices){
		var vertexWorldPosition : Vector3 = localToWorld.MultiplyPoint3x4(vertex);
		vertexWorldPosition.y += Mathf.Cos(vertexWorldPosition.x * .04) * .2;
		vertexWorldPosition.y += Mathf.Cos(vertexWorldPosition.x * .02) * .2;
		vertexWorldPosition.y += Mathf.Cos(vertexWorldPosition.z * .02) * .3;
		vertexWorldPosition.y += Mathf.Cos(vertexWorldPosition.z * .03) * .3;
		vertexWorldPosition.y -= Mathf.Cos(vertexWorldPosition.z * .001) * .5;
		vertex = worldToLocal.MultiplyPoint3x4(vertexWorldPosition);
	}
	thisMeshFilter.mesh.vertices = vertices;
	thisMeshFilter.mesh.RecalculateNormals();
	thisMeshFilter.mesh.RecalculateBounds();

	var thisCollider : MeshCollider = plane.GetComponent.<MeshCollider>();
	thisCollider.sharedMesh = thisMeshFilter.mesh;
}

function Update () {

}