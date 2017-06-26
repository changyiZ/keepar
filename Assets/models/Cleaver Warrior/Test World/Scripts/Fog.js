#pragma strict

var relativeCamera : Transform;

var startFadeDistance : float = 5.0;

function Start () {

}

function Update () {
	var particleSystem : ParticleSystem = GetComponent(ParticleSystem);
	var particles : ParticleSystem.Particle[] = new ParticleSystem.Particle[1000];
	var particleAmount : int =  particleSystem.GetParticles(particles);
	
	for(var i = 0; i < particleAmount; i++){
		var thisParticle : ParticleSystem.Particle = particles[i];
		var distanceToCamera : float = Vector3.Distance(thisParticle.position, relativeCamera.position);
		if(distanceToCamera < startFadeDistance){
			var colorFade : float = Mathf.Lerp(0, thisParticle.color.r, distanceToCamera / startFadeDistance) / 255;
			if(colorFade == 0.0)
				thisParticle.remainingLifetime = 0.0;
			else
				thisParticle.color = Color(colorFade, colorFade, colorFade);
		}

		particles[i] = thisParticle;
	}
	particleSystem.SetParticles(particles, particleAmount);
	
}